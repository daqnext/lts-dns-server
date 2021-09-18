const minimist =require('minimist');
const {common} =require('./common.js');

///process the args
var argv = minimist(process.argv.slice(2));
var args = common;
if(argv.config){
    var overwriteconf=  require('./'+argv.config+'.js')
    if(overwriteconf){
        args = { ...args,...overwriteconf[argv.config] }
    }
}
args={...args,...argv}

module.exports={args};