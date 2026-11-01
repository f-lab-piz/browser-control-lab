import {decode} from 'fast-png';
import {unzlibSync} from 'fflate';
import {LIMITS} from '../shared/limits.mjs';
const encoder=new TextEncoder(),decoder=new TextDecoder();
export const byteLength=value=>encoder.encode(value).length;
export function utf8Prefix(value,limit){const bytes=encoder.encode(value);return bytes.length<=limit?decoder.decode(bytes):new TextDecoder().decode(bytes.subarray(0,limit),{stream:true})}
function validateInflation(bytes,width,height){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),parts=[];let offset=8,total=0,ended=false,header=false;
 while(offset<bytes.length){
  if(offset+12>bytes.length)throw Error('Incomplete PNG chunk');
  const size=view.getUint32(offset),type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(offset+12+size>bytes.length)throw Error('Incomplete PNG chunk');
  if(!header){if(type!=='IHDR'||size!==13)throw Error('PNG header must be first');header=true}
  else if(type==='IHDR')throw Error('Duplicate PNG header');
  if(type==='IDAT'){parts.push(bytes.subarray(offset+8,offset+8+size));total+=size}
  if(type==='IEND'){if(size||offset+12!==bytes.length)throw Error('Invalid PNG trailer');ended=true;break}
  offset+=12+size;
 }
 if(!ended||!parts.length)throw Error('Missing PNG data or trailer');
 const channels=({0:1,2:3,3:1,4:2,6:4})[bytes[25]],depth=bytes[24],interlace=bytes[28];
 if(!channels||![1,2,4,8,16].includes(depth)||interlace>1)throw Error('Invalid PNG format');
 const expected=interlace===0?(Math.ceil(width*channels*depth/8)+1)*height:null;
 const maximum=expected??(width*height*8+height*7+64);
 if(maximum>=LIMITS.memoryBytes)throw Error('IMAGE_RESOURCE_LIMIT: PNG scanlines exceed decode workspace');
 const compressed=new Uint8Array(total);let cursor=0;for(const part of parts){compressed.set(part,cursor);cursor+=part.length}
 const raw=unzlibSync(compressed,{out:new Uint8Array(maximum+1)});
 if(raw.length>maximum||expected!==null&&raw.length!==expected)throw Error('PNG scanline size mismatch');
 let a=1,b=0;for(const byte of raw){a=(a+byte)%65521;b=(b+a)%65521}
 if(compressed.length<6||new DataView(compressed.buffer).getUint32(compressed.length-4)!==((b<<16)|a)>>>0)throw Error('PNG zlib checksum mismatch');
}
export function imageBytes(image){
 if(!image||image.type!=='image'||image.mimeType!=='image/png'||typeof image.data!=='string')throw Error('INVALID_IMAGE: display expects image/png base64');
 const data=image.data,padding=data.endsWith('==')?2:data.endsWith('=')?1:0;
 if(!data.length||data.length%4||/[^A-Za-z0-9+/=]/.test(data)||data.slice(0,data.length-padding).includes('='))throw Error('INVALID_IMAGE: noncanonical base64');
 let binary;try{binary=atob(data);if(btoa(binary)!==data)throw Error('padding')}catch{throw Error('INVALID_IMAGE: noncanonical base64')}
 const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
 if(bytes.length<33||[137,80,78,71,13,10,26,10].some((b,i)=>bytes[i]!==b))throw Error('INVALID_IMAGE: PNG signature');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),width=view.getUint32(16),height=view.getUint32(20);
 if(!width||!height)throw Error('INVALID_IMAGE: PNG dimensions');
 // Bound decoder allocation independently of compressed file size. Fail explicitly.
 if(width*height*8+height*8>LIMITS.memoryBytes)throw Error('IMAGE_RESOURCE_LIMIT: PNG raster decode exceeds 64 MiB workspace');
 try{validateInflation(bytes,width,height);decode(bytes,{checkCrc:true})}catch(error){throw Error('INVALID_IMAGE: '+error.message)}
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
