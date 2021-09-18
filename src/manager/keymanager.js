const {redis,sqlpool} =require("../global.js");
class KeyManager{

    static mem_prefix="dns_key_"

    static  async getAll(){
        let result={};
        let exist=await redis.exists(KeyManager.mem_prefix+"all");
        if(!exist){
            const [rows,fields] = await sqlpool.query("select * from apikey");
            rows.forEach(element => {
                result[element.key]=element.name;
            });
            await redis.hmset(KeyManager.mem_prefix+"all",result);
            await redis.expire(KeyManager.mem_prefix+"all",30);
        }else{
            result=await redis.hgetall(KeyManager.mem_prefix+"all");
        }
        return result;     
    }

    static async getAllAsArray(){
        let objectresult=await KeyManager.getAll();
        let arrayresult=[];

        for (const property in objectresult) {
            arrayresult.push({
                name:objectresult[property],
                apikey:property
            });
          }

        return arrayresult;
    }

    static async keyExist(key){
            let allkeys= await KeyManager.getAll();
            if(allkeys[key]){
                return true;
            }else{
                return false;
            }
            
    }

}

module.exports={KeyManager}