import {parse} from 'acorn';
import {generate} from 'astring';
const globalTarget=name=>({type:'MemberExpression',computed:true,object:{type:'Identifier',name:'globalThis'},property:{type:'Literal',value:name}});
function target(pattern){
 if(pattern.type==='Identifier')return globalTarget(pattern.name);
 if(pattern.type==='ArrayPattern')return {...pattern,elements:pattern.elements.map(p=>p&&target(p))};
 if(pattern.type==='ObjectPattern')return {...pattern,properties:pattern.properties.map(p=>p.type==='RestElement'?target(p):({...p,shorthand:false,value:target(p.value)}))};
 if(pattern.type==='RestElement')return {...pattern,argument:target(pattern.argument)};
 if(pattern.type==='AssignmentPattern')return {...pattern,left:target(pattern.left)};
 throw Error('Unsupported persistent declaration: '+pattern.type);
}
// Independent REPL transformation: top-level bindings become global properties.
// Each request is an ES module to support top-level await without wrapping variables in a function.
export function transformCode(code){
 const ast=parse(code,{ecmaVersion:'latest',sourceType:'module'}),body=[];
 for(const statement of ast.body){
  if(statement.type.startsWith('Import')||statement.type.startsWith('Export'))throw Error('Module imports/exports are not available in the browser REPL');
  if(statement.type==='VariableDeclaration'){
   for(const declaration of statement.declarations)body.push({type:'ExpressionStatement',expression:{type:'AssignmentExpression',operator:'=',left:target(declaration.id),right:declaration.init||{type:'UnaryExpression',operator:'void',prefix:true,argument:{type:'Literal',value:0}}}});
  }else if(['FunctionDeclaration','ClassDeclaration'].includes(statement.type)){
   body.push({type:'ExpressionStatement',expression:{type:'AssignmentExpression',operator:'=',left:globalTarget(statement.id.name),right:{...statement,type:statement.type==='FunctionDeclaration'?'FunctionExpression':'ClassExpression'}}});
  }else body.push(statement);
 }
 return generate({...ast,body});
}
