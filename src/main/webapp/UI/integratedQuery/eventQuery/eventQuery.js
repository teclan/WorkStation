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
    var _config = {
        minWidth: 3601,
        minHeight: 765,
        ajaxUrl: {
            getEventInfosUrl: '/WorkStation/query/alarmEventslist.do'
        }
    };
    var _globalH = {
        getAlarmInfosParams: {
            alertPojo: {
                sysuserID: '',
                eventNum:'',
                eventTime: '',
                eventType: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
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
        mouseoutEventA: null,
        mouseoutEventB: null,
        getAlarmInfosParams: {
            alertPojo: {
                sysuserID: '',
                eventNum:'',
                eventTime: '',
                eventType: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'eventTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch:'1',
        eventTypeJson:null,
        eventTypePush:null,
        history_eventsDesc:''
    };


//重绘布局
    function _resizeDocment() {
        $body = $('body');
        $content = $("#content");
        $table = $("#table");
        var tableHeight = $table.height();
        var bodyWidth = $body.width();
        var contentWidth = $content.width();
        if (contentWidth < _config.minWidth) {
            $table.width(_config.minWidth);
        } else {
            $table.css('width', '100%');
        }


    }

    function _init() {
        _initEven();
        _initData();
        _searchEventInfo();
    }
    var eventTypeJson = [
        {eventTypeId : "-1",eventTypeName : "其他"},
        {eventTypeId : "0",eventTypeName : "火警"},
        {eventTypeId : "1",eventTypeName : "劫盗"},
        {eventTypeId : "2",eventTypeName : "有声劫盗"},
        {eventTypeId : "3",eventTypeName : "无声劫盗"},
        {eventTypeId : "4",eventTypeName : "挟持"},
        {eventTypeId : "5",eventTypeName : "周边防范"},
        {eventTypeId : "6",eventTypeName : "窃盗"},
        {eventTypeId : "7",eventTypeName : "出入防区"},
        {eventTypeId : "8",eventTypeName : "一般报警"},
        {eventTypeId : "9",eventTypeName : "拆动"},
        {eventTypeId : "10",eventTypeName : "无交流"},
        {eventTypeId : "11",eventTypeName : "系统电池电压过低"},
        {eventTypeId : "12",eventTypeName : "电池测试故障"},
        {eventTypeId : "13",eventTypeName : "扩充器故障"},
        {eventTypeId : "14",eventTypeName : "警铃1"},
        {eventTypeId : "15",eventTypeName : "警铃1恢复"},
        {eventTypeId : "16",eventTypeName : "警铃2"},
        {eventTypeId : "17",eventTypeName : "警铃2恢复"},
        {eventTypeId : "18",eventTypeName : "通讯失败"},
        {eventTypeId : "19",eventTypeName : "电话线1故障"},
        {eventTypeId : "20",eventTypeName : "电话线1故障恢复"},
        {eventTypeId : "21",eventTypeName : "电话线2故障"},
        {eventTypeId : "22",eventTypeName : "电话线2故障恢复"},
        {eventTypeId : "23",eventTypeName : "感应器故障"},
        {eventTypeId : "24",eventTypeName : "无线感应故障"},
        {eventTypeId : "25",eventTypeName : "无线感应器电池过低"},
        {eventTypeId : "26",eventTypeName : "超测"},
        {eventTypeId : "27",eventTypeName : "一类警情"},
        {eventTypeId : "28",eventTypeName : "二类警情"},
        {eventTypeId : "29",eventTypeName : "一类故障"},
        {eventTypeId : "30",eventTypeName : "二类故障"}
    ];
    function _initData() {
        var nowTime = getNowFormatDate();
        var startTime = getBeforeHalfYearFormatDate();
        nowTime =nowTime.split(" ")[0]+" 23:59:59";
        startTime =startTime.split(" ")[0]+" 00:00:00";
        $("#startTime").val(startTime);
        $('#startTime').click(function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
          //  this.blur();
        });
        $("#endTime").val(nowTime);
        $('#endTime').click(function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
          //  this.blur();
        });

        $("#timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH();
        });

        post_async(null, "../../../eveType.do", _showEveType);
        $("#eveType").click();
        $("#eveDescribe").one('click',function(){             //获取事件描述显示
            _getDescribe();
        });
        _global.eventTypeJson = eventTypeJson;

        $('#codeTypeId').bind('change',function (e) {
            changeCodeType();
        })
    }

    function _initEven() {
        document.oncontextmenu = function () {
            return false;
        }
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        $("#policeCheck").bind('click',function () {
            _searchEventInfo();
        });

        //默认点击一次
        $("#eveDescribe").click();
    }
    function _searchEventInfo() {
        var time = $("#startTime").val().replace(" ","T")+";"+$("#endTime").val().replace(" ","T");
        var alertPojo = {
            "eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
            "eventTime":time.replace(" ","T").replace(" ","T"), // 事件发生时间
            "sysCode":"", // 系统码
            "accountNum":$("#accountNum").val(), // 机主编号
            "accountName":$("#userName").val(), // 机主名称
            "handleStatus":"", // 处理状态（未处理，已处理)
            "handleResult":"", // 处理结果（确认警情，误报，移去）
            "handleDesc":"", // 处理结果说明
            "handleTime":"", // 处理时间
            "codeTypeId":$("#codeTypeId").val(),
            "eventDesc":$("#eventDesc").val(),
        };
        _getAlarmInfos(alertPojo);  //初始化请求未处理事件
    }
    function addTableRow(jsonData, isPre) {
        var row_json = _messageExchange(jsonData);//转换原始数据与显示的数据
        $div_row = $("<tr></tr>");

        $div_state = $("<td></td>");
        $div_date = $("<td></td>");
        $div_time = $("<td></td>");
        $div_systemCode = $("<td></td>");
        $div_userCode = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_usrAlmType = $("<td></td>");
        $div_userAddress = $("<td></td>");
        $div_eventType = $("<td></td>");
        $div_eventDescribe = $("<td></td>");
        $div_deviceZone = $("<td></td>");
        $div_userZone = $("<td></td>");
        $div_zoneLocation = $("<td></td>");
        $div_probeType = $("<td></td>");
        $div_callerID = $("<td></td>");
        $div_eventSource = $("<td></td>");

        $div_deviceId = $("<td></td>");
        $div_deviceModel = $("<td></td>");
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
        $div_docResult = $("<td></td>");

        $div_row
            .append($div_state)
            .append($div_docResult)
            .append($div_date)
            .append($div_time)
            .append($div_userCode)
            .append($div_userName)
            .append($div_deviceId)
            .append($div_deviceZone)
            .append($div_eventDescribe)
            .append($div_eventSource)
            .append($div_systemCode)
            .append($div_usrAlmType)
            .append($div_eventNum)
            .append($div_userAddress)
            .append($div_eventType)
            .append($div_userZone)
            .append($div_zoneLocation)
            .append($div_probeType)
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
            .addClass('table_row')
            .attr('id', jsonData.eventNum);

        $div_state.addClass("table_content_state").text(row_json.state).attr("title", row_json.state).attr("id", "state_" + row_json.eventNum);
        $div_docResult.addClass("table_item_5").text(row_json.docResult).attr("title", row_json.docResult);
        $div_date.addClass("table_item_2").text(row_json.date).attr("title", row_json.date);
        $div_time.addClass("table_item_2").text(row_json.time).attr("title", row_json.time);
        $div_systemCode.addClass("table_item_3").text(row_json.systemCode).attr("title", row_json.systemCode);
        $div_userCode.addClass("table_item_4").text(row_json.userCode).attr("title", row_json.userCode);
        $div_userName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_usrAlmType.addClass("table_item_userName").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));
        $div_userAddress.addClass("table_item_userName").text(row_json.userAddress).attr("title", row_json.userAddress);
       /* $div_eventType.addClass("table_item_4").text(row_json.codeType).attr("title", row_json.codeType);*/
        $div_eventType.addClass("table_item_4").text(row_json.eventType).attr("title", row_json.eventType);
        $div_eventDescribe.addClass("table_item_4").text(row_json.eventDescribe).attr("title", row_json.eventDescribe);
        $div_userZone.addClass("table_item_4").text(row_json.userZone).attr("title", row_json.userZone);
        $div_deviceZone.addClass("table_item_4").text(row_json.deviceZone).attr("title", row_json.deviceZone);
        $div_zoneLocation.addClass("table_item_4").text(row_json.zoneLocation).attr("title", row_json.zoneLocation);
        $div_probeType.addClass("table_item_4").text(row_json.probeType).attr("title", row_json.probeType);
        $div_callerID.addClass("table_item_4").text(row_json.callerID).attr("title", row_json.callerID);
        $div_eventSource.addClass("table_item_4").text(row_json.eventSource).attr("title", row_json.eventSource);
        //设备编号
        $div_deviceId.addClass("table_item_4").text(row_json.deviceId).attr("title", row_json.deviceId);
        $div_deviceModel.addClass("table_item_zoneNum").text(row_json.deviceModel).attr("title", row_json.deviceModel);
        $div_pliceInfoType.addClass("table_item_4").text(row_json.pliceInfoType).attr("title", row_json.pliceInfoType);
        $div_reactivityType.addClass("table_item_4").text(row_json.reactivityType).attr("title", row_json.reactivityType);
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
            _global.top.upPopusManager('../integratedQuery/eventQuery/relatedEvents/relatedEvents.html');
        });

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
        var row_json =
            {
                state: "",
                date: "",
                time: "",
                systemCode: "",
                datetime:"",
                userCode: "",
                userName: "",
                usrAlmType: "",
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
                devSubSys: "",
                probeModel: "",
                cameraName:"",
                userMonitorId:"",
                cameraModelId:"",
                atPos:"",
                docResult:""
            };
        row_json.state = dataJson.handleStatus;
        var eventTime = dataJson.eventTime;
        var datetime = dataJson.eventTime.replace("T"," ");
        var time = ['', ''];
        time = eventTime.split("T");
        row_json.datetime = datetime;
        row_json.date = time[0];
        row_json.time = time[1];
        row_json.systemCode = dataJson.sysCode;
        row_json.userCode = dataJson.accountNum;
        row_json.userName = dataJson.accountName;
        row_json.usrAlmType = dataJson.usrAlmType;
        row_json.userAddress = dataJson.accountAddr;
        row_json.eventType = dataJson.codeType;
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
        row_json.docResult = dataJson.handleResult;
        return row_json;

    }

    function _getAlarmInfosParams() {
        var params = {};
        params.alertPojo = {};
        params.pageInfoPojo = {};
        params.alertPojo = _global.getAlarmInfosParams.alertPojo;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort =sortVal();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }

    /*修改升降序*/
    function sortVal() {
        var sort="";
        if($("#timePng").hasClass('timePngchange')){
            sort="eventTime|DESC";
        }
        else{
            sort="eventTime|ASC";
        }
        return sort;
    }

    function _getAlarmInfos(alertPojo) {
        _global.getAlarmInfosParams.alertPojo = alertPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;

        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        var param = _getAlarmInfosParams();
        var params = {
            "queryTond":alertPojo,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        };
        $("body").loading();
        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
    }

    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();
        var params = {
            "queryTond":param.alertPojo,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        };
        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
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
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var alertPojo = data.json;
            for (var i = 0; i < alertPojo.length; i++) {
                addTableRow(alertPojo[i]);
            }

        } else {
            _clearRow();
        }
        setColSize();
    }

    function _clearRow() {
      $("#table_content").text('');
    }

    function _queryData_page(page) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        var param = _getAlarmInfosParams();

        var params = {
            "queryTond":param.alertPojo,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize
            }
        };
        $("body").loading();
        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
    }


    /************************************************
     获取未处理事件的事件类型的回调函数
     ************************************************/
    function _showEveType(data) {
        var $option = $("<option></option>");
        $option.attr('value', "");
        $option.text("全部");
        $option.appendTo($("#codeTypeId"));
        for (var i = 0; i < data.EveTypeList.length; i++) {
            var $option = $("<option></option>");
            $option.attr('value', data.EveTypeList[i].codeTypeId);
            $option.text(data.EveTypeList[i].codeType);
            $option.appendTo($("#codeTypeId"));
        }
        $('#eventDesc').attr("disabled", true);
    }

    function _getDescribe() {
        post_async(null, "../../../eveDescribe.do", _showDescribe);
    }
    /************************************************
     历史事件的事件类型下拉切换选择时，重新加载对应的事件描述
     ************************************************/
    function changeCodeType() {
        var selectId = $("#codeTypeId option:selected").val();
        $("#eventDesc").html("");
        if (selectId == "") {
            $('#eventDesc').attr("disabled", true);
        } else {
            $('#eventDesc').removeAttr("disabled");
            getEventDesc(selectId);
        }
    }
    /************************************************
     历史事件的事件描述查询
     ************************************************/
    function getEventDesc(codeTypeId) {
        post_async(
            {"codeTypeId": codeTypeId},
            "../../../getCodeMemo.do",
            getCodeMemo_callback);
    }
    /************************************************
     历史事件的事件描述查询回调函数
     ************************************************/
    function getCodeMemo_callback(data) {
        var $option = $("<option></option>");
        $option.attr('value', "");
        $option.text("");
        $option.appendTo($("#eventDesc"));
        for (var i = 0; i < data.codeMemo.length; i++) {
            var $option = $("<option></option>");
            $option.text(data.codeMemo[i].codeMemo);
            $option.attr('value', data.codeMemo[i].codeId);
            $option.appendTo($("#eventDesc"));
        }
        $("#eventDesc option").each(function (i, n) {
            if ($(n).text() == _global.history_eventsDesc) {
                $(n).attr("selected", true);
            }
        })
    }

    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('th');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:true,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(jQuery, window);

