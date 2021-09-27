const { now } = require("moment-timezone");
const {koaRouter,moment,ROOTDIR,redis,Utils } =require("../global.js");//all the global data and initialization

koaRouter.get('/test1',async (ctx,next) =>{

    await redis.set("testkey1","aaaa");
    await redis.expire("testkey1",30)
    ttlresult= await redis.ttl("testkey1")

    ctx.body={result:ttlresult};
    await next();
});

koaRouter.get('/test2',async (ctx,next) =>{
    
 
    let i=0;
    for (i = 0; i < 100000; i++) {
        if(Utils.checkTtlRefresh(1)){
            break;
        }
      }

    ctx.body={i:i};
    await next();
});


