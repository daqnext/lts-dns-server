const koa =require('koa');
const named = require('lts-dns-server-lib/lib/index');
const router =require( 'koa-router');
const cors = require("koa2-cors");
const path =require( 'path');
const {args} =require('../configs/args.js');
const log4js =require( 'log4js');
const ioredis =require( "ioredis");
const mysql =require( "mysql2");
const axios =require( "axios");
const randomstring =require( "randomstring");
const moment = require('moment');
const {ECTHttpServer,ecthttp} = require("ectsm-node");
const {Utils} =require('./util.js');
 



//////////////////////////////////////////
let ROOTDIR=path.resolve();

//////////global koa//////////////
let koaApp = new koa();
let koaRouter = new router();



////////////global ioredis////////////
const redis = new Redis.Cluster([
      {
        host: args.redis_host,
        port: args.redis_port,
      }]
);

// Create the connection pool. The pool-specific settings are the defaults
let sqlpool = mysql.createPool({
    host: args.db_host,
    user: args.db_username,
    password:args.db_password,
    database: args.db_name,
    waitForConnections: true,
    connectionLimit: args.db_pool_num,
    queueLimit: 0
}).promise();



///////////global log4js//////////////
log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: ROOTDIR+"/log/"+args.logfilename, 
            maxLogSize: 500000,
            backups: 5,
            replaceConsole: true,
        },
        console: {
            type: 'console',
            replaceConsole: true,
        },
    },
    categories: {
        default: { appenders: args.logtypes,level: args.loglevel },
    },

    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    disableClustering: true
});

let logger=log4js.getLogger('default');


//ectm 

///koa-ectm support middleware
koaApp.use(
    cors({
        exposeHeaders: ["Ectm_key", "ectm_key", "Ectm_time", "ectm_time", "Ectm_token", "ectm_token"],
    })
);

async function GetRawBody(ctx, next) {
    let data = Buffer.from("");
    ctx.rawBody = await new Promise((resolve, reject) => {
        ctx.req.on("data", (chunk) => {
            //data+=chunk; // 将接收到的数据暂时保存起来
            data = Buffer.concat([data, chunk]);
        });
        ctx.req.on("end", () => {
            if (data.length == 0) {
                console.log("no body");
                resolve(null);
            } else {
                //console.log(Buffer.from(data[0]));
                resolve(data);
            }
        });
    });
    await next();
}


koaRouter.ECTMPost=function(url,func){
    koaRouter.post(url,GetRawBody,func);
}

koaRouter.ECTMGet=function(url,func){
    koaRouter.get(url,func);
}


let ECTMServer = new ECTHttpServer(args.ECTM_PriKeyStr);

ECTMServer.Post=async function(ctx){
    let ectReq=  await ECTMServer.HandlePost(ctx.headers,ctx.rawBody);
    if (ectReq.Err != null) {
        ctx.status = 500;
        ctx.body = Buffer.from("decrypt header error");
        return false;
    }else{
        ctx.ectReq=ectReq;
        return true;
    }
}

ECTMServer.Get=async function(ctx){
    let ectReq = await ECTMServer.HandleGet(ctx.headers,ctx.rawBody);
    if (ectReq.Err != null) {
        ctx.status = 500;
        ctx.body = Buffer.from("decrypt header error");
        return false;
    }else{
        ctx.ectReq=ectReq;
        return true;
    }
}


ECTHttpServer.SendBack=function(ctx,data){
    const ECTResponseObj = ECTHttpServer.ECTSendBack(ctx.res, ctx.ectReq.SymmetricKey, data);
    if (ECTResponseObj.err != null) {
        ctx.status = 500;
        ctx.body = Buffer.from(ECTResponseObj.err);
        return false;
    }
    ctx.body = ECTResponseObj.encryptedBodyBuffer;
    return true
}

module.exports={args,ROOTDIR,koaApp,named,koaRouter,logger,redis,sqlpool,axios,randomstring,moment,ecthttp,ECTMServer,ECTHttpServer,Utils};

