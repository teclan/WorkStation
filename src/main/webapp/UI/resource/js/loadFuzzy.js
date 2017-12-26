/**
 * Created by ywhl on 2017/8/25.
 */
function _openLoad(body, url, iframSize) {

    if ($("#upBottomDiv").length > 0) {
        $("#upBottomDiv").remove();
    }
    var iframSizeWidth = iframSize.width;
    var iframeSizeHeight = iframSize.height;
    console.log("iframSizeWidth: " + iframSizeWidth);
    console.log("iframeSizeHeight: " + iframeSizeHeight);
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
        "width":1000+ bodyWidth + "px",
        "height":1000+ bodyHeight + "px",
        "display": "inline-block",
        "position": "absolute",
        "z-index": "199",
        /*"background-color": "black",*/

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
    });
    body.append(bottomDiv);
}

function _closeLoad() {
    $("#upBottomDiv").remove();
}