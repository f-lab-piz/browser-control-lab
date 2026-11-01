// Browser-native fixture oracle, not an extension/product PASS.
import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {startFixture} from '../test-site/server.mjs';
import {outputPng} from '../test-site/output-png.mjs';
test('PNG byte-boundary fixtures decode in Chromium to the intended1x1 RGBA pixel',{timeout:45000},async()=>{
 const fixture=await startFixture();let browser;
 try{
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  browser=await chromium.launch({executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),headless:true});
  const page=await browser.newPage();await page.goto(fixture.url+'/audit');
  for(const size of [128,4*1024*1024-1,4*1024*1024,4*1024*1024+1]){
   assert.equal(outputPng(size).length,size);
   const observation=page.evaluate(async size=>{const data=await fetch('/output-image?bytes='+size).then(r=>r.json());const bytes=Uint8Array.from(atob(data.data),c=>c.charCodeAt(0));const bitmap=await createImageBitmap(new Blob([bytes],{type:data.mimeType}));const canvas=new OffscreenCanvas(1,1),context=canvas.getContext('2d');context.drawImage(bitmap,0,0);const pixel=[...context.getImageData(0,0,1,1).data];bitmap.close();return {length:bytes.length,pixel}},size);
   let timer;const observed=await Promise.race([observation,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Native PNG oracle timeout at '+size+' bytes')),10000)})]).finally(()=>clearTimeout(timer));
   assert.equal(observed.length,size);assert.deepEqual(observed.pixel,[12,34,56,255]);
  }
  for(const [kind,expected] of [['adam-valid',true],['adam-short',false]]){
   const decoded=await page.evaluate(async kind=>{const data=await fetch('/output-review-image?kind='+kind).then(r=>r.json());const bytes=Uint8Array.from(atob(data.data),c=>c.charCodeAt(0));try{const image=await createImageBitmap(new Blob([bytes],{type:'image/png'}));image.close();return true}catch{return false}},kind);
   assert.equal(decoded,expected);
  }

 }finally{await browser?.close();await fixture.close()}
});
