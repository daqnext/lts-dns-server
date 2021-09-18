const { now } = require("moment-timezone");
const { koaRouter, moment, ROOTDIR, args, ecthttp, ECTMServer,ECTHttpServer } = require("../global.js");//all the global data and initialization


koaRouter.get('/ectminfo', async (ctx, next) => {
    ctx.body = {
        UnixTime: Math.floor(Date.now() / 1000),
        PublicKey: args.ECTM_PubKeyStr
    };
    await next();
});


koaRouter.ECTMGet('/testget', async (ctx, next) => {

    if (! await ECTMServer.Get(ctx)) {
        await next();
        return
    }
    console.log("symmetricKey:", ctx.ectReq.GetSymmetricKey());
    console.log("token:", ctx.ectReq.GetToken());
    //responseData example
    const data = {
        Status: 0,
        Msg: "get success",
        Data: "this is some data",
    };

    ECTHttpServer.SendBack(ctx, data)
    await next();
});


koaRouter.ECTMPost("/testpost", async (ctx,next) => {
     
    if (! await ECTMServer.Post(ctx)) {
        await next();
        return
    }

    console.log("symmetricKey:", ctx.ectReq.GetSymmetricKey());
    console.log("token:", ctx.ectReq.GetToken());
    console.log("decryptedBody string:", ctx.ectReq.ToString());
    console.log("decryptedBody json:", ctx.ectReq.ToJson());

    //responseData example
    const data = {
        Status: 0,
        Msg: "post success",
        Data: null,
    };

    ECTHttpServer.SendBack(ctx, data);
    await next();
});
