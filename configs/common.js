var common = {
  //log-level
  loglevel:'DEBUG',
  logfilename:'default.log',
  logtypes:['console','file'],
  /// server port 
  port: 80,

  //sqldb 
  db_host:'localhost',
  db_port:'3306',
  db_username:'root',
  db_password:'',
  db_name:'test',
  db_pool_num:5,


  //redis cluter defalt db0
  redis_host:'localhost',
  redis_port:6379,
  redis_password:"",

  //cache
  cache_prefix:'dev_dns_',

  //ectm
  ECTM_PriKeyStr:"bhbb4EC96zx2uUsWDtSYivzaZUzdeDKMfn+dSV9VwUI=",
  ECTM_PubKeyStr:"BJJlxQFcPuVTjaB/PvbqmN0py98C2iScUQlvpRUm+kpAgqJmnofCely42Hczgb7cqwTZtFTfPwm2ImdmDtvFMH4="
 
};

module.exports= {common}