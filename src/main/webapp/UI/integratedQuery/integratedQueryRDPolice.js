/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    //重绘一次布局，然后再设置页面的resize事件
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function ($, window) {
    window.resizeDocment = _resizeDocment;//修改页面大小
    window.init = _init;//修改页面大小
    window.pluginsPage = _pluginsPage;
    window.statisticsEventType =_statisticsEventType;
    window.setStatistics = _setStatistics;
    window.getStatistics = _getStatistics;

    window.clearStatistics = _clearStatistics;
    window.preDipose = _preDipose;
    //window.switchFloatWin = _switchFloatWin;//打开、关闭各类弹窗
    //window.getUserInfo = _getUserInfo;//获取用户的ID、等级、辖区等信息
    // window.transform = _transform;
    // window.getUploadURL = _getUploadURL;
    // window.getDwonloadUrl = _getDwonloadUrl;

    var _config = {
        minWidth: 1160,
        minHeight: 765,
        module: {
            suspectSRC: '../suspect/suspect_Index.html',
            caseSRC: '../case/case_Index.html',
            clueSRC: '../clue/clue_Index.html'
        },
        win: {
            addCase: '../addNewCase/newCase.html',
            saveTo: '../saveTo/SaveTo.html',
            lookFile: '../videoPlayer/videoPlayer.html',
            upload: '../upload/upload.html'
        },
        ajaxUrl: {
            preDiposeUrl: '../../alertPretreatment.do',
        }
    };

    var _global = {
        currentUser: '',//当前用户名
        heartBeatTime: 1000,//心跳间隔
        casLog: 'https://pc-20150819yb:8843/cas/logout?service=',
        uploadURL: '',
        dwonloadURL: '',
        sendInfo: {
            Timer: null,
            Time: 500,
            count: 0
        },
        plugins: {
            page: null
        },
        userInfo: {
            /*
             //id:'583ec955337cb117c4507fbd',//熊德生新建
             id:'583f90092dcdd2188817116e',//案件库用
             //id:'000000a1db5d48279e3e2a6c80000000',//疑情库用
             placeCode:'450305',
             placeName:-1,
             name:'Iris',
             securityLevel:'1'//1普通，4管理员
             */
            id: '',
            placeCode: '',
            placeName: -1,
            name: '',
            securityLevel: ''//1普通，4管理员
        },
        statistics:[
            {
                onealert:0, //一级警情
                twoalert:0, //二级警情
                onefault:0, //一级故障
                twofault:0, //二级故障
                superm:0    //超测
            },
            {
                onealert:0,
                twoalert:0,
                onefault:0,
                twofault:0,
                superm:0
            },
            {
                onealert:0,
                twoalert:0,
                onefault:0,
                twofault:0,
                superm:0
            }
        ]
    };



//重绘布局
    function _resizeDocment() {
        var $body = $('body');
        $body.css('overflow-y', 'hidden');
        $body.css('overflow-x', 'hidden');
        var DocHeight = $(window).height();
        var DocWidth = $(window).width();
        var main = {width: 0, height: 0};
        var nav = {widht: 0};

        DocHeight = parseInt(DocHeight);
        DocWidth = parseInt(DocWidth);
        $body.width(DocWidth);
        /*$body.height(DocHeight);
         $body.width(DocWidth);*/

        /*if(DocHeight < _config.minHeight){
         DocHeight = _config.minHeight;
         $body.css('overflow-y','scroll');
         }
         else{
         $body.css('overflow-y','hidden');
         }
         if(DocWidth < _config.minWidth){
         DocWidth = _config.minWidth;
         $body.css('overflow-x','scroll');
         $body.width(_config.minWidth);
         }
         else{
         $body.css('overflow-x','hidden');
         }
         $('#wrapper').height(DocHeight);
         $('#wrapper').width(DocWidth);
         nav.width = DocWidth - 2;
         main.width = nav.width;
         main.height = DocHeight - 62 - 1;
         $('#nav').width(nav.width);
         $('#main').height(main.height);
         $('#main').width(main.width);

         if(isShowWin == true){
         _fixFloatWinWin();
         }*/
    }

    function _init() {
        _initEven();
       // _initData();
    }

    function _initEven() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: queryData_page
        });
    }

    function _initData() {
        var userName = '会飞的鱼';
        userName = parent.getSysuserID();
        if (!userName) {
            userName = '会飞的鱼';
        }
        _loginPush(userName);
    }

//登录websocket
    function _loginPush(userName) {
        var isClose = 0;
        var tryTime = 0;
        if (!window.WebSocket) return -1;
        if (!userName)return -2;
        //alert(" "+turl);
        socket = new WebSocket('ws://' + window.location.host + '/RDAcenter/websocket/login/' + userName);

        //接收消息
        socket.onmessage = function (evnt) {
            console.log("收到evnt: " + evnt);
            var data = evnt.data;
            //console.log("收到: "+data);
            _pushMessage(data);
            /* var json = $.parseJSON(data);
             var mode = json['mode'];
             var message = $.parseJSON(json['message'])
             switch(mode){
             case "news":showMessage(message);break;
             default :
             printLog("Unknown: "+data);
             if(console)console.log(evnt);
             }*/
            //socket.send(data);//发送给服务器的方法， 服务器onMessage 接收
        }
        // 异常
        socket.onerror = function (event) {
            console.log("happen error.");
            if (console) console.log(event);
        };

        // 建立连接
        socket.onopen = function (event) {
            console.log(userName + " is Go online.");
            if (console) console.log(event);
        };
        // 断线重连
        socket.onclose = function () {

            //如果不是主动断开，就重连
            if (isClose == 0) {
                console.log(userName + " is Offline, reconnect(" + (tryTime + 1) + "s)...");
                // 重试10次，每次之间间隔10秒
                if (tryTime < 10) {
                    setTimeout(function () {
                            socket = null;
                            tryTime++;
                            init();
                        },
                        1000);
                } else {
                    tryTime = 0;
                    console.log("Connection failed ten times,this is over.");
                }
            }
        };
        return 1;
    }

    function _pushMessage(data) {
        console.log("_pushMessage: " + data);
        var dataJson = $.parseJSON(data);
        console.log("datajson: " + dataJson);
        console.log("eventNum: " + dataJson.eventNum);
        var jsonData = dataJson.alertPojo;
        if (dataJson.mode == "add") {
            _pageUpdate('alarmDataIframe');
            alarmDataIframe.appendRow(jsonData, true);
            _statisticsEventType('add',jsonData.eventType);
            updateStatistics();
        } else if (dataJson.mode == "pretreatment") {//预处理pretreatment
            _pageUpdate('preDisposeIframe');
            alarmDataIframe.removeRow(dataJson.eventNum);
            handledIframe.removeRow(dataJson.eventNum);
            preDisposeIframe.appendRow(jsonData, true);
            _statisticsEventType('pretreatment',jsonData.eventType);
            updateStatistics();
        } else if (dataJson.mode == 'complete') {//已处理
            _pageUpdate('handledIframe');
            alarmDataIframe.removeRow(dataJson.eventNum);
            preDisposeIframe.removeRow(dataJson.eventNum);
            handledIframe.appendRow(jsonData, true);

            _statisticsEventType('handledIframe',jsonData.eventType);
            updateStatistics();
        } else {

        }

    }

    function _pageUpdate(iframe){
        var pageInfoPojo = {};
        if(iframe == 'alarmDataIframe'){
            pageInfoPojo = alarmDataIframe.getPageInfo();
        }else if(iframe == 'preDisposeIframe'){
            pageInfoPojo = preDisposeIframe.getPageInfo();
        }else if(iframe == "handledIframe"){
            pageInfoPojo = handledIframe.getPageInfo();
        }else{

        }

        var currentPage = pageInfoPojo.currentPage;
        var totalNum = pageInfoPojo.totalNum;
        var totalPage = pageInfoPojo.totalPage;
        var pageSize = pageInfoPojo.pageSize;

        totalNum++;

        totalPage = ((totalNum-1)/pageSize)+1;
        _global.plugins.page.setPage(totalPage, currentPage, totalNum);
        pageInfoPojo.currentPage = currentPage;
        pageInfoPojo.totalNum = totalNum;
        pageInfoPojo.totalPage = totalPage;
        pageInfoPojo.pageSize = pageSize;
        if(iframe == 'alarmDataIframe'){
            alarmDataIframe.setPageInfo(pageInfoPojo);

        }else if(iframe == 'preDisposeIframe'){

            preDisposeIframe.setPageInfo(pageInfoPojo);

        }else if(iframe == "handledIframe"){
            handledIframe.setPageInfo(pageInfoPojo);
        }else{

        }

    }

    function messageExchange(dataJson) {
        var row_json =
            {
                state: "",
                date: "",
                time: "",
                systemCode: "",
                userCode: "",
                userName: "",
                userAddress: "",
                eventType: "",
                eventDescribe: "",
                deviceZone: "",
                userZone: "",
                zoneLocation: "",
                probeType: "",
                callerID: "",
                eventSource: "",
                deviceId: "",
                deviceModel: "",
                pliceInfoType: "",
                reactivityType: "",
                callerException: "",
                eventNum: "",
                zoneNum: "",
                zoneName: "",
                deviceSubSystem: "1",
                probeModel: ""
            };
        switch (dataJson.disposeStatus) {
            case '0':
                row_json.state = '未处理';
                break;
            case '1':
                row_json.state = '已处理';
                break;
            case '2':
                row_json.state = '预处理';
                break;
            default:
                row_json.state = '';
                break;
        }
        ;
        var disposeTime = dataJson.disposeTime;
        var time = ['', ''];
        //time = disposeTime.split(" ");
        row_json.date = time[0];
        row_json.time = time[1];
        row_json.systemCode = "";
        row_json.userCode = dataJson.accountNum;
        row_json.userName = dataJson.accountName;
        row_json.userAddress = dataJson.accountAddr;
        switch (dataJson.eventType) {
            case '0':
                row_json.eventType = "计划任务";
                break;
            case '1':
                row_json.eventType = "劫盗";
                break;
            default:
                // statements_def
                break;
        }
        row_json.eventDescribe = dataJson.eventDesc;
        row_json.deviceZone = dataJson.devZoneId;
        row_json.userZone = dataJson.accountZone;
        row_json.zoneLocation = dataJson.zoneAtPos;
        row_json.probeType = dataJson.snType;
        row_json.callerID = dataJson.callID;
        row_json.eventSource = dataJson.eventSrc;
        row_json.deviceId = dataJson.devId;
        row_json.deviceModel = dataJson.devModelName;
        row_json.pliceInfoType = dataJson.almType;
        row_json.reactivityType = dataJson.wantDo;
        row_json.callerException = dataJson.isCallAbnor;
        row_json.eventNum = dataJson.eventNum;
        row_json.zoneNum = dataJson.areaId;
        row_json.zoneName = dataJson.areaName;
        row_json.deviceSubSystem = "";
        row_json.probeModel = dataJson.snModelName;
        return row_json;

    }

    function queryData_page(page) {
        var iframeName = window.getIframeName();
        switch (iframeName){
            case 'alarmDataIframe':
                alarmDataIframe.queryData_page(page);
                break;
            case 'preDisposeIframe':
                preDisposeIframe.queryData_page(page);
                break;
            case 'handledIframe':
                handledIframe.queryData_page(page);
                break;
            default:
                break;
        }

    }

    function _pluginsPage(){
        return _global.plugins.page;
    }



    function _statisticsEventType(status,eventType) {
        eventType = parseInt(eventType);
        if (status == "add") {
            if (eventType>=0&&eventType<=5){           //一级警情
                _global.statistics[0].onealert++;
            }else if(eventType>=6&&eventType<=9){      //二级警情
                _global.statistics[0].twoalert++;
            }else if(eventType>=10&&eventType<=12){    //一级故障
                _global.statistics[0].onefault++;
            }else if(eventType>=13&&eventType<=25){    //二级故障
                _global.statistics[0].twofault++;
            }else if(eventType==26){                   //超测
                _global.statistics[0].superm++;
            }else{

            }
        } else if (status == "pretreatment") {//预处理pretreatment
            if (eventType>=0&&eventType<=5){           //一级警情
                _global.statistics[1].onealert++;
            }else if(eventType>=6&&eventType<=9){      //二级警情
                _global.statistics[1].twoalert++;
            }else if(eventType>=10&&eventType<=12){    //一级故障
                _global.statistics[1].onefault++;
            }else if(eventType>=13&&eventType<=25){    //二级故障
                _global.statistics[1].twofault++;
            }else if(eventType==26){                   //超测
                _global.statistics[1].superm++;
            }else{

            }

        } else if (status == 'handledIframe') {//已处理
            if (eventType>=0&&eventType<=5){           //一级警情
                _global.statistics[2].onealert++;
            }else if(eventType>=6&&eventType<=9){      //二级警情
                _global.statistics[2].twoalert++;
            }else if(eventType>=10&&eventType<=12){    //一级故障
                _global.statistics[2].onefault++;
            }else if(eventType>=13&&eventType<=25){    //二级故障
                _global.statistics[2].twofault++;
            }else if(eventType==26){                   //超测
                _global.statistics[2].superm++;
            }else{

            }
        } else {

        }
    }

    
    function _setStatistics(statistics) {
        _global.statistics = statistics;
    }
    function _getStatistics() {
        return _global.statistics;
    }
    function _clearStatistics() {
        for (var i=0;i<3;i++){
            _global.statistics[i].onealert=0;
            _global.statistics[i].twoalert=0;
            _global.statistics[i].onefault=0;
            _global.statistics[i].twofault=0;
            _global.statistics[i].superm=0;

        }
    }

    function _getPreDiposeParams() {
        var jsonData = parent.getSelectedJsonData();
        var sysuserID = parent.getSysuserID();
        var params = {};
        params.sysuserID = sysuserID;
        params.eventNum = jsonData.eventNum;
        params.disposeType ='0';
        params.disposer = sysuserID;
        params.disposeID = '';
        params.disposeStatus = '2';
        params.pretreatmentPojo = '';
        return params;
    }
    function _preDipose(_callback_preDispose) {
        var params = _getPreDiposeParams();
        post_async(params, _config.ajaxUrl.preDiposeUrl, _callback_preDispose);
    }




})(jQuery, window);

