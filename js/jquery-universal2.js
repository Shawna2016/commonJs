/**
 * universal v1.0
 * require jquery 1.11+
 */
;(function($, window, document, undefined) {
    //数据绑定功能
    //如果返回的数据不用经过处理直接可以应用到实例中，即可直接在html标签中添加url属性，例如：<ul class="nav nav-pills" url="js/mock/jsonData.json">
    //如果数据需要经过筛选之后才可以进行绑定，即可使用onload()函数,传入参数。如筛选后的数据需要处理之后才能使用,则要再次使用setData().
    //如果数据需要进行处理后才可以进行绑定，即可使用setData().

    //数据不用经过处理直接可以应用到实例
    function init() {
        _findChildNodes(this, function(el) {
            var self = el;
            var url = _getAttrPro(el, "url");
            if (url && url != "") {
                var ReqType = _getAttrPro(el, "type"),
				 	dataType = _getAttrPro(el, "dataType");
                dataAjax({
                    url: url,
                    ReqType: ReqType,
                    dataType: dataType,
                    success: function(data) {
                        $(self).setData(data);
                    },
                    error: function(data) {
                        _error(data);
                    }
                });
            }
        });
    }
    //请求后返回成功函数识别属性进项绑定
    function setData(self, data) {
        if (self.children().length == 0) {
            _tagBind(self, data);
        } else {
            var eleTagRepeat = _getAttrPro(self, "tagRepeat");
            if (eleTagRepeat == "true") {
                _tagBind(self, data);
            }
            _findChildNodes(self, function(element) {
                var eleFieldName = _getAttrPro(element, "fieldName");
                if (eleFieldName && eleFieldName != "") {
                    var eleValue = data[eleFieldName];
                    element.append(eleValue);
                }
            });
        }
    }

    //判别标签进行数据绑定
    function _tagBind(self, data) {
        var result = "", trHtml = "";
        for (var i = 0; i < data.length; i++) {
            switch (_getAttrPro(self, "tagName")) {
                case "SELECT":
                    for (var objAtr in data[i]) {
                        var op = "<option>" + data[i][objAtr] + "</option>";
                        result += op;
                    }
                    break;
                case "TBODY":
                    var tdLength = $(self).children("tr").eq(0).children("td").length;
                    for (var i = 0; i < data.length; i++) {
                        var tableHtml = '<tr>';
                        for (var o = 0; o < tdLength; o++) {
                            var tdAttr = $(self).children("tr").eq(0).children("td").eq(o);
                            var td = "<td>" + data[i][_getAttrPro(tdAttr, "fieldName")] + "</td>";
                            tableHtml += td;
                        }
                        result += tableHtml + '</tr>';
                    }
                    break;
                case "UL":
                    for (var objAtr in data[i]) {
                        var li = "<li><a href=''>" + data[i][objAtr] + "</a></li>";
                        result += li;
                    }
                    break;
            };
        }
        $(self).append(result);
    }
    //请求后返回失败函数
    function _errorFuc(data) {
        alert("请求失败！");
    }
    //ajax请求
    function dataAjax(opt) {
        var defaults = {
            url: "",
            data: "",
            ReqType: "GET", //默认是post请求
            Method: "", //默认函数名为""
            async: false, //是否异步，默认是true
            dataType: "json", //数据返回类型默认json
            contentType: "application/json",
            //OPType: "sel", //默认查询操作
            ServerType: "", //约束：在作用域CommonAjax()中，many为保留字，服务器不可以用这个名字。
            ServerName: "", //单服务器查询时，这个参数要传""
            success: null, //成功回调
            error: null, //发生错误时回调,
            lock: true //默认锁屏
        };
        var settings = $.extend({}, defaults, opt);
        $.ajax({
            type: settings.ReqType,
            url: settings.url,
            data: settings.json,
            dataType: settings.dataType,
            async: settings.async,
            contentType: settings.contentType,
            success: function(text) {
                settings.success(text);
            },
            error: function(text) {
                settings.error(text);
            }
        });
    }
    //获取属性
    function _getAttrPro(el, attribute) {
        var elAttrPro = el.prop(attribute) ? el.prop(attribute) : el.attr(attribute);
        return elAttrPro;
    }
    //遍历子节点
    function _findChildNodes(parentNode, callBack) {
        parentNode.children().each(function(index) {
            var childNode = parentNode.children().eq(index);
            callBack(childNode);
            _findChildNodes(childNode, callBack);
        });
    }
    //向外暴露接口
    $.fn.fit = init;
    $.fn.dataAjax = dataAjax;
    $.fn.setData = function(data) {
        setData(this, data);
    }
    $.fn.load = function(url) {//string或object
        //设置url+ajax+setData;
        if (typeof url === "string") {
            url = {
                url: url
            }
        };
        this.setGetAttr(url);
        url.success = function(data) {
            this.setData(data);
        }
        this.dataAjax(url);
    };
    $.fn.reload = function() {
        //读取url+ajax+setData
        var url = this.setGetAttr("url");
        if (url) {
            this.load(url);
        }
    };

    //设置Object或者读取传string,默认不传参数的时候，返回全部属性
    $.fn.setGetAttr = function(object) {
        if (typeof object === "object") {
            for (var k in object) {
                this.attr(k, object[k]);
            }
        }
        else if (typeof object === "string") {
            return this.attr(object);
        } else {
            var attrs = this[0].attributes, k = -1, result = {};
            while (++k < attrs.length) {
                attr = attrs[k];
                result[attr.name] = attr.value === "true" ? true : attr.value === "false" ? false : attr.value;
            }
            return result;
        }
    };

    //1、为url创建一个数组
    //2、自定义属性
    //3、构造函数



})(jQuery, window, document);
