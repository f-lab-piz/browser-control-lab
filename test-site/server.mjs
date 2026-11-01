import http from 'node:http';
import {outputPng,reviewPng,formatPng,pngFormatCases} from './output-png.mjs';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const scenarios=['basic','mail','booking','dropdown','large','files','dynamic','audit'];
export function createRun(scenario){
 if(!scenarios.includes(scenario))throw Error('Unknown scenario');
 return {id:crypto.randomUUID(),scenario,status:'pending',events:[],state:{loaded:30,mailScrolls:0},task:{mail:137,room:2,start:8,end:12,option:230,item:2761,fileText:'browser-control-upload-proof',audit:{semantics:'tester@example.test',duplicates:'right',delay:'approved',overlay:'clicked',clipped:'clicked',drag:'shipment-A',mime:'mime-proof',shadow:'clicked',slot:'clicked',details:'clicked',multi:['a.txt:A','b.txt:B'],localdrop:'local-proof',offscreen:'clicked',coordinates:'clicked'}}};
}
export function applyEvent(run,event){
 const {type,...data}=event;let valid=false;const s=run.state,t=run.task;
 switch(run.scenario){
 case 'audit':if(type==='audit-step'&&Object.hasOwn(t.audit,data.key)&&JSON.stringify(data.value)===JSON.stringify(t.audit[data.key])){(s.passed??={})[data.key]=true;valid=true;s.complete=Object.keys(s.passed).length===Object.keys(t.audit).length}break;
 case 'basic':if(type==='basic-submit'&&data.name==='테스터'&&data.checked===true){valid=true;s.complete=true}break;
 case 'mail':
  if(type==='mail-load'&&data.loaded===s.loaded+30&&data.loaded<=300){s.loaded=data.loaded;s.mailScrolls++;valid=true}
  if(type==='mail-open'&&data.id<=s.loaded){s.open=data.id;valid=true}
  if(type==='mail-read'&&data.id===t.mail&&s.open===t.mail&&s.loaded>=t.mail&&s.mailScrolls>0){s.complete=true;valid=true}break;
 case 'booking':
  if(type==='booking-select'&&data.row===t.room&&data.start===t.start&&data.end===t.end&&data.moved===true){s.selection=data;valid=true}
  if(type==='booking-open'&&s.selection){s.open=true;valid=true}
  if(type==='booking-confirm'&&s.open&&data.title==='설계 회의'&&data.people===4){s.complete=true;valid=true}break;
 case 'dropdown':
  if(type==='dropdown-scroll'&&Number.isInteger(data.first)&&data.first>=0&&data.first<600){s.first=data.first;s.scrolled=true;valid=true}
  if(type==='dropdown-select'&&data.index===t.option&&s.scrolled&&s.first<=t.option&&s.first+14>t.option){s.complete=true;valid=true}break;
 case 'large':if(type==='large-select'&&data.index===t.item){s.complete=true;valid=true}break;
 case 'files':
  if(type==='file-upload'&&data.sha256===crypto.createHash('sha256').update(t.fileText).digest('hex')&&data.size===Buffer.byteLength(t.fileText)){s.upload=true;valid=true}
  if(type==='file-download-issued'&&s.upload){s.download=true;s.complete=true;valid=true}break;
 case 'dynamic':
  if(type==='dynamic-select'&&data.value==='current-generation'){s.complete=true;valid=true}break;
 }
 run.events.push({type,data,accepted:valid,at:Date.now()});
 if(s.complete)run.status='passed';
 return {accepted:valid,status:run.status};
}
export async function startFixture({port=0}={}){
 const runs=new Map();
 const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://local');
  const send=(data,status=200,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(type==='application/json'?JSON.stringify(data):data)};
  try{
   if(url.pathname==='/reset-file'){res.writeHead(200,{'Content-Type':'text/plain','Content-Disposition':'attachment; filename="reset-proof.txt"'});res.end('reset-file-proof');return}
   if(url.pathname==='/output-format-image'){const row=pngFormatCases().find(r=>r.name===url.searchParams.get('name'));if(!row)throw Error('Unknown PNG format case');return send({type:'image',mimeType:'image/png',data:formatPng(row.options).toString('base64')})}
   if(url.pathname==='/output-review-image')return send({type:'image',mimeType:'image/png',data:reviewPng(url.searchParams.get('kind')).toString('base64')});
   if(url.pathname==='/output-image')return send({type:'image',mimeType:'image/png',data:outputPng(Number(url.searchParams.get('bytes')||128)).toString('base64')});
   if(url.pathname==='/api/runs'&&req.method==='POST'){
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>65536)throw Error('Body too large')}
    const run=createRun(JSON.parse(raw||'{}').scenario);runs.set(run.id,run);return send(run,201);
   }
   if(url.pathname.startsWith('/api/runs/')){
    const [, , ,id,action]=url.pathname.split('/');const run=runs.get(id);if(!run)return send({error:'Run not found'},404);
    if(action==='events'&&req.method==='POST'){
     let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>65536)throw Error('Body too large')}
     return send(applyEvent(run,JSON.parse(raw)));
    }
    return send(run);
   }
   if(url.pathname==='/download'){
    const run=runs.get(url.searchParams.get('run'));if(!run||!run.state.upload)return send({error:'Upload first'},409);
    applyEvent(run,{type:'file-download-issued'});
    res.writeHead(200,{'Content-Type':'text/plain','Content-Disposition':'attachment; filename="proof-download.txt"'});if(url.searchParams.get('slow')==='1'){const bytes=Buffer.from(run.task.fileText.repeat(100000));let offset=0;const timer=setInterval(()=>{if(offset>=bytes.length){clearInterval(timer);res.end();return}res.write(bytes.subarray(offset,offset+32768));offset+=32768},60);res.on('close',()=>clearInterval(timer))}else res.end(run.task.fileText);return;
   }
   if(url.pathname==='/audit-export'){if(url.searchParams.get('mode')==='cookie'&&!req.headers.cookie?.includes('bcl_fixture=yes'))return send({error:'Cookie required'},403);res.writeHead(200,{'Content-Type':'text/plain','Content-Disposition':'attachment; filename=export-proof.txt'});res.end('audit-export-proof');return}
   if(url.pathname==='/audit-frame')return send('<button style="margin:80px" onclick="this.textContent=\'좌표 성공\';parent.postMessage({auditCoordinate:\'clicked\'},location.origin)">좌표 내부 실행</button>',200,'text/html; charset=utf-8');
   if(url.pathname==='/popup')return send('<h1>팝업 연결 확인</h1><button onclick="window.close()">닫기</button>',200,'text/html; charset=utf-8');
   if(url.pathname==='/noop')return send('잘못된 목적 링크입니다. 업무 대상은 작업 카드에 표시됩니다.',200,'text/plain; charset=utf-8');
   const file=url.pathname==='/'?'index.html':url.pathname==='/selection-boundaries'?'selection-boundaries.html':url.pathname==='/selection'?'selection.html':url.pathname==='/evaluation'?'evaluation.html':url.pathname==='/reset'?'reset.html':url.pathname==='/audit'?'audit.html':url.pathname==='/coverage'?'coverage.html':url.pathname==='/frame'?'frame.html':url.pathname.slice(1);
   if(!['index.html','selection-boundaries.html','selection.html','evaluation.html','reset.html','frame.html','fixture.js','style.css','audit.html','audit.js','coverage.html','review-boundaries.html'].includes(file))return send({error:'Not found'},404);
   const type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8';
   return send(await readFile(path.join(ROOT,file)),200,type);
  }catch(error){send({error:error.message},400)}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});
 const actual=server.address().port;
 return {server,runs,port:actual,url:'http://127.0.0.1:'+actual,close:()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections()})};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const site=await startFixture({port:Number(process.env.PORT||8787)});
 console.log('Fixture site: '+site.url);
 for(const sig of ['SIGINT','SIGTERM'])process.on(sig,async()=>{await site.close();process.exit()});
}
