import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export async function buildExtension({directory=path.join(root,'.local/extension'),connection}={}){
 if(!connection?.url||!connection?.token)throw Error('Bridge connection required');await mkdir(directory,{recursive:true});
 for(const name of ['manifest.json','offscreen.html','offscreen.js'])await copyFile(path.join(root,'extension',name),path.join(directory,name));
 await copyFile(fileURLToPath(import.meta.resolve('@jitl/quickjs-wasmfile-release-sync/wasm')),path.join(directory,'quickjs.wasm'));
 await build({entryPoints:[path.join(root,'extension/background.js')],outfile:path.join(directory,'background.js'),bundle:true,format:'esm',platform:'browser',target:'chrome120',logLevel:'silent'});
 await build({entryPoints:[path.join(root,'extension/runtime-worker.mjs')],outfile:path.join(directory,'runtime-worker.js'),bundle:true,format:'esm',platform:'browser',target:'chrome120',conditions:['browser'],logLevel:'silent'});
 await writeFile(path.join(directory,'connection.json'),JSON.stringify(connection));return directory;
}
