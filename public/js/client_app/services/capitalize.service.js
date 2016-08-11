theMoneyApp.service("capitaliseString",function(){
    var captStr = function(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
        captStr : captStr
    }
});