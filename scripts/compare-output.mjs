// Our product-path counterpart to the bounded Codex/Aside console experiment.
import {productRuntime,resultText} from '../tests/helpers/product-runtime.mjs';
const h=await productRuntime('b01c-output-comparison',{extraSources:['scripts/compare-output.mjs']});
const code='console.log("before");console.log("x"+String.fromCharCode(0)+"y",{name:"한😀"},7);var b01cCycle={name:"cycle"};b01cCycle.self=b01cCycle;console.log(b01cCycle);console.log("after");42';
try{const session=await h.client.session(),result=await h.client.js(session.id,code);h.evidence.push({case:'bounded-console-comparison',code,result});console.log(JSON.stringify({status:result.status,text:resultText(result),error:result.result?.error}))}finally{await h.close()}
