$.fn.hello = function () {
    console.log(this);
};

/*****************************************************************/
/*****************************封装大方法*****************************/
/*****************************************************************/
/**
 * 设置元素可拖拽
 * @param callback
 */
$.fn.canDrag = function (callback) {
    var $el = $(this);
    var mX = 0, mY = 0, isDrag = false;
    //鼠标按下
    $el.on('mousedown', function (e) {
        mX = e.pageX - $el[0].offsetLeft;//鼠标按下点与元素最左边距离
        mY = e.pageY - $el[0].offsetTop;//鼠标按下点与元素最右边距离
        isDrag = true;
    });
    //鼠标移动
    $el[0].onmousemove = function (ev) {
        var moveX = 0, moveY = 0;
        if (isDrag) {
            moveX = ev.pageX - mX;
            moveY = ev.pageY - mY;

            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;
            var elW = $el.innerWidth();
            var elH = $el.innerHeight();

            var maxY = innerHeight - elH;
            var maxX = innerWidth - elW;

            moveX = Math.min(maxX, Math.max(0, moveX));
            moveY = Math.min(maxY, Math.max(0, moveY));

            $el.css({
                left: moveX,
                top: moveY,
                cursor: "move"
            })
        }
        //拖拽回调函数
        if (callback && typeof(callback) === "function") {
            callback();
        }

    };
    //鼠标松开
    $el[0].onmouseup = function (ev) {
        isDrag = false;
    }
};

/**
 * 动画封装方法
 * @param cssJson
 * @param callback
 */
$.fn.anim = function (cssJson, callback) {
    var $el = $(this);
    var isOver = true;
    clearInterval($el[0].timer);
    $el[0].timer = setInterval(function () {
        for (var attr in cssJson) {
            var attrValue = parseFloat($el.css(attr));
            if (attr === 'opacity') {
                attrValue = Math.round(attrValue * 100);
            }
            var speed = (Math.round(cssJson[attr]) - attrValue) / 15;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (attrValue != Math.round(cssJson[attr])) {
                isOver = false;
            } else {
                isOver = true;
            }
            if (attr === 'opacity') {
                $el.css(attr, (attrValue + speed) / 100);
            } else {
                $el.css(attr, Math.ceil(attrValue + speed));
            }
        }
        if (isOver) {
            clearInterval($el[0].timer);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }
    }, 30);
};


/*****************************************************************/
/*****************************尺寸相关*****************************/
/*****************************************************************/
/**
 * 元素在窗口尺寸变化时回调函数
 * @param callback
 */
$.onSizeChange = function (callback) {
    var timer = null;
    $(window).resize(function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            //回调函数
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }, 50);
    });
};

/**
 * 元素自动于窗口宽高百分比处（窗口尺寸变化时亦可）
 * @param perX
 * @param perY
 */
$.fn.autoInWin = function (perX, perY) {
    var self = this;
    $(this).inWindow(perX, perY);
    $.onSizeChange(function () {
        $(self).inWindow(perX, perY);
    })
    return this;
};

/**
 * 元素自动填满视口（窗口尺寸变化时亦可）
 */
$.fn.autoFillWindow = function () {
    var self = this;
    $(this).fillWindow();
    $.onSizeChange(function () {
        $(self).fillWindow();
    })
};

/**
 * 中心在屏幕宽高相应百分比处(包括边框)
 * @param perX
 * @param perY
 * @private
 */
$.fn._inWindowPer = function (perX, perY) {
    $(this).offset({
        top: (window.innerHeight - $(this).height()) * perY,
        left: (window.innerWidth - $(this).width()) * perX
    });
};

/**
 * 把屏幕宽高分为100分，元素中心在屏幕宽高相应处(包括边框)
 * @param xin100
 * @param yin100
 */
$.fn.inWindow = function (xin100, yin100) {
    $(this)._inWindowPer(xin100 / 100, yin100 / 100);
    return $(this);
};

/**
 * 元素的宽高变成分别屏幕宽高的百分比(包括边框)
 * @param perW
 * @param perH
 */
$.fn.perSize = function (perW, perH) {
    var $el = $(this);
    var borderW2 = $el.outerWidth() - $el.innerWidth();
    var borderH2 = $el.outerHeight() - $el.innerHeight();
    $el.css({
        width: (window.innerWidth - borderW2) * perW,
        height: (window.innerHeight - borderW2) * perH
    })
};

/**
 * 让元素居中占满屏(包括边框)
 */
$.fn.fillWindow = function () {
    var $el = $(this);
    $el.inWindow(0, 0);
    $el.perSize(1, 1);
};

/**
 * 获取元素左上角相对于屏幕的坐标
 * @returns {{x: *, y: *}}
 */
$.fn.getPos = function () {
    var $el = $(this);
    return {
        x: $el.offset().left,
        y: $el.offset().top
    };
};

/**
 * 获取元素尺寸(布局+边线+元素宽)
 * @returns {{w: *, h: *}}
 */
$.fn.getOutSize = function () {
    var $el = $(this);
    return {
        w: $el.outerWidth(),
        h: $el.outerHeight()
    };
};

/**
 * 设置元素相对文档的绝对位置
 */
$.fn.setPos = function (x, y) {
    var $el = $(this);
    $el.offset({top: y, left: x});
};

/**
 * 方便循环遍历jquery对象
 * @param cb (元素, 索引, 原对象)
 */
$.fn.forE = function (cb) {
    var $els = $(this);
    for (let i = 0; i < $els.length; i++) {
        let $el = $($els[i]);
        cb($el, i, $els)
    }
};

/**
 * 获取窗口尺寸
 */
$.win = function () {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    };
};

/*****************************************************************/
/*****************************样式相关*****************************/
/*****************************************************************/
/**
 * 元素在窗口尺寸变化时回调函数
 * @param callback
 */
$.fn.attrSVG = function (cfg) {
    var rot = cfg.rot || 0;
    var x = cfg.t.x || 0;
    var y = cfg.t.y || 0;
    var op = cfg.op || 1;
    var sca = cfg.sca || 1;

    $(this).attr({
        transform: 'translate(' + x + ',' + y + ")" + "scale(" + sca + ")" + "rotate(" + rot + ")",
        opacity: op,

    });
};


/*****************************************************************/
/*****************************创建相关*****************************/
/*****************************************************************/
/**
 * 创建选择型表单
 * @param opts 数组
 * @returns {jQuery|HTMLElement}
 */
$.createSelect = function (opts) {
    var id = new Date().getTime();//将创建时间当做id
    var html = '<select id="' + id + '">';
    for (let i = 0; i < opts.length; i++) {
        html += '<option value="' + opts[i] + '">' + opts[i] + '</option>';
    }
    html += '</select>';
    $('body').append(html);
    return $('#' + id);
};

/**
 *
 * @param cfg
 */
$.fn.createText = function (cfg) {


    var id = new Date().getTime();//将创建时间当做id
    var html = '<svg xmlns="http://www.w3.org/2000/svg" width="' + 100 + '%" height="' + 100 + '%">';
    html += ' <path id="path1" d="M' + ((cfg.x || 0) + 0.5) + ' ' + ((cfg.y || 0) + 0.5)
        + ' h2000" stroke="' + (cfg.ss || 'none') + '" fill="none"></path>';
    html += ' <text style="' + (cfg.style || "font-size:30px") + ';" id="' + id + '" y="' + (cfg.y || 0) + '"> ';
    html += '<textPath xlink:href="#path1">';
    html += cfg.str;
    html += ' </textPath> ';
    html += '</text> ';
    html += '</svg> ';
    console.log(html);
    $(this).append(html);

    var dy = 0;//y偏移量
    var $txt = $('#' + id);
    var txt_y = $txt.attr("y");
    console.log($txt[0]);
    let bBox = $txt[0].getBBox();
    switch (cfg.py || 't') {
        case 't':
            dy = txt_y - bBox.y;
            break;
        case 'c':
            dy = txt_y - bBox.y - bBox.height / 2;
            break;
        case 'b':
            dy = txt_y - bBox.y - bBox.height;
            break;
    }
    $txt.attr({"dy": dy});
    return $txt;
};
/**
 *
 * @param tagName
 * @returns {jQuery|HTMLElement}
 */
$.addSVGel = function (tagName) {
    return $(document.createElementNS($.SVG_NS(), tagName));
};

/*****************************************************************/
/*****************************运算相关*****************************/
/*****************************************************************/
/**
 * 获取范围随机数：如 $.getRange([1,9])
 * @param range
 * @returns {number}
 */
$.rangeInt = function (range) {

    return Math.ceil($.range(range));
};

/**
 * 获取范围随机数：如 $.getRange([1,9])
 * @param range
 * @returns {number}
 */
$.range = function (range) {
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);
    min = min - 1;
    var deta = max - min;
    return min + Math.random() * deta;
};

/*****************************************************************/
/*****************************辅助相关*****************************/
/*****************************************************************/
/**
 * 不选中元素（消除蓝色）
 */
$.fn.dontSelectEl = function () {
    document.onselectstart = new Function('event.returnValue=false');
};
/**
 * 增加一个imgdom节点(结构和数据分离方便img模板生成)
 * @param path
 * @param fileName
 * @returns {string}
 */
$.getImgDom = function (path, fileName) {
    return "<img " + "src=" + "\"" + path + fileName + "\">";
};
/**
 * 返回svg的命名空间,老是复制粘贴怪麻烦,写个函数呗
 * @returns {string}
 * @constructor
 */
$.SVG_NS = function () {
    return 'http://www.w3.org/2000/svg';
};

$.XLINK_NS = function () {
    return 'http://www.w3.org/1999/xlink';
};


