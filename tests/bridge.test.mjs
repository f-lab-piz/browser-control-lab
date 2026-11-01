import test from 'node:test';
import assert from 'node:assert/strict';
import {startBridge} from '../bridge/server.mjs';
import {bridgeClient} from '../bridge/client.mjs';
test('transport authorization, session file isolation and separate extension credentials',async()=>{
 const bridge=await startBridge();try{
  const client=bridgeClient(bridge.url,bridge.token),a=await client.session(),b=await client.session();
  assert.equal((await fetch(bridge.url+'/v1/extension/next',{headers:{authorization:'Bearer '+bridge.token}})).status,401);
  const asset=await fetch(bridge.url+'/v1/assets?sessionId='+a.id+'&name=proof.txt',{method:'POST',headers:{authorization:'Bearer '+bridge.token},body:'proof'}).then(r=>r.json());
  assert.equal((await fetch(bridge.url+'/v1/assets/'+asset.id+'?sessionId='+b.id,{headers:{authorization:'Bearer '+bridge.token}})).status,403);
  assert.equal(await fetch(bridge.url+'/v1/assets/'+asset.id+'?sessionId='+a.id,{headers:{authorization:'Bearer '+bridge.extensionToken}}).then(r=>r.text()),'proof');
  assert.equal((await fetch(bridge.url+'/v1/status',{headers:{authorization:'Bearer '+bridge.token,origin:'https://example.org'}})).status,403);
 }finally{await bridge.close()}
});
test('request IDs deduplicate, reset invalidates running work and stale results cannot overwrite it',async()=>{
 const bridge=await startBridge();try{
  const client=bridgeClient(bridge.url,bridge.token),session=await client.session();
  const polling=fetch(bridge.url+'/v1/extension/next',{headers:{authorization:'Bearer '+bridge.extensionToken}}).then(r=>r.json());
  await new Promise(r=>setTimeout(r,20));
  const first=await client.request('/v1/sessions/'+session.id+'/js',{code:'console.log(1)',requestId:'one'});
  assert.equal((await polling).requestId,'one');
  assert.equal((await client.request('/v1/sessions/'+session.id+'/js',{code:'console.log(1)',requestId:'one'})).requestId,first.requestId);
  assert.equal(bridge.requests.size,1);
  await client.request('/v1/sessions/'+session.id+'/reset',{});
  assert.equal((await client.request('/v1/requests/one')).status,'cancelled');
  const response=await fetch(bridge.url+'/v1/extension/result',{method:'POST',headers:{authorization:'Bearer '+bridge.extensionToken,'Content-Type':'application/json'},body:JSON.stringify({requestId:'one',sessionId:session.id,generation:0,result:{content:[]}})});
  assert.equal(response.status,409);
  assert.equal((await client.request('/v1/requests/one')).status,'cancelled');
 }finally{await bridge.close()}
});
