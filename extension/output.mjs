import {Inflate} from 'pako';
import {crc32} from '../shared/png-crc.mjs';
import {LIMITS} from '../shared/limits.mjs';
const encoder=new TextEncoder(),decoder=new TextDecoder();
export const byteLength=value=>encoder.encode(value).length;
export function utf8Prefix(value,limit){const bytes=encoder.encode(value);return bytes.length<=limit?decoder.decode(bytes):new TextDecoder().decode(bytes.subarray(0,limit),{stream:true})}
function inflateChecked(compressed,maximum,metadata=false,accept=()=>{}){
 if(compressed.length<6)throw Error('Incomplete PNG zlib stream');
 let length=0,stream;
 const inflater=new Inflate({windowBits:15,chunkSize:65536});
 inflater.onStart=value=>{stream=value};
 inflater.onData=data=>{length+=data.length;if(length>maximum)throw Error(metadata?'IMAGE_RESOURCE_LIMIT: PNG metadata exceeds workspace':'PNG scanline size mismatch');accept(data)};
 for(let offset=0;offset<compressed.length;offset+=256){
  if(!inflater.push(compressed.subarray(offset,offset+256),offset+256>=compressed.length))throw Error('Invalid PNG zlib stream: '+inflater.msg);
 }
 if(!inflater.ended||inflater.err||stream.total_in!==compressed.length)throw Error('Incomplete or trailing PNG zlib stream');
 return length;
}

function keywordEnd(data,start=0){const end=data.indexOf(0,start);if(end<start+1||end-start>79)throw Error('Invalid PNG metadata keyword');return end}
function metadataStream(type,data){
 if(type==='iCCP'||type==='zTXt'){const end=keywordEnd(data);if(data[end+1]!==0)throw Error('Invalid PNG metadata compression');return data.subarray(end+2)}
 if(type==='iTXt'){
  const end=keywordEnd(data),flag=data[end+1];if(flag>1||data[end+2]!==0)throw Error('Invalid PNG metadata compression');
  const language=data.indexOf(0,end+3),translated=language<0?-1:data.indexOf(0,language+1);if(language<0||translated<0)throw Error('Invalid PNG international text');
  return flag?data.subarray(translated+1):null;
 }
 return null;
}
function pngFormat(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),width=view.getUint32(16),height=view.getUint32(20),depth=bytes[24],color=bytes[25],interlace=bytes[28];
 const depths=({0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]})[color];
 if(!width||!height||width>0x7fffffff||height>0x7fffffff||!depths?.includes(depth)||bytes[26]!==0||bytes[27]!==0||interlace>1)throw Error('Invalid PNG IHDR format');
 const channels=({0:1,2:3,3:1,4:2,6:4})[color],passes=interlace?[[0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]]:[[0,0,1,1]];
 let expected=0,maxRow=0;const rows=[];for(const [x,y,dx,dy] of passes){const w=Math.max(0,Math.ceil((width-x)/dx)),h=Math.max(0,Math.ceil((height-y)/dy));if(w&&h){const bytes=Math.ceil(w*channels*depth/8);expected+=(bytes+1)*h;maxRow=Math.max(maxRow,bytes);rows.push({width:w,height:h,bytes})}}
 // Charge file copies, bounded inflater buffers and indexed row buffers before allocation.
 const workspace=(color===3?maxRow*2:0)+bytes.length*3+2*1024*1024;
 if(workspace>LIMITS.memoryBytes||expected>LIMITS.memoryBytes)throw Error('IMAGE_RESOURCE_LIMIT: PNG estimated decode workspace exceeds 64 MiB');
 return {width,height,depth,color,expected,workspace,rows,bytesPerPixel:Math.max(1,Math.ceil(channels*depth/8))};
}
function rowValidator(format,paletteEntries){
 let pass=0,row=0,position=-1,filter=0,previous,current;
 const setup=()=>{if(format.color===3){previous=new Uint8Array(format.rows[pass].bytes);current=new Uint8Array(previous.length)}};
 setup();
 return data=>{for(const byte of data){
  const plan=format.rows[pass];if(!plan)throw Error('Extra PNG scanline data');
  if(position===-1){if(byte>4)throw Error('Invalid PNG filter');filter=byte;position=0;continue}
  if(format.color===3){
   const left=position>=format.bytesPerPixel?current[position-format.bytesPerPixel]:0,up=previous[position],corner=position>=format.bytesPerPixel?previous[position-format.bytesPerPixel]:0;
   let predictor=0;
   if(filter===1)predictor=left;else if(filter===2)predictor=up;else if(filter===3)predictor=Math.floor((left+up)/2);else if(filter===4){const p=left+up-corner,dl=Math.abs(p-left),du=Math.abs(p-up),dc=Math.abs(p-corner);predictor=dl<=du&&dl<=dc?left:du<=dc?up:corner}
   current[position]=(byte+predictor)&255;
  }
  position++;
  if(position===plan.bytes){
   if(format.color===3){for(let x=0;x<plan.width;x++){const bit=x*format.depth,index=(current[bit>>>3]>>>(8-format.depth-(bit&7)))&((1<<format.depth)-1);if(index>=paletteEntries)throw Error('PNG palette index out of range')}[previous,current]=[current,previous]}
   position=-1;row++;if(row===plan.height){pass++;row=0;if(pass<format.rows.length)setup()}
  }
 }};
}
function validateInflation(bytes,format){
 const {width,height,depth,color,expected,workspace}=format;
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),compressed=new Uint8Array(bytes.length);let offset=8,total=0,ended=false,header=false,dataEnded=false,sawData=false,metadataBytes=0,paletteEntries=0,transparency=false;
 while(offset<bytes.length){
  if(offset+12>bytes.length)throw Error('Incomplete PNG chunk');
  const size=view.getUint32(offset),type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(offset+12+size>bytes.length)throw Error('Incomplete PNG chunk');
  if(!/^[A-Za-z]{4}$/.test(type)||type[2]!==type[2].toUpperCase())throw Error('Invalid PNG chunk type');
  if(crc32(bytes.subarray(offset+4,offset+8+size))!==view.getUint32(offset+8+size))throw Error('PNG chunk CRC mismatch');
  if(!header){if(type!=='IHDR'||size!==13)throw Error('PNG header must be first');header=true}
  else if(type==='IHDR')throw Error('Duplicate PNG header');
  if(type==='PLTE'){
   if(paletteEntries||sawData||[0,4].includes(color)||!size||size>768||size%3||color===3&&size/3>2**depth)throw Error('Invalid PNG palette');paletteEntries=size/3;
  }
  if(type==='tRNS'){
   if(transparency||sawData||![0,2,3].includes(color)||color===0&&size!==2||color===2&&size!==6||color===3&&(!paletteEntries||size>paletteEntries))throw Error('Invalid PNG transparency');transparency=true;
  }
  if(type==='IDAT'){if(color===3&&!paletteEntries)throw Error('Missing PNG palette');if(dataEnded)throw Error('Nonconsecutive PNG data');sawData=true;compressed.set(bytes.subarray(offset+8,offset+8+size),total);total+=size}
  else if(sawData)dataEnded=true;
  const metadata=metadataStream(type,bytes.subarray(offset+8,offset+8+size));
  if(metadata)metadataBytes+=inflateChecked(metadata,LIMITS.memoryBytes-Math.max(expected,workspace)-metadataBytes,true);
  if(!['IHDR','PLTE','IDAT','IEND'].includes(type)&&type[0]===type[0].toUpperCase())throw Error('Unknown critical PNG chunk');
  if(type==='IEND'){if(size||offset+12!==bytes.length)throw Error('Invalid PNG trailer');ended=true;break}
  offset+=12+size;
 }
 if(!ended||!sawData)throw Error('Missing PNG data or trailer');
 if(Math.max(expected,workspace)+metadataBytes>LIMITS.memoryBytes)throw Error('IMAGE_RESOURCE_LIMIT: PNG expanded data exceeds workspace');
 if(inflateChecked(compressed.subarray(0,total),expected,false,rowValidator(format,paletteEntries))!==expected)throw Error('PNG scanline size mismatch');

}
export function imageBytes(image){
 if(!image||image.type!=='image'||image.mimeType!=='image/png'||typeof image.data!=='string')throw Error('INVALID_IMAGE: display expects image/png base64');
 const data=image.data,padding=data.endsWith('==')?2:data.endsWith('=')?1:0;
 if(!data.length||data.length%4||/[^A-Za-z0-9+/=]/.test(data)||data.slice(0,data.length-padding).includes('='))throw Error('INVALID_IMAGE: noncanonical base64');
 let binary;try{binary=atob(data);if(btoa(binary)!==data)throw Error('padding')}catch{throw Error('INVALID_IMAGE: noncanonical base64')}
 const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
 if(bytes.length<33||[137,80,78,71,13,10,26,10].some((b,i)=>bytes[i]!==b))throw Error('INVALID_IMAGE: PNG signature');
 try{const format=pngFormat(bytes);validateInflation(bytes,format)}catch(error){if(error.message.startsWith('IMAGE_RESOURCE_LIMIT'))throw error;throw Error('INVALID_IMAGE: '+error.message)}
 return bytes.length;
}
export class OutputBuffer{
 constructor(){this.content=[];this.bytes=0;this.imageTotal=0;this.images=0;this.reasons=new Set()}
 omit(reason){this.reasons.add(reason)}
 text(value){
  if(this.content.length>=LIMITS.blocks){this.omit('blocks');return}
  const remaining=LIMITS.textBytes-this.bytes,originalBytes=byteLength(value);
  if(originalBytes>remaining)this.omit('text-bytes');
  if(!remaining&&originalBytes)return;
  const text=utf8Prefix(value,remaining);this.bytes+=byteLength(text);this.content.push({type:'text',text});
 }
 image(image){
  const bytes=imageBytes(image);
  if(bytes>LIMITS.imageBytes){this.omit('image-bytes');return}
  if(this.imageTotal+bytes>LIMITS.imageTotalBytes){this.omit('image-total-bytes');return}
  if(this.images>=LIMITS.imageCount){this.omit('image-count');return}
  if(this.content.length>=LIMITS.blocks){this.omit('blocks');return}
  this.images++;this.imageTotal+=bytes;this.content.push({type:'image',mimeType:image.mimeType,data:image.data});
 }
 result(meta={}){
  if(meta.error?.message&&byteLength(meta.error.message)>LIMITS.textBytes){meta={...meta,error:{...meta.error,message:utf8Prefix(meta.error.message,LIMITS.textBytes)}};this.omit('error-bytes')}
  let result={...meta,content:this.content,truncated:this.reasons.size>0,truncationReasons:[...this.reasons],metrics:{...meta.metrics,outputChars:this.bytes,outputBytes:this.bytes,imageBytes:this.imageTotal,imageCount:this.images}};
  if(byteLength(JSON.stringify(result))>LIMITS.resultBytes)result={execution:meta.execution,content:[],truncated:true,truncationReasons:['result-bytes'],error:{code:'RESULT_LIMIT',message:'Result JSON exceeds 16 MiB; complete content omitted'},runtimeReset:meta.runtimeReset||false};
  return result;
 }
}
// Runs inside QuickJS. JSON escaping prevents native CString conversion losing NUL.
export function installConsole(){
 const stringify=JSON.stringify;
 function format(value){
  if(typeof value==='string')return value;
  if(value===undefined)return 'undefined';if(typeof value==='bigint')return String(value)+'n';if(typeof value==='symbol'||typeof value==='function')return String(value);
  const ancestors=[];
  return stringify(value,function(key,v){
   if(typeof v==='bigint')return String(v)+'n';
   if(v&&typeof v==='object'){while(ancestors.length&&ancestors[ancestors.length-1]!==this)ancestors.pop();if(ancestors.includes(v))return '[Circular]';ancestors.push(v)}
   return v;
  });
 }
 globalThis.console={log:(...values)=>__print(stringify(values.map(format).join(' ')))};
}
