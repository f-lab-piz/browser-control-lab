// Per-session cancellation provenance. This is not a browser action queue:
// event waiters and the input that triggers them must run concurrently.
export class SessionLifecycle{
 constructor(){this.sessions=new Map()}
 record(id,generation){
  if(typeof id!=='string'||!id||!Number.isSafeInteger(generation)||generation<1)throw Error('Invalid lifecycle provenance');
  let value=this.sessions.get(id);
  if(!value){value={generation,epoch:0,barrier:Promise.resolve(),operations:new Set(),inFlight:new Map()};this.sessions.set(id,value)}
  return value;
 }
 async start(id,generation){
  const state=this.record(id,generation);
  for(;;){if(state.generation!==generation)throw Error('SESSION_RESET: stale generation');const barrier=state.barrier;await barrier;if(barrier===state.barrier)break}
  if(state.generation!==generation)throw Error('SESSION_RESET: stale generation');
  return state;
 }
 async run(id,generation,description,action){
  const state=await this.start(id,generation),epoch=state.epoch;
  let cancel;const cancelled=new Promise((_,reject)=>{cancel=()=>reject(Error('SESSION_RESET: previous generation cancelled'))});
  // Rejection can precede the first actual API dispatch.
  cancelled.catch(()=>{});
  const scope={
   sessionId:id,generation,
   assert(){if(state.generation!==generation||state.epoch!==epoch)throw Error('SESSION_RESET: stale operation')},
   cancel,
   async call(dispatch,command){
    scope.assert();const token=Symbol();
    const actual=Promise.resolve().then(()=>{scope.assert();state.inFlight.set(token,{...description,...command,generation});return dispatch()}).then(value=>{scope.assert();return value}).finally(()=>state.inFlight.delete(token));
    return Promise.race([actual,cancelled]);
   }
  };
  state.operations.add(scope);
  try{return await Promise.race([Promise.resolve().then(()=>{scope.assert();return action(scope)}).then(value=>{scope.assert();return value}),cancelled])}
  finally{state.operations.delete(scope)}
 }
 reset(id,generation,cleanup){
  const state=this.record(id,generation);
  if(generation<state.generation)return Promise.reject(Error('SESSION_RESET: stale reset'));
  state.generation=generation;state.epoch++;
  const inFlight=[...state.inFlight.values()];
  for(const operation of state.operations)operation.cancel();
  const work=state.barrier.then(()=>cleanup({inFlight}));
  // A failed cleanup must be visible to its caller, but cannot permanently lock
  // future reset attempts. All new calls still wait for the newest barrier.
  state.barrier=work.then(()=>{},()=>{});
  return work;
 }
}

export async function releaseHeldInputs(inputs,dispatch,{timeoutMs=2000}={}){
 const trace=[],warnings=[];
 for(const [id,input] of [...inputs]){
  let timer;
  try{
   await Promise.race([Promise.resolve().then(()=>dispatch(input.target,input.method,input.params)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Input release timed out; effect unknown')),timeoutMs)})]);
   inputs.delete(id);trace.push({target:input.target,method:input.method,kind:input.kind,key:input.key,button:input.button,status:'released'});
  }catch(error){const entry={target:input.target,method:input.method,kind:input.kind,key:input.key,button:input.button,status:'failed',message:error.message};trace.push(entry);warnings.push(entry)}
  finally{clearTimeout(timer)}
 }
 return {status:warnings.length?'partial':'complete',trace,warnings};
}
