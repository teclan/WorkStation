/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    selectinit();
});

function closefun(){
    if(parent._closePopus)parent._closePopus();
    if(parent._closeUpPopus)parent._closeUpPopus()
}

;(function(window,$){
    window.selectinit = _init;


    var _config = {
        ajaxUrl: {
            preDiposeUrl: '../../../../alertPretreatment.do'

        }
    };
    var _global = {
        top: parent
    };
    function _init(){
        $("#close").click(function(){closefun()});
        _initEvent();
        _initData();

        var userDate = parent.returnUserinfo();

        var accountNum = userDate.userInformation.userId;
        post_async(
            {"userId": accountNum},
            "../../../../../getUserData.do",
            basicInformation_callback);

    }

    function _initEvent() {
        $("#policeList_tab>li").click(function (e) {
            e.preventDefault();
            var data = $(this).data('show');
            $(data).show().siblings().hide();

        });
        $(".fgt li").bind("click", function () {
            $(".fgt li.triangle").removeClass("triangle");
            $(this).addClass("triangle");
        });
    }

    function _initData() {
        var userDate = parent.returnUserinfo();
        var accountNum = userDate.userInformation.userId;
        post_async(
            {"userId":accountNum},
            "../../../../../getRelevantContact.do",
            createContactRow);
    }

    function basicInformation_callback(data) {
        var result = data.result;
        if(result.code == "200"){

            showBasicInformation(data.userInformation);
        }
        $("#tab_specific").click();

    }


    function createContactRow(data){
        var relevantContact = data.relevantContact;
        for(var i = 0; i < relevantContact.length; i++){
            var $div_row = $('<div></div>');
            var $div_peoId = $('<div></div>');
            var $div_peoName = $('<div></div>');
            /*var $div_peoTitle = $('<div></div>');*/
            var $div_telephone1 = $('<div></div>');
            var $div_telephone2 = $('<div></div>');
            var $div_familyPhone = $('<div></div>');
            var $div_mobilePhone = $('<div></div>');
            var $div_remarks = $('<div></div>');
            $div_row.append($div_peoId)
                .append($div_peoName)
                /*.append($div_peoTitle)*/
                .append($div_telephone1)
                .append($div_telephone2)
                .append($div_familyPhone)
                .append($div_mobilePhone)
                .append($div_remarks)
                .addClass('Row');
            $div_peoId.addClass('peoId').text(relevantContact[i].contId).attr('title', relevantContact[i].contId);
            $div_peoName.addClass('peoName').text(relevantContact[i].cName).attr('title', relevantContact[i].cName);
            $div_telephone1.addClass('telephone1').text(relevantContact[i].cphone1).attr('title', relevantContact[i].cphone1);
            $div_telephone2.addClass('telephone2').text(relevantContact[i].cphone2).attr('title', relevantContact[i].cphone2);
            $div_familyPhone.addClass('familyPhone').text(relevantContact[i].hmPhone).attr('title', relevantContact[i].hmPhone);
            $div_mobilePhone.addClass('mobilePhone').text(relevantContact[i].hdPhone).attr('title', relevantContact[i].hdPhone);
            $div_remarks.addClass('remarks').text(relevantContact[i].fMemo).attr('title', relevantContact[i].fMemo);
            $div_row.appendTo('#contact_content');
        }
    }
    
    function showBasicInformation(userInformation) {
		var isPay = userInformation.isPay;
		var isVideoCheck = userInformation.isVideoCheck;
		var engageTest = userInformation.engageTest;
		var nomRpt = userInformation.nomRpt;
		if(isPay !=null){
			isPay = ((isPay == 0)?"否":"是");
		}
		else{
			isPay = "";
		}
		if(isVideoCheck !=null){
			isVideoCheck = ((isVideoCheck == 0)?"否":"是");
		}
		else{
			isVideoCheck = "";
		}
		if(engageTest !=null){
			engageTest = ((engageTest == 0)?"否":"是");
		}
		else{
			engageTest = "";
		}
		if(nomRpt !=null){
			nomRpt = ((nomRpt == 0)?"否":"是");
		}
		else{
			nomRpt = "";
		}
		
        $("#userId").val(userInformation.userId);//用户编号
        $("#contact").val(userInformation.contact);//单位负责人
        $("#cMobile").val(userInformation.cMobile);//负责人手机

        $("#userName").val(userInformation.userName);//用户名称
        $("#rdClass").val(getUsrAlmType(userInformation.usrAlmType));//用户级别
        $("#PayNO").val(userInformation.payNO);//口令

        $("#userAddr").val(userInformation.userAddr);//用户地址
        $("#userType").val(userTypeTranse(userInformation.userType));//用户类型
        $("#businessName").val(userInformation.businessName);//用户行业

        $("#areaName").val(userInformation.areaName);//所属区域
        $("#serverType").val(userInformation.userServerTypeName);//服务类型
        $("#business_subName").val(userInformation.define1);//子行业

        $("#centerName").val(userInformation.platformName);//所属平台
        $("#isPay").val(isPay);//缴费状态*
        $("#createDate").val(userInformation.createDate);//录入时间

        $("#cPhone").val(userInformation.cPhone);//负责人电话
        $("#isVideoCheck").val(isVideoCheck);//短信转发*
        $("#operName").val(userInformation.operName);//录入人

        $("#pnlTel").val(userInformation.pnlTel);//联网电话
        $("#instDate").val(userInformation.instDate);//安装日期
        $("#engageTest").val(engageTest);//定期测试用户*

        $("#pnlHdTel").val(userInformation.pnlHdTel);//无线卡号
        $("#nomRpt").val(nomRpt);//定期撤布防用户*
        $("#fMemo").val(userInformation.fMemo);//备注
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
    function userTypeTranse(userTypeId){
        switch (userTypeId) {
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
})(window,jQuery);