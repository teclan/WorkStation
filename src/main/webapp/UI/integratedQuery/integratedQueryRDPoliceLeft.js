
$(document).ready(function(){
    $("#contentLeft div").click(function(){
        var i=$("#contentLeft div").index($(this));
        var $ActiveTabs = $('.checked');
        if($ActiveTabs.length>0){
            $("#contentLeft div").removeClass('checked');
        }
        $("#contentLeft div").eq(i).addClass('checked');
    });
    $("#brtid").click(function(){
        $("#rightOpen2").hide();
        $("#rightOpen1").show();
        userData();
    });
    $("#prepare_brtid").click(function(){
        $("#rightOpen1").hide();
        $("#rightOpen2").show();
        query();
    });

    $("#brtid").click();//默认点击用户信息

});

//用户信息
function userData(){
    iframeManager('userInfoIframe');
}
//事件查询
function query(){
    iframeManager('eventQueryIframe');
}



function iframeManager(iframeName){
    switch (iframeName) {
        case "userInfoIframe":
            $("#userInfoIframe").css('width', '100%');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            //userInfoIframe.searchEventInfo();
            $("#faultUserIframe").css('width', '0px');
            break;
        case "userStateIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '100%');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            //userStateIframe.searchEventInfo();
            $("#faultUserIframe").css('width', '0px');
            break;
        case "deviceInfoIframe":
	    	 $("#userInfoIframe").css('width', '0px');
	         $("#userStateIframe").css('width', '0px');
	         $("#deviceInfoIframe").css('width', '100%');
            $("#AkeyIframe").css('width', '0px');
	         $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
	         $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
	         $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
	         //deviceInfoIframe.searchEventInfo();
	         break;
        case "AkeyIframe":
            $("#AkeyIframe").css('width', '100%');
            $("#AkeyIframe").siblings().css('width', '0px');
            //deviceInfoIframe.searchEventInfo();
            break;
        case "eventQueryIframe":
        	$("#userInfoIframe").css('width', '0px');
	        $("#userStateIframe").css('width', '0px');
	        $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
	        $("#eventQueryIframe").css('width', '100%');
            $("#eventmonthIframe").css('width', '0px');
	        $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
	        $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //eventQueryIframe.searchEventInfo();
            break;
        case "eventmonthIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '100%');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //eventmonthIframe.searchEventInfo();
            break;
        case "rdQueryIframe":
        	$("#userInfoIframe").css('width', '0px');
	        $("#userStateIframe").css('width', '0px');
	        $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
	        $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
	        $("#rdQueryIframe").css('width', '100%');
            $("#rdVerifyIframe").css('width', '0px');
	        $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //rdQueryIframe.searchEventInfo();
            break;
        case "rdVerifyIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0PX');
            $("#rdVerifyIframe").css('width', '100%');
            $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //rdVerifyIframe.searchEventInfo();
            break;
        case "fixQueryIframe":
        	$("#userInfoIframe").css('width', '0px');
	        $("#userStateIframe").css('width', '0px');
	        $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
	        $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
	        $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
	        $("#fixQueryIframe").css('width', '100%');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //fixQueryIframe.searchEventInfo();
            break;
        case "patrollistIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0px');
            $("#patrollistIframe").css('width', '100%');
            $("#dailyIframe").css('width', '0%');
            $("#faultUserIframe").css('width', '0px');
            //patrollistIframe.searchEventInfo();
            break;
        case "dailyIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0%');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '100%');
            $("#faultUserIframe").css('width', '0px');
            //dailyIframe.searchEventInfo();
            break;
        case "faultUserIframe":
            $("#userInfoIframe").css('width', '0px');
            $("#userStateIframe").css('width', '0px');
            $("#deviceInfoIframe").css('width', '0px');
            $("#AkeyIframe").css('width', '0px');
            $("#eventQueryIframe").css('width', '0px');
            $("#eventmonthIframe").css('width', '0px');
            $("#rdQueryIframe").css('width', '0px');
            $("#rdVerifyIframe").css('width', '0px');
            $("#fixQueryIframe").css('width', '0%');
            $("#patrollistIframe").css('width', '0px');
            $("#dailyIframe").css('width', '0px');
            $("#faultUserIframe").css('width', '100%');

            var flag=$("#daily").data("daily");
            if(flag.length==0){
                dailyIframe.resizeDocment();
                $("#daily").data("daily","1");
            }
            //dailyIframe.searchEventInfo();
            break;
        default:
            // statements_def
            break;
    }
}
;(function ($,window) {

    window.setIframeName = _setIframeName;
    window.getIframeName = _getIframeName;
    window.setAlarmNum = _setAlarmNum;
    window.statisticalt = _statisticalt;
    window.updateStatistics = _updateStatistics;
    var _global = {
        top:parent,
        iframeName:''
    }

    function _setAlarmNum() {
        var statistics= getStatistics();
        serName1(statistics[0].onealert);
        serName2(statistics[0].twoalert);
        serName3(statistics[0].onefault);
        serName4(statistics[0].twofault);
        serName5(statistics[0].superm);

    }
    function _setPreDisposeNum() {
        var statistics= getStatistics();

        prepare_serName1(statistics[1].onealert);
        prepare_serName2(statistics[1].twoalert);
        prepare_serName3(statistics[1].onefault);
        prepare_serName4(statistics[1].twofault);
        prepare_serName5(statistics[1].superm);

    }
    function _setHandledNum() {
        var statistics= getStatistics();
        end_serName1(statistics[2].onealert);
        end_serName2(statistics[2].twoalert);
        end_serName3(statistics[2].onefault);
        end_serName4(statistics[2].twofault);
        end_serName5(statistics[2].superm);

    }
    function _setIframeName(iframeName) {
        _global.iframeName = iframeName;
    }
    function _getIframeName() {
        return _global.iframeName;
    }

    function _statisticalt(sysuserID,disposeStatus,eventType,callbackfunc){
        var url = '../../statisticalt.do';
        var param = {};
        param.sysuserID = sysuserID;
        param.disposeStatus =disposeStatus;
        param.eventType = eventType;
        param.roleId = _global.top.getSysroleId();
        param.onlyHandle = _global.top.getSysOnlyHandle();
        console.log(JSON.stringify(param));
        post_async(param,url,callbackfunc);
    }
    function alarmData_callbackfunc(data){
        var result = data.result;
        if(result.code==0){

        }else{

        }
    }
    function preDispose_callbackfunc(data){
        var result = data.result;
        if(result.code==0){

        }else{

        }
    }
    function handled_callbackfunc(data){
        var result = data.result;
        if(result.code==0){

        }else{

        }
    }

    function _updateStatistics() {
        _setAlarmNum();
        _setPreDisposeNum();
        _setHandledNum();

    }



})(jQuery,window);
