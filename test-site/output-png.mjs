import {deflateSync} from 'node:zlib';
import {crc32} from '../shared/png-crc.mjs';
export {crc32} from '../shared/png-crc.mjs';
export function pngChunk(type,data){const content=Buffer.concat([Buffer.from(type),data]),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);content.copy(out,4);out.writeUInt32BE(crc32(content),out.length-4);return out}
export function outputPng(size=128){
 if(!Number.isInteger(size)||size<96||size>5*1024*1024)throw Error('PNG fixture size out of range');
 const header=Buffer.alloc(13);header.writeUInt32BE(1,0);header.writeUInt32BE(1,4);header[8]=8;header[9]=6;
 const start=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(Buffer.from([0,12,34,56,255])))]),end=pngChunk('IEND',Buffer.alloc(0));
 const padding=Buffer.alloc(size-start.length-end.length-12,112);padding.write('bcl\0',0,'ascii');
 return Buffer.concat([start,pngChunk('tEXt',padding),end]);
}

export function reviewPng(kind){
 const base=outputPng(128),header=Buffer.from(base.subarray(16,29));
 if(kind==='adam-short'){header[12]=1;return Buffer.concat([base.subarray(0,8),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(Buffer.from([0,12]))),pngChunk('IEND',Buffer.alloc(0))])}
 if(kind==='icc-large'){const profile=Buffer.alloc(80*1024*1024);profile.writeUInt32BE(profile.length);return Buffer.concat([base.subarray(0,33),pngChunk('iCCP',Buffer.concat([Buffer.from('profile\0\0','ascii'),deflateSync(profile)])),base.subarray(33)])}
 if(kind==='adam-valid'){header[12]=1;return Buffer.concat([base.subarray(0,8),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(Buffer.from([0,12,34,56,255]))),pngChunk('IEND',Buffer.alloc(0))])}
 throw Error('Unknown review PNG');
}

export function formatPng({color=6,depth=8,width=1,height=1,interlace=0,palette=color===3?Buffer.from([12,34,56]):null,index=0,transparency=null,paletteAfter=false,duplicatePalette=false,paletteEntries,rowFilter=0,pattern=false,compression=0,filter=0}={}){
 if(paletteEntries!==undefined)palette=Buffer.alloc(paletteEntries*3);
 const channels=({0:1,2:3,3:1,4:2,6:4})[color]||1,header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=depth;header[9]=color;header[10]=compression;header[11]=filter;header[12]=interlace;
 const passes=interlace===1?[[0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]]:[[0,0,1,1]],rows=[];
 for(const [x,y,dx,dy] of passes){
  const w=Math.max(0,Math.ceil((width-x)/dx)),h=Math.max(0,Math.ceil((height-y)/dy));if(!w||!h)continue;
  const size=Math.ceil(w*channels*depth/8),stride=size+1,raw=Buffer.alloc(stride*h),bpp=Math.max(1,Math.ceil(channels*depth/8));let previous=Buffer.alloc(size);
  for(let row=0;row<h;row++){
   const current=Buffer.alloc(size);if(pattern){for(let pixel=0;pixel<w;pixel++){const value=(Math.floor(pixel/4)+row)%2===0?1:0,bit=pixel*depth;current[bit>>>3]|=value<<(8-depth-(bit&7))}}
   else if(index)current[0]=index<<(8-depth);
   raw[row*stride]=rowFilter;
   for(let i=0;i<size;i++){
    const left=i>=bpp?current[i-bpp]:0,up=previous[i],corner=i>=bpp?previous[i-bpp]:0;let prediction=0;
    if(rowFilter===1)prediction=left;else if(rowFilter===2)prediction=up;else if(rowFilter===3)prediction=Math.floor((left+up)/2);else if(rowFilter===4){const p=left+up-corner,dl=Math.abs(p-left),du=Math.abs(p-up),dc=Math.abs(p-corner);prediction=dl<=du&&dl<=dc?left:du<=dc?up:corner}
    raw[row*stride+1+i]=(current[i]-prediction)&255;
   }
   previous=current;
  }
  rows.push(raw);
 }

 const chunks=[Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',header)];
 if(palette&&!paletteAfter){chunks.push(pngChunk('PLTE',palette));if(duplicatePalette)chunks.push(pngChunk('PLTE',palette))}
 if(transparency)chunks.push(pngChunk('tRNS',transparency));chunks.push(pngChunk('IDAT',deflateSync(Buffer.concat(rows))));if(palette&&paletteAfter)chunks.push(pngChunk('PLTE',palette));chunks.push(pngChunk('IEND',Buffer.alloc(0)));return Buffer.concat(chunks);
}
export function pngFormatCases(){
 const cases=[],depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
 for(const color of [0,2,3,4,6])for(const depth of [1,2,4,8,16]){
  const valid=depths[color].includes(depth);cases.push({name:`color-${color}-depth-${depth}`,valid,nativeExpected:valid,options:{color,depth}});
  if(valid)cases.push({name:`adam-color-${color}-depth-${depth}`,valid:true,nativeExpected:true,options:{color,depth,interlace:1,width:9,height:7}});
 }
 cases.push(
  {name:'missing-palette',valid:false,nativeExpected:false,options:{color:3,palette:null}},
  {name:'empty-palette',valid:false,options:{color:3,palette:Buffer.alloc(0)}},
  {name:'partial-palette',valid:false,options:{color:3,palette:Buffer.alloc(2)}},
  {name:'palette-exceeds-depth',valid:false,options:{color:3,depth:1,palette:Buffer.alloc(9)}},
  {name:'palette-index-missing',valid:false,options:{color:3,index:1}},
  {name:'palette-after-data',valid:false,options:{color:3,paletteAfter:true}},
  {name:'duplicate-palette',valid:false,options:{color:3,duplicatePalette:true}},
  {name:'gray-palette',valid:false,options:{color:0,palette:Buffer.alloc(3)}},
  {name:'excessive-palette',valid:false,nativeExpected:true,options:{color:3,paletteEntries:1048576}},
  {name:'rgb-transparency',valid:true,nativeExpected:true,options:{color:2,transparency:Buffer.alloc(6)}},
  {name:'gray-transparency',valid:true,nativeExpected:true,options:{color:0,transparency:Buffer.alloc(2)}},
  {name:'indexed-transparency',valid:true,nativeExpected:true,options:{color:3,transparency:Buffer.alloc(1)}},
  {name:'alpha-transparency',valid:false,options:{color:6,transparency:Buffer.alloc(1)}},
  {name:'invalid-compression',valid:false,options:{compression:1}},
  {name:'invalid-filter',valid:false,options:{filter:1}},
  {name:'invalid-interlace',valid:false,options:{interlace:2}},
  {name:'large-stream-raster',valid:true,nativeExpected:true,options:{depth:16,width:2048,height:2048}},
  {name:'expanded-data-limit',valid:false,nativeExpected:true,resource:true,options:{depth:16,width:2048,height:4096}},
  {name:'row-workspace-limit',valid:false,resource:true,options:{color:3,width:40000000,height:1}}
 );
 for(let rowFilter=0;rowFilter<=4;rowFilter++)cases.push({name:'indexed-filter-'+rowFilter,valid:true,nativeExpected:true,samples:[[0,0,[200,100,50,255]],[4,0,[12,34,56,255]],[0,1,[12,34,56,255]]],options:{color:3,depth:2,width:9,height:7,palette:Buffer.from([12,34,56,200,100,50]),pattern:true,rowFilter}});
 cases.push({name:'adam-indexed-paeth',valid:true,nativeExpected:true,samples:[[0,0,[200,100,50,255]],[4,1,[12,34,56,255]],[0,3,[12,34,56,255]]],options:{color:3,depth:2,width:9,height:7,interlace:1,palette:Buffer.from([12,34,56,200,100,50]),pattern:true,rowFilter:4}},{name:'invalid-row-filter',valid:false,nativeExpected:false,options:{rowFilter:5}});
 return cases;
}
