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
	userDate: ""
};

$(function() {
	init();
	/*********
	 * 初始化加载用户信息
	 */
	post_async({
			"userId": accountNum
		},
		"../../../../getUserData.do",
		basicInformation_callback);
	/*********
	 * 初始化加载历史事件事件类型下拉框
	 */
	post_async({
			"userId": ""
		},
		"../../../../getCodeType.do",
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
		if(href == "#con_untreated") {
			$("#untreat_eventType option[value='" + _global.untreat_eventsType + "']").attr("selected", true);
			$("#untreat_select_describ").html("");
			getEventDesc_untreat(_global.untreat_eventsType);
			$("#untreat_select_describ option").each(function(i, n) {
				if($(n).text() == _global.untreated_eventsDesc) {
					$(n).attr("selected", true);
				}
			})
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
			"../../../../getRelevantContact.do",
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
			"../../../../getEquipmentData.do",
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
			"../../../../getUserZone.do",
			userZone_callback);
		$("#userZoneTab").colResizable({
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
					"userId": accountNum
				},
				"../../../../GetCameraListByUid.do",
				monitorPoint_callback);
			$("#monitorTab").colResizable({
				minWidth: 24,
				liveDrag: true,
				gripInnerHtml: "<div></div>",
				draggingClass: "dragging",
				onResize: null
			});
			/* $("#monitorTab").colResizable({
			     liveDrag: true,
			     gripInnerHtml: "<div class='grip'></div>",
			     draggingClass: "dragging",
			     resizeMode: 'overflow',
			     postbackSafe: true,
			     partialRefresh: true,
			     flush:true
			 });*/
		}
	});
	/************************************************
	 处警预案点击事件
	 ************************************************/
	$("#rdPlan").bind('click', function() {
		$("#rdPlanTab").colResizable({
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
		$("#historyRecordTab").colResizable({
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
		$("#untreated_contentTab").colResizable({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 历史事件点击事件
	 ************************************************/
	$("#history_event").bind('click', function() {
		$("#history_contentTab").colResizable({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	 关闭按钮点击事件，触发解锁
	 ************************************************/
	$("#close").bind('click', function() {
		parent._closeUpPopus();
	});
	$("#more_info").bind('click', function() {
		var useerInfoJson = {};
		_tipsManager(useerInfoJson, 'openuserInfo');
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
	 获取历史事件的查询条件，并查询
	 ************************************************/
	var history_startTime = $("#center_time_start_text").val().replace(" ", "T");
	var history_endTime = $("#center_time_end_text").val().replace(" ", "T");
	var history_eventTime = history_startTime + ";" + history_endTime;
	var history_json = {
		"eventTime": history_eventTime,
		"userId": accountNum,
		"disposeStatus": "",
		"codeTypeId": "",
		"eventDesc": ""
	}
	post_async(
		history_json,
		"../../../../ownerEvent.do",
		historyEvent_callback);

	/************************************************
	 历史事件的搜索按钮的点击事件
	 ************************************************/
	$("#search").bind('click', function() {
		var history_search_startTime = $("#center_time_start_text").val().replace(" ", "T");
		var history_search_endTime = $("#center_time_end_text").val().replace(" ", "T");
		var history_searchTime = history_search_startTime + ";" + history_search_endTime;
		var history_eventType = $("#history_select option:selected").val();
		var history_eventDesc = $("#history_select_describ option:selected").text();
		_global.history_eventsType = history_eventType;
		_global.history_eventsDesc = history_eventDesc;
		var history_searchJson = {
			"eventTime": history_searchTime,
			"userId": accountNum,
			"disposeStatus": "",
			"codeTypeId": history_eventType,
			"eventDesc": history_eventDesc
		}
		post_async(
			history_searchJson,
			"../../../../ownerEvent.do",
			historyEvent_callback);
	});
	/************************************************
	 未处理事件切换时，默认的搜索
	 ************************************************/
	$("#untreated_event").bind('click', function() {
		var untreated_startTime = $("#untreated_time_start_text").val().replace(" ", "T");
		var untreated_endTime = $("#untreated_time_end_text").val().replace(" ", "T");
		var untreated_eventTime = untreated_startTime + ";" + untreated_endTime;
		var untreated_eventType = $("#untreat_eventType option:selected").val();
		var untreated_eventDesc = $("#untreat_select_describ option:selected").text();
		_global.untreated_eventsType = untreated_eventType;
		_global.untreated_eventsDesc = untreated_eventDesc;
		var untreated_json = {
			"eventTime": untreated_eventTime,
			"userId": accountNum,
			"disposeStatus": "0",
			"codeTypeId": untreated_eventType,
			"eventDesc": untreated_eventDesc
		}
		post_async(
			untreated_json,
			"../../../../ownerEvent.do",
			untreatEvent_callback);
	});
	/************************************************
	 未处理事件的搜索按钮的点击事件
	 ************************************************/
	$("#search_untreat").bind('click', function() {
		var search_untreat_startTime = $("#untreated_time_start_text").val().replace(" ", "T");
		var search_untreat_endTime = $("#untreated_time_end_text").val().replace(" ", "T");
		var search_untreat_eventTime = search_untreat_startTime + ";" + search_untreat_endTime;
		var untreated_eventType = $("#untreat_eventType option:selected").val();
		var untreated_eventDesc = $("#untreat_select_describ option:selected").text();
		_global.untreated_eventsType = untreated_eventType;
		_global.untreated_eventsDesc = untreated_eventDesc;

		var untreat_searchJson = {
			"eventTime": search_untreat_eventTime,
			"userId": accountNum,
			"disposeStatus": "0",
			"codeTypeId": untreated_eventType,
			"eventDesc": untreated_eventDesc
		}
		post_async(
			untreat_searchJson,
			"../../../../ownerEvent.do",
			untreatEvent_callback);
	});
	isDispose(rowData.disposeStatus);
	//isSameSysuerID(rowData.disposer); //其他用户是否可以预处理
	checkDisposeType(rowData);
	//默认点击一次 未处理事件
	$("#untreated_event").click();
});
/************************************************
 解锁功能的回调函数
 ************************************************/
function lockCallback(data) {
	if(data.result.code == "1") {
		var accountNum = rowData.accountNum;
		var sysuserID = parent.getSysuserID();
		post_async({
				"sysuserID": sysuserID,
				"accountNum": accountNum,
				"type": 3
			},
			"../../../../delAlertsock.do",
			unlockCallback);
	} else {
		parent.closePopus();
	}
}

function unlockCallback(data) {
	if(data.result.code == "0") {
		parent.closePopus();
	}
	if(data.result.code == "1") {
		var accountNum = rowData.accountNum;
		var sysuserID = parent.getSysuserID();
		post_async({
				"sysuserID": sysuserID,
				"accountNum": accountNum,
				"type": 3
			},
			"../../../../delAlertsock.do",
			unlockCallback);
	}
}
//获取当前时间
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	//    if (strDate >= 0 && strDate <= 9) {
	//        strDate = "0" + strDate;
	//    }
	if(strDate >= 0 && strDate <= 3) {
		strDate = "01"
	}
	if(strDate > 3 && strDate <= 12) {
		strDate = "0" + (strDate - 3);
	}
	if(strDate > 12) {
		strDate = strDate - 3;
	}
	//    if (hour >= 0 && hour <= 9) {
	//        hour = "0" + hour;
	//    }
	//    if (minute >= 0 && minute <= 9) {
	//        minute = "0" + minute;
	//    }
	//    if (second >= 0 && second <= 9) {
	//        second = "0" + second;
	//    }
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + "00" + seperator2 + "00" + seperator2 + "00";
	return currentdate;
}
//获取结束时间
function getEndFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();

	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}

	/* var hour = date.getHours();
	 var minute = date.getMinutes();
	 var second = date.getSeconds();

	 if (hour >= 0 && hour <= 9){
	 hour = "0" + hour;
	 }
	 if (minute >= 0 && minute <= 9){
	 minute = "0" + minute;
	 }
	 if (second >= 0 && second <= 9){
	 second = "0" + second;
	 }*/
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + 23 + seperator2 + 59 + seperator2 + 59;
	return currentdate;
}

//获取十分钟前时间
function getBeforeTenMinFormat(eventTime) {
    var nowDate = new Date(eventTime);
    var time = (nowDate.getTime() - 600000);
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
 关闭弹窗
 ************************************************/
function _closePopus() {
	$("#mainDiv").remove();
	$("#bottomDiv").remove();
	clearTimeout(_global.tipsOpen);
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

function _open_preDispose() {
	_openPopups($('body'), "../tips/dispose.html", {
		width: 352,
		height: 154
	});
	_global.tipsOpen = setTimeout('_closePopus()', 2000);
}

function _open_transpond() {
	_openPopups($('body'), "../tips/forw.html", {
		width: 352,
		height: 154
	});
	_global.tipsOpen = setTimeout('_closePopus()', 2000);
}

function _open_userinfo() {
	_openPopups($('body'), "./userInfo/userInfo.html", {
		width: 1000,
		height: 435
	});
}

/*function _open_mapSign() {
    _openPopups($('body'), "../mapSign/mapSign.html", {
        width: 1000,
        height: 435
    });
}*/

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
 未处理事件的事件类型下拉切换选择时，重新加载对应的事件描述
 ************************************************/
function changeCodeType_untreat() {
	var selectId = $("#untreat_eventType option:selected").val();
	$("#untreat_select_describ").html("");
	if(selectId == "") {
		$('#untreat_select_describ').attr("disabled", true);
	} else {
		$('#untreat_select_describ').removeAttr("disabled");
		getEventDesc_untreat(selectId);
	}
}
/************************************************
 历史事件的事件描述查询
 ************************************************/
function getEventDesc(codeTypeId) {
	post_async({
			"codeTypeId": codeTypeId
		},
		"../../../../getCodeMemo.do",
		getCodeMemo_callback);
}
/************************************************
 未处理事件的事件描述查询
 ************************************************/
function getEventDesc_untreat(codeTypeId) {
	post_async({
			"codeTypeId": codeTypeId
		},
		"../../../../getCodeMemo.do",
		getCodeMemo_Callback);
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
		$option.attr('value', i);
		$option.text(data.codeMemo[i].codeMemo);
		$option.appendTo($("#history_select_describ"));
	}
	$("#history_select_describ option").each(function(i, n) {
		if($(n).text() == _global.history_eventsDesc) {
			$(n).attr("selected", true);
		}
	})
}
/************************************************
 未处理事件的事件描述查询回调函数
 ************************************************/
function getCodeMemo_Callback(data) {
	var $option = $("<option></option>");
	$option.attr('value', "");
	$option.text("");
	$option.appendTo($("#untreat_select_describ"));
	for(var i = 0; i < data.codeMemo.length; i++) {
		var $option = $("<option></option>");
		$option.attr('value', i);
		$option.text(data.codeMemo[i].codeMemo);
		$option.appendTo($("#untreat_select_describ"));
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
	//$("#handleDesc").val(data.userInformation.handleDesc);
	$("#InternetTel").val(data.userInformation.pnlTel);
	$("#wirelessTel").val(data.userInformation.pnlHdTel);
	$("#cPayNO").val(data.userInformation.contactPayNO);
	$("#rdClass").val(getUsrAlmType(data.userInformation.usrAlmType)); //用户级别
	$("#eventType").val(rowData.codeType); //事件类型
	$("#eventTime").val(rowData.eventTime.replace("T", ' ')); //报警时间
	$("#alarmAddr").val(rowData.alarmAddr); //报警位置
	$("#pnlTel").val(data.userInformation.pnlTel);
	addInputTitle();
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
		var snModelName =data.userZone[i].snModelName;
        if(snModelName==""||snModelName==null){snModelName=data.userZone[i].snModeId};
        var wantDoName =data.userZone[i].wantDoName;
        if(wantDoName==""||wantDoName==null){wantDoName=data.userZone[i].wantDo};
        var almTypeName =data.userZone[i].almTypeName;
        if(almTypeName==""||almTypeName==null){almTypeName=data.userZone[i].almType};
        var snTypeName =data.userZone[i].snTypeName;
        if(snTypeName==""||snTypeName==null){snTypeName=data.userZone[i].snType};

        innerHtml += "<tr>" +
			"<td>" + data.userZone[i].ownerZoneName + "</td>" +
			"<td>" + data.userZone[i].devId + "</td>" +
			"<td>" + data.userZone[i].devZoneId + "</td>" +
			"<td>" + snModelName + "</td>" +
			"<td>" + data.userZone[i].atPos + "</td>" +
			"<td>" + wantDoName + "</td>" +
			"<td>" + almTypeName + "</td>" +
			"<td>" + data.userZone[i].snNum + "</td>" +
			"<td>" + snTypeName + "</td>" +
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
	if(data.code == "1000") {
		for(var i = 0; i < data.result.length; i++) {
			var userMonitorId = '';
			var devMonitorId = '';
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
			if(data.result[i].userMonitorId) {
				userMonitorId = data.result[i].userMonitorId;
			}
			if(data.result[i].devMonitorId) {
				devMonitorId = data.result[i].devMonitorId;
			}
			if(data.result[i].devId) {
				devId = data.result[i].devId;
			}
			if(data.result[i].cameraName) {
				cameraName = data.result[i].cameraName;
			}
			if(data.result[i].devChannelId) {
				devChannelId = data.result[i].devChannelId;
			}
			if(data.result[i].atPos) {
				atPos = data.result[i].atPos;
			}
			if(data.result[i].instDate) {
				instDate = data.result[i].instDate;
			}
			if(data.result[i].almTypeName&&data.result[i].almTypeName !=""&&data.result[i].almTypeName!=null) {
				almType = data.result[i].almTypeName;
			}else {
                almType = data.result[i].almType;
			}
			if(data.result[i].wantDoName&&data.result[i].wantDoName !=""&&data.result[i].wantDoName!=null) {
				wantDo = data.result[i].wantDoName;
			}else {
                wantDo = data.result[i].wantDo;
			}
			if(data.result[i].cameraTypeName&&data.result[i].cameraTypeName !=""&&data.result[i].cameraTypeName!=null) {
				cameraType = data.result[i].cameraTypeName;
			}else {
                cameraType = data.result[i].cameraType;
			}
			if(data.result[i].cameraModelName&&data.result[i].cameraModelName !=""&&data.result[i].cameraModelName!=null) {
				cameraModelId = data.result[i].cameraModelName;
			}else {
                cameraModelId = data.result[i].cameraModelId;
			}
			if(data.result[i].fMemo) {
				fMemo = data.result[i].fMemo;
			}
			innerHtml += "<tr>" +
				"<td>" + userMonitorId + "</td>" +
				"<td>" + devMonitorId + "</td>" +
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
	} else {
		$("#monitorData").html(innerHtml);
	}
}
/************************************************
 历史事件的查询的回调函数
 ************************************************/
function historyEvent_callback(data) {
	var innerHtml = "";
	var alertPojo = data.alertPojo;
	var resolveState = "";
	for(var i = 0; i < alertPojo.length; i++) {
		if(alertPojo[i].disposeType == "1" && alertPojo[i].disposeStatus == "1") {
			resolveState = "已处警";
		} else {
			resolveState = "";
		}
		var history_eventType = getEventType(alertPojo[i].eventType);
		innerHtml += "<tr>" +
			"<td>" + alertPojo[i].docResult + "</td>" +
			"<td>" + alertPojo[i].eventTime.replace("T", " ") + "</td>" +
			"<td>" + alertPojo[i].sysCode + "</td>" +
			"<td>" + alertPojo[i].codeType + "</td>" +
			"<td>" + alertPojo[i].eventDesc + "</td>" +
			"<td>" + alertPojo[i].accountZone + "</td>" +
			"<td>" + alertPojo[i].eventSrc + "</td>" +
			"<td>" + alertPojo[i].callID + "</td>" +
			"</tr>"
	}
	$("#historyData").html(innerHtml);
	addTitle();
}
/************************************************
 未处理事件的回调函数
 ************************************************/
function untreatEvent_callback(data) {
	var innerHtml = "";
	var alertPojo = data.alertPojo;
	for(var i = 1; i < alertPojo.length + 1; i++) {
		var untreated_eventType = getEventType(alertPojo[i - 1].eventType);
		innerHtml += "<tr>" +
			"<td class='checkbox_td'>" +
			"</td>" +
			"<td>" + alertPojo[i - 1].eventTime.replace("T", " ") + "</td>" +
			"<td>" + alertPojo[i - 1].sysCode + "</td>" +
			"<td>" + alertPojo[i - 1].eventDesc + "</td>" +
			"<td>" + alertPojo[i - 1].codeType + "</td>" +
			"<td>" + alertPojo[i - 1].devZoneId + "</td>" +
			"<td>" + alertPojo[i - 1].eventSrc + "</td>" +
			"<td>" + alertPojo[i - 1].callID + "</td>" +
			"</tr>"
	}
	$("#untreatedData").html(innerHtml);
	addTitle();
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

	window.isSameSysuerID = _isSameSysuerID;
	window.isDispose = _isDispose;
	window.preDipose = _preDipose;
	window.getUserZone = _getUserZone;
	window.getMapPic = _getMapPic;
	window.getNVRVideoPojo = _getNVRVideoPojo;
	window.getEventNumlist = _getEventNumlist;
	window.returnUserinfo = _returnUserinfo;

	var _config = {
		ajaxUrl: {
			preDiposeUrl: '../../../../alertPretreatment.do',
			getMapPicUrl: '/WorkStation/getMapPicByUserId.do',
			getUserZoneUrl: '../../../../getUserZoneByUserId.do',
			getUserZoneIsAlarmUrl: "../../../../alarmStatus.do",
			getVideoDownloadUrl: '../../../../getVideoDownloadUrl.do',
			QueryDealwayListByUidUrl: '../../../../QueryDealwayListByUid.do',
			QueryLogListByAuidUrl: '../../../../QueryLogListByAuid.do',
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
		VideoDownloadPojo: {},
		isUserZoneShow: false,
		mapPath:"",
        pathId:""
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
		//点击历史记录标签
		$("#historyRecord").bind('click', function() {
			_getHistoryRecord();
		});
		if(rowData.devId && rowData.devId != "") {
			$("#electronicMap").removeClass("pointerNone");
		};
        //切换防区图
        $("#choosemap").on("change",function () {
            var mapval = $("#choosemap").val();
            var mapId =  "#areaImage"+mapval;
            $(mapId).show().siblings().hide();
			$("#Map").data("areaImage",mapId);
        })
	}

	function _initData() {
		_global.jsonData = parent.getSelectedJsonData();
		_global.rowJson = parent.getSelectedJsonData();
		_showAlarmInfo(_global.rowJson);
        //获取防区图防区信息
        _getZonesinfos();

	}

	function _isDispose(disposeStatus) {
		if(disposeStatus == "1") {
			$("#pretreatment").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
			$("#forwardTo110").css({
				"pointer-events": "none",
				"opacity": "0.5"
			});
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
        var pojo = data.MappicPojo;
		if(result.code == '0') {
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
            $(mapId).show().siblings().hide();

			$("#Map").data("areaImage",mapId);
			$.fn.addiconList({
				containerId:"Map",
				minZoom:0.4,
				maxZoom:3,
				zoomSize:0.05,
				zoom:1,
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
		$("#"+_global.pathId).addClass('NoPicture');
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
        _showZone(isShow);
	}
    //获取探头信息
    function _getZonesinfos() {
        var params = _getUserZoneParams();
        post_async(params,_config.ajaxUrl.getZonesByRoleIdUrl,_callback_getUserZone)
    }

	function _callback_getUserZone(data, isShow) {
		var result = data.result;
		if(result.code == '0') {
			_global.userZonePojo = data.zonePojo;
		}
	}

	function _getUserZoneIsAlarmParams() {
		var params = {};
		params.userZonePojo = _global.userZonePojo;
		return params;
	}

	function _getUserZoneIsAlarm(isShow) {
		var params = _getUserZoneIsAlarmParams();
		post_async(params, _config.ajaxUrl.getUserZoneIsAlarmUrl, _callback_getUserZoneIsAlarm, isShow);
	}

	function _callback_getUserZoneIsAlarm(data, isShow) {
		var result = data.result;
		if(result.code == 0) {
			_global.userZonePojo = data.userZonePojo;
			//_global.isUserZoneShow = true;
			_clearRow();
			for(var i = 0; i < _global.userZonePojo.length; i++) {
				if(isShow) {
                    var pathId = "#areaImage" + _global.userZonePojo[i].mapId;
                    if($(pathId).length == 0){
                        continue;
                    }
                    if($(pathId).data('isOk') == 1){
                        if(_global.userZonePojo[i].isAlert == 1) {
                            _createAlarmIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].ownerZoneName, $(pathId), _global.userZonePojo[i]);
                        } else {
                            _createIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].ownerZoneName, $(pathId), _global.userZonePojo[i]);
                        }
					}

				}
				//_AddTableRow(_global.userZonePojo[i]);
			}
		}
	}

	function _clearRow() {
		$("#table_content").children(".table_row").remove();
	}

	function _showZone(isShow) {
		_getUserZoneIsAlarm(isShow);
	}
	function _createIcon(posX, posY, index, $img_center, jsonData) {
		//<div id="alarmPic" class="alarmPic"></div>
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
		return _global.VideoDownloadPojo;
	}

	//未处理 历史事件 显示/隐藏 切换函数
	function _switchHistory() {
		if($("#search_tab").hasClass('noShow')) {
			$("#search_tab").removeClass('noShow').addClass('isShow');
			$("#search_untreated").removeClass('noShow').addClass('isShow');
			$("#search_showHide").text('收起');
		} else {
			$("#search_tab").removeClass('isShow').addClass('noShow');
			$("#search_untreated").removeClass('isShow').addClass('noShow');
			$("#search_showHide").text('搜索');
		}
	}

	function _showAlarmInfo(jsonData) {
		$("#rdClass").val(getUsrAlmType(jsonData.usrAlmType)); //处警等级
		$("#eventType").val(jsonData.codeType); //事件类型
		$("#eventDesc").val(jsonData.eventDescribe); //事件描述
		$("#eventTime").val(jsonData.eventTime); //报警时间
		$("#alarmAddr").val(jsonData.alarmAddr); //报警位置
		$("#handleDesc").val(jsonData.handleDesc); //报警位置

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
	function _getEventNumlist() {
		var eventNumList = [];
		$("input[name='untreated_event_check']:checked").each(function(i, item) {
			eventNumList.push($(item).val());
		});
		return eventNumList;
	}

	function _getHistoryRecordParams() {
		var params = {};
		params.userId = _global.jsonData.accountNum;
		params.pageInfoPojo = {};
		params.pageInfoPojo.currentPage = 1;
		params.pageInfoPojo.pageSize = 100;
		return params;
	}

	function _getHistoryRecord() {
		var params = _getHistoryRecordParams();
		post_async(params, _config.ajaxUrl.QueryLogListByAuidUrl, _callback_getHistoryRecord);
	}

	function _callback_getHistoryRecord(data) {
		var result = data.result;
		if(result.code == '0') {
			_clearHistoryRecordRow();
			var jsonList = data.List;
			for(var i = 0; i < jsonList.length; i++) {
				_addHistoryRecordRow(jsonList[i]);
			}
		} else {
			_clearHistoryRecordRow();
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

	function _addHistoryRecordRow(rowData) {
		var $tr_row = $("<tr></tr>");
		var $td_strdate = $("<td></td>");
		var $td_operationContent = $("<td></td>");
		var $td_userName = $("<td></td>");
		var $td_userId = $("<td></td>");

		$td_strdate.text(rowData.strdate).attr('title', rowData.strdate);
		$td_operationContent.text(rowData.operationContent).attr('title', rowData.operationContent);
		$td_userName.text(rowData.userName).attr('title', rowData.userName);
		$td_userId.text(rowData.userId).attr('title', rowData.userId);

		$tr_row
			.append($td_strdate)
			.append($td_operationContent)
			.append($td_userName)
			.append($td_userId);
		$tr_row.appendTo($('#historyRecordData'));

	}

	function _clearHistoryRecordRow() {
		var i = 1;

		$('#historyRecordData tr').each(function() {

			var $this = $(this);
			setTimeout(function() {

				$this.remove();
			}, i * 1);
			i++;
		});
	}

})(jQuery, window);