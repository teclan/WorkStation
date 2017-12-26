
;(function(window,$,undefined){
    window.openOtherPopus = _openOtherPopups;         //打开弹窗
    window.closeOtherPopus = _closeOtherPopus;        //关闭弹窗

    function _openOtherPopups(url, iframSize) {
        var body=$('body');
        if ($("#mainDivOther").length > 0) {
            $("#mainDivOther").remove();
        }
        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        console.log("iframSizeWidth: " + iframSizeWidth);
        console.log("iframeSizeHeight: " + iframeSizeHeight);
        var mainDiv = $("<div></div>");
        var bottomDiv = $("<div></div>");
        var iframe = $("<iframe></iframe>");
        iframe.attr({
            name:'mainOtherIframe',
            src: url,
            scrolling: "no",
            width: iframSizeWidth,
            height: iframeSizeHeight,
            border: 0,
            frameborder: "no"
        });
        var bodyHeight = body.height();
        var bodyWidth = body.width();
        bodyHeight = body.height();
        bodyWidth = body.width();
        var iframeHeightCenter = (bodyHeight - iframeSizeHeight) ;
        var iframeWidthCenter = (bodyWidth - iframSizeWidth-5) ;
        iframeHeightCenter = parseInt(iframeHeightCenter);
        iframeWidthCenter = parseInt(iframeWidthCenter);
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);

        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            "width": iframSizeWidth + 'px',
            "height": iframeSizeHeight + 'px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "99999",
            "border-radius": "3px",
            "background-color": "#FFF"
        });
        mainDiv.attr({
            id: "mainDivOther"
        });
        body.resize(function () {
            bodyHeight = body.height();
            bodyWidth = body.width();
            bodyHeight = parseInt(bodyHeight);
            bodyWidth = parseInt(bodyWidth);
            iframeHeightCenter = (bodyHeight - iframeSizeHeight) ;
            iframeWidthCenter = (bodyWidth - iframSizeWidth) ;
            mainDiv.css({
                "top": iframeHeightCenter + 'px',
                "left": iframeWidthCenter + 'px'
            });
        });
        mainDiv.append(iframe);
        body.append(mainDiv);
    }

    function _closeOtherPopus() {
        $("#mainDivOther").remove();
    }

})(window,jQuery);