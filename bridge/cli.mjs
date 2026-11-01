import {startBridge} from './server.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {buildExtension} from '../scripts/build-extension.mjs';
const bridge=await startBridge({port:Number(process.env.BRIDGE_PORT||8791)});
const directory=await buildExtension({connection:{url:bridge.url,token:bridge.extensionToken}});
await mkdir('.local',{recursive:true});await writeFile('.local/client.json',JSON.stringify({url:bridge.url,token:bridge.token}),{mode:0o600});
console.log('HTTP bridge: '+bridge.url+'\nLoad unpacked extension from: '+directory+'\nToken is saved in .local/extension/connection.json (not tracked by Git).');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await bridge.close();process.exit()});
