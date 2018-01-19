$(document).ready(function () {
    init();
});

;
(function ($, window) {
    window.init = _init;

    var _config = {
        ajaxUrl: {
            getByPassData: '/WorkStation/getChildInfoByDevId.do',
            getUserData: '/WorkStation/getUserData.do'
        }
    };
    var _global = {
        top: parent.parent,
        userId: '',
        getAlarmInfosParams: {
            queryTond: {
                fuzzy: {
                    fuzzyKey: "all",
                    fuzzyValue: "",
                },
                areaId: "all",
                businessId: "all",
                userServerType: "all",
                nomRpt: "all",
                timeStart: "",
                timeEnt: ""
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'userId|DESC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        }
    };

    function _init() {
        _initData();
        _initEvent();
    }

    function _initData() {
        _getUserStateData();
        _getByPassData();
    }

    function _initEvent() {
        $('#close,#cancel').bind('click', function (e) {
            parent._closeUp2Popus();
        });
        $('.centen_centen_row', '#row_List').bind('click', function (e) {
            var $this = $(this);
            var check = $this.hasClass('row_checked');
            if (check) {
                $this.removeClass('row_checked');
            } else {
                $this.addClass('row_checked').siblings().removeClass('row_checked');
            }
        });
        $('#userData').bind('click', function (e) {
            $('body').loading();
            post_async({
                    "userId": _global.userId
                },_config.ajaxUrl.getUserData,
                _callback_getAlarmInfos);
        });

        $('#refresh').bind('click', function (e) {
            location.reload();
        });
    }

    function _callback_getAlarmInfos(data) {
        $('body').removeLoading();
        if (data.result.code == "200") {
            var jsondata = data.userInformation;
            _global.top.setSelectedJsonData(jsondata);//把行 的原始数据存入主页面
            _global.top.upPopusManager("../integratedQuery/userData/userData.html");
        }
    }

    function _getByPassData() {
        var devId = parent.iframeStateMonitor.getCurrentDevId();
        console.log(devId);
        var param = {};
        param.devId = devId;
        post_async(param, _config.ajaxUrl.getByPassData, _getByPassDataCallBack);
    }

    function _getByPassDataCallBack(data) {
        console.log(JSON.stringify(data));
        if (data.result.code == 200) {
            _showSubSysStatus(data.devStatus)
            var json = data.subSysList;
            clearRowList();
            for (var i = 0; i < json.length; i++) {
                _showByPass(json[i]);
            }
        }
    }

    function clearRowList() {
        $('#row_List').empty();
    }


    function _showByPass(row_json) {
        var $row = $('<div></div>');
        var $roleZoneName = $('<div></div>');
        var $State_row = $('<div></div>');
        var $operation_row = $('<div></div>');
        var $fMemo_row = $('<div></div>');

        $roleZoneName.addClass('scope_defenseNum_row').text(row_json.subSysId).appendTo($row);
        $State_row.addClass("State_row").text(row_json.subRange).appendTo($row);
        $fMemo_row.addClass('fMemo_row').text(row_json.fMemo).appendTo($row);
        var typeBF;
        if(row_json.isBF==1){
            typeBF = "布防";
        }else{
            typeBF = "撤防";
        }
        $operation_row.addClass('operation_row').text(typeBF).appendTo($row);
        $row.addClass('centen_centen_row').attr('id', row_json.devId).appendTo($('#row_List'));
    }

    function _getUserStateData() {
        var userId = parent.parent.iframeStateMonitor.getCurrentUserId();
        _global.userId = userId;
        console.log(userId);
    }
    function _showSubSysStatus(json){
        if(json==null){
            $('#isBF').removeClass('protectionColor').removeClass('removalColor').addClass('removalColor').text('撤防');
            var userId = parent.parent.iframeStateMonitor.getCurrentUserId();
            $('.title_1').text("用户编号：" + userId);
             return;
        }
        $('.title_1').text("用户编号：" + json.ownId);
            if (json.isBF != null && json.isBF != '' || json.isBF == 0) {
                if (json.isBF == 0) { //表示该用户当前状态是撤防，可以让他布防
                    $('#isBF').removeClass('protectionColor').removeClass('removalColor').addClass('removalColor').text('撤防');
                } else if (json.isBF == 1) { //表示该用户当前状态是布防，可以让他撤防
                    $('#isBF').removeClass('protectionColor').removeClass('removalColor').addClass('protectionColor').text('布防');
                }
            } else {
                $('#isBF').removeClass('protectionColor').removeClass('removalColor').text('未知');
            }

    }
})(jQuery, window);