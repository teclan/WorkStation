var systemId = parent.getSysuserID();
var rowData = parent.getSelectedJsonData();
var accountNum
if(rowData.userId){
    accountNum = rowData.userId;
}else if(rowData.ownerId) {
    accountNum = rowData.ownerId;
}else {
    accountNum = rowData.accountNum;
}


/*********
 * 全局变量
 */
var _global = {
	history_eventsType: "",
	history_eventsDesc: "",
	untreat_eventsType: "",
	untreated_eventsDesc: "",
	userDate: ""
};
var _global2 = {
    plugins:{
        page:null
    }
};
/*********
 * 初始化加载历史事件、未处理事件事件类型下拉框
 */
post_async({
		"userId": ""
	},
	"../../../getCodeType.do",
	getCodeType_callback);

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
 历史事件、未处理事件切换的显示切换，下拉框的默认加载
 ************************************************/
$("ul.event>li").click(function(e) {
	e.preventDefault();
	var href = $(this).attr('href');
	$(href).show().siblings().hide();
});
/************************************************
 历史事件的事件描述查询
 ************************************************/
function getEventDesc(codeTypeId) {
	post_async({
			"codeTypeId": codeTypeId
		},
		"../../../getCodeMemo.do",
		getCodeMemo_callback);
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
	//	var selectId = $("#history_select option:selected").val();
	//	getEventDesc(selectId);
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

$(document).ready(function() {
	init();
	$("#title_1").html("用户资料");
	/*basicInformation_callback(rowData);*/

	/************************************************
	 基本信息、相关联系人、相关设备、防区图、用户防区、监控点切换的
	 显示切换
	 ************************************************/
	$("ul.fgt>li").click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href');
		$(href).show().siblings().hide();
		if(href == "#areaMap") {
			getMapPic();
		} else {

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
	 相关联系人按钮的点击事件
	************************************************/
	$("#relatedContact").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../../getRelevantContact.do",
			relatedContact_callback);
		$("#relevantContactTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	相关设备按钮的点击事件
	************************************************/
	$("#relatedEquipment").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../../getEquipmentData.do",
			relatedEquipment_callback);
		$("#relevantEquipmentTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
	});
	/************************************************
	用户防区按钮的点击事件
	************************************************/
	$("#userZone").bind('click', function() {
		post_async({
				"userId": accountNum
			},
			"../../../getUserZone.do",
			userZone_callback
		);
		$("#userZoneTab").colResizabled({
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null,
			minWidth: 24
		});
	});

	/************************************************
	  监控点按钮的点击事件
	************************************************/
	$("#monitorPoint").bind('click', function() {
		if(accountNum == "") {

		} else {
			post_async({
					"ownerId": accountNum
				},
				"../../../GetCameraListByUid.do",
				monitorPoint_callback);
		}
		$("#monitorTab").colResizabled({
			minWidth: 24,
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null
		});
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
	关闭按钮的点击事件
	************************************************/
	$("#close").bind('click', function() {
		parent._closeUpPopus();
	});

});
/************************************************
相关联系人的回调函数
************************************************/
function relatedEquipment_callback(data) {
	var innerHtml = "";
	for(var i = 0; i < data.EquipmentList.length; i++) {
		var devState = devStateTranse(data.EquipmentList[i].devState);
		devState =devState == null ? '' : devState;
		innerHtml += "<tr>" +
			"<td>" + data.EquipmentList[i].devId + "</td>" +
			"<td>" + data.EquipmentList[i].devName + "</td>" +
			"<td>" + data.EquipmentList[i].devTypeName + "</td>" +
			"<td>" + data.EquipmentList[i].devModelName + "</td>" +
			"<td>" + data.EquipmentList[i].areaName + "</td>" +
			"<td>" + devState + "</td>" + //返回的是编号
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
            return "离线";
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
用户信息的回调函数
************************************************/
function basicInformation_callback(data) {
	var result = data.result;
	if(result.code == "200") {
		var isPay = data.userInformation.isPay;
		var isVideoCheck = data.userInformation.isVideoCheck;
		var engageTest = data.userInformation.engageTest;
		var nomRpt = data.userInformation.nomRpt;
		if(isPay != null) {
			isPay = ((isPay == 0) ? "否" : "是");
		} else {
			isPay = "";
		}
		if(isVideoCheck != null) {
			isVideoCheck = ((isVideoCheck == 0) ? "否" : "是");
		} else {
			isVideoCheck = "";
		}
		if(engageTest != null) {
			engageTest = ((engageTest == 0) ? "否" : "是");
		} else {
			engageTest = "";
		}
		if(nomRpt != null) {
			nomRpt = ((nomRpt == 0) ? "否" : "是");
		} else {
			nomRpt = "";
		}
		$("#accountNum").val(data.userInformation.userId); //用户编号
		$("#contact").val(data.userInformation.contact); //单位负责人
		$("#cMobile").val(data.userInformation.cMobile); //负责人手机
		$("#accountName").val(data.userInformation.userName); //用户名称
		$("#rdClass").val(getUsrAlmType(data.userInformation.usrAlmType)); //用户级别
		$("#cPayNO").val(data.userInformation.contactPayNO); //口令
		$("#accountAddr").val(data.userInformation.userAddr); //用户地址
		$("#accountTypeName").val(userTypeTranse(data.userInformation.userType)); //用户类型，只有编号，没有文字
		$("#accountBusinessName").val(data.userInformation.businessName); //用户行业，分中心编号，没有文字
		$("#areaName").val(data.userInformation.areaName); //所属区域
		$("#serverType").val(data.userInformation.userServerTypeName); //服务类型
		$("#business_subName").val(data.userInformation.define1); //子行业，只有编号，没有文字
		//$("#centerName").val(data.userInformation.centerName); //所属分中心
        $("#centerName").val(data.userInformation.platformName); //所属平台
		$("#isPay").val(isPay); //新添加，缴费状态
		$("#createDate").val(data.userInformation.instDate); //新添加，录入时间，安装日期
		$("#cPhone").val(data.userInformation.cPhone); //负责人电话
		$("#isVideoCheck").val(isVideoCheck); //新添加，短信转发
		$("#operName").val(data.userInformation.operName); //新添加，录入人
		$("#pnlTel").val(data.userInformation.pnlTel); //联网电话
		/*ly*/
		/*
		$("#instDate").val(data.userInformation.instDate); //安装日期
		*/
		$("#engageTest").val(engageTest); //新添加，定期测试用户
		$("#wirelessTel").val(data.userInformation.pnlHdTel); //无线卡号
		$("#nomRpt").val(nomRpt); //新添加，定期撤布防用户
        $("#pnlTel").val(data.userInformation.pnlTel); //新添加，联网电话
		$("#road").val(data.userInformation.road); //新添加，道路标志
		$("#fMemo").val(data.userInformation.fMemo); //备注
		/* $("#devIds").val(data.pnlActID);   //关联设备，没有该字段
		 $("#annotation").val(data.uMem);
		 $("#faultRemind").val(data.badMem);*/
		addInputTitle();
	}
	// $("#basicInformation").click();
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
			"<td>" + data.relevantContact[i].contPwd + "</td>"+
			"<td>" + data.relevantContact[i].fMemo + "</td>" +
			"</tr>";
	}
	$("#contactsData").html(innerHtml);
	addTitle();
}
/************************************************
、用户防区的回调函数
************************************************/
function userZone_callback(data) {
	var innerHtml = "";

	for(var i = 0; i < data.userZone.length; i++) {
		if(data.userZone[i].wantDoName == ""||data.userZone[i].wantDoName ==null){data.userZone[i].wantDoName = data.userZone[i].wantDo};
        if(data.userZone[i].almTypeName == ""||data.userZone[i].almTypeName ==null){data.userZone[i].almTypeName = data.userZone[i].almType};
        if(data.userZone[i].snTypeName == ""||data.userZone[i].snTypeName ==null){data.userZone[i].snTypeName = data.userZone[i].snType};
		innerHtml += "<tr>" +
			"<td>" + data.userZone[i].ownerZoneName + "</td>" +
			"<td>" + data.userZone[i].devId + "</td>" +
			"<td>" + data.userZone[i].devZoneId + "</td>" +
			"<td>" + data.userZone[i].snModelName + "</td>" +
			"<td>" + data.userZone[i].atPos + "</td>" +
			"<td>" + data.userZone[i].wantDoName + "</td>" +
			"<td>" + data.userZone[i].almTypeName + "</td>" +
			"<td>" + data.userZone[i].snNum + "</td>" +
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

	if(data.code == "1000") {
		for(var i = 0; i < data.result.length; i++) {
			var ownerMonitorId = '';
			var devMonitorId = "";
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
			if(data.result[i].ownerMonitorId) {
                ownerMonitorId = data.result[i].ownerMonitorId;
			}
			if(data.result[i].devChannelId) {
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
			if(data.result[i].almTypeName&&data.result[i].almTypeName!=""&&data.result[i].almTypeName!=null) {
				/*almType = data.result[i].almType;*/
				almType = data.result[i].almTypeName;
			}else {
                almType = data.result[i].almType;
			}
			if(data.result[i].wantDoName&&data.result[i].wantDoName!=""&&data.result[i].wantDoName!=null) {
				/*wantDo = data.result[i].wantDo;*/
				wantDo = data.result[i].wantDoName;
			}else {
                wantDo = data.result[i].wantDo;
			}
			if(data.result[i].cameraTypeName&&data.result[i].cameraTypeName!=""&&data.result[i].cameraTypeName!=null) {
				/*cameraType = data.result[i].cameraType;*/
				cameraType = data.result[i].cameraTypeName;
			}else {
                cameraType = data.result[i].cameraType;
			}
			if(data.result[i].cameraModelName&&data.result[i].cameraModelName!=""&&data.result[i].cameraModelName!=null) {
				cameraModelId = data.result[i].cameraModelName;
			}else {
                cameraModelId = data.result[i].cameraModelId;
			}
			if(data.result[i].fMemo) {
				fMemo = data.result[i].fMemo;
			}
			innerHtml += "<tr>" +
				"<td>" + ownerMonitorId + "</td>" +
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

function addTitle() {
	$(".haveTitle tbody tr").each(function() {
		$(this).children("td").not("#fixedtd").mouseover(function() {
			$(this).attr("title", $(this).text());
		});
	});
}

function addInputTitle() {
	$("table input").each(function() {
		$(this).mouseover(function() {
			$(this).attr("title", $(this).val());
		});
	});
};
(function($, window) {
	window.init = _init;
	window.getUserZone = _getUserZone;
	window.getMapPic = _getMapPic;
	window.setColSizehistoryEventTab=_setColSizehistoryEventTab;

	var _config = {
		ajaxUrl: {
			getMapPicUrl: '/WorkStation/getMapPicByUserId.do',
			getUserZoneUrl: '../../../getUserZoneByUserId.do',
			getUserZoneIsAlarmUrl: "../../../alarmStatus.do",
			QueryDealwayListByUidUrl: '../../../QueryDealwayListByUid.do',
			QueryLogListByAuidUrl: '../../../QueryLogListByAuid.do',
            getMapPicByRoleIdUrl:"/WorkStation/getMapPicByRoleId.do",
            getZonesByRoleIdUrl:"/WorkStation/getZoneByOwnerId.do"

		}
	};
	var _global = {
		top: parent,
		userZonePojo: null,
		mouseoutEventA: null,
		jsonData: '',
		isUserZoneShow: false,
		mapPath: "",
        pathId:""

	};

	function _init() {
		_initEvent();
		_initData();
		post_async({
                "userId": accountNum
			},
			"../../../getUserData.do",
			basicInformation_callback);
	}

	function _initEvent() {
		var center_endTime=getNowFormatDate();
		var center_nowTime = getCenetrBeforeTenMinFormat(center_endTime);
		$("#center_time_start_text").val(center_nowTime);
		$("#center_time_end_text").val(center_endTime);
		
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
        /************************************************
         升降序的切换222
         ************************************************/
        $("#historyEventTab1 tr th:eq(3)").click(function(){
            $("#timePng").toggleClass("timePngchange");
            var sort="";
            if($("#timePng").hasClass("timePngchange")){
                sort = "devId|DESC";
            }else {
                sort = "devId|ASC";
            }
            var history_search_startTime = $("#center_time_start_text").val().replace(" ", "T");
            var history_search_endTime = $("#center_time_end_text").val().replace(" ", "T");
            var history_searchTime = history_search_startTime + ";" + history_search_endTime;
            var history_eventType = $("#history_select option:selected").val();
            var history_codeId = $("#history_select_describ option:selected").val();
            _global.history_eventsType = history_eventType;
            _global.history_codeId = history_codeId;
            var history_searchJson = {
                "eventTime": history_searchTime,
                "userId": accountNum,
                "disposeStatus": "",
                "codeTypeId": history_eventType,
                "codeId": history_codeId,
                pageInfoPojo:{
                    currentPage:1,
                    sort:sort,
                    pageSize:10
                }
            };
            post_async(
                history_searchJson,
                "../../../ownerEventPage.do",
                historyEvent_callback);
        });
        /************************************************
         翻页222
         ************************************************/
        _global2.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });

		$("#rdPlan").bind('click', function() {
			_getRdPlan();
		});
		//点击历史记录标签
		$("#historyRecord").bind('click', function() {
			_getHistoryRecord();
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
			var history_searchJson = {
				"eventTime": history_searchTime,
				"userId": accountNum,
				"disposeStatus": "",
				"codeTypeId": history_eventType,
				"codeId": history_codeId,
                pageInfoPojo:{
                    currentPage:1,
                    sort:"eventTime|DESC",
                    pageSize:10
                }
			};
			post_async(
				history_searchJson,
				"../../../ownerEventPage.do",
				historyEvent_callback);
		});
		$("#historyEvent").data('click',"");
		$("#historyEvent").bind('click', function() {
			if($("#historyEvent").data('click').length==0) {
				$("#historyEvent").data('click',"click");
				$("#search").click();
			}
		});
        //切换防区图
        $("#choosemap").on("change",function () {
            var mapval = $("#choosemap").val();
            var mapId =  "#areaImage"+mapval;
            $(mapId).show().siblings().hide();
			$("#Map").data("areaImage",mapId);
        })

	}
    function _queryData_page(page) {
        var history_search_startTime = $("#center_time_start_text").val().replace(" ", "T");
        var history_search_endTime = $("#center_time_end_text").val().replace(" ", "T");
        var history_searchTime = history_search_startTime + ";" + history_search_endTime;
        var history_eventType = $("#history_select option:selected").val();
        var history_codeId = $("#history_select_describ option:selected").val();
        _global.history_eventsType = history_eventType;
        _global.history_codeId = history_codeId;
        var history_searchJson = {
            "eventTime": history_searchTime,
            "userId": accountNum,
            "disposeStatus": "",
            "codeTypeId": history_eventType,
            "codeId": history_codeId,
            pageInfoPojo:{
                currentPage:1,
                sort:"eventTime|DESC",
                pageSize:10
            }
        };
        history_searchJson.pageInfoPojo.currentPage = page;
        post_async(
            history_searchJson,
            "../../../ownerEventPage.do",
            historyEvent_callback);
    }

	/************************************************
	 历史事件的查询的回调函数
	 ************************************************/
	function historyEvent_callback(data) {
		var innerHtml = "";
		var alertPojo = data.alertPojo;
		var resolveState = "";
        var totalPage = data.pageInfo.totalPage;
        var currentPage = data.pageInfo.currentPage;
        var totalNum = data.pageInfo.totalNum;
        if(totalNum == 0){totalNum = -1};
        _global2.plugins.page.setPage(totalPage, currentPage, totalNum);
		for(var i = 0; i < alertPojo.length; i++) {
			if(alertPojo[i].disposeType == "1" && alertPojo[i].disposeStatus == "1") {
				resolveState = "已处警";
			} else {
				resolveState = "";
			}
			innerHtml += "<tr>" +
				"<td>" + alertPojo[i].docResult + "</td>" +
				"<td>" + alertPojo[i].eventTime.replace("T", " ") + "</td>" +
				"<td>" + alertPojo[i].sysCode + "</td>" +
				"<td>" + alertPojo[i].devId + "</td>" +
				"<td>" + alertPojo[i].codeType + "</td>" +
				"<td>" + alertPojo[i].eventDesc + "</td>" +
				"<td>" + alertPojo[i].devZoneId + "</td>" +
				"<td>" + alertPojo[i].eventSrc + "</td>" +
				"<td>" + alertPojo[i].accountZone + "</td>" +
				"<td>" + alertPojo[i].userMonitorId + "</td>" +
				"<td>" + alertPojo[i].callID + "</td>" +
				"</tr>"
		}
		$("#historyEventData").html(innerHtml);
		_setColSizehistoryEventTab();
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

	function _initData() {

		_global.jsonData = parent.getSelectedJsonData();
        //获取防区图防区信息
        _getZonesinfos();

	}

	function _getMapPicParams() {
		var params = {};
		params.userPojo = {};
		params.userPojo.ownerId = accountNum;
        //params.userPojo.roleId = "";
		return params;
	}

	function _getUserZoneParams() {
		var params = {};
		params.userPojo = {};
		params.userPojo.ownerId = accountNum;
        //params.userPojo.roleId ="";
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
                $("#choosemap").append($option);
                //配置防区图显示
                var $div = $("<div></div>");
                var pathId = "areaImage" + pojo[i].mapId;
                $div.attr("id", pathId).addClass("areaImage");
                $("#Map").append($div);
                $('#'+pathId).data("draggableJson",[]);
                $div.imageView(_global.mapPath, getUserZone, _geifalseback);

				//防区数组初始化

				$('#'+pathId).data("zoom",1);
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
	/***********************************************
	 加载不到图像时的回调函数
	 *************************************************/
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

    function _getUserZoneIsAlarm(isShow) {
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
			}
	}


	function _clearRow() {
		$("#table_content").children(".table_row").remove();
	}

	function _showZone(isShow) {
		_getUserZoneIsAlarm(isShow);
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

	function _createAlarmIcon(posX, posY, index, $img_center, jsonData) {
        if($('#zone'+jsonData.ownerZoneName).length == 1){
            return;
        }
		var $imgCenter = $img_center;
		var $icon = $('<div></div>');
		var $tip = $('<span></span>');
		$imgCenter.append($icon);
		$icon.append($tip);
		$icon.addClass('alarmPic');
        $icon.attr('id','zone'+jsonData.ownerZoneName);
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
		$div_snType.addClass('mouseOver_item').text("探头类型：" + snModelName);
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

	function _getRdPlanParams() {
		var params = {};
        params.userId = accountNum;
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
		$("#rdPlanTab").colResizabled({
			liveDrag: true,
			gripInnerHtml: "<div></div>",
			draggingClass: "dragging",
			onResize: null,
			minWidth: 24
		});
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

	function _getHistoryRecordParams() {
		var params = {};
        params.userId = accountNum;
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

	function _setColSizehistoryEventTab(){
		var col1 = document.getElementById("historyEventTab1").getElementsByTagName('th');//获取表头所有列
		var col2 = document.getElementById("historyEventTab2").getElementsByTagName('td');//获取数据表所有列
		$("#historyEventTab1").colResizable({
			minWidth: 20, //最小宽度
			liveDrag:true, //是否实时拖动
			gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
			draggingClass:"dragging", //拖动div样式
			onResize: null, //拖动时调用函数
			followCol:col2,//数据表的列集合
			mainCol:col1,//表头表的列结婚firstColDrag:false
			firstColDrag:true,
		});
		$("#historyEventTab2").colResizableNot({
			minWidth: 20, //最小宽度
			liveDrag:true, //是否实时拖动
			gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
			draggingClass:"dragging", //拖动div样式
			onResize: null //拖动时调用函数
		});
		document.getElementById("historyEventTab2").style.width=document.getElementById("historyEventTab1").style.width;
		var columnsize = col1.length;

		if((col2!=null&&col2.length>0)&&col1!=null){
			//给数据表重新获取宽度
			for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
				col2[i].style.width = col1[i].style.width;//实际应用用这里
			}
		}
		//固定和滚动
		document.getElementById("historyEventTab2").style.width=document.getElementById("historyEventTab1").style.width;
		var right_div2 = document.getElementById("historyEventTabright_div2");
		right_div2.onscroll = function(){
			var right_div2_left = this.scrollLeft;
			document.getElementById("historyEventTabright_div1").scrollLeft = right_div2_left;
		}
	}
})(jQuery, window);