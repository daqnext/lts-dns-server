const {assert} = require('chai');
const {args,ROOTDIR,redis,sqlpool,axios,randomstring} =require("../src/global.js");

 

describe('sqldb', function() {
  it('pool-query', async function() {
      //const [rows,fields] = await sqlpool.query("select * from test");
      //await sqlpool.query("INSERT INTO test VALUES ('xdd','asdf')");
      //(await sqlpool.getConnection()).execute
  });
 
});


describe('axios', function() {

    it('get', async function() {
      //var result=await axios.get('https://baidu.com');
      //console.log(result);            
    });
 
});


describe('randomstring', function() {

  it('20len', async function() {
      let rs=randomstring.generate(20);
      assert.equal(rs.length,20);
  });

});


 





