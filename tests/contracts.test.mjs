import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRun,applyEvent,startFixture} from '../test-site/server.mjs';

test('64 internal APIs and 3 external tools have distinct entries and honest implementation status',async()=>{
 const catalog=JSON.parse(await readFile(new URL('../docs/api-catalog.json',import.meta.url)));
 assert.equal(catalog.external.length,3);assert.equal(catalog.internal.length,64);
 assert.equal(new Set(catalog.internal.map(a=>a.name)).size,64);
 assert(catalog.internal.every(a=>a.status==='planned'));
});
test('mail requires loading through inner scrolling and reading the correct mail',()=>{
 const run=createRun('mail');assert.equal(applyEvent(run,{type:'mail-read',id:137}).accepted,false);
 assert.equal(applyEvent(run,{type:'mail-load',loaded:150}).accepted,false);
 for(const loaded of [60,90,120,150])assert(applyEvent(run,{type:'mail-load',loaded}).accepted);
 applyEvent(run,{type:'mail-open',id:136});assert(!applyEvent(run,{type:'mail-read',id:137}).accepted);
 applyEvent(run,{type:'mail-open',id:137});assert.equal(applyEvent(run,{type:'mail-read',id:137}).status,'passed');
});
test('booking requires correct dragged interval, opened editor and saved details',()=>{
 const run=createRun('booking');assert(!applyEvent(run,{type:'booking-confirm',title:'설계 회의',people:4}).accepted);
 assert(!applyEvent(run,{type:'booking-select',row:2,start:8,end:12,moved:false}).accepted);
 assert(applyEvent(run,{type:'booking-select',row:2,start:8,end:12,moved:true}).accepted);
 applyEvent(run,{type:'booking-open'});assert(!applyEvent(run,{type:'booking-confirm',title:'wrong',people:4}).accepted);
 assert.equal(applyEvent(run,{type:'booking-confirm',title:'설계 회의',people:4}).status,'passed');
});
test('virtualized dropdown requires the target to be in a scrolled rendered range',()=>{
 const run=createRun('dropdown');assert(!applyEvent(run,{type:'dropdown-select',index:230}).accepted);
 applyEvent(run,{type:'dropdown-scroll',first:210});assert(!applyEvent(run,{type:'dropdown-select',index:230}).accepted);
 applyEvent(run,{type:'dropdown-scroll',first:225});assert.equal(applyEvent(run,{type:'dropdown-select',index:230}).status,'passed');
});
test('HTTP fixture runs are isolated and wrong events cannot set a pass flag',async()=>{
 const site=await startFixture();try{
  const a=await fetch(site.url+'/api/runs',{method:'POST',body:JSON.stringify({scenario:'basic'})}).then(r=>r.json());
  const b=await fetch(site.url+'/api/runs',{method:'POST',body:JSON.stringify({scenario:'basic'})}).then(r=>r.json());
  await fetch(site.url+'/api/runs/'+a.id+'/events',{method:'POST',body:JSON.stringify({type:'set-pass',status:'passed'})});
  assert.equal((await fetch(site.url+'/api/runs/'+a.id).then(r=>r.json())).status,'pending');
  assert.equal((await fetch(site.url+'/api/runs/'+b.id).then(r=>r.json())).status,'pending');
  assert.equal((await fetch(site.url+'/api/runs/missing')).status,404);
 }finally{await site.close()}
});
