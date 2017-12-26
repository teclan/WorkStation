/**
*和单点登录相关的一些方法，用于检测用户是否掉线
*/   
var ywHeartbeat = {
    heartbeatConfig: {
        systemExitUrl: "../../main/exitSystem.do",
        HeartBeatUrl: "../../main/HeartBeat.do",
        heartBeatTime: 3000,
        currentUser: "",
        loginTime: "",
        serverInfo: "WIN-EAKVARHMFQ5:8843"
    },
    exitSys: function() {
        var params = {};     
        //params.userName= getSysuserID();
        params.userName = "noclear";
        post_async(params, ywHeartbeat.heartbeatConfig.SystemExitUrl, ywHeartbeat.callBack_SystemExit);
    },
    callBack_SystemExit: function() {
        var _uRL = window.top.location.href;
        _uRL = _uRL.split("?")[0];
        window.top.location = _uRL;
    },
    getUserName: function() {
        return ywHeartbeat.heartbeatConfig.currentUser;
    },
    setHeartBeatTimer: function() {
        setTimeout(function() {
            ywHeartbeat.heartBeat();
        }, ywHeartbeat.heartbeatConfig.heartBeatTime);
    },
    heartBeat: function() {
        var params = {};
        post_async(params, ywHeartbeat.heartbeatConfig.HeartBeatUrl, ywHeartbeat.callBack_HeartBeat);
    },
    callBack_HeartBeat: function(data) {
        if (data.UserName && data.SysTime) {
            if(console) {
                console.log("--****userName is : " + data.UserName + ", loginTime is : " + data.SysTime);
            }
            ywHeartbeat.setHeartBeatTimer(); 
        } else {
            //alert("您已掉线，请重新登录！");
            ywHeartbeat.exitSys();
        }
    }
}