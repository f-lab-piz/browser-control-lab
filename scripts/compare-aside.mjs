// Independent live comparison only; never substitutes for product execution.
import {execFile} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const url=process.env.FIXTURE_URL||'http://127.0.0.1:8794/audit';
const program=`
const comparison={engine:'Aside',cases:[]};const t=await openTab(${JSON.stringify(url)});
try{
 const s=await snapshot(t);comparison.snapshot={chars:s.tree.length,tail:s.tree.includes('문서 끝 승인'),selected:s.tree.includes('selected'),secret:s.tree.includes('never-print-this-secret'),mentionsTruncation:/truncat|omitt|생략/i.test(s.tree)};
 const id=await t.locator('body').getAttribute('data-run');
 for(const [name,run] of [
 ['regex-role',async()=>await t.getByRole('button',{name:/레이블 저장/}).count()],
 ['filter-visible',async()=>await t.locator('#duplicates button').filter({visible:true}).count()],
 ['negative-nth',async()=>await t.locator('#duplicates [data-unit]').nth(-1).count()],
 ['slot-name',async()=>{await t.getByRole('button',{name:'슬롯 승인',exact:true}).click();await snapshot(t);return await t.getByText('PASS · slot',{exact:true}).count()}],
 ['readonly-fill',async()=>{try{await t.getByLabel('고정 문서번호',{exact:true}).fill('BROKEN',{timeout:500});return 'completed'}catch(e){return 'rejected'}}],
 ['scaled-frame-click',async()=>{await t.frameLocator('iframe').getByRole('button',{name:'좌표 내부 실행',exact:true}).click();await snapshot(t);return await t.frameLocator('iframe').getByRole('button',{name:'좌표 성공',exact:true}).count()}],
 ['html-drag',async()=>{await t.locator('#drag-source').dragTo(t.locator('#drag-target'));await snapshot(t);await t.getByText('PASS · drag',{exact:true}).waitFor({timeout:2000});return true}],
 ['screenshot-clip',async()=>{const b=await t.screenshot({clip:{x:0,y:0,width:320,height:240}});return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)}}]
 ]){try{comparison.cases.push({id:name,status:'measured',value:await run()})}catch(e){comparison.cases.push({id:name,status:'error',error:e.message})}}
 const scoped=await snapshot(t,{selector:'#tail-target'});comparison.scoped={chars:scoped.tree.length,tail:scoped.tree.includes('문서 끝 승인')};
 const state=await fetch(new URL('/api/runs/'+id,${JSON.stringify(url)}).href).then(r=>r.json());comparison.serverPassed=state.state.passed;comparison.events=state.events;
 console.log('BCL_COMPARISON '+JSON.stringify(comparison));
}finally{await closeTab(t)}
`;
await mkdir('output/before-after',{recursive:true});
const args=['repl',...(process.env.ASIDE_ACCOUNT?['--account',process.env.ASIDE_ACCOUNT]:[]),program];
const output=await new Promise(resolve=>execFile('aside',args,{timeout:120000,maxBuffer:1048576},(error,stdout,stderr)=>resolve({error:error?.message,stdout,stderr})));
await writeFile('output/before-after/aside-raw.txt',output.stdout+'\n'+output.stderr);
const line=output.stdout.split('\n').find(s=>s.startsWith('BCL_COMPARISON '));
const result=line?JSON.parse(line.substring('BCL_COMPARISON '.length)):{status:'blocked',error:output.error||output.stderr};
await writeFile('output/before-after/aside.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));if(!line)process.exitCode=1;
