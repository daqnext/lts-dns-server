const { koaRouter, moment, ROOTDIR, sqlpool, ECTMServer, ECTHttpServer } = require("../global.js");//all the global data and initialization
const { DomainManager } = require("../manager/domainmanager.js");
const { KeyManager } = require("../manager/keymanager.js");



koaRouter.ECTMGet('/domain/all', async (ctx, next) => {

    if (! await ECTMServer.Get(ctx)) {
        await next();
        return;
    }


    let token = ctx.ectReq.GetToken();
    if (token && (await KeyManager.keyExist(token))) {
        let dresult = await DomainManager.getAll();
        ECTHttpServer.SendBack(ctx, { result: dresult });
    } else {
        ECTHttpServer.SendBack(ctx, { result: [] });
    }

    await next();
});


koaRouter.ECTMPost("/domain/delete", async (ctx, next) => {
    //check header
    if (! await ECTMServer.Post(ctx)) {
        await next();
        return
    }

    let token = ctx.ectReq.GetToken();
    if (token && (await KeyManager.keyExist(token))) {
        const [_result, errmsg] = await DomainManager.delete(ctx.ectReq.ToJson().id);
        ECTHttpServer.SendBack(ctx, { result: _result, msg: errmsg });
    } else {
        ECTHttpServer.SendBack(ctx, { result: false, msg: 'token not exist' });
    }
    await next();
});



koaRouter.ECTMPost("/domain/add", async (ctx, next) => {
    //check header
    if (! await ECTMServer.Post(ctx)) {
        await next();
        return
    }

    let token = ctx.ectReq.GetToken();
    if (token && (await KeyManager.keyExist(token))) {
        let toaddparams=ctx.ectReq.ToJson();
        toaddparams.creator = (await KeyManager.getAll())[token];
        const [_result, errmsg] = await DomainManager.add(toaddparams);
        ECTHttpServer.SendBack(ctx, { result: _result, msg: errmsg });
    } else {
        ECTHttpServer.SendBack(ctx, { result: false, msg: 'token not exist' });
    }
    await next();
});

