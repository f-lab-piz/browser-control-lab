import test from 'node:test';
import assert from 'node:assert/strict';
import {createContext,runInContext} from 'node:vm';
import {installBrowserApi} from '../extension/api-source.mjs';
import {stringifyJsonValue} from '../shared/json-value.mjs';
async function runtime(){const calls=[],context=createContext({__hostCall:async(method,args)=>{calls.push({method,args});return method==='browser.attach'?{id:1}:0}});runInContext('('+installBrowserApi.toString()+')('+stringifyJsonValue.toString()+')',context);context.page=await runInContext('browser.attach(1)',context);calls.length=0;return {calls,context}}
test('invalid public search construction is rejected before any host or browser call',async()=>{
 const {calls,context}=await runtime();
 for(const source of ["page.locator('')","page.locator(7)","page.getByText('   ')","page.getByText({})","page.getByLabel('')","page.getByLabel('A',null)","page.getByRole('')","page.getByRole('unknown-role')","page.getByRole('button',[])","page.getByRole('button',{name:null})","page.getByRole('button',{includeHidden:'yes'})","page.getByText('A',{exact:1})","page.getByRole('button',{unknown:true})","page.getByRole('button',{name:/A/g,exact:true})","page.getByText(/A/,{exact:true})","page.getByLabel(/A/,{exact:true})"]){assert.throws(()=>runInContext(source,context),/INVALID_|UNSUPPORTED_/,source)}
 assert.deepEqual(calls,[]);
});
test('public search preserves regex source flags explicit empty role name and a stable options copy',async()=>{
 const {calls,context}=await runtime();
 await runInContext("page.getByText('  A\\n B  ').count()",context);
 await runInContext("page.getByText(/^A B$/gy).count()",context);
 await runInContext("var opts={name:'',exact:true};var chosen=page.getByRole('button',opts);opts.name='changed';chosen.count()",context);
 const rows=JSON.parse(JSON.stringify(calls));assert.equal(rows[0].args.query.value,'A B');assert.deepEqual(rows[1].args.query.value,{__bclRegex:true,source:'^A B$',flags:'gy'});assert.deepEqual(rows[2].args.query.options,{name:'',exact:true});assert(rows.every(row=>row.method==='locator.count'));
});
