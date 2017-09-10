/**
//=======================================================================================================
//---------------------------------------HT-网页放大镜插件说明---------------------------------------------
//=======================================================================================================
/**
 *名称：HT-网页放大镜
 *版本：V2.1.3
 *时间：2016年09月20日
 *作者：CN-Tower
 *邮箱：247114045@qq.com
 *微博：@CN-Tower
 *GitHub：CN-Tower
*/

//=======================================================================================================
//-------------------------------------------放大镜插件开始------------------------------------------------
//=======================================================================================================

if (typeof jQuery === 'undefined') importJquery();                        //引入jQuery
if (typeof html2canvas === 'undefined') importHtml2CanvasJs();            //引入html2canvas

$(function () {
    (function () {
        //-------------------------------------------------------------------------
        //-------------------------------参数和变量---------------------------------
        //-------------------------------------------------------------------------
        var $win = $(window);
        var $document = $(document);
        var $body = $document.find("body");
        var $html = $document.find("html");
        var $getter = $("<div id='getter'></div>");                       //创建拾取器元素
        var $show = $("" +                                                //创建显示窗元素
            "<div id='show'>" +
            "<div id='hd'></div>" +
            "<div id='show_area'><img src='#' id='ifo'></div>" +
            "</div>" +
            "");
        var $img = $("" +                                                 //创建显示窗控件元素
            "<img src='./magnifier/imgs/bg.png'>" +
            "<img src='./magnifier/imgs/close_0.png'>" +
            "<img src='./magnifier/imgs/minus_0.png'>" +
            "<img src='./magnifier/imgs/plus_0.png'>" +
            "");
        var $sbar = $("<img id='s_bar' src='./magnifier/imgs/bar.png'>");
        var $hd = $show.find("#hd");
        var $ifo = $show.find("#ifo");
        var $imgs = $($img, $ifo, $sbar);
        var cx, cy, px, py, ox, oy, aFactor, wFactor, hFactor;
        var windowW = $win.width();
        var windowH = $win.height();
        var bodyW = $document.width();
        var bodyH = $document.height();
        if (bodyW < windowW) bodyW = windowW;
        if (bodyH < windowH) bodyH = windowH;

        //-------------------------------------------------------------------------
        //------------------------------定义控件样式--------------------------------
        //-------------------------------------------------------------------------
        $sbar.css({
            width: "51px",
            height: "51px",
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 99999
        })
        //消除body无背景颜色时显示为黑色的BUG
        if ($body.css("backgroundColor") == "transparent" && $body.css("backgroundImage") == "none") {
            $body.css("background", "white");
        }
        //定义网页body样式，并消除一些BUG
        $body.css({
            position: "absolute",
            width: "100%",
            top: "0",
            left: "0"
        }).attr("ondragstart", "return false")    //消除鼠标左键拖动图片的BUG
            .mousemove(function (e) {             //设置拾取器跟随鼠标移动
                cx = e.clientX;
                cy = e.clientY;
                px = e.pageX;
                py = e.pageY;
                $getter.css({
                    top: py - hFactor,
                    left: px - wFactor
                });
                $ifo.css({
                    top: -(py - hFactor) * aFactor,
                    left: -(px - wFactor) * aFactor
                });
            }).append($sbar);
        //定义拾取器样式
        $getter.css({
            width: "400px",
            height: "316px",
            position: "absolute",
            background: "orange",
            opacity: "0.4",
            zIndex: "1000",
            display: "none",
            cursor: "crosshair"
        });
        //定义关联参数和放大参数（这两个参数的定义必需在拾取器样式定义完之后）
        wFactor = parseInt($getter.css("width")) / 2;
        hFactor = parseInt($getter.css("height")) / 2;
        aFactor = 516 / parseInt($getter.css("width"));
        //定义放大图片样式
        $ifo.css({
            width: bodyW * aFactor,
            height: bodyH * aFactor,
            zIndex: "1003",
            position: "absolute"
        });
        //定义显示窗控件的样式和响应事件
        $img.eq(0).css({
            zIndex: "1001",
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
        }).end().eq(1).css({
            width: "51px",
            height: "51px",
            zIndex: "1010",
            position: "absolute",
            top: "22px",
            left: "452px"
        }).mouseenter(function () {
            $(this).css("cursor", "pointer").attr("src", "./magnifier/imgs/close_1.png")
        }).mouseleave(function () {
            $(this).css("cursor", "auto").attr("src", "./magnifier/imgs/close_0.png")
        }).end().eq(2).css({
            width: "51px",
            height: "51px",
            zIndex: "1010",
            position: "absolute",
            top: "250px",
            left: "40px"
        }).mouseenter(function () {
            $(this).css("cursor", "pointer").attr("src", "./magnifier/imgs/minus_1.png")
        }).mouseleave(function () {
            $(this).css("cursor", "auto").attr("src", "./magnifier/imgs/minus_0.png")
        }).end().eq(3).css({
            width: "51px",
            height: "51px",
            zIndex: "1010",
            position: "absolute",
            top: "250px",
            left: "452px"
        }).mouseenter(function () {
            $(this).css("cursor", "pointer").attr("src", "./magnifier/imgs/plus_1.png")
        }).mouseleave(function () {
            $(this).css("cursor", "auto").attr("src", "./magnifier/imgs/plus_0.png")
        });
        //定义显示窗及一些子元素的样式
        $show.css({
            width: "537px",
            height: "508px",
            position: "fixed",
            top: "50px",
            left: "500px",
            overflow: "hidden",
            zIndex: "1001",
            display: "none"
        }).children("#hd").css({
            width: "537px",
            height: "90px",
            position: "absolute",
            zIndex: "1002",
            top: "0",
            left: "0"
        }).end().children("#show_area").css({
            width: "516px",
            height: "400px",
            overflow: "hidden",
            zIndex: "1002",
            position: "absolute",
            top: "95px",
            left: "10px",
            borderRadius: "6px"
        }).end().append($img);

        //-------------------------------------------------------------------------
        //------------------------------定义响应事件--------------------------------
        //-------------------------------------------------------------------------
        $sbar.mousedown(function (e) { //移动插件图标
            ox = e.offsetX;
            oy = e.offsetY;
            $document.on("mousemove", moveSBarFun)
        }).mouseup(function () {
            $document.off("mousemove", moveSBarFun)
        })
        function moveSBarFun() {
            $sbar.css({
                top: cy - oy + "px",
                left: cx - ox + "px"
            })
        }

        $hd.mousedown(function (e) {   //移动显示窗
            ox = e.offsetX;
            oy = e.offsetY;
            $document.on("mousemove", moveShowWinFun)
        }).mouseup(function () {
            $document.off("mousemove", moveShowWinFun)
        });
        function moveShowWinFun() {
            $show.css({
                top: cy - oy + "px",
                left: cx - ox + "px"
            })
        }

        $img.eq(1).click(function () { //关闭显示窗
            $show.css("display", "none");
            $getter.css("display", "none");
            $ifo.attr("src", "");
        });

        var w, h, t = 4;
        $img.eq(2).click(function () { //加大放大倍数
            t++;
            if (t > 16) t = 16;
            w = t * 100 + "px";
            h = t * 78 + "px";
            $getter.css({
                width: w,
                height: h
            });
            wFactor = parseInt($getter.css("width")) / 2;
            hFactor = parseInt($getter.css("height")) / 2;
            aFactor = 516 / parseInt($getter.css("width"));
            $ifo.css({
                width: bodyW * aFactor,
                height: bodyH * aFactor
            })
        });

        $img.eq(3).click(function () { //减小放大倍数
            t--;
            if (t < 1) t = 1;
            w = t * 100 + "px";
            h = t * 78 + "px";
            $getter.css({
                width: w,
                height: h
            });
            wFactor = parseInt($getter.css("width")) / 2;
            hFactor = parseInt($getter.css("height")) / 2;
            aFactor = 516 / parseInt($getter.css("width"));
            $ifo.css({
                width: bodyW * aFactor,
                height: bodyH * aFactor
            });
        });
        
        

        $sbar.dblclick(function () {           //定义调用放大镜的方法（在起动器上双击）
            $show.css("display", "none");      //消除二次调用取到显示窗的BUG
            $getter.css("display", "none");    //消除二次调用取到拾取器的BUG
            //消除滚动后，不能获取全屏的BUG
            $($html, $body).scrollLeft("0").animate({scrollTop: "0"}, "fast", function () {
                html2canvas($html, {
                onrendered: function (canvas) {//调用html2canvas插件，把body副本渲染canvas元素
                        var url = canvas.toDataURL("image/jpeg", 1);      //导出canvas为jpg格式的body快照
                        $ifo.attr("src", url);                            //把body快照传入显示窗的显示图片
                    }
                });
                $body.append($getter).find($getter).fadeIn("slow").end()
                    .append($show).find($show).fadeIn("slow");
            })
        });
    }());
});



