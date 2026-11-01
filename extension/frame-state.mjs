// CDP target별 문서와 실제 프레임 트리의 수명을 관리한다.
function prepare(state){state.frameChildren??=new Map();state.frameEpoch??=0}
function erase(state,ids){
 for(const id of ids){state.frames.delete(id);state.frameChildren.delete(id)}
 for(const children of state.frameChildren.values())for(const id of ids)children.delete(id);
}
export function removeFrame(state,id){
 prepare(state);const removed=new Set([id]);let changed=true;
 while(changed){changed=false;for(const frame of state.frames.values())if(removed.has(frame.parent)&&!removed.has(frame.id)){removed.add(frame.id);changed=true}}
 erase(state,removed);return removed;
}
export function detachTarget(state,sessionId){
 prepare(state);state.childSessions.delete(sessionId);
 for(const frame of [...state.frames.values()])if(frame.sessionId===sessionId)removeFrame(state,frame.id);
}
export function recordFrame(state,frame,parent=null,sessionId,sourceRoot=false){
 prepare(state);let old=state.frames.get(frame.id);
 const main=sessionId===undefined&&parent===null&&!frame.parentId;
 const parentId=main?null:frame.parentId||parent||old?.parent||null;
 const foreign=!main&&!sourceRoot&&old?.sessionId&&old.sessionId!==sessionId&&state.childSessions.has(old.sessionId);
 if(foreign){old.parent=parentId;return {frame:old,owned:false}}
 const changed=Boolean(old?.loaderId&&frame.loaderId&&old.loaderId!==frame.loaderId);
 if(changed){
  if(main){state.frames.clear();state.frameChildren.clear();state.frameEpoch++;old=undefined}
  else for(const child of [...state.frames.values()])if(child.parent===frame.id)removeFrame(state,child.id);
 }
 const current={...old,id:frame.id,parent:parentId,name:frame.name??old?.name??'',url:frame.url??old?.url??'',loaderId:frame.loaderId??old?.loaderId,sessionId,sourceRoot:sourceRoot||old?.sourceRoot&&old?.sessionId===sessionId,contextId:changed||old?.sessionId!==sessionId?undefined:old?.contextId};
 state.frames.set(frame.id,current);if(main)state.mainFrame=frame.id;
 return {frame:current,owned:true};
}
export function recordTree(state,tree,parent=null,sessionId){
 const {owned}=recordFrame(state,tree.frame,parent,sessionId,parent===null);
 if(owned)state.frameChildren.set(tree.frame.id,new Set((tree.childFrames||[]).map(c=>c.frame.id)));
 for(const child of tree.childFrames||[])recordTree(state,child,tree.frame.id,sessionId);
}
export function pruneFrames(state){
 prepare(state);const reachable=new Set(),pending=[state.mainFrame];
 // Cross-process descendants may be absent from the parent's getFrameTree.
 // Their own live target tree supplies the parent edge instead.
 while(pending.length){const id=pending.pop();if(reachable.has(id)||!state.frames.has(id))continue;reachable.add(id);pending.push(...(state.frameChildren.get(id)||[]));for(const frame of state.frames.values())if(frame.parent===id&&frame.sourceRoot&&state.childSessions.has(frame.sessionId))pending.push(frame.id)}
 erase(state,new Set([...state.frames.keys()].filter(id=>!reachable.has(id))));
}
