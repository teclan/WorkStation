/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function() {
    initWebsocket();
});

;
(function($, window) {
    window.initWebsocket = _init;

    var _global = {
        webPram: '',
        socket:null
    };

    function _init() {
        _initData();
    }

    function _initData() {
        //生成唯一标识符用来连接websocket
        var webPram = creatWebParam();
        _global.webPram = webPram;
        _loginPush(webPram);
    }

    //登录websocket
    function _loginPush(webPram) {
        var isClose = 0;
        var tryTime = 0;
        if(!window.WebSocket) return -1;
        if(!webPram) return -2;
        //alert(" "+turl);
        _global.socket = new WebSocket('ws://' + window.location.host + '/WorkStation/websocket/login/' + webPram);

        //接收消息
        _global.socket.onmessage = function(evnt) {
            if(console)console.log("收到evnt: " + evnt);
            var data = evnt.data;
            _pushMessage(data);
            //socket.send(data);//发送给服务器的方法， 服务器onMessage 接收
        }
        // 异常
        _global.socket.onerror = function(event) {
            if(console)console.log("happen error.");
            if(console) console.log(event);
        };

        // 建立连接
        _global.socket.onopen = function(event) {
            if(console)console.log(webPram + " is Go online.");
            if(console) console.log(event);
            tryTime = 0;//连接成功后，归零
        };
        // 断线重连
        _global.socket.onclose = function() {

            //如果不是主动断开，就重连
            if(isClose == 0) {
                if(console)console.log(webPram + " is Offline, reconnect(" + (tryTime + 1) + "s)...");
                // 重试60次，每次之间间隔1秒
                if(tryTime < 60) {
                    setTimeout(function() {
                            _global.socket = null;
                            tryTime++;
                            _loginPush(_global.webPram);
                        },
                        1000);
                } else {
                    //60s到10分钟之间，每次之间间隔5秒
                    if(tryTime >=60 && tryTime< 600){
                        setTimeout(function() {
                                _global.socket = null;
                                tryTime++;
                                _loginPush(_global.webPram);
                            },
                            5000);
                    }
                    //如果长时间连接不上，每次之间间隔20秒
                    else{
                        setTimeout(function() {
                                _global.socket = null;
                                tryTime++;
                                _loginPush(_global.webPram);
                            },
                            20000);
                    }
                    //tryTime = 0;
                    //console.log("Connection failed ten times,this is over.");
                }
            }
        };
        return 1;
    }

    function creatWebParam(){
        var  time = nowDatetime();
        var  str =parseInt((Math.random()*9+1)*1000);
        var rstr = time+''+str;
        return rstr;
    }

    function nowDatetime() {

        var date = new Date();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
        var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
        var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
        var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());

        var dateString =
            date.getFullYear() +''+
            month +''+
            day +''+
            hours +''+
            minutes +''+
            seconds;

        return dateString;
    }


    //消息推送函数
    function _pushMessage(data) {
        console.log("_pushMessage: " + data);
        var dataJson = $.parseJSON(data);
        console.log("datajson: " + dataJson);
        for(var i=0;i<dataJson.length;i++) {
            if (dataJson[i].handleStatus == "已处理") {
                removeRow(dataJson[i].eventNum);
            } else {
                parent.audioPlay();
                pushTableRow(dataJson[i]);
            }
        }
    }

})(jQuery, window);