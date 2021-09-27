Utils={

}

Utils.checkTtlRefresh=function(leftsecs) {
    if (leftsecs > 0 && leftsecs < 3) {
        if (Utils.getRandomInt(100)==50){
            return true;
        }
    }
    return false;
}

Utils.getRandomInt=function(max) {
    return Math.floor(Math.random() * max);
}


module.exports={Utils};
