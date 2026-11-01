import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {stringifyJsonValue} from '../shared/json-value.mjs';
test('JSON codec keeps exact finite values own prototype-like keys shared references and cross-realm plain data',()=>{
 const common={x:1},value=JSON.parse('{"__proto__":{"own":true},"constructor":7}');
 value.zero=-0;value.text='a\0한😀\ud800';value.shared=[common,common];
 const copy=JSON.parse(stringifyJsonValue(value));assert.deepEqual(copy,value);assert(Object.is(copy.zero,-0));assert(Object.hasOwn(copy,'__proto__'));assert.equal({}.own,undefined);
 assert.equal(stringifyJsonValue(runInNewContext('({x:[null,false,7]})')),'{"x":[null,false,7]}');
 assert.equal(stringifyJsonValue(Object.assign(Object.create(null),{x:1})),'{"x":1}');
});
test('JSON codec rejects loss-prone data without invoking accessors or toJSON',()=>{
 let invoked=0;const getter=Object.defineProperty({},'x',{enumerable:true,get(){invoked++;return 7}}),toJSON={toJSON(){invoked++;return null}},cycle={};cycle.self=cycle;
 for(const value of [undefined,NaN,Infinity,1n,Symbol('x'),()=>1,{x:undefined},[,1],new Date(),new Map(),getter,toJSON,cycle,{[Symbol('x')]:1},Object.defineProperty({},'x',{value:1}),Object.assign([1],{extra:2})])assert.throws(()=>stringifyJsonValue(value),/SERIALIZATION_ERROR/);
 assert.equal(invoked,0);
});
