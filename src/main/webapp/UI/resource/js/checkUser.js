/**
 * Created by 123 on 2017/12/19.
 */
function checkUser(callback) {
    //验证cookies是否存在
    var userName = $.cookie("userName");
    if($.cookie("userName")&&userName!=""&&userName!=null){
        if(typeof (callback) == "function"){
            callback();
        }
        /*//获取cookie值
        var strcookie = {
            userName:$.cookie("userName"),
            password:$.cookie("password")
        };
        //获取当前登录账号
        post_async(strcookie,"/WorkStation/login.do",_callback_judgeUser,callback)*/
    }else {
        location.href = "/WorkStation/UI/login/login.html"//跳转到登录界面
    }
}
//验证用户的回调函数
function _callback_judgeUser(data,callback) {
    if(data.code == "200"){
        if(typeof (callback) == "function"){
            callback();
        }
    }else {
        location.href = "/WorkStation/UI/login/login.html"//跳转到登录界面
    }
}