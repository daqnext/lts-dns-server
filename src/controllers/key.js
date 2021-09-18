const { koaRouter, moment, ROOTDIR, sqlpool ,ECTMServer,ECTHttpServer} = require("../global.js");//all the global data and initialization
const { KeyManager } = require("../manager/keymanager.js");

koaRouter.ECTMGet('/key/verify', async (ctx, next) => {

    if (! await ECTMServer.Get(ctx)) {
        await next();
        return;
    }

    let token = ctx.ectReq.GetToken();
    if (token && (await KeyManager.keyExist(token))) {
        ECTHttpServer.SendBack(ctx, { result: true });
    } else {
        ECTHttpServer.SendBack(ctx, { result: false });
    }

    await next();
});


koaRouter.ECTMGet('/key/getall', async (ctx, next) => {

    if (! await ECTMServer.Get(ctx)) {
        await next();
        return;
    }

    let token = ctx.ectReq.GetToken()
    if (token && (await KeyManager.keyExist(token))) {
        res = { result: await KeyManager.getAllAsArray() };
        ECTHttpServer.SendBack(ctx,res);
    } else {
        res = { result: [] };
        ECTHttpServer.SendBack(ctx,res);
    }
});
