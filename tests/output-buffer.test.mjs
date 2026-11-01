import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {OutputBuffer,imageBytes} from '../extension/output.mjs';
import {outputPng,pngChunk,reviewPng,formatPng,pngFormatCases,compressionPngCases,compressionPng} from '../test-site/output-png.mjs';
const image=bytes=>({type:'image',mimeType:'image/png',data:bytes.toString('base64')});
function replaceData(data){const p=outputPng(128);return Buffer.concat([p.subarray(0,33),pngChunk('IDAT',data),pngChunk('IEND',Buffer.alloc(0))])}
test('PNG validation rejects corrupt CRC truncated files malformed scanlines and excessive inflate independent of encoded size',()=>{
 const good=outputPng(128);assert.equal(imageBytes(image(good)),128);
 const crc=Buffer.from(good);crc[30]^=1;
 const huge=replaceData(deflateSync(Buffer.alloc(1024*1024)));
 const malformed=replaceData(deflateSync(Buffer.from([0,1])));
 const adler=Buffer.from(deflateSync(Buffer.from([0,12,34,56,255])));adler[adler.length-1]^=1;
 for(const bytes of [crc,good.subarray(0,-1),Buffer.concat([good,Buffer.from([0])]),huge,malformed,replaceData(adler)])assert.throws(()=>imageBytes(image(bytes)),/INVALID_IMAGE/);
});
test('output errors cannot exceed the result JSON budget and never return partial images',()=>{
 const b=new OutputBuffer();b.image(image(outputPng(128)));const r=b.result({error:{code:'JS_ERROR',message:'한'.repeat(100000)}});
 assert(r.truncated);assert(r.truncationReasons.includes('error-bytes'));assert(Buffer.byteLength(r.error.message)<=65536);assert.equal(r.content[0].data,outputPng(128).toString('base64'));
 const fallback=b.result({unbounded:'x'.repeat(16*1024*1024)});assert.equal(fallback.error.code,'RESULT_LIMIT');assert.deepEqual(fallback.content,[]);
});

test('Adam7 exact scanline bytes and compressed metadata workspace apply during bounded stream validation',()=>{
 assert.throws(()=>imageBytes(image(reviewPng('adam-short'))),/INVALID_IMAGE/);
 assert.throws(()=>imageBytes(image(reviewPng('icc-large'))),/IMAGE_RESOURCE_LIMIT/);
 assert(imageBytes(image(reviewPng('adam-valid')))>0);
});

test('PNG format corpus enforces IHDR combinations palettes indexes transparency and estimated raster workspace',()=>{
 for(const row of pngFormatCases()){
  const bytes=formatPng(row.options);
  if(row.valid)assert.equal(imageBytes(image(bytes)),bytes.length,row.name);
  else assert.throws(()=>imageBytes(image(bytes)),row.resource?/IMAGE_RESOURCE_LIMIT/:/INVALID_IMAGE/,row.name);
 }
});


test('PNG compressed streams validate stored LEN/NLEN and zlib framing without rejecting fixed or dynamic blocks',()=>{
 for(const row of compressionPngCases()){
  const bytes=compressionPng(row.name);
  if(row.valid)assert.equal(imageBytes(image(bytes)),bytes.length,row.name);
  else assert.throws(()=>imageBytes(image(bytes)),/INVALID_IMAGE/,row.name);
 }
});
