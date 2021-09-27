const { redis, sqlpool, Utils } = require("../global.js");
class DomainManager {

    static mem_prefix = "dns_domain_"

    static async getAll(forceupdate = false) {
        let key = DomainManager.mem_prefix + "all";
        let exist = await redis.exists(key);
        if(exist){
            if (Utils.checkTtlRefresh(await redis.ttl(key))) {
                forceupdate = true;
            }
        }

        let resultstr;
        if (!exist || forceupdate) {
            const [rows, fields] = await sqlpool.query("select * from domain");
            resultstr = JSON.stringify(rows);
            await redis.set(DomainManager.mem_prefix + "all", resultstr);
            await redis.expire(DomainManager.mem_prefix + "all", 30);
        } else {
            resultstr = await redis.get(DomainManager.mem_prefix + "all");
        }
        return JSON.parse(resultstr);
    }

    static async delete(id) {
        try {
            await sqlpool.execute("delete from domain where id =" + id);
            await DomainManager.getAll(true);
            return [true, ''];
        } catch (err) {
            return [false, err.toString()];
        }
    }

    static async add(recordinput) {
        try {
            await sqlpool.execute("INSERT INTO domain (type,domain,value,caa_flag,caa_tag,ttl,creator) VALUES (?,?,?,?,?,?,?)",
                [recordinput.type, recordinput.domain,
                recordinput.value, recordinput.caa_flag,
                recordinput.caa_tag, recordinput.ttl,
                recordinput.creator]);
            await DomainManager.getAll(true);
            return [true, ''];
        } catch (err) {
            return [false, err.toString()];
        }
    }

    static async setRecord(type, domain, object) {
        let tosetstr = JSON.stringify(object);
        let key = DomainManager.mem_prefix + "record_" + type + "_" + domain;
        await redis.set(key, tosetstr);
        await redis.expire(key, 30);
    }

    static async getRecord(type, domain, forceupdate = false) {
        try {
            let key = DomainManager.mem_prefix + "record_" + type + "_" + domain;
            let exist = await redis.exists(key);
            if(exist){
                if (Utils.checkTtlRefresh(await redis.ttl(key))) {
                    forceupdate = true;
                }
            }

            let resultstr;

            if (!exist || forceupdate) {
                const [rows, fields] = await sqlpool.query("select * from domain where type='" + type + "' and domain='" + domain + "' ");
                if (rows[0]) {
                    resultstr = JSON.stringify(rows[0]);
                } else {
                    resultstr = '{}';
                }

                await redis.set(key, resultstr);
                await redis.expire(key, 30);
            } else {
                resultstr = await redis.get(key);
            }

            if (resultstr == null) {
                return null;
            }

            return JSON.parse(resultstr);

        } catch (err) {
            return {};
        }
    }


    static tagToIp(tagstr) {
        let result = "";
        for (let i = 0; i < tagstr.length; i++) {
            let tchar = tagstr.charAt(i);
            if (tchar == 'k') {
                result = result + "."
            } else if (tchar == 'x') {
                break;
            } else {
                result = result + String.fromCharCode(tchar.charCodeAt(0) - 49);
            }
        }
        return result
    }





}

module.exports = { DomainManager }