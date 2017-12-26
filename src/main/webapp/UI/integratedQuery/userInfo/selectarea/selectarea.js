/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;

function closeselectarea(){
    /*parent._closePopus();*/
    if(parent._closeUpPopus){
        parent._closeUpPopus();
    }
    /*if(parent.closeMapPopus){
        parent.closeMapPopus();
    }*/

}
var curTreeNode=null;
function zTreeOnClick(event, treeId, treeNode){
    /*debugger;*/
    if(treeNode.id=="DEFAULTDIR"){
        curTreeNode=" ";
    }
    else curTreeNode=treeNode;
}
function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../RDAcenter/getRulaArea.do";
}

var setting = {
    async: {
        enable: true,
        url:"/../RDAcenter/getAreaList.do",
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID()},
        dataFilter: filter
    },
    view: {
        showIcon: false
    },
    callback: {
    	beforeExpand : areaTreeBeforeExpand,
        onClick: zTreeOnClick
    },
    data : {
		simpleData : {
			enable : true,
			idKey : "id",
			pIdKey : "pId",
			rootPId : 0
		}
	}
};

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
    	childNodes[i].open = true;
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function getZTreeUserID(){          //????????????

    var returnData = null;
    if(parent.getLoginUserName && typeof (parent.getLoginUserName) == 'function' ){
        returnData =parent.getLoginUserName();
    }
    if(parent.parent.parent.getLoginUserName && typeof (parent.parent.parent.getLoginUserName) == 'function' ){
        returnData = parent.parent.parent.getLoginUserName();
    }
  /*  var userId = returnData.userId;
    return userId;*/
}

$(document).ready(function(){



	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
    $("#close,#cancel").click(function(){
        closeselectarea();});
    $("#sure").click(function(){
        if(curTreeNode)
       /* parent.getArea(curTreeNode.name);*/
           
            parent.iframeAllManager.userInfoIframe.getArea(curTreeNode);
            closeselectarea()
    });
});
