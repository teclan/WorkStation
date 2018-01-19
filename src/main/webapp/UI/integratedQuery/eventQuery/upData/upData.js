/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.init = _init;
    function _init() {
        _initData();    //初始化数据
        _initEven();    //初始化事件
    }
    function _initData() {
        var nowTime = getNowFormatDate();
        var startTime = getBeforeWeekFormatDate();
        nowTime =nowTime.split(" ")[0];
        startTime =startTime.split(" ")[0];
        $("#startTime").val(startTime);
        $('#startTime').click(function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
        });
        $("#endTime").val(nowTime);
        $('#endTime').click(function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
        });
    }
    function _initEven() {
        /************************************************
         关闭按钮点击事件，触发解锁
         ************************************************/
        $("#close,#cancel").bind('click', function() {
            parent.closeupPopus();
        });
        /************************************************
         确定按钮
         ************************************************/
        $("#sure").bind('click', function() {
            var startTime=new Date($("#startTime").val());
            var endTime=new Date($("#endTime").val());
            var days = endTime.getTime() - startTime.getTime();
            var day = parseInt(days / (1000 * 60 * 60 * 24));
            if(day>7)
            {
                parent.alertFail("选择的日期跨度不可以超过7天!",2000,null);
                return;
            }
            else{
                parent.updateEvent({
                    startTime:$("#startTime").val()+"T00:00:00",
                    endTime:$("#endTime").val()+"T23:59:59",
                })
                parent.closeupPopus();
            }
        });
    }

})(jQuery, window);

