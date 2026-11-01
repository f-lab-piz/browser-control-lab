import test from 'node:test';
import assert from 'node:assert/strict';
import {recordTree,recordFrame,removeFrame,detachTarget,pruneFrames} from '../extension/frame-state.mjs';
const state=()=>({frames:new Map(),childSessions:new Set(),frameChildren:new Map(),frameEpoch:0});
const tree=(id,url,loaderId,children=[],parentId)=>({frame:{id,url,loaderId,parentId},childFrames:children});

test('foreign frame stubs cannot overwrite live child-target document or context',()=>{
 const s=state();recordTree(s,tree('root','http://app.test','r1',[tree('portal',':','placeholder')]));s.childSessions.add('portal-session');
 recordTree(s,tree('portal','http://portal.test','p1',[],'root'),null,'portal-session');s.frames.get('portal').contextId=42;
 recordTree(s,tree('root','http://app.test','r1',[tree('portal',':','placeholder')]));
 assert.equal(s.frames.get('portal').url,'http://portal.test');assert.equal(s.frames.get('portal').contextId,42);
 recordTree(s,tree('portal','http://portal.test/new','p2',[],'root'),null,'portal-session');
 assert.equal(s.frames.get('portal').contextId,undefined);assert.equal(s.frames.get('portal').loaderId,'p2');
});
test('detached targets remove descendants without removing another live branch',()=>{
 const s=state();recordTree(s,tree('root','app','r1',[tree('a','a','a1',[tree('grandchild','g','g1')]),tree('b','b','b1')]));
 s.childSessions.add('a-session');s.childSessions.add('g-session');s.childSessions.add('b-session');
 recordFrame(s,{id:'a',url:'a',loaderId:'a1',parentId:'root'},null,'a-session');recordFrame(s,{id:'grandchild',url:'g',loaderId:'g1',parentId:'a'},null,'g-session');recordFrame(s,{id:'b',url:'b',loaderId:'b1',parentId:'root'},null,'b-session');
 detachTarget(s,'a-session');assert.deepEqual([...s.frames.keys()],['root','b']);assert(s.childSessions.has('b-session'));assert(!s.childSessions.has('a-session'));
});
test('late detach cannot remove a frame already mapped to a new target session',()=>{
 const s=state();recordTree(s,tree('root','app','r1',[tree('child','child','c1')]));s.childSessions.add('old');s.childSessions.add('new');
 recordFrame(s,{id:'child',url:'child',loaderId:'c1',parentId:'root'},null,'new');detachTarget(s,'old');assert.equal(s.frames.get('child').sessionId,'new');
});
test('new root document invalidates old contexts and child frames',()=>{
 const s=state();recordTree(s,tree('root','app/a','r1',[tree('old','old','o1')]));s.frames.get('root').contextId=7;
 recordTree(s,tree('root','app/b','r2',[tree('new','new','n1')]));pruneFrames(s);
 assert.deepEqual([...s.frames.keys()],['root','new']);assert.equal(s.frames.get('root').contextId,undefined);assert.equal(s.frameEpoch,1);
});
test('current tree edges prune orphan frames even if a late child tree still replies',()=>{
 const s=state();recordTree(s,tree('root','app','r1',[tree('current','current','c1')]));s.childSessions.add('old-session');
 recordTree(s,tree('old','old','o1',[tree('old-mail','mail','m1')],'removed-parent'),null,'old-session');
 pruneFrames(s);assert.deepEqual([...s.frames.keys()],['root','current']);
 removeFrame(s,'current');assert.deepEqual([...s.frames.keys()],['root']);assert.equal(s.frameChildren.get('root').size,0);
});

test('child target roots remain discoverable when parent trees omit OOPIF descendants',()=>{
 const s=state();s.childSessions.add('portal-session');s.childSessions.add('mail-session');
 recordTree(s,tree('root','app','r1'));
 recordTree(s,tree('portal','portal','p1',[],'root'),null,'portal-session');
 recordTree(s,tree('mail','mail','m1',[],'portal'),null,'mail-session');
 recordTree(s,tree('root','app','r1'));pruneFrames(s);
 assert.deepEqual([...s.frames.keys()],['root','portal','mail']);
 removeFrame(s,'portal');assert.deepEqual([...s.frames.keys()],['root']);
});
test('a child target own root replaces an inherited parent session',()=>{
 const s=state();s.childSessions.add('portal-session');s.childSessions.add('mail-session');
 recordTree(s,tree('root','app','r1',[tree('portal',':','p0')]));
 recordTree(s,tree('portal','portal','p1',[tree('mail',':','m0')],'root'),null,'portal-session');
 recordTree(s,tree('mail','mail','m1',[],'portal'),null,'mail-session');
 assert.equal(s.frames.get('mail').url,'mail');assert.equal(s.frames.get('mail').sessionId,'mail-session');
 recordTree(s,tree('portal','portal','p1',[tree('mail',':','m0')],'root'),null,'portal-session');
 assert.equal(s.frames.get('mail').url,'mail');assert.equal(s.frames.get('mail').sessionId,'mail-session');
});
