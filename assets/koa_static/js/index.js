var ectmSuccess=false;
$(async function(){
    ectmSuccess=await hc.Init("/ectminfo"); 
    if(!ectmSuccess){
        console.error("ectm init error")
    }       
});
