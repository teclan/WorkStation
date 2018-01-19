
;(function (window, $, undefined) {
    window.openProcesserPopups = _openProcesserPopups;
    window.closeProcesserPopus = _closeProcesserPopus;
    window.stopProcesser = _stopProcesser;
    window._setSleepTime = _setSleepTime;

    var _global = {
        sleepTime:100,
        stop:false,
        b:0,
    }
    function _openProcesserPopups(body,color,sleepTime) {
        if(color.length==0){
            color="#4BBEED";
        }
        if(sleepTime>0){
            _global.sleepTime=sleepTime;
        }
        if ($("#processerDiv").length > 0) {
            $("#processerDiv").remove();
        }
        if ($("#bottomProcesserDiv").length > 0) {
            $("#bottomProcesserDiv").remove();
        }
        var processerDiv = $("<div></div>");
        var bottomProcesserDiv = $("<div></div>");

        bottomProcesserDiv.attr({
            id: "bottomProcesserDiv"
        });
        bottomProcesserDiv.css({
            "opacity": 0.1,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "999",
            "background-color": "black",

        });
        processerDiv.css({
            "top": 'calc(48%)',
            "left": 'calc(50% - 100px)',
            "width": '22px',
            "height": '200px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "100",
            "border-radius": "3px",
            "background-color": "#FFF"
        });
        processerDiv.attr({
            id: "processerDiv"

        });

        var probar=$("<div id='probar'></div>");
        var percent=$("<span id='percent'></span>");
        var line=$("<div id='line' w='100' style='width:0px;'></div>");
        probar.css({
            float:'left',
            width:'200px',
            background:'#FFF',
            border:'2px solid '+color,
            height:'20px',
            'border-radius':'0px',
            position:'absolute',
            });
        percent.css({
            position:'absolute',
            left:'0px',
            display:'inline-block',
            color:'#fff',
            'font-size':'16px',
        });
        line.css({
            float:'left',
            height:'20px',
            overflow:'hidden',
            background:color,
            'border-radius':'0px',
        });

        processerDiv.append(probar);
        probar.append(percent);
        probar.append(line);

        body.append(bottomProcesserDiv);
        body.append(processerDiv);
        processerbar();
        /*bottomProcesserDiv.click(function(){
            _stopProcesser();
        });*/
    }
    function si(){
        var time = window.setInterval(function(){
            var a=$("#line").width();
            $("#percent").html(_global.b+"%");
            $("#percent").css({"left":(a-40)+"px"});
            if(!_global.stop){
                if(_global.b>95){
                    $("#line").stop();
                }else{
                    var c=parseInt(_global.b)+1;
                    $("#line").animate({
                        width: c+"%"
                    },_global.sleepTime);
                    _global.b=c;
                }
            }
            else{
                $("#line").animate({
                    width: "100%"
                },_global.sleepTime);
                $("#percent").html("100%");
                clearInterval(time);
            }
            if(_global.b==100) {
                clearInterval(time);
            }
        },_global.sleepTime);
    }

    function processerbar(){
        $("#probar").css({"display":"block"});
        si();
    };
    function _setSleepTime(sleepTime) {
        _global.sleepTime=sleepTime;
    }
    function _stopProcesser() {
        _global.sleepTime=100;
        _global.stop=true;
        processerbar();
        _closeProcesserPopus();
    }
    function _closeProcesserPopus() {
        $("#processerDiv").remove();
        $("#bottomProcesserDiv").remove();
    }
})(window, jQuery, undefined);

