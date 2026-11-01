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
