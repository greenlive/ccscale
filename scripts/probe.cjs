const http=require('http');
const urls=['http://localhost:3000/en','http://localhost:8000/api/health','http://localhost:3001/dashboard'];
function check(url){return new Promise((resolve)=>{const req=http.get(url,{timeout:2000},(res)=>{resolve(res.statusCode);res.resume();});req.on('error',(e)=>resolve('ERR:'+e.code));req.on('timeout',()=>{req.destroy();resolve('TIMEOUT');});});}
(async()=>{for(const u of urls){const r=await check(u);console.log(u+' -> '+r);}})();
