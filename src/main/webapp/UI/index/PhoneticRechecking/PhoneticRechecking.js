

$(document).ready(function() {
    init();
});
;(function(window,$,undefined){
    window.init = _init;        //初始化
    var timeOut = null;
    var _global = {
        url:"",//rtsp://10.0.10.208:9000/000252:0:HIK_EH:0:0:admin:admin/av_stream",
    }

    function _init(){
        _initData();        //初始化数据
        _initEvent();       //初始化事件
    }
    function _initEvent() {
        $("#close").bind('click', function() {
            parent.closeOtherPopus();
        });
        $("#picture").bind('click', function() {
            var cell=$("#picture").hasClass("celling");
            if(cell) {
                $("#picture").addClass("uncelling").removeClass("celling");
                var p=document.getElementById("Object1");
                p.SetDealmodle(parseInt('1'));
                p.play_id=10;
                //url="rtsp://10.0.10.208:9000/000252:0:HIK_EH:0:0:admin:admin/av_stream";
                console.log(_global.url);
                p.SoloCircuit(_global.url,"123.123.123.123");

                $("#msg").text("00:01");
                timeOutAlert();
            }
            else {
                $("#picture").addClass("celling").removeClass("uncelling");
                stopTimeOutAlert();
                var p = document.getElementById("Object1");
                p.StopPlay();
                parent.closeOtherPopus();
            }
        });
    }
    function _initData() {
        var jsonData=parent.getSelectedJsonData();//获取所选行的原始数据
        var userName=jsonData.accountName.length<12?jsonData.accountName:jsonData.accountName.substr(0,11)+"…";
        $("#userName").text(userName);
        var devData=post_sync({devId:jsonData.devId},"/RDAcenter/queryOneClickDevByDevId.do")
        if(devData.result.code=='0'){
            var devJson=devData.json[0];
            if(devJson.devType == 15){
                if(devJson.manufacturer == 'HIK'){
                    //rtsp://10.0.10.208:9000/000252:0:HIK_EH:0:0:admin:admin/av_stream
                    //rtsp://流媒体服务IP:流媒体服务端口/设备ID:HIK_EH（设备类型）:0（设备通道）:0（播放码流）:设备用户名:设备密码/av_stream
                    _global.url = "rtsp://"+devJson.Ip+":"+devJson.PORT+"/"+ devJson.devSn+":0:HIK_EH:"+devJson.tunnelId+":"+devJson.playCode+":"+
                        devJson.loginName + ':' + devJson.loginPwd + '/av_stream';
                }
            }
        }
    }

    function timeOutAlert(){
        timeOut = window.setTimeout(function(){
            var m=parseInt(timeOut/60);
            if(m<10){
                m='0'+m;
            }
            var s=timeOut%60;
            if(s<10){
                s='0'+s;
            }
            $("#msg").text(m+":"+s);
            timeOutAlert();
        },1000);
    }

    function stopTimeOutAlert(){
        //console.log("timeCut:"+timeOut);
        window.clearTimeout(timeOut);
    }
    function plugin(id)
    {
        return document.getElementById(id);
    }
})(window,jQuery);