/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    //重绘一次布局，然后再设置页面的resize事件
    resizeDocment(); //重绘函数
    $(window).resize(function () {
        resizeDocment(); //重绘函数
    });
    init();
});

;
(function ($, window) {
    window.resizeDocment = _resizeDocment; //修改页面大小
    window.init = _init;
    window.pluginsPage = _pluginsPage;
    window.getCurrentGroupData = _getCurrentGroupData;
    window.getUserStateList = _getUserStateList;
    window.clearSearchTitle = _clearSearchTitle;
    window.allUserClick = _allUserClick;
    window.getCurrentUserId = _getCurrentUserId;
    window.getCurrentDevId = _getCurrentDevId;

    var _config = {
        minWidth: 1160,
        minHeight: 765,
        ajaxUrl: {
            getUserStateList: '/WorkStation/eventDock/getUserStateListByWorkStation.do',
        }
    };

    var _global = {
        plugins: {
            page: null
        },
        pageInfoPojo: {
            currentPage: '1',
            pageSize: '45',
            totalNum: '',
            totalPage: ''
        },
        currentGroupData: null,
        currentClickUserId: '',
        currentClickDevId:'',
        top:parent,
        queryValue:'',
        checkId:'',
    };

    //重绘布局
    function _resizeDocment() {
        var $body = $('body');
        $body.css('overflow-y', 'hidden');
        $body.css('overflow-x', 'hidden');
        var DocHeight = $(window).height();
        var DocWidth = $(window).width();
        var main = {
            width: 0,
            height: 0
        };
        var nav = {
            widht: 0
        };

        DocHeight = parseInt(DocHeight);
        DocWidth = parseInt(DocWidth);
        $body.width(DocWidth);
    }

    var Interval =  null;//用户状态的定时刷新

    function _init() {
        _initEven();
        // _initData();
    }

    function _initEven() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });

        $('.search_check > label').bind('click', function (e) {
            var isCheck = $(this).children('span').hasClass('isCheck');
            if (isCheck) {
                $(this).children('span').removeClass('isCheck').addClass('noCheck');
                _getUserStateList();
            } else {
                $(this).children('span').removeClass('noCheck').addClass('isCheck');
                $(this).siblings().children('span').removeClass('isCheck').addClass('noCheck');
                _getUserStateList();
            }

        })

        $('#policeCheck').bind('click', function (e) {
            _getUserStateList();
        });

        _getUserStateList();
    }

    function getUserStateListPoll() {
        var parma = {};
        parma.queryValue = _global.queryValue;
        parma.checkId = _global.checkId;
        parma.pageInfoPojo = {};
        parma.pageInfoPojo.pageSize = _global.pageInfoPojo.pageSize;
        parma.pageInfoPojo.currentPage = _global.pageInfoPojo.currentPage;
        $('#contentRight').loading();
        clearInterval(Interval);
        post_async(parma, _config.ajaxUrl.getUserStateList, callbackUserStateList);
    }

    function _allUserClick() {
        $("#allUser").click();
    }

    function _clearSearchTitle() {
        $('#searchInput').val("");
        $('.search_check > label').children('.isCheck').removeClass('isCheck').addClass('noCheck');
        $('.search_check > label :first').children('span').removeClass('noCheck').addClass('isCheck');
    }

    function _getCurrentGroupData() {
        return _global.currentGroupData;
    }

    function _getCurrentUserId() {
        return _global.currentClickUserId;
    }

    function _getCurrentDevId() {
        return _global.currentClickDevId;
    }



    function _getUserStateList() {
        var parma = {};
        parma.queryValue = $('#searchInput').val();
        var checkId = $('#search_check > label').children('.isCheck').attr('id');
        parma.checkId = checkId == undefined ? '' : checkId;
        _global.queryValue=parma.queryValue;
        _global.checkId=parma.checkId;
        parma.pageInfoPojo = {};
        parma.pageInfoPojo.pageSize = _global.pageInfoPojo.pageSize;
        parma.pageInfoPojo.currentPage = 1;
        $('#contentRight').loading();
        clearInterval(Interval);
        post_async(parma, _config.ajaxUrl.getUserStateList, callbackUserStateList);
    }


    function callbackUserStateList(data) {
        $('#contentRight').removeLoading();
        if (data.result.code == 200) {
            clearSearchList();
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.pageInfoPojo.currentPage = currentPage;
            _global.pageInfoPojo.totalNum = totalNum;
            _global.pageInfoPojo.totalPage = totalPage;
            if (totalNum == 0) totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                showUserStateList(json[i]);
            }
        }
        Interval = setInterval(getUserStateListPoll, 20000);
    }

    function showUserStateList(json) {
        var $stateDiv = $('<div></div>');
        var $stateText = $('<div></div>');
        var $statebuttom = $('<div></div>');
        var $stateUserName = $('<div></div>');
        var $stateUserNum = $('<div></div>');

        var $text = '';
        var color = '';
        if (json.isActivation == 1) {
            if (json.isTimeout == 1) {
                $text = '离线';
                color = 'offlineColor';
            } else {
                if (json.isBYpass > 0) {
                    if ($text == '') {
                        $text = '旁路';
                        color = 'theBypassColor';
                    } else {
                        $text = $text + '/旁路';
                    }
                }
                if (json.isBF == 1) {
                    if ($text == '') {
                        $text = '布防';
                        color = 'protectionColor';
                    } else {
                        $text = $text + '/布防';
                    }
                } else if (json.isBF == 0) {
                    if ($text == '') {
                        color = 'removalColor';
                        $text = '撤防';
                    } else {
                        $text = $text + '/撤防';
                    }
                }
            }
        } else {
            $text = '未使用';
            color = 'unusedColor';
        }
        if ($text == '' && color == '') {
            $text = "其他";
            color = "otherColor";
        }

        $stateDiv.addClass('stateDiv').attr('id', json.userId + ","+json.devId );
        $stateText.addClass('stateText').text($text);
        $statebuttom.addClass('statebuttom ' + color + ' ');
        $stateUserName.addClass('stateUserName').text(json.userName == null ? '' : json.userName).attr('title', json.userName == null ? '' : json.userName);
        $stateUserNum.addClass('stateUserNum').text(json.userId);
        $stateText.appendTo($stateDiv);
        $stateUserName.appendTo($statebuttom);
        $stateUserNum.appendTo($statebuttom);
        $statebuttom.appendTo($stateDiv);
        $stateDiv.appendTo($('#searchList'));
        $stateDiv.bind('click', function (e) {
            var arry = $(this).attr('id').split(",");
            _global.currentClickUserId = arry[0];
            _global.currentClickDevId = arry[1];
            _global.top.upPopus2Manager("../stateMonitor/UserData/UserData.html");
        });
    }

    function clearSearchList() {
        $('#searchList').empty();
    }

    function _queryData_page(page) {

        _global.pageInfoPojo.currentPage = page;
        var parma = {};
        parma.queryValue = _global.queryValue;
        parma.checkId = _global.checkId;
        parma.pageInfoPojo = {};
        parma.pageInfoPojo.pageSize = _global.pageInfoPojo.pageSize;
        parma.pageInfoPojo.currentPage = page;
        $('#contentRight').loading();
        clearInterval(Interval);
        post_async(parma, _config.ajaxUrl.getUserStateList, callbackUserStateList);
    }

    function _pluginsPage() {
        return _global.plugins.page;
    }

})(jQuery, window);