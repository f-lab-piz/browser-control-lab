import {parse} from 'acorn';
// Validate the public script surface without changing declaration kinds or scope.
// The native QuickJS global async evaluator owns persistent lexical bindings.
export function transformCode(code){
 const ast=parse(code,{ecmaVersion:'latest',sourceType:'module'});
 for(const statement of ast.body)if(statement.type.startsWith('Import')||statement.type.startsWith('Export'))throw Error('Module imports/exports are not available in the browser REPL');
 return code;
}
