/*********
 * 获取登录用户和右键点击的数据
 */
var systemId = parent.getSysuserID();
var rowData = parent.getSelectedJsonData();
var accountNum = rowData.accountNum;
/*********
 * 全局变量
 */
var _global = {
	popusName: '',
	tipsOpen: '',
	history_eventsType: "",
	history_eventsDesc: "",
	untreat_eventsType: "",
	untreated_eventsDesc: "",
	userDate: "",
};
var _global2 = {
    plugins:{
    	page:null
	}
};

$(function() {
	var _global = {
		eventNumlist: [],
		top:parent,
		flag:0,
	};

	init();
	/*********
	 * 初始化加载用户信息
	 */
	post_async({
			"userId": accountNum
		},
		"../../getUserData.do",
		basicInformation_callback);
	/*********
	 * 初始化加载历史事件事件类型下拉框
	 */
	post_async({
			"userId": ""
		},
		"../../getCodeType.do",
		getCodeType_callback);
	/************************************************
	 基本信息、相关联系人、相关设备、防区图、用户防区、监控点切换的
	 显示切换
	 ************************************************/
	$("ul.fgt>li").click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		$(href).show().siblings().hide();
		if(href == "#areaMap") {
			//getUserZone();
			getMapPic();
			$('.xmd').hide();
			$("#bottom_div_contain").hide();
		} else {
			$('.xmd').show();
			$("#bottom_div_contain").show();
		}
	});
	/************************************************
	 历史事件、未处理事件切换的显示切换，下拉框的默认加载
	 ************************************************/
	$("ul.event>li").click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		$(href).show().siblings().hide();
		if(href == "#con_history") {
			$("#history_select option[value='" + _global.history_eventsType + "']").attr("selected", true);
			$("#history_select_describ").html("");
			getEventDesc(_global.history_eventsType);

		}
	});
	/************************************************
	 基本信息、相关联系人、相关设备、防区图、用户防区、监控点切换的
	 样式切换
	 ************************************************/
	$(".fgt li").bind("click", function() {
		$(".fgt li.triangle").removeClass("triangle");
		$(this).addClass("triangle");
	});
	/************************************************
	 历史事件、未处理事件切换的样式切换
	 ************************************************/
	$(".event li").bind("click", function() {
		$(".event li.triangle").removeClass("triangle");
		$(this).addClass("triangle");
	});
	/************************************************
	 相关联系人点击事件
	 ************************************************/
	$("#relatedContact").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../getRelevantContact.do",
			relatedContact_callback);
		$("#relatedContactTab").colResizable({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 相关设备点击事件
	 ************************************************/
	$("#relatedEquipment").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../getEquipmentData.do",
			relatedEquipment_callback);
		$("#relevantEquipmentTab").colResizable({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 用户防区点击事件
	 ************************************************/
	$("#userZone").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../getUserZone.do",
			userZone_callback);
		$("#userZoneTab").colResizabled({
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null,
			minWidth: 24

		});
	});
	/************************************************
	 监控点点击事件
	 ************************************************/
	$("#monitorPoint").bind('click', function() {
		if(accountNum == "") {

		} else {
			post_async({
					"ownerId": accountNum
				},
				"../../GetCameraListByUid.do",
				monitorPoint_callback);
			$("#monitorTab").colResizabled({
				minWidth: 24,
				liveDrag: true,
				gripInnerHtml: "<div></div>",
				draggingClass: "dragging",
				onResize: null
			});
		}
	});
	/************************************************
	 处警预案点击事件
	 ************************************************/
	$("#rdPlan").bind('click', function() {
		$("#rdPlanTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 历史记录点击事件
	 ************************************************/
	$("#historyRecord").bind('click', function() {
		$("#historyRecordTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 未处理事件点击事件
	 ************************************************/
	$("#untreated_event").bind('click', function() {
		$("#untreated_contentTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	$("#more_info").bind('click', function() {
		var useerInfoJson = {};
		_tipsManager(useerInfoJson, 'openuserInfo');
	});

    /************************************************
     翻页222
     ************************************************/
    _global2.plugins.page = new YW.PAGEUI({
        ID: 'pageBox',
        clickPage: _queryData_page
    });
	//全选未处理事件
	$("#allCheckUntreated").bind('click', function() {
		var $this = $(this);
		var isChecked = $this.hasClass('isChecked');//是否已经被勾选

		if(isChecked == true){
			//已经被勾选，当前操作是取消全选
			$("input[name='untreated_event_check']").removeAttr("checked");
			$this.removeClass("isChecked").addClass("noCheck");

		}
		else{
			//未被勾选，当前操作是要全选
			$("input[name='untreated_event_check']").attr("checked","true");
			$this.removeClass("noCheck").addClass("isChecked");
		}
	});
	/************************************************
	 历史事件、未处理事件开始时间和结束时间的选择框初始化
	 ************************************************/
	$('#center_time_start_text').click(function() {
		WdatePicker({
			maxDate: '#F{$dp.$D(\'center_time_end_text\')}',
			dateFmt: 'yyyy-MM-dd HH:mm:ss',
			isShowClear: false
		});
		this.blur();
	});
	$('#center_time_end_text').click(function() {
		WdatePicker({
			minDate: '#F{$dp.$D(\'center_time_start_text\')}',
			dateFmt: 'yyyy-MM-dd HH:mm:ss',
			isShowClear: false
		});
		this.blur();
	});
	$('#untreated_time_start_text').click(function() {
		WdatePicker({
			maxDate: '#F{$dp.$D(\'untreated_time_end_text\')}',
			dateFmt: 'yyyy-MM-dd HH:mm:ss',
			isShowClear: false
		});
		this.blur();
	});
	$('#untreated_time_end_text').click(function() {
		WdatePicker({
			minDate: '#F{$dp.$D(\'untreated_time_start_text\')}',
			dateFmt: 'yyyy-MM-dd HH:mm:ss',
			isShowClear: false
		});
		this.blur();
	});
        /************************************************
         升降序的切换222
         ************************************************/
        $("#history_contentTab1 tr th:eq(3)").click(function(){
			_global.flag +=1;
			var tmp = _global.flag%3;
			console.log("tmp:"+tmp);
			if(tmp == 1){
				$("#timePng").removeClass("timePngchange2").addClass("timePngchange");
			}
			else if(tmp == 2){
				$("#timePng").removeClass("timePngchange").addClass("timePngchange2");
			}else if(tmp == 0){
				$("#timePng").removeClass("timePngchange").removeClass("timePngchange2");
			}
			var sort="";
			if($("#timePng").hasClass("timePngchange")){
				sort = "devId|DESC,eventTime|DESC";
			}else if($("#timePng").hasClass("timePngchange2")){
				sort = "devId|ASC,eventTime|ASC";
			}else {
				sort = "eventTime|DESC";
			}
            var history_startTime = $("#center_time_start_text").val().replace(" ", "T");
            var history_endTime = $("#center_time_end_text").val().replace(" ", "T");
            var history_eventTime = history_startTime + ";" + history_endTime;
            var history_json = {
				queryTond:{
					"eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
					"eventTime":history_eventTime, // 事件发生时间
					"sysCode":"", // 系统码
					"accountNum":accountNum, // 机主编号
					"accountName":"", // 机主名称
					"handleStatus":"", // 处理状态（未处理，已处理)
					"handleResult":"", // 处理结果（确认警情，误报，移去）
					"handleDesc":"", // 处理结果说明
					"handleTime":"" // 处理时间
				},
                pageInfoPojo:{
                    currentPage:1,
                    sort:sort,
                    pageSize:10
                }
            }
            post_async(
                history_json,
                "/WorkStation/query/alarmEventslist.do",
                historyEvent_callback);
        });

	/************************************************
	 获取历史事件的查询条件，并查询
	 ************************************************/
	var history_startTime = $("#center_time_start_text").val().replace(" ", "T");
	var history_endTime = $("#center_time_end_text").val().replace(" ", "T");
	var history_eventTime = history_startTime + ";" + history_endTime;
	var history_json = {

		queryTond:{
			"eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
			"eventTime":history_eventTime, // 事件发生时间
			"sysCode":"", // 系统码
			"accountNum":accountNum, // 机主编号
			"accountName":"", // 机主名称
			"handleStatus":"", // 处理状态（未处理，已处理)
			"handleResult":"", // 处理结果（确认警情，误报，移去）
			"handleDesc":"", // 处理结果说明
			"handleTime":"" // 处理时间
		},
		pageInfoPojo:{
			currentPage:1,
			sort:"eventTime|DESC",
			pageSize:10
		}
	};
    history_json.pageInfoPojo.currentPage = 1;
	$('#history_event').click(function() {
		post_async(
			history_json,
			"/WorkStation/query/alarmEventslist.do",
			historyEvent_callback);
	});

	/************************************************
	 历史事件的搜索按钮的点击事件
	 ************************************************/
	$("#search").bind('click', function() {
		var history_search_startTime = $("#center_time_start_text").val().replace(" ", "T");
		var history_search_endTime = $("#center_time_end_text").val().replace(" ", "T");
		var history_searchTime = history_search_startTime + ";" + history_search_endTime;
		var history_eventType = $("#history_select option:selected").val();
		var history_codeId = $("#history_select_describ option:selected").val();
		_global.history_eventsType = history_eventType;
		_global.history_codeId = history_codeId;
		var sort="";
		var sort="";
		if($("#timePng").hasClass("timePngchange")){
			sort = "devId|DESC,eventTime|DESC";
		}else if($("#timePng").hasClass("timePngchange2")){
			sort = "devId|ASC,eventTime|ASC";
		}else {
			sort = "eventTime|DESC";
		}
		var history_searchJson = {
			queryTond:{
				"eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
				"eventTime":history_searchTime, // 事件发生时间
				"sysCode":"", // 系统码
				"accountNum":accountNum, // 机主编号
				"accountName":"", // 机主名称
				"handleStatus":"", // 处理状态（未处理，已处理)
				"handleResult":"", // 处理结果（确认警情，误报，移去）
				"handleDesc":"", // 处理结果说明
				"handleTime":"", // 处理时间
				"codeTypeId":history_eventType,
				"eventDesc":history_codeId,
			},
			pageInfoPojo:{
				currentPage:1,
				sort:sort,
				pageSize:10
			}
		}
        history_searchJson.pageInfoPojo.currentPage = 1;
		post_async(
			history_searchJson,
			"/WorkStation/query/alarmEventslist.do",
			historyEvent_callback);
	});

    //222
	function _queryData_page(page) {
        var history_search_startTime = $("#center_time_start_text").val().replace(" ", "T");
        var history_search_endTime = $("#center_time_end_text").val().replace(" ", "T");
        var history_searchTime = history_search_startTime + ";" + history_search_endTime;
        var history_eventType = $("#history_select option:selected").val();
        var history_codeId = $("#history_select_describ option:selected").val();
        _global.history_eventsType = history_eventType;
        _global.history_codeId = history_codeId;
		var sort="";
		if($("#timePng").hasClass("timePngchange")){
			sort = "devId|DESC,eventTime|DESC";
		}else if($("#timePng").hasClass("timePngchange2")){
			sort = "devId|ASC,eventTime|ASC";
		}else {
			sort = "eventTime|DESC";
		}
        var history_searchJson = {
			queryTond:{
				"eventNum":"", //事件编号,为空（null 或者 “”）将忽略该条件，下方字段也是如此
				"eventTime":history_searchTime, // 事件发生时间
				"sysCode":"", // 系统码
				"accountNum":accountNum, // 机主编号
				"accountName":"", // 机主名称
				"handleStatus":"", // 处理状态（未处理，已处理)
				"handleResult":"", // 处理结果（确认警情，误报，移去）
				"handleDesc":"", // 处理结果说明
				"handleTime":"", // 处理时间
				"codeTypeId":history_eventType,
				"eventDesc":history_codeId,
			},
			pageInfoPojo:{
				currentPage:1,
				sort:sort,
				pageSize:10
			}
        };
        history_searchJson.pageInfoPojo.currentPage = page;
        post_async(
            history_searchJson,
            "/WorkStation/query/alarmEventslist.do",
            historyEvent_callback);
    }
	isDispose(rowData.disposeStatus);
	checkDisposeType(rowData);

});
//获取当前时间
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	month = month < 10 ? ('0' + month) : month;

	var strDate = date.getDate();
	strDate = strDate < 10 ? ('0' + strDate) : strDate;

	var hour = date.getHours();
	hour = hour < 10 ? ('0' + hour) : hour;

	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;

	var second = date.getSeconds();
	second = second < 10 ? ('0' + second) : second;

	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + hour + seperator2 + minute + seperator2 + second;
	return currentdate;

}

//获取十分钟前时间
function getBeforeTenMinFormat(eventTime) {
    var nowDate = new Date(eventTime);
    var time = (nowDate.getTime() - 600000);
	var timeFormat = formatDateTime(time);
    return timeFormat;
}
//获取7天钟前时间
function getCenetrBeforeTenMinFormat(eventTime) {
	var nowDate = new Date(eventTime);
	var time = (nowDate.getTime() - 7*24*60*60*1000);
	var timeFormat = formatDateTime(time);
	return timeFormat;
}

	//时间戳转换成 yyyy-MM-dd HH:mm:ss
     function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    };
/************************************************
 关闭弹窗
 ************************************************/
function _closePopus() {
	$("#mainDiv").remove();
	$("#bottomDiv").remove();
}

/************************************************
 打开核警、处警、维修、预处理的转接
 ************************************************/
function _tipsManager(param_json, tipsPage_str, callback_func) {
	switch(tipsPage_str) {
		case 'preDispose':
			_global.popusName = 'preDispose';
			_open_preDispose();
			break;
		case 'transpond':
			_global.popusName = 'transpond';
			_open_transpond();
			break;
		case 'openuserInfo':
			_global.popusName = 'openuserInfo';
			_open_userinfo();
			break;
		default:
			break;
	}
}
function _open_userinfo() {
	_openPopups($('body'), "./userInfo/userInfo.html", {
		width: 1000,
		height: 435
	});
}

function _openPopups(body, url, iframSize) {

	if($("#mainDiv").length > 0) {
		$("#mainDiv").remove();
	}
	if($("#bottomDiv").length > 0) {
		$("#bottomDiv").remove();
	}
	var iframSizeWidth = iframSize.width;
	var iframeSizeHeight = iframSize.height;
	console.log("iframSizeWidth: " + iframSizeWidth);
	console.log("iframeSizeHeight: " + iframeSizeHeight);
	var mainDiv = $("<div></div>");
	var bottomDiv = $("<div></div>");
	var iframe = $("<iframe></iframe>");
	iframe.attr({
		src: url,
		scrolling: "no",
		width: iframSizeWidth,
		height: iframeSizeHeight,
		border: 0,
		frameborder: "no"
	});
	var windowHeight = window.height;
	var windowWidth = window.width;
	var bodyHeight = body.height();
	var bodyWidth = body.width();
	bodyHeight = body.height();
	bodyWidth = body.width();
	var iframeHeight = iframe.height();
	var iframeWidth = iframe.width();
	console.log("bodyWidth: " + bodyWidth);
	var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
	var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
	iframeHeightCenter = parseInt(iframeHeightCenter);
	iframeWidthCenter = parseInt(iframeWidthCenter);
	console.log("iframeWidthCenter: " + iframeWidthCenter);
	bodyHeight = parseInt(bodyHeight);
	bodyWidth = parseInt(bodyWidth);
	bottomDiv.attr({
		id: "bottomDiv"
	});
	bottomDiv.css({
		"opacity": 0.5,
		"float": "left",
		"top": "0px",
		"left": "0px",
		"width": bodyWidth + "px",
		"height": bodyHeight + "px",
		"display": "inline-block",
		"position": "absolute",
		"z-index": "99",
		"background-color": "black",

	});
	mainDiv.css({
		"top": iframeHeightCenter + 'px',
		"left": iframeWidthCenter + 'px',
		"width": iframSizeWidth + 'px',
		"height": iframeSizeHeight + 'px',
		"display": "inline-block",
		"position": "absolute",
		"z-index": "100",
		"border-radius": "3px",
		"background-color": "#FFF"
	});
	mainDiv.attr({
		id: "mainDiv"
	});
	body.resize(function() {
		bodyHeight = body.height();
		bodyWidth = body.width();
		bodyHeight = parseInt(bodyHeight);
		bodyWidth = parseInt(bodyWidth);
		bottomDiv.css({
			"width": bodyWidth + "px",
			"height": bodyHeight + "px"
		});
		iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
		iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
		mainDiv.css({
			"top": iframeHeightCenter + 'px',
			"left": iframeWidthCenter + 'px'
		});
	});

	mainDiv.append(iframe);
	body.append(bottomDiv);
	body.append(mainDiv);
}
/************************************************
 相关设备的回调函数
 ************************************************/
function relatedEquipment_callback(data) {
	var innerHtml = "";
	for(var i = 0; i < data.EquipmentList.length; i++) {
		innerHtml += "<tr>" +
			"<td>" + data.EquipmentList[i].devId + "</td>" +
			"<td>" + data.EquipmentList[i].devName + "</td>" +
			"<td>" + data.EquipmentList[i].devTypeName + "</td>" +
			"<td>" + data.EquipmentList[i].devModelName + "</td>" +
			"<td>" + data.EquipmentList[i].areaName + "</td>" +
			"<td>" + devStateTranse(data.EquipmentList[i].devState) + "</td>" + //返回的是编号
			"</tr>";
	}
	$("#equipmentData").html(innerHtml);
	addTitle();
}
/************************************************
 设备状态的数据转换
 ************************************************/
function devStateTranse(devState) {
	switch(devState) {
		case 0:
			return "不在线";
			break;
		case 1:
			return "在线";
			break;
		case 2:
			return "未知";
			break;
		default:
			break;
	}
}
/************************************************
 获取历史事件的事件类型的回调函数
 ************************************************/
function getCodeType_callback(data) {
	var $option = $("<option></option>");
	$option.attr('value', "");
	$option.text("全部");
	$option.appendTo($("#history_select"));
	for(var i = 0; i < data.codeType.length; i++) {
		var $option = $("<option></option>");
		$option.attr('value', data.codeType[i].codeTypeId);
		$option.text(data.codeType[i].codeType);
		$option.appendTo($("#history_select"));
	}
	$('#history_select_describ').attr("disabled", true);
}
/************************************************
 历史事件的事件类型下拉切换选择时，重新加载对应的事件描述
 ************************************************/
function changeCodeType() {
	var selectId = $("#history_select option:selected").val();
	$("#history_select_describ").html("");
	if(selectId == "") {
		$('#history_select_describ').attr("disabled", true);
	} else {
		$('#history_select_describ').removeAttr("disabled");
		getEventDesc(selectId);
	}
}
/************************************************
 历史事件的事件描述查询
 ************************************************/
function getEventDesc(codeTypeId) {
	post_async({
			"codeTypeId": codeTypeId
		},
		"../../getCodeMemo.do",
		getCodeMemo_callback);
}
/************************************************
 历史事件的事件描述查询回调函数
 ************************************************/
function getCodeMemo_callback(data) {
	var $option = $("<option></option>");
	$option.attr('value', "");
	$option.text("");
	$option.appendTo($("#history_select_describ"));
	for(var i = 0; i < data.codeMemo.length; i++) {
		var $option = $("<option></option>");
		//$option.attr('value', i);
		$option.attr('value', data.codeMemo[i].codeId);
		$option.text(data.codeMemo[i].codeMemo);
		$option.appendTo($("#history_select_describ"));
	}
}
/************************************************
 基本信息的回调函数
 ************************************************/
function basicInformation_callback(data) {
	_global.userDate = data;

	$("#accountNum").val(data.userInformation.userId);
	$("#devIds").val(data.userInformation.devId);
	$("#accountName").val(data.userInformation.userName);
	$("#accountAddr").val(data.userInformation.userAddr);
	$("#annotation").val(data.userInformation.uMem);
	$("#accountBusinessName").val(data.userInformation.businessName);
	$("#centerName").val(data.userInformation.platformName); //分中心编号，没有文字
	$("#areaName").val(data.userInformation.areaName);
	$("#business_subName").val(data.userInformation.define1); //子行业，只有编号，没有文字
	$("#accountTypeName").val(userTypeTranse(data.userInformation.userType)); //只有编号，没有文字
	$("#serverType").val(data.userInformation.userServerTypeName);
	$("#faultRemind").val(data.userInformation.badMem);
	$("#instDate").val(data.userInformation.instDate);
	$("#cMobile").val(data.userInformation.cMobile);
	$("#contact").val(data.userInformation.contact);
	$("#cPhone").val(data.userInformation.cPhone);
	$("#fMemo").val(data.userInformation.fMemo);
	$("#InternetTel").val(data.userInformation.pnlTel);
	$("#pnlHdTel").val(data.userInformation.pnlHdTel);
	$("#cPayNO").val(data.userInformation.payNO);
	$("#pnlTel").val(data.userInformation.pnlTel);
	addInputTitle();
}

function _returnUserinfo() {
	return _global.userDate;
}
/************************************************
 用户类型的数据转换
 ************************************************/
function userTypeTranse(userTypeId) {
	switch(userTypeId) {
		case 0:
			return "一般客户";
			break;
		case 1:
			return "机主";
			break;
		case 2:
			return "系统操作员";
			break;
		case 3:
			return "业务操作员";
			break;
		default:
			break;
	}
}
/************************************************
 相关联系人的回调函数
 ************************************************/
function relatedContact_callback(data) {
	var innerHtml = "";
	for(var i = 0; i < data.relevantContact.length; i++) {
		innerHtml += "<tr>" +
			"<td>" + data.relevantContact[i].contId + "</td>" +
			"<td>" + data.relevantContact[i].cName + "</td>" +
			"<td>" + data.relevantContact[i].cphone1 + "</td>" +
			"<td>" + data.relevantContact[i].cphone2 + "</td>" +
			"<td>" + data.relevantContact[i].hmPhone + "</td>" +
			"<td>" + data.relevantContact[i].hdPhone + "</td>" +
			"<td>" + data.relevantContact[i].contPwd + "</td>"	+
			"<td>" + data.relevantContact[i].fMemo + "</td>" +
			"</tr>";
	}
	$("#contactsData").html(innerHtml);
	addTitle();
}
/************************************************
 用户防区的回调函数
 ************************************************/
function userZone_callback(data) {
	var innerHtml = "";
	for(var i = 0; i < data.userZone.length; i++) {
        if(data.userZone[i].wantDoName==""||data.userZone[i].wantDoName==null){data.userZone[i].wantDoName=data.userZone[i].wantDo};
        if(data.userZone[i].almTypeName==""||data.userZone[i].almTypeName==null){data.userZone[i].almTypeName=data.userZone[i].almType};
        if(data.userZone[i].snTypeName==""||data.userZone[i].snTypeName==null){data.userZone[i].snTypeName=data.userZone[i].snType};

        innerHtml += "<tr>" +
			"<td>" + data.userZone[i].ownerZoneName + "</td>" +
			"<td>" + data.userZone[i].devId + "</td>" +
			"<td>" + data.userZone[i].devZoneId + "</td>" +
			"<td>" + data.userZone[i].snModelName + "</td>" +
			"<td>" + data.userZone[i].atPos + "</td>" +
			"<td>" + data.userZone[i].wantDoName + "</td>" +
			"<td>" + data.userZone[i].almTypeName + "</td>" +
			"<td>" + data.userZone[i].snNum + "</td>" +
			/* "<td>" + data.userZone[i].snTypeName + "</td>" +*/
			"<td>" + data.userZone[i].snTypeName + "</td>" +
			"<td>" + data.userZone[i].instDate + "</td>" +
			"<td>" + data.userZone[i].fMemo + "</td>" +
			"</tr>";
	}
	$("#uderzoneData").html(innerHtml);
	addTitle();
}
/************************************************
 监控点的回调函数
 ************************************************/
function monitorPoint_callback(data) {

    var innerHtml = "";
    if (data.code == "1000") {

        for (var i = 0; i < data.result.length; i++) {

            var ownerMonitorId = '';
            var devChannelId = '';
            var devId = '';
            var cameraName = "";
            var devChannelId = "";
            var atPos = "";
            var instDate = "";
            var almType = "";
            var wantDo = "";
            var cameraType = "";
            var cameraModelId = "";
            var fMemo = "";
            if (data.result[i].ownerMonitorId) {
                ownerMonitorId = data.result[i].ownerMonitorId;
            }
            if (data.result[i].devChannelId) {
                devChannelId = data.result[i].devChannelId;
            }
            if (data.result[i].devId) {
                devId = data.result[i].devId;
            }
            if (data.result[i].cameraName) {
                cameraName = data.result[i].cameraName;
            }
            if (data.result[i].devChannelId) {
                devChannelId = data.result[i].devChannelId;
            }
            if (data.result[i].atPos) {
                atPos = data.result[i].atPos;
            }
            if (data.result[i].instDate) {
                instDate = data.result[i].instDate;
            }
            if (data.result[i].almTypeName&&data.result[i].almTypeName !=""&&data.result[i].almTypeName!=null) {
                almType = data.result[i].almTypeName;
            }else {
                almType = data.result[i].almType;
			}
            if (data.result[i].wantDoName&&data.result[i].wantDoName !=""&&data.result[i].wantDoName!=null) {
                wantDo = data.result[i].wantDoName;
            }else {
                wantDo = data.result[i].wantDo;
			}
            if (data.result[i].cameraTypeName&&data.result[i].cameraTypeName !=""&&data.result[i].cameraTypeName!=null) {
                cameraType = data.result[i].cameraTypeName;
            }else {
                cameraType = data.result[i].cameraType;
			}
            if (data.result[i].cameraModelName&&data.result[i].cameraModelName !=""&&data.result[i].cameraModelName!=null) {
                cameraModelId = data.result[i].cameraModelName;
            }else {
                cameraModelId = data.result[i].cameraModelId;
			}
            if (data.result[i].fMemo) {
                fMemo = data.result[i].fMemo;
            }
            innerHtml += "<tr>" +
                "<td>" + ownerMonitorId + "</td>" +
                "<td>" + devChannelId + "</td>" +
                "<td>" + devId + "</td>" +
                "<td>" + cameraName + "</td>" +
                "<td>" + devChannelId + "</td>" +
                "<td>" + atPos + "</td>" +
                "<td>" + instDate + "</td>" +
                "<td>" + almType + "</td>" +
                "<td>" + wantDo + "</td>" +
                "<td>" + cameraType + "</td>" +
                "<td>" + cameraModelId + "</td>" +
                "<td>" + fMemo + "</td>" +
                "</tr>";
        }
        $("#monitorData").html(innerHtml);
        addTitle();
    }
    else {
        $("#monitorData").html(innerHtml);
    }
}
/************************************************
 历史事件的查询的回调函数
 ************************************************/
function historyEvent_callback(data) {
	var innerHtml = "";
	var alertPojo = data.json;
	var totalPage = data.pageInfoPojo.totalPage;
    var currentPage = data.pageInfoPojo.currentPage;
    var totalNum = data.pageInfoPojo.totalNum;
    if(totalNum == 0){totalNum = -1};
    _global2.plugins.page.setPage(totalPage, currentPage, totalNum);
	for(var i = 0; i < alertPojo.length; i++) {
		innerHtml += "<tr>" +
			"<td>" + alertPojo[i].handleStatus + "</td>" +
			"<td>" + alertPojo[i].eventTime.replace("T", " ") + "</td>" +
			"<td>" + alertPojo[i].sysCode + "</td>" +
			"<td>" + alertPojo[i].devId + "</td>" +
			"<td>" + alertPojo[i].codeType + "</td>" +
			"<td>" + alertPojo[i].eventDesc + "</td>" +
			"<td>" + alertPojo[i].devZoneId + "</td>" +
			//"<td>" + alertPojo[i].eventSrc + "</td>" +
			"<td>" + alertPojo[i].accountZone + "</td>" +
			"<td>" + alertPojo[i].userMonitorId + "</td>" +
			//"<td>" + alertPojo[i].callID + "</td>" +
			"</tr>"
	}
	$("#historyData").html(innerHtml);
	addTitle();
	setColSizeHistoryData();
}
function setColSizeHistoryData(){
	var col1 = document.getElementById("history_contentTab1").getElementsByTagName('th');//获取表头所有列
	var col2 = document.getElementById("history_contentTab2").getElementsByTagName('td');//获取数据表所有列
	$("#history_contentTab1").colResizable({
		minWidth: 20, //最小宽度
		liveDrag:true, //是否实时拖动
		gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
		draggingClass:"dragging", //拖动div样式
		onResize: null, //拖动时调用函数
		followCol:col2,//数据表的列集合
		mainCol:col1,//表头表的列结婚firstColDrag:false
		firstColDrag:true,
	});
	$("#history_contentTab2").colResizableNot({
		minWidth: 20, //最小宽度
		liveDrag:true, //是否实时拖动
		gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
		draggingClass:"dragging", //拖动div样式
		onResize: null //拖动时调用函数
	});
	document.getElementById("history_contentTab2").style.width=document.getElementById("history_contentTab1").style.width;
	var columnsize = col1.length;

	if((col2!=null&&col2.length>0)&&col1!=null){
		//给数据表重新获取宽度
		for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
			col2[i].style.width = col1[i].style.width;//实际应用用这里
		}
	}
	//固定和滚动
	document.getElementById("history_contentTab2").style.width=document.getElementById("history_contentTab1").style.width;
	var right_div2 = document.getElementById("history_contentTab_div2");
	right_div2.onscroll = function(){
		var right_div2_left = this.scrollLeft;
		document.getElementById("history_contentTab_div1").scrollLeft = right_div2_left;
	}
}

/************************************************
 添加table标题 attr("title",)
 ************************************************/
function addTitle() {
	$(".haveTitle tbody tr").each(function() {
		$(this).children("td").not("#fixedtd").mouseover(function() {
			$(this).attr("title", $(this).text());
		});
	});

}
/************************************************
 添加input标题
 ************************************************/
function addInputTitle() {
	$("table input").each(function() {
		$(this).mouseover(function() {
			$(this).attr("title", $(this).val());
		});
	});
}
/************************************************
 ************************************************/
function getEventType(typeId) {
	switch(typeId) {
		case "-1":
			return "其他";
			break;
		case "0":
			return "火警";
			break;
		case "1":
			return "劫盗";
			break;
		case "2":
			return "有声劫盗";
			break;
		case "3":
			return "无声劫盗";
			break;
		case "4":
			return "挟持";
			break;
		case "5":
			return "周边防区";
			break;
		case "6":
			return "窃盗";
			break;
		case "7":
			return "出入防区";
			break;
		case "8":
			return "一般报警";
			break;
		case "9":
			return "拆动";
			break;
		case "10":
			return "无交流";
			break;
		case "11":
			return "系统电池电压过低";
			break;
		case "12":
			return "电池测试故障";
			break;
		case "13":
			return "扩充器故障";
			break;
		case "14":
			return "警铃1";
			break;
		case "15":
			return "警铃1恢复";
			break;
		case "16":
			return "警铃2";
			break;
		case "17":
			return "警铃2恢复";
			break;
		case "18":
			return "通讯失败";
			break;
		case "19":
			return "电话线1故障";
			break;
		case "20":
			return "电话线1故障恢复";
			break;
		case "21":
			return "电话线2故障";
			break;
		case "22":
			return "电话线2故障恢复";
			break;
		case "23":
			return "感应器故障";
			break;
		case "24":
			return "无线感应故障";
			break;
		case "25":
			return "无线感应器电池过低";
			break;
		case "26":
			return "超测";
			break;
		case "27":
			return "一类警情";
			break;
		case "28":
			return "二类警情";
			break;
		case "29":
			return "一类故障";
			break;
		case "30":
			return "二类故障";
			break;
		case "":
			return "全部";
			break;
		default:
			break;
	}
}

;
(function($, window) {
	window.init = _init;

	window.checkDisposeType = _checkDisposeType;
	window.isSameSysuerID = _isSameSysuerID;
	window.isDispose = _isDispose;
	window.preDipose = _preDipose;
	window.getUserZone = _getUserZone;
	window.getMapPic = _getMapPic;
	window.getNVRVideoPojo = _getNVRVideoPojo;
	window.returnUserinfo = _returnUserinfo;

	var _config = {
		ajaxUrl: {
			preDiposeUrl: '../../alertPretreatment.do',
			getMapPicUrl: '/WorkStation/getMapPicByUserId.do',
			getUserZoneUrl: '../../getUserZoneByUserId.do',
			getUserZoneIsAlarmUrl: "../../alarmStatus.do",
			QueryDealwayListByUidUrl: '../../QueryDealwayListByUid.do',
			QueryLogListByAuidUrl: '../../QueryLogListByAuid.do',
            getMapPicByRoleIdUrl:"/WorkStation/getMapPicByRoleId.do",
            getZonesByRoleIdUrl:"/WorkStation/getZoneByOwnerId.do"
		}
	};
	var _global = {
		top: parent,
		userZonePojo: null,
		mouseoutEventA: null,
		jsonData: '',
		rowJson: '',
		getLinkageViewParams: {
			userPojo: {
				userId: '',
				zoneCHValue: '',
				zoneCHFlag: ""
			}
		},
		NVRVideoPojo: {},
		isUserZoneShow: false,
		mapPath: "",
        pathId:"",

	};

	function _init() {
		_initEvent();
		_initData();
	}

	function _initEvent() {
		$("#search_showHide").bind('click', function() {
			_switchHistory();
		});
		//点击处警预案标签
		$("#rdPlan").bind('click', function() {
			_getRdPlan();
		});
		//切换防区图
		$("#choosemap").on("change",function () {
            var mapval = $("#choosemap").val();
            var mapId =  "#areaImage"+mapval;
            $(mapId).show().siblings().hide();
			$("#Map").data("areaImage",mapId);
        })

		$("#policeCheck").bind('click',function () {
			parent.okAndCancel("确认处理警情？",function () {
				submit("确认警情");
			},null);
		});
		$("#policeRemove").bind('click',function () {
			parent.okAndCancel("确认处理警情？",function () {
				submit("移去");
			},null);
		});
		$("#Wrong").bind('click',function () {
			parent.okAndCancel("确认处理警情？",function () {
				submit("误报");
			},null);
		});
		/************************************************
		 关闭按钮点击事件，触发解锁
		 ************************************************/
		$("#close").bind('click', function() {
			parent.closeupPopus();
		});
	}
	function submit(handleResult) {
		var eventNum=rowData.eventNum;
		var eventNums=[];
		eventNums.push(eventNum)
		var params={
			"eventNums":eventNums,
			"handleResult":handleResult,
			"handleDesc":$("#handleDesc").val(),
			"handleTime":"",
		}
		var data=post_sync(params,"/WorkStation/eventDock/handleAlarmEvent.do");
		if(data.code=='200'){
			parent.alertSuccess("操作成功!",2000,null);
			parent.closeupPopus();
		}
		else{
			parent.alertSuccess(data.message,2000,null);
		}
	}

	function _initData() {
		_global.jsonData = parent.getSelectedJsonData();
		_global.rowJson = parent.getSelectedJsonData();
		_showAlarmInfo(_global.jsonData);
		//获取防区图防区信息
        _getZonesinfos();

	}


	function _isDispose(disposeStatus) {
		if(disposeStatus == "1") {
			$("#pretreatment").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
		}
	}

	//设置 底部按钮是否屏蔽， 2017-07-27 只有该条报警信息是预处理时 屏蔽不是正在预处理的其他单据按钮
	function _checkDisposeType(rowData) {

		switch(rowData.disposeStatus) {
			case "0": //未处理
				break;
			case "1": //已处理
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				break;
			case "2": //预处理
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				_checkDisposeTypeAfter(rowData.disposeType);
				break;
			default:

				break;
		}

	}

	function _checkDisposeTypeAfter(disposeType) {
		switch(disposeType) {
			case "0": //最外层
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				break;
			case "1": //处警

				$("#policeCheck").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#repair").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				//预处理时有处警单产生时不能转发1102017年10月27日15:10:02
                $("#forwardTo110").css({
                    "pointer-events": "none",
                    "opacity": "0.5"
                });
				break;
			case "2": //核警
				$("#policeHandle").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#repair").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
                //预处理时有核警单产生时不能转发1102017年10月27日15:10:08
                $("#forwardTo110").css({
                    "pointer-events": "none",
                    "opacity": "0.5"
                });
				break;
			case "3": //维修
				$("#policeCheck").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#policeHandle").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
				$("#pretreatment").css({
					"pointer-events": "none",
					"opacity": "0.5"
				});
                //预处理时有维修单产生时不能转发1102017年10月27日15:10:13
                $("#forwardTo110").css({
                    "pointer-events": "none",
                    "opacity": "0.5"
                });
				break;
			case "4": //转发
				break;
			default:
				break;
		}
	}

	//暂时停用 判断登录用户与之前处理过的用户是否相同
	function _isSameSysuerID(disposer) {
		var sysuserID = parent.getSysuserID();
		if(sysuserID != disposer && disposer != "") {
			$("#policeCheck").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
			$("#policeHandle").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
			$("#repair").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
			$("#pretreatment").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
		} else {

		}
	}

	function _getPreDiposeParams() {
		var jsonData = parent.getSelectedJsonData();
		var sysuserID = parent.getSysuserID();
		var params = {};
		params.sysuserID = sysuserID;
		params.eventNum = jsonData.eventNum;
		params.disposeType = '0';
		params.disposer = sysuserID;
		params.disposeID = '';
		params.disposeStatus = '2';
		params.pretreatmentPojo = '';
		return params;
	}

	function _preDipose() {
		var params = _getPreDiposeParams();
		post_async(params, _config.ajaxUrl.preDiposeUrl, _callback_preDispose);
	}

	function _callback_preDispose(data) {
		var result = data.result;
		if(result.code == 0) {
			parent.alertSuccess("操作成功！",2000,null/*_preDispose_callback*/);
		} else {
			parent.alertFail("操作失败！",2000,null);
		}
	}


	function _getMapPicParams() {
		var params = {};
		params.userPojo = {};
		params.userPojo.ownerId = accountNum;
		return params;
	}

	function _getUserZoneParams() {
		var params = {};
		params.userPojo = {};
		params.userPojo.ownerId = accountNum;
		return params;
	}

	function _getMapPic() {
		if(_global.isUserZoneShow == false) {
			_global.isUserZoneShow = true;
			var params = _getMapPicParams();
			post_async(params,_config.ajaxUrl.getMapPicByRoleIdUrl,_callback_getMapPic);
		}
	}

	function _callback_getMapPic(data) {
		var result = data.result;
		if(result.code == '0') {
			var pojo = data.MappicPojo;
			if(pojo == null || pojo.length == 0) {
                var $div=$("<div></div>");
                _global.pathId = "areaImage0";
                $div.addClass("areaImage").attr("id",_global.pathId);
                $("#Map").append($div);
				_showNoPicture();
				return;
			}
            for(var i=0, len = pojo.length;i<len;i++) {
                //将防区图路径存储起来
                _global.mapPath = pojo[i].mapPath;
                //配置防区图下拉
                var $option = $("<option></option>");
                $option.attr("value", pojo[i].mapId);
                $option.text(pojo[i].mapName);
                //$option.data("mapId",pojo[i].mapId);
                $("#choosemap").append($option);
                //配置防区图显示
                var $div = $("<div></div>");
                _global.pathId = "areaImage" + pojo[i].mapId;
                $div.attr("id", _global.pathId).addClass("areaImage");
                $("#Map").append($div);
                $('#'+"areaImage" + pojo[i].mapId).data("draggableJson",[]);
                $div.imageView(_global.mapPath, getUserZone, _geifalseback);

				//防区数组初始化

				$('#'+"areaImage" + pojo[i].mapId).data("zoom",1);
            }
            //只显示一个区域
            var mapval = $("#choosemap").val();
            var mapId =  "#areaImage"+mapval;
			$("#Map").data("areaImage",mapId);
			$(mapId).show().siblings().hide();
			$.fn.addiconList({
				containerId:"Map",
				minZoom:0.4,
				maxZoom:3,
				zoomSize:0.05,
				zoom:1,
				scrollDiv:'areaMap'
			});

			function getUserZone(id) {
                $('#' + id).data('isOk',1);
				_getUserZone(true);
			}
		} else {
            var $div=$("<div></div>");
            _global.pathId = "areaImage0";
            $div.addClass("areaImage").attr("id",_global.pathId);
            $("#Map").append($div);
			_showNoPicture();
		}
	}

	function _showNoPicture() {
		$("#" +_global.pathId).addClass('NoPicture');
	}

	function _geifalseback(id,mapPath) {
		var $div=$("<div></div>").addClass("box");
		var $div1=$("<div></div>").addClass('falsePicture');
		var $div2=$("<div></div>").addClass('div2');
		var $div3=$("<div></div>").addClass('div3');
		var $div4=$("<div></div>").addClass('div4');
		var $div5=$("<div></div>").addClass('div5');
		var $span = $("<span></span>");
		$div2.text('页面加载失败');
		$div4.text('1、网络故障，');
		$span.text('请重新加载图片').addClass("onclick").click(function () {
			$span.css('color','red');
			$("#"+id).imageView(mapPath, _removefalseback, _geifalseback);
		});
		$div5.text('2、图片丢失，请联系系统操作员到管理平台重新上传');
		$div3.append($div4);
		$div3.append($span);
		$div.append($div1);
		$div.append($div2);
		$div.append($div3);
		$div.append($div5);
		$div.appendTo("#"+id);
		_getUserZone(false);
		function _removefalseback() {
			$div.remove();
			_getUserZone(true);
		}

	}

	function _getUserZone(isShow) {
        _gotocreateIcon(isShow)
    }
    //获取探头信息
    function _getZonesinfos() {
        var params = _getUserZoneParams();
        post_async(params,_config.ajaxUrl.getZonesByRoleIdUrl,_callback_getUserZone)
    }

	function _callback_getUserZone(data) {
		var result = data.result;
		if(result.code == '0') {
			_global.userZonePojo = data.zonePojo;
		}
	}
	function _gotocreateIcon(isShow) {
        for(var i = 0; i < _global.userZonePojo.length; i++) {
            if (isShow) {
                var pathId = "#areaImage" + _global.userZonePojo[i].mapId;
                if ($(pathId).length == 0) {
                    continue;
                }
                if ($(pathId).data('isOk') == 1) {
					if(_global.jsonData.accountZone==_global.userZonePojo[i].ownerZoneName){
						_createAlarmIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].ownerZoneName, $(pathId), _global.userZonePojo[i]);

					}else {
						_createIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].ownerZoneName, $(pathId), _global.userZonePojo[i]);
					}
                }

            }
        }
    }
	function _createIcon(posX, posY, index, $img_center, jsonData) {
        if($('#zone'+jsonData.ownerZoneName).length == 1){
            return;
        }
		var $imgCenter = $img_center; //$('#img_center');
		var $icon = $('<div></div>');
		var $tip = $('<span></span>');
		$imgCenter.append($icon);
		$icon.append($tip);
		$icon.addClass('noAlarmPic');
		$icon.attr('id','zone'+jsonData.ownerZoneName);
		//$icon.attr('title', index);
		$tip.text(index);
		$tip.addClass('picTip');
		var imageOriginal = $imgCenter.data('imageOriginal');
		var imageTarget = $imgCenter.data('imageTarget');
		var element = {
			width: $imgCenter.width(),
			height: $imgCenter.height()
		};
		var pointTar = _getPoint(imageOriginal, element, imageTarget, posX, posY);
		$icon.css({
			top: pointTar.top + 'px',
			left: pointTar.left + 'px'
		});
		$icon.mouseover(function(e) {
			// alert("sss");
			var positionX = e.pageX;
			var positionY = e.pageY;
			_rightKeyPopus($('body'), positionX, positionY, jsonData);
			clearTimeout(_global.mouseoutEventA);
		}).mouseout(function() {
			_global.mouseoutEventA = setTimeout(function() {
				$("#rightKey_contains").remove();
			}, 500);
		});
		//_rightKeyPopus($('body'), pointTar.left, pointTar.top)
		//记录防区坐标位置
		var jsonArr=$img_center.data("draggableJson");
		var jsonStr={
			"id":'zone'+jsonData.ownerZoneName,
			"x":posX,
			"y":posY,
		}
		jsonArr.push(jsonStr);
		$img_center.data("draggableJson",jsonArr);

	}

	function _createAlarmIcon(posX, posY, index, $img_center, jsonData) {
		//<div id="alarmPic" class="alarmPic"></div>
        if($('#zone'+jsonData.ownerZoneName).length == 1){
            return;
        }
		var $imgCenter = $img_center; //$('#img_center');
		var $icon = $('<div></div>');
		var $tip = $('<span></span>');
		$imgCenter.append($icon);
		$icon.append($tip);
		$icon.addClass('alarmPic');
		$icon.attr('id','zone'+jsonData.ownerZoneName);
		//$icon.attr('title', index);
		$tip.text(index);
		$tip.addClass('picTip');
		var imageOriginal = $imgCenter.data('imageOriginal');
		var imageTarget = $imgCenter.data('imageTarget');
		var element = {
			width: $imgCenter.width(),
			height: $imgCenter.height()
		};
		var pointTar = _getPoint(imageOriginal, element, imageTarget, posX, posY);
		$icon.css({
			top: pointTar.top + 'px',
			left: pointTar.left + 'px'
		});
		$icon.mouseover(function(e) {
			//alert("sss");
			var positionX = e.pageX;
			var positionY = e.pageY;
			_rightKeyPopus($('body'), positionX, positionY, jsonData);
			clearTimeout(_global.mouseoutEventA);
		}).mouseout(function() {
			_global.mouseoutEventA = setTimeout(function() {
				$("#rightKey_contains").remove();
			}, 500);
		});
		//记录防区坐标位置
		var jsonArr=$img_center.data("draggableJson");
		var jsonStr={
			"id":'zone'+jsonData.ownerZoneName,
			"x":posX,
			"y":posY,
		}
		jsonArr.push(jsonStr);
		$img_center.data("draggableJson",jsonArr);
	}

	function _getPoint(original, element, target, posX, posY) {
		var pointOrg = {
			top: 0,
			left: 0
		};
		var pointTar = {
			top: 0,
			left: 0
		};
		var bLeft = (element.width - target.width) / 2; // 1
		var bTop = (element.height - target.height) / 2; //62.5655
		pointOrg.left = original.width * posX; //265.01718528
		pointOrg.top = original.height * posY; //128.322576824
		pointTar.left = (pointOrg.left * target.width) / original.width + bLeft - 17; //165.807562096
		pointTar.top = (pointOrg.top * target.height) / original.height + bTop - 41; //142.366175043068
		return pointTar;
	}

	function _rightKeyPopus($body, x, y, jsonData) {
		var row_json = {};
		row_json = jsonData;
		if($("#rightKey_contains").length > 0) {
			$("#rightKey_contains").remove();
		} else {

		}
		var snModelName=row_json.snModelName==""?row_json.snModelId:row_json.snModelName;
		$div_contains = $("<div></div>");
		$div_ownerZoneName = $("<div></div>");
		$div_atPos = $("<div></div>");
		$div_snType = $("<div></div>");
		$div_snNum = $("<div></div>");


		// var hotTitle = row_json.ownerZoneName + '防区/' + row_json.snType + '/' + row_json.atPos + '/' + row_json.snNum + '只';

		//$div_hotTitle.addClass('mouseOver_item').text("热点标题：" + hotTitle);
		//$div_userId.addClass('mouseOver_item').text("用户编号：" + accountNum);

		$div_ownerZoneName.addClass('mouseOver_item').text("用户防区编号：" + row_json.ownerZoneName);
		$div_atPos.addClass('mouseOver_item').text("防区位置：" + row_json.atPos);
		$div_snType.addClass('mouseOver_item').text("探头型号：" + snModelName);
		$div_snNum.addClass('mouseOver_item').text("探头数量：" + row_json.snNum);//

		$div_contains.addClass("rightKey_contains").attr('id', 'rightKey_contains')
			.append($div_ownerZoneName)
			.append($div_atPos)
			.append($div_snType)
			.append($div_snNum)
			.mouseout(function() {

				_global.mouseoutEventA = setTimeout(function() {
					$div_contains.remove();
				}, 500);
			}).mouseover(function() {
				clearTimeout(_global.mouseoutEventA);
			});
		$body.append($div_contains);
		var bodyHeight = $("body").height();
		var bodyWidth = $("body").width();
		if((bodyWidth - x) < 283 + 5) {
			x = x - 288;
			$div_contains.addClass('rightTrangel');
		} else {
			x += 5;
			$div_contains.addClass('leftTrangel');
		}
		if((bodyHeight - y) < 156) {
			y = y - 155;
		} else {
			y--;
		}
		$div_contains.css({
			"top": y + 'px',
			"left": x + 'px'
		});

	}

	function _getNVRVideoPojo() {
		return _global.NVRVideoPojo;
	}

	//未处理 历史事件 显示/隐藏 切换函数
	function _switchHistory() {
		if($("#search_tab").hasClass('noShow')) {
			$("#search_tab").removeClass('noShow').addClass('isShow');
			$("#search_untreated").removeClass('noShow').addClass('isShow');
			$('#con_untreatedData').css("height","92px");
			$('#history_contentTab_content').css("height","92px");
			//$("#search_showHide").text('收起');
		} else {
			$("#search_tab").removeClass('isShow').addClass('noShow');
			$("#search_untreated").removeClass('isShow').addClass('noShow');
			$('#con_untreatedData').css("height","162px");
			$('#history_contentTab_content').css("height","162px");
			//$("#search_showHide").text('搜索');
		}
	}

	function _showAlarmInfo(jsonData) {
		var eventTime = jsonData.eventTime.replace('T', ' ');
		$("#rdClass1").val(getUsrAlmType(jsonData.usrAlmType)); //处警等级
		$("#rdClass").val(jsonData.usrAlmType); //处警等级

		$("#eventType").val(jsonData.codeType); //事件类型
		$("#eventDesc").val(jsonData.eventDesc); //事件描述
		/* $("#eventTime").val(jsonData.eventTime);*/
		$("#eventTime").val(eventTime) //报警时间
		$("#alarmAddr").val(jsonData.alarmAddr); //报警位置
		/*   $("#snType").val(jsonData.snType);                             //探头类型
		   $("#accountZone").val(jsonData.accountZone);                        //用户防区编号
		   $("#zoneAtPos").val(jsonData.zoneAtPos);                          //防区位置*/

		//设置搜索的默认时间，报警时间的前十分钟
		var nowTime = getBeforeTenMinFormat(eventTime);
		var endTime = eventTime;
		$("#untreated_time_start_text").val(nowTime);
		$("#untreated_time_end_text").val(endTime);

		var center_endTime=getNowFormatDate();
		var center_nowTime = getCenetrBeforeTenMinFormat(center_endTime);
		$("#center_time_start_text").val(center_nowTime);
		$("#center_time_end_text").val(center_endTime);
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


	function _getRdPlanParams() {
		var params = {};
		params.userId = _global.jsonData.accountNum;
		return params;
	}

	function _getRdPlan() {
		var params = _getRdPlanParams();
		post_async(params, _config.ajaxUrl.QueryDealwayListByUidUrl, _callback_getRdPlan);
	}

	function _callback_getRdPlan(data) {
		var result = data.result;
		if(result.code == '1000') {
			_clearRdPlanRow();
			var jsonList = data.List;
			for(var i = 0; i < jsonList.length; i++) {
				_addRdPlanRow(jsonList[i]);
			}
		} else {
			_clearRdPlanRow();
		}
	}

	function _addRdPlanRow(rowData) {
		var $tr_row = $("<tr></tr>");
		var $td_num = $("<td></td>");
		var $td_content = $("<td></td>");
		var $td_memo = $("<td></td>");
		$td_num.text(rowData.dealWayId).attr('title', rowData.dealWayId);
		$td_content.text(rowData.fdata).attr('title', rowData.fdata);
		$td_memo.text(rowData.fMemo).attr('title', rowData.fMemo);

		$tr_row
			.append($td_num)
			.append($td_content)
			.append($td_memo)
			.appendTo($('#rdPlanData'));

	}

	function _clearRdPlanRow() {
		var i = 1;

		$('#rdPlanData tr').each(function() {

			var $this = $(this);
			setTimeout(function() {

				$this.remove();
			}, i * 1);
			i++;
		});
	}

})(jQuery, window);