function _openUpPopups(body, url, iframSize) {

    if ($("#upMainDiv").length > 0) {
        $("#upMainDiv").remove();
    }
    if ($("#upBottomDiv").length > 0) {
        $("#upBottomDiv").remove();
    }
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    console.log("iframSizeWidth: " + iframSizeWidth);
    console.log("iframeSizeHeight: " + iframeSizeHeight);
    var mainDiv = $("<div></div>");
    var bottomDiv = $("<div></div>");
    var iframe = $("<iframe></iframe>");
    iframe.attr({
        id:'upMainDivIframe',
        name:'upMainDivIframe',
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
        id: "upBottomDiv"
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
        "z-index": "199",
        "background-color": "black",

    });
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px',
        "width": iframSizeWidth + 'px',
        "height": iframeSizeHeight + 'px',
        "display": "inline-block",
        "position": "absolute",
        "z-index": "200",
        "border-radius": "3px",
        "background-color": "#FFF"

    });
    mainDiv.attr({
        id: "upMainDiv"

    });

    body.resize(function () {
        console.log('resize body');
        bodyHeight = body.height();
        bodyWidth = body.width();
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.css({
            "width": bodyWidth + "px",
            "height": bodyHeight + "px"
        });
        var iframeSizeHeight = iframe.height();
        var iframSizeWidth = iframe.width();
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
        /*bottomDiv.bind('click',function () {
            _closePopus();
        });*/
    }

function _openUp2Popups(body, url, iframSize) {

    if ($("#up2MainDiv").length > 0) {
        $("#up2MainDiv").remove();
    }
    if ($("#up2BottomDiv").length > 0) {
        $("#up2BottomDiv").remove();
    }
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    console.log("iframSizeWidth: " + iframSizeWidth);
    console.log("iframeSizeHeight: " + iframeSizeHeight);
    var mainDiv = $("<div></div>");
    var bottomDiv = $("<div></div>");
    var iframe = $("<iframe></iframe>");
    iframe.attr({
        id:'up2MainDivIframe',
        name:'up2MainDivIframe',
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
        id: "up2BottomDiv"
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
        "z-index": "179",
        "background-color": "black",

    });
    mainDiv.css({
        "top": iframeHeightCenter + 'px',
        "left": iframeWidthCenter + 'px',
        "width": iframSizeWidth + 'px',
        "height": iframeSizeHeight + 'px',
        "display": "inline-block",
        "position": "absolute",
        "z-index": "180",
        "border-radius": "3px",
        "background-color": "#FFF"



    });
    mainDiv.attr({
        id: "up2MainDiv"

    });

    body.resize(function () {
        console.log('resize body');
        bodyHeight = body.height();
        bodyWidth = body.width();
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.css({
            "width": bodyWidth + "px",
            "height": bodyHeight + "px"
        });
        var iframeSizeHeight = iframe.height();
        var iframSizeWidth = iframe.width();
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
    /*bottomDiv.bind('click',function () {
     _closePopus();
     });*/
}

function _closeUp2Popus() {
    $("#up2MainDiv").remove();
    $("#up2BottomDiv").remove();
}

    function _closeUpPopus() {
        $("#upMainDiv").remove();
        $("#upBottomDiv").remove();
    }
function _closeUp2Popus() {
    $("#up2MainDiv").remove();
    $("#up2BottomDiv").remove();
}

    function _changeUpSize(iframSize){
        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        var body = $("body");
        var bottomDiv = $("#upBottomDiv");
        var mainDiv = $("#upMainDiv");
        var iframe =  $("#upMainDivIframe");
        iframe.css({
            "width": iframSizeWidth +'px',
            "height": iframeSizeHeight + 'px'
        })


        console.log('resize body');
        bodyHeight = body.height();
        bodyWidth = body.width();
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.css({
            "width": bodyWidth + "px",
            "height": bodyHeight + "px"
        });
        var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
        var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            'width': iframSizeWidth + 'px',
            'height': iframeSizeHeight + 'px'
        });
    }

