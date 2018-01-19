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
    var areaId ="all";
    var _config = {
        minWidth: 3045,
        minHeight: 765,
        ajaxUrl: {
            ownerslist: '/WorkStation/eventDock/ownerslist.do',

        }
    };
      var _globalH = {
          getAlarmInfosParams: {
              queryTond: {
                  "userIds":[], // 查询的机主用户ID列表，数组为空时返回所有
                  "userName":"", // 指定关键字模糊查询此字段，下方字段与此相同，字段可不写或设置为null或为空字符串均忽略
                  "userAddr":"",
                  "areaName":"",
                  "contact":"",
                  "cPhone":"",
                  "cMobile":"",
                  "pnlTel":"",
                  "pnlHdTel":""
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
            queryTond: {
                "userIds":[], // 查询的机主用户ID列表，数组为空时返回所有
                "userName":"", // 指定关键字模糊查询此字段，下方字段与此相同，字段可不写或设置为null或为空字符串均忽略
                "userAddr":"",
                "areaName":"",
                "contact":"",
                "cPhone":"",
                "cMobile":"",
                "pnlTel":"",
                "pnlHdTel":""
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
        var contentWidth = $content.width()
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
        $(".timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH();
        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        $("#policeCheck").bind('click',function () {
            _searchuserInfo();
        });


        $("#policeRemove").bind('click',function () {
            parent.parent.okAndCancel("确认同步资料？",function () {
                submit();
            },null);
        });
        $("#btn-export").click(function(){
            var params = {
                "queryTond":{
                    "userIds":[], // 查询的机主用户ID列表，数组为空时返回所有
                    "userName":$("#userName").val(), // 指定关键字模糊查询此字段，下方字段与此相同，字段可不写或设置为null或为空字符串均忽略
                    "userAddr":$("#userAddr").val(),
                    "areaName":"",
                    "contact":"",
                    "cPhone":"",
                    "cMobile":"",
                    "pnlTel":"",
                    "pnlHdTel":""
                },
                "pageInfoPojo": {
                    "pageSize":25, // 每页记录数
                    "currentPage":1, // 请求第几页
                    "sort":"ASC" // 排序方式，按 userName 排序，默认升序
                }
                , "headers":[]
            };
            var url = "/WorkStation/ExportExcel/UserInfoExcel.do";
            //window.location.href= url+'?params='+JSON.stringify(params);

            window.open(url+'?params='+JSON.stringify(params), "_blank");
            _global.top.alertSuccess("正在导出，请稍等！",1000,null);
        });
    }

      function submit() {
          parent.parent.openProcePopups('',100);
          var data=post_sync(null,"/WorkStation/eventDock/updateOwners.do");
          if(data.code=='200'){
              parent.parent.alertSuccess("操作成功!",2000,null);
              _searchEventInfo();
              parent.parent.stopProce();
          }
          else{
              parent.parent.stopProce();
              parent.parent.alertSuccess(data.message,2000,null);
          }
      }
    function _searchEventInfo() {
        _searchuserInfo();
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;
        $div_row = $("<tr></tr>");
        $div_accountNum = $("<td></td>");
        $div_accountName = $("<td></td>");
        $div_accountAddr = $("<td></td>");
        $div_contact = $("<td></td>");
        $div_cPhone = $("<td></td>");
        $div_cMobile = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_pnlTel_subName = $("<td></td>");//联网电话
        $div_row
            .append($div_accountNum)
            .append($div_accountName)
            .append($div_accountAddr)
            .append($div_contact)
            .append($div_cPhone)
            .append($div_cMobile)
            .append($div_areaName)
            .append($div_pnlTel_subName)
            .addClass('table_row')
            .attr('id', jsonData.eventNum);
        $div_accountNum.addClass("table_item_4").text(row_json.userId).attr("title", row_json.userId);
        $div_accountName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_accountAddr.addClass("table_item_userName").text(row_json.userAddr).attr("title", row_json.userAddr);
        $div_contact.addClass("table_item_5").text(row_json.contact).attr("title", row_json.contact);
        $div_cPhone.addClass("table_item_5").text(row_json.cPhone).attr("title", row_json.cPhone);
        $div_cMobile.addClass("table_item_5").text(row_json.cMobile).attr("title", row_json.cMobile);
        $div_areaName.addClass("table_item_4").text(row_json.areaName).attr("title", row_json.areaName);
        $div_pnlTel_subName.addClass("table_item_4").text(row_json.pnlTel).attr("title", row_json.pnlTel);//新添加的字段，子行业 $div_pnlTel_subName
        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
        $div_row.bind('dblclick', function (e) {
            _global.top.setSelectedJsonData(jsonData);//把所选行 的原始数据存入主页面
            _global.top.upPopusManager("../integratedQuery/userData/userData.html");

        });
    }

    function _getAlarmInfosParams() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getAlarmInfosParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _gettimeReceptacle();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }

    function _getAlarmInfos(queryTond,pageInfoPojo) {
        _global.getAlarmInfosParams.queryTond = queryTond;
        _global.getAlarmInfosParams.pageInfoPojo = pageInfoPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        var params = _getAlarmInfosParams();
        $("body").loading();
        post_async(params, _config.ajaxUrl.ownerslist, _callback_getAlarmInfos);
    }

      function _getAlarmInfosH() {
          _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
          $('body').loading();
          var params = _getAlarmInfosParams();
          post_async(params, _config.ajaxUrl.ownerslist, _callback_getAlarmInfos);
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
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                 addTableRow(json[i]);
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
        var params = _getAlarmInfosParams();
        $('body').loading();
        post_async(params, _config.ajaxUrl.ownerslist, _callback_getAlarmInfos);
    }

    function _searchuserInfo() {
        var  queryTond = {
            "userIds":[], // 查询的机主用户ID列表，数组为空时返回所有
            "userName":$("#userName").val(), // 指定关键字模糊查询此字段，下方字段与此相同，字段可不写或设置为null或为空字符串均忽略
            "userAddr":$("#userAddr").val(),
            "areaName":"",
            "contact":"",
            "cPhone":"",
            "cMobile":"",
            "pnlTel":"",
            "pnlHdTel":""
        };
        var pageInfoPojo={
            "pageSize":25, // 每页记录数
                "currentPage":1, // 请求第几页
                "sort":"ASC" // 排序方式，按 userName 排序，默认升序
        };
       _getAlarmInfos(queryTond,pageInfoPojo);

    }
      function _gettimeReceptacle() {
         var pass="";
         if($("#timePng").hasClass("timePngchange")){
             pass="DESC"
         }
         else {
             pass="ASC"
         }
         return pass;
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
                  /* col2[i].style.width="100px";
                   col1[i].style.width="100px";*/
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

