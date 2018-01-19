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
    window.removeRow = _removeRow;
    window.pushTableRow = _pushTableRow;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;

    var checkboxArray = [];
    var _config = {
        minWidth: 3045,
        minHeight: 765,
        ajaxUrl: {
            alarmEventslist: '/WorkStation/query/alarmEventslist.do',

        }
    };
    var _global = {
        currentUser: '',//当前用户名
        heartBeatTime: 1000,//心跳间隔
        casLog: 'https://pc-20150819yb:8843/cas/logout?service=',
        uploadURL: '',
        dwonloadURL: '',
        sendInfo: {},
        userInfo: {},
        top: parent.parent,
        up: parent,
        plugins: {
            page: null
        },
        getAlarmInfosParams: {
            queryTond: {
                fuzzy:{
                    fuzzyKey:"",
                    fuzzyValue:"",
                },
                areaId:"",
                businessId:"",
                userServerType:"",
                nomRpt:"",
                timeStart:"",
                timeEnt:""
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'userId|DESC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch:'5',
        eventTypeJson:null,
        eventTypePush:null
    };


//重绘布局
    function _resizeDocment() {
        $body = $('body');
        $content = $("#content");
        $table = $("#table");
        var contentWidth = $content.width();
        if (contentWidth < _config.minWidth) {
            $table.width(_config.minWidth);
        } else {
            $table.css('width', '100%');
        }
    }

    function _init() {
        _initEven();
    }
    function _initEven() {
        //默认加载数据
        _searchEventInfo();
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });

        $("#policeRemove").bind('click',function () {
            if(checkboxArray.length==0){
                parent.alertSuccess("请选择要处理的警情！",2000,null);
                return;
            }
            parent.okAndCancel("确认处理警情？",function () {
                submit("移去");
            },null);
        });


        $("#upData").bind('click',function () {
            parent.upPopusManager1('../integratedQuery/eventQuery/upData/upData.html');
        });
    }
    function submit(handleResult) {
        var params={
            "eventNums":checkboxArray,
            "handleResult":handleResult,
            "handleDesc":$("#handleDesc").val(),
            "handleTime":"",
        }
        var data=post_sync(params,"/WorkStation/eventDock/handleAlarmEvent.do");
        if(data.code=='200'){
            parent.alertSuccess("操作成功!",2000,null);
            checkboxArray = [];
            _searchEventInfo();
        }
        else{
            parent.alertSuccess(data.message,2000,null);
        }
    }
    function _searchEventInfo() {
        _searchuserInfo();
    }
    function _removeRow(eventNum) {
        if($("#" + eventNum).length>0){
            $("#" + eventNum).remove();
            _pageRemove();
        };
    }

    function addTableRow(jsonData, isPre) {
        var row_json = _messageExchange(jsonData); //转换原始数据与显示的数据
        $div_row = $("<tr></tr>");
        $dic_checkbox = $("<td></td>");
        $div_state = $("<td></td>");
        $div_date = $("<td></td>");
        $div_time = $("<td></td>");
        $div_userCode = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_deviceModel = $("<td></td>");
        $div_zoneLocation = $("<td></td>");
        $div_deviceZone = $("<td></td>");
        $div_deviceId = $("<td></td>");
        $div_systemCode = $("<td></td>");
        $div_usrAlmType = $("<td></td>");
        $div_userAddress = $("<td></td>");
        $div_eventType = $("<td></td>");
        $div_eventDescribe = $("<td></td>");
        $div_userZone = $("<td></td>");
        $div_probeType = $("<td></td>");
        $div_callerID = $("<td></td>");
        $div_eventSource = $("<td></td>");
        $div_pliceInfoType = $("<td></td>");
        $div_reactivityType = $("<td></td>");
        $div_callerException = $("<td></td>");
        $div_eventNum = $("<td></td>");
        /* $div_zoneNum = $("<td></td>");*/
        $div_zoneName = $("<td></td>");
        $div_deviceSubSystem = $("<td></td>");
        $div_probeModel = $("<td></td>");
        /*$div_policeLevel = $("<td></td>");*/
        $div_cameraName = $("<td></td>");
        $div_userMonitorId = $("<td></td>");
        $div_cameraModelId = $("<td></td>");
        $div_atPos = $("<td></td>");

        $div_row
            .append($dic_checkbox)
            .append($div_state)
            .append($div_date)
            .append($div_time)
            .append($div_userCode)
            .append($div_userName)
            .append($div_deviceId)
            .append($div_deviceZone)
            .append($div_eventDescribe)
            .append($div_eventSource)
            .append($div_systemCode)
            .append($div_userZone)
            .append($div_usrAlmType)
            .append($div_eventNum)
            .append($div_userAddress)
            .append($div_eventType)
            .append($div_zoneLocation)
            .append($div_probeType)//探头类型
            .append($div_probeModel)
            .append($div_deviceModel)
            .append($div_pliceInfoType)
            .append($div_reactivityType)
            .append($div_callerException)
            .append($div_callerID)
            .append($div_zoneName)
            .append($div_deviceSubSystem)
            .append($div_cameraName)
            .append($div_userMonitorId)
            .append($div_cameraModelId)
            .append($div_atPos)
            .addClass('table_row row_noChecked')
            .attr('id', row_json.eventNum)
            .attr('name', row_json.accountNum)
            .data('jsonData', row_json);
            $dic_checkbox.addClass('noChecked').bind('click', function () {
                var isChecked = $(this).hasClass('isChecked');
                if (isChecked) {
                    $(this).removeClass('isChecked').addClass('noChecked');
                    _removeCheckboxData(row_json.eventNum);

                } else {
                    $(this).removeClass('noChecked').addClass('isChecked');
                    _setCheckboxData(row_json.eventNum);
                }
            });
        $div_state.addClass("table_content_state").text(row_json.state).attr("title", row_json.state).attr("id", "state_" + row_json.eventNum).attr("name", "state_" + jsonData.accountNum);
        $div_date.addClass("table_item_2").text(row_json.date).attr("title", row_json.date);
        $div_time.addClass("table_item_2").text(row_json.time).attr("title", row_json.time);
        $div_systemCode.addClass("table_item_3").text(row_json.systemCode).attr("title", row_json.systemCode);
        $div_userCode.addClass("table_item_4").text(row_json.userCode).attr("title", row_json.userCode);
        $div_userName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_usrAlmType.addClass("table_item_userName").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));
        $div_userAddress.addClass("table_item_userName").text(row_json.userAddress).attr("title", row_json.userAddress);
        $div_eventType.addClass("table_item_4").text(row_json.codeType).attr("title", row_json.codeType);
        switch (row_json.eventType) {
            case '劫盗':
                $div_eventType.addClass("table_robber_state");
                $div_row.addClass('robber');
                break;
            case '火警':
                $div_eventType.addClass("table_robber_state");
                $div_row.addClass('fire');
                break;
            default:
                break;
        }
        $div_eventDescribe.addClass("table_item_4").text(row_json.eventDescribe).attr("title", row_json.eventDescribe);
        $div_deviceZone.addClass("table_item_4").text(row_json.deviceZone).attr("title", row_json.deviceZone);
        $div_userZone.addClass("table_item_4").text(row_json.userZone).attr("title", row_json.userZone);
        $div_zoneLocation.addClass("table_item_4").text(row_json.zoneLocation).attr("title", row_json.zoneLocation);
        var probeType = row_json.probeType;
        if(probeType == null||probeType == "null"){probeType = "";}
        $div_probeType.addClass("table_item_4").text(probeType).attr("title", probeType);
        $div_callerID.addClass("table_item_4").text(row_json.callerID).attr("title", row_json.callerID);
        $div_eventSource.addClass("table_item_4").text(row_json.eventSource).attr("title", row_json.eventSource);
        //设备编号
        $div_deviceId.addClass("table_item_4").text(row_json.deviceId).attr("title", row_json.deviceId);
        $div_deviceModel.addClass("table_item_zoneNum").text(row_json.deviceModel).attr("title", row_json.deviceModel);
        var pliceInfoType = row_json.pliceInfoType;
        if(pliceInfoType == null||pliceInfoType == "null"){pliceInfoType = "";}
        $div_pliceInfoType.addClass("table_item_4").text(pliceInfoType).attr("title", pliceInfoType);
        var reactivityType = row_json.reactivityType;
        if(reactivityType == null||reactivityType == "null"){reactivityType = "";}
        $div_reactivityType.addClass("table_item_4").text(reactivityType).attr("title", reactivityType);
        $div_callerException.addClass("table_item_4").text(row_json.callerException).attr("title", row_json.callerException);
        $div_eventNum.addClass("table_item_long").text(row_json.eventNum).attr("title", row_json.eventNum);
        $div_zoneName.addClass("table_item_4").text(row_json.zoneName).attr("title", row_json.zoneName);
        $div_deviceSubSystem.addClass("table_item_5").text(row_json.devSubSys).attr("title", row_json.devSubSys);
        $div_probeModel.addClass("table_item_4").text(row_json.probeModel).attr("title", row_json.probeModel);
        $div_cameraName.addClass("table_item_5").text(row_json.cameraName).attr("title", row_json.cameraName);
        $div_userMonitorId.addClass("table_item_5").text(row_json.userMonitorId).attr("title", row_json.userMonitorId);
        $div_cameraModelId.addClass("table_item_5").text(row_json.cameraModelId).attr("title", row_json.cameraModelId);
        $div_atPos.addClass("table_item_5").text(row_json.atPos).attr("title", row_json.atPos);

        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
        $div_row.bind('dblclick', function (e) {
            _global.top.setSelectedJsonData(jsonData);//把所选行 的原始数据存入主页面
            _global.top.upPopusManager('../relatedEvents/relatedEvents.html');
        });
    }

    function _removeCheckboxData(eventNum) {
        checkboxArray.splice($.inArray(eventNum,checkboxArray),1);
    }

    function _setCheckboxData(eventNum) {
        checkboxArray.push(eventNum);
        //console.log("++++"+checkboxArray);
    }
    function getUsrAlmType(usrAlmType){
        switch (usrAlmType) {
            case '0':
                return "一级";
                break;
            case '1':
                return "二级";
                break;
            case '2':
                return "三级";
                break;
            case '3':
                return "四级";
                break;
            case '4':
                return "五级";
                break;
            default:
                break;
        }
    }

    function _messageExchange(dataJson) {
        var row_json = {
            state: "",
            date: "",
            time: "",
            systemCode: "",
            userCode: "",
            userName: "",
            usrAlmType: '',
            userAddress: "",
            codeType: "",
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
            devSubSys: "",
            probeModel: "",
            cameraName: '',
            userMonitorId: '',
            cameraModelId: '',
            atPos: ''
        };
        row_json.state = dataJson.handleStatus;
        var eventTime = dataJson.eventTime;
        var time = ['', ''];
        time = eventTime.split("T");
        row_json.date = time[0];
        row_json.time = time[1];
        row_json.eventTime = eventTime.replace('T', ' ');
        row_json.systemCode = dataJson.sysCode;
        row_json.userCode = dataJson.accountNum;
        row_json.userName = dataJson.accountName;
        row_json.usrAlmType = dataJson.usrAlmType;
        row_json.userAddress = dataJson.accountAddr;
        row_json.codeType = dataJson.codeType;

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
        row_json.devSubSys = dataJson.devSubSys;
        row_json.probeModel = dataJson.snModelName;
        row_json.cameraName = dataJson.cameraName;
        row_json.userMonitorId = dataJson.userMonitorId;
        row_json.cameraModelId = dataJson.cameraModelId;
        row_json.atPos = dataJson.atPos;
        row_json.usrAlmType = dataJson.usrAlmType;
        return row_json;

    }

    function _getAlarmInfosParams() {

        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getAlarmInfosParams.queryTond;
        params.pageInfoPojo = _global.getAlarmInfosParams.pageInfoPojo;
        return params;
    }

    function _getAlarmInfos(queryTond,pageInfoPojo) {
        _global.getAlarmInfosParams.queryTond = queryTond;
        _global.getAlarmInfosParams.pageInfoPojo = pageInfoPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;

        var params = _getAlarmInfosParams();
        $("body").loading();
        post_async(params, _config.ajaxUrl.alarmEventslist, _callback_getAlarmInfos);
    }

    function _callback_getAlarmInfos(data) {
        $("body").removeLoading();
        $("#content").scrollLeft(0).scrollTop(0);                   //滚动条复位
        var result = data.result;

        if (result.code == 0) {
            var pageInfo = data.pageInfoPojo;
            var totalNum = pageInfo.totalNum;
            var totalPage = pageInfo.totalPage;
            var currentPage = pageInfo.currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.currentPage = currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.totalNum = totalNum;
            _global.getAlarmInfosParams.pageInfoPojo.totalPage = totalPage;
            $("#title_left_text2").text("未处理条数："+totalNum+"条");
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                addTableRow(json[i]);
            }

        } else {
            _clearRow();
        }
        $("#table").colResizable({
            liveDrag:true,
            gripInnerHtml:"<div></div>",
            draggingClass:"dragging",
            onResize:null,
            minWidth:25
        });
    }

    function _clearRow() {
        $("#table_content").text('');
    }

    function _queryData_page(page) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        var params = _getAlarmInfosParams();
        //$('body').loading();
        post_async(params, _config.ajaxUrl.alarmEventslist, _callback_getAlarmInfos);
    }

    function _getPageInfo(){
        return _global.getAlarmInfosParams.pageInfoPojo;
    }
    function _setPageInfo(pageInfoPojo){
        _global.getAlarmInfosParams.pageInfoPojo.currentPage =  pageInfoPojo.currentPage;
        _global.getAlarmInfosParams.pageInfoPojo.totalNum = pageInfoPojo.totalNum;
        _global.getAlarmInfosParams.pageInfoPojo.totalPage = pageInfoPojo.totalPage;
        _global.getAlarmInfosParams.pageInfoPojo.pageSize = pageInfoPojo.pageSize;
        _global.plugins.page.setPage(pageInfoPojo.totalPage, pageInfoPojo.currentPage, pageInfoPojo.totalNum);
    }
    function _searchuserInfo() {
        var  queryTond = {
            "eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
            "eventTime":"", // 事件发生时间
            "sysCode":"", // 系统码
            "accountNum":"", // 机主编号
            "accountName":"", // 机主名称
            "handleStatus":"未处理", // 处理状态（未处理，已处理)
            "handleResult":"", // 处理结果（确认警情，误报，移去）
            "handleDesc":"", // 处理结果说明
            "handleTime":"", // 处理时间
            "codeTypeId":"",
            "evtWay":"1",
        };
        var  pageInfoPojo = {
            "pageSize": 25,
            "currentPage": 1,
            "sort": "eventTime|DESC",
        }
        _getAlarmInfos(queryTond,pageInfoPojo);
    }

    function _pageRemove(){
        var pageInfoPojo = {};
        pageInfoPojo = _getPageInfo();
        var currentPage = pageInfoPojo.currentPage;
        var totalNum = pageInfoPojo.totalNum;
        var totalPage = pageInfoPojo.totalPage;
        var pageSize = pageInfoPojo.pageSize;
        totalNum--;
        $("#title_left_text2").text("未处理条数："+totalNum+"条");

        totalPage = ((totalNum-1)/pageSize)+1;
        pageInfoPojo.currentPage = currentPage;
        pageInfoPojo.totalNum = totalNum;
        pageInfoPojo.totalPage = totalPage;
        pageInfoPojo.pageSize = pageSize;
        _setPageInfo(pageInfoPojo);
    }

    function _pushTableRow(jsonData) {
        if ($("#" + jsonData.eventNum).length > 0) {
            _removeRow(jsonData.eventNum);
        }
        var currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        var totalNum = _global.getAlarmInfosParams.pageInfoPojo.totalNum+1;
        _global.getAlarmInfosParams.pageInfoPojo.totalNum=totalNum;
        $("#title_left_text2").text("未处理条数："+totalNum+"条");
        if (currentPage == '1' || currentPage == 1) {
            addTableRow(jsonData, true);
        }

        var pageInfoPojo = {};
        pageInfoPojo = _getPageInfo();
        var currentPage = pageInfoPojo.currentPage;
        var totalPage = pageInfoPojo.totalPage;
        var pageSize = pageInfoPojo.pageSize;
        totalPage = ((totalNum-1)/pageSize)+1;
        pageInfoPojo.currentPage = currentPage;
        pageInfoPojo.totalNum = totalNum;
        pageInfoPojo.totalPage = totalPage;
        pageInfoPojo.pageSize = pageSize;
        _setPageInfo(pageInfoPojo);
    }
})(jQuery, window);

