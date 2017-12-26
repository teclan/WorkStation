/**
 * Created by 123 on 2017/12/19.
 */

charset = "utf-8";
$(document).ready(function () {
    //重绘一次布局，然后再设置页面的resize事件
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    init();
});

;(function ($, window) {
    window.resizeDocment = _resizeDocment;  //修改页面大小
    window.init = _init;
    window.sure = _sure;

    var _config = {
        minWidth: 1280,
        minHeight: 765,
    };
//重绘布局
    function _resizeDocment() {

        var $body = $('body');
        var $content = $('#content');
        var $divBottom = $('#divBottom');
        $body.css('overflow-y', 'hidden');
        $body.css('overflow-x', 'hidden');
        var DocHeight = $(window).height();
        var DocWidth = $(window).width();
        var main = {width: 0, height: 0};
        var nav = {widht: 0};
        var contentHeight = $content.height();
        var contentWidth = $content.width();
        var divBottomHeight = $divBottom.height();
        var divBottomWidth = $divBottom.width();

        DocHeight = parseInt(DocHeight);
        DocWidth = parseInt(DocWidth);

        $body.height(DocHeight);
        $body.width(DocWidth);
        contentHeight = DocHeight - 65 - divBottomHeight - 10;
        $content.height(contentHeight);
        if (DocWidth < _config.minWidth) {
            DocWidth = _config.minWidth;
            $body.css('overflow-x', 'scroll');
            $body.width(_config.minWidth);
            $content.height(contentHeight - 18);
            $divBottom.width(_config.minWidth);
            $("#show_up").css('left', '675px');
        }
        else {
            $body.css('overflow-x', 'hidden');
            $divBottom.css('width', '100%');
            var showUpLeft = (DocWidth - 90) / 2;
            showUpLeft = parseInt(showUpLeft);
            $("#show_up").css('left', showUpLeft + "px");
        }
    }

    function _init() {
        _initData();//初始化数据
        _initEven();    //初始化事件
    }
    function _initData() {
        $("#pwdOld").val("");
        $("#pwdNew1").val("");
        $("#pwdNew2").val("");

    }
    function _initEven() {
        $("#pwdNew2").blur(function () {
            var pwdNew1 =$("#pwdNew1").val();
            var pwdNew2 =$("#pwdNew2").val();
            if(pwdNew1 != pwdNew2){
                $("#pwdNew2").attr("errormsg","与新密码不一致").next().removeClass("Validform_right").addClass("Validform_wrong");
            }
        })
    }
    //修改密码
    function _checkpass() {
        var pwdNew1 =$("#pwdNew1").val();
        var pwdNew2 =$("#pwdNew2").val();
        if(pwdNew1==pwdNew2){
            //获取用户名
            var userName = $.cookie("userName");
            var params={
                "userName":userName,
                "oldPwd":$("#pwdOld").val(),
                "newPwd":$("#pwdNew1").val(),
            };
            var data=post_sync(params,"/WorkStation/changePwd.do");
            if(data.code=='200'){
                parent.alertSuccess("操作成功!",2000,null);
                //删除cookie
                $.cookie("userName",null,{expires:-1,path:"/"});
                $.cookie("password",null,{expires:-1,path:"/"});
                parent.location.href = "/WorkStation/UI/login/login.html";
            }
            else{
                parent.alertSuccess(data.message,2000,null);
            }
        }else {
            //parent.alertSuccess("新密码与确认密码不一致",2000,null);
            $("#pwdNew2").attr("errormsg","与新密码不一致").next().removeClass("Validform_right").addClass("Validform_wrong");
        }
    }
    function _sure(flag){
        if(flag){
            _checkpass();
        }else{
            //alert("验证不通过");
            parent.alertWarn("请填写完整信息",2000,null);
        }
    }

})(jQuery, window);