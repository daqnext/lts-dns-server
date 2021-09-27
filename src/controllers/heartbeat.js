const { now } = require("moment-timezone");
const {koaRouter,moment,ROOTDIR } =require("../global.js");//all the global data and initialization

koaRouter.get('/heartbeat',async (ctx,next) =>{
    ctx.body={time:moment().unix()};
    await next();
});

