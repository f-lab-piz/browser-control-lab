// Self-contained so the same rule can run in QuickJS and a page isolated world.
// Unlike JSON.stringify, this never invokes toJSON, drops fields, or coerces
// undefined/nonfinite values to null. Negative zero remains a finite JSON value.
export function stringifyJsonValue(value){
 const ancestors=new Set();
 const fail=(path,message)=>{throw Error('SERIALIZATION_ERROR: '+path+' '+message)};
 function visit(input,path){
  if(input===null)return 'null';
  if(typeof input==='boolean')return input?'true':'false';
  if(typeof input==='string')return JSON.stringify(input);
  if(typeof input==='number'){if(!Number.isFinite(input))fail(path,'must be finite');return Object.is(input,-0)?'-0':String(input)}
  if(typeof input!=='object')fail(path,'cannot contain '+typeof input);
  if(ancestors.has(input))fail(path,'is circular');
  const array=Array.isArray(input),keys=Reflect.ownKeys(input);
  if(array){if(keys.length!==input.length+1)fail(path,'must be a dense array without extra properties')}
  else{
   const prototype=Object.getPrototypeOf(input);
   if(prototype!==null){
    const constructor=Object.getOwnPropertyDescriptor(prototype,'constructor')?.value;
    if(Object.getPrototypeOf(prototype)!==null||typeof constructor!=='function'||constructor.prototype!==prototype||Function.prototype.toString.call(constructor)!==Function.prototype.toString.call(Object))fail(path,'must be a plain object');
   }
  }
  ancestors.add(input);
  try{
   if(array){
    const values=[];
    for(let index=0;index<input.length;index++){
     const descriptor=Object.getOwnPropertyDescriptor(input,String(index));
     if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))fail(path+'['+index+']','must be an own data element');
     values.push(visit(descriptor.value,path+'['+index+']'));
    }
    return '['+values.join(',')+']';
   }
   const values=[];
   for(const key of keys){
    if(typeof key!=='string')fail(path,'cannot contain symbol keys');
    const descriptor=Object.getOwnPropertyDescriptor(input,key);
    if(!descriptor?.enumerable||!Object.hasOwn(descriptor,'value'))fail(path+'.'+key,'must be enumerable data');
    values.push(JSON.stringify(key)+':'+visit(descriptor.value,path+'.'+key));
   }
   return '{'+values.join(',')+'}';
  }finally{ancestors.delete(input)}
 }
 return visit(value,'$');
}
