export function bridgeClient(url,token){
 async function request(path,data){const response=await fetch(url+path,{method:data===undefined?'GET':'POST',headers:{authorization:'Bearer '+token,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});const result=await response.json();if(!response.ok)throw Error(result.error||'Bridge error');return result}
 async function wait(id,timeout=150000){const deadline=Date.now()+timeout;while(Date.now()<deadline){const r=await request('/v1/requests/'+id);if(!['queued','running'].includes(r.status))return r;await new Promise(resolve=>setTimeout(resolve,30))}throw Error('Client wait timed out')}
 return {request,wait,session:()=>request('/v1/sessions',{}),async js(sessionId,code,options={}){const r=await request('/v1/sessions/'+sessionId+'/js',{code,...options});return wait(r.requestId)},async reset(sessionId){const r=await request('/v1/sessions/'+sessionId+'/reset',{});return wait(r.requestId)}};
}
