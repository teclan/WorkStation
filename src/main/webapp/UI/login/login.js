$(document).ready(function () {
    //重绘一次布局，然后再设置页面的resize事件
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function (window, $) {
    window.resizeDocment = _resizeDocment;  //修改页面大小
    window.init = _init;

    var _config = {
        minWidth: 1280,
        minHeight: 765,
        ajaxUrl: {
            loginUrl:"/WorkStation/login.do"
        }
    };
    var _global = {

    };

//重绘布局
    function _resizeDocment() {
        var $body = $('body');
        $body.css('overflow-y', 'hidden');
        $body.css('overflow-x', 'hidden');
        var DocHeight = $(window).height();
        var DocWidth = $(window).width();
        DocHeight = parseInt(DocHeight);
        DocWidth = parseInt(DocWidth);
        $body.height(DocHeight);
        $body.width(DocWidth);
        if (DocWidth < _config.minWidth) {
            $body.css('overflow-x', 'scroll');
            $body.width(_config.minWidth);
        }
        else {
        }


    }

    function _init() {
        _initData();
        _initEvent();
    }
    //数据初始化
    function _initData() {

    }
    //事件初始化
    function _initEvent() {
        //登录按钮的点击事件
        $("#sure").bind("click",function () {
            _judgeUser();//对用户名和密码进行判断
        })
        $("body").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                _judgeUser();
            }
        });
    }
    //点击登录后判断用户名和密码
    function _judgeUser() {
        var userName = $("#userName").val();
        var password = $("#password").val();
        if(userName =="" || userName==null || password == "" || password ==null){
            if(!($("#msg").length>0)){
                var $div = $("<div></div>");
                $div.attr("id","msg").addClass("errors");
                $div.text("用户名和密码不能为空");
                $(".title").append($div);
            }else {
                $("#msg").text("用户名和密码不能为空");
            }
        }else {
            var params = {
                userName:userName,
                password:password
            };
            post_async(params,_config.ajaxUrl.loginUrl,_callback_judgeUser)
        }
    }
    //验证用户的回调函数
    function _callback_judgeUser(data) {
        if(data.code == "200"){
            //用cookie将用户名和密码存起来
            $.cookie("userName",$("#userName").val(),{path:"/"});
            $.cookie("password",$("#password").val(),{path:"/"});
            location.href = "../index/index.html"//跳转到首页
        }else {
                $("#msg").remove();
                var $div = $("<div></div>");
                $div.attr("id","msg").addClass("errors");
                $div.text("认证失败");
                $(".title").append($div);
        }
    }







})(window, jQuery);