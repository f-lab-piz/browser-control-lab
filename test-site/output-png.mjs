import {deflateSync} from 'node:zlib';
const table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});
export function crc32(bytes){let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0}
export function pngChunk(type,data){const content=Buffer.concat([Buffer.from(type),data]),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);content.copy(out,4);out.writeUInt32BE(crc32(content),out.length-4);return out}
export function outputPng(size=128){
 if(!Number.isInteger(size)||size<96||size>5*1024*1024)throw Error('PNG fixture size out of range');
 const header=Buffer.alloc(13);header.writeUInt32BE(1,0);header.writeUInt32BE(1,4);header[8]=8;header[9]=6;
 const start=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(Buffer.from([0,12,34,56,255])))]),end=pngChunk('IEND',Buffer.alloc(0));
 const padding=Buffer.alloc(size-start.length-end.length-12,112);padding.write('bcl\0',0,'ascii');
 return Buffer.concat([start,pngChunk('tEXt',padding),end]);
}
