const { args, koaApp, named, koaRouter, logger, ROOTDIR } = require("./global.js");//all the global data and initialization
const json = require("koa-json");
const koastatic = require("koa-static");
const koabodyparser = require("koa-bodyparser");
const fs = require("fs");
const { DomainManager } = require("./manager/domainmanager.js");



/////////ini koa //////////////////////////
koaApp.use(json());
koaApp.use(koastatic(ROOTDIR + '/assets/koa_static'));
koaApp.use(koabodyparser());

koaApp.use(async (ctx, next) => {
        try {
                await next();   // execute code for descendants
                if (!ctx.body) {
                        ctx.status = 404; ctx.body = "not found";
                        logger.debug("not found 404:", ctx.request);
                }
        } catch (e) {
                ctx.status = 500; ctx.body = "server error";
                logger.error("server error:", ctx.request, e);
        }
});

/////////require all the controllers////////////
fs.readdirSync(ROOTDIR + "/src/controllers").forEach(function (file) {
        require(ROOTDIR + "/src/controllers/" + file)
});

koaApp.use(koaRouter.routes()).use(koaRouter.allowedMethods());

koaApp.listen(args.port, () => {
        logger.info('The application is listening on port : ', args.port);
})

////////////start dns server //////////

var server = named.createServer();


server.listen(53, '0.0.0.0', function () {
        console.log('DNS server started on port 53');
});


server.on('query', async function (query) {

        try{
                var domain = query.name()
                var type = query.type();
        }catch(err){
                logger.error('bad dns query');
                type='';
        }
        

        switch (type) {

                case 'A':
                        if (domain.startsWith('spec-00') && domain.length > 15) {
                                var taglength = parseInt(domain.substring(11, 14));
                                if (taglength && taglength > 0) {
                                        try {
                                                var tagstr = domain.substring(15, 15 + taglength);
                                                var record = new named.ARecord(DomainManager.tagToIp(tagstr));
                                                query.addAnswer(domain, record, 72000);
                                        } catch (err) {
                                                logger.error('bad tag resolving');
                                        }
                                }
                                break;
                        } else {
                                try {
                                        var cacherecord = await DomainManager.getRecord('A', domain);
                                        if (cacherecord.value) {
                                                var record = new named.ARecord(cacherecord.value);
                                                query.addAnswer(domain, record, cacherecord.ttl);
                                        }
                                } catch (err) {
                                        logger.error('A type bad resolving');
                                }
                                break;
                        }
                case 'TXT':
                        try {
                                var cacherecord = await DomainManager.getRecord('TXT', domain);
                                if (cacherecord.value) {
                                        var record = new named.TXTRecord(cacherecord.value);
                                        query.addAnswer(domain, record, cacherecord.ttl);
                                }
                        } catch (err) {
                                logger.error('TXT resolve error');
                        }
                        break;
                case 'MX':
                        try {
                                var cacherecord = await DomainManager.getRecord('MX', domain);
                                if (cacherecord.value) {
                                        var record = new named.MXRecord(cacherecord.value, { ttl: cacherecord.ttl });
                                        query.addAnswer(domain, record, cacherecord.ttl);
                                }
                        } catch (err) {
                                logger.error('MX resolve error');
                        }
                        break;
                case 'SOA':
                        try {
                                var record = new named.SOARecord('mesontracking.com', {
                                        admin: 'admin@mesontracking.com',
                                        serial: 0,
                                        refresh: 36000,
                                        retry: 1800,
                                        expire: 72000,
                                        ttl: 72000
                                });
                                query.addAnswer(domain, record, 72000);

                        } catch (err) {
                                logger.error('SOA resolve error');
                        }
                        break;

                case 'CAA':
                        try {
                                var cacherecord = await DomainManager.getRecord('CAA', domain);
                                if (cacherecord.value) {
                                        var record = new named.CAARecord(cacherecord.caa_flag, cacherecord.caa_tag, cacherecord.value);
                                        query.addAnswer(domain, record, cacherecord.ttl);
                                }
                        } catch (err) {
                                logger.error('CAA resolve error');
                        }
                        break;
                case 'AAAA':
                        try {
                                var cacherecord = await DomainManager.getRecord('AAAA', domain);
                                if (cacherecord.value) {
                                        var record = new named.AAAARecord(cacherecord.value);
                                        query.addAnswer(domain, record, cacherecord.ttl);
                                }
                        } catch (err) {
                                logger.error('AAAA resolve error');
                        }
                        break;
                case 'CNAME':
                        try {
                                var cacherecord = await DomainManager.getRecord('CNAME', domain);
                                if (cacherecord.value) {
                                        var record = new named.CNAMERecord(cacherecord.value);
                                        query.addAnswer(domain, record, cacherecord.ttl);
                                }
                        } catch (err) {
                                logger.error('CNAME resolve error');
                        }
                        break;
        }
        server.send(query);
});

server.on('clientError', function (error) {
        logger.error('there was a clientError',error);
});

server.on('uncaughtException', function (error) {
        logger.error('there was an excepton:',error.message());
});

///////////end of main////////////////////////

