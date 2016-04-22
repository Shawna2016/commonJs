;(function($,window,document,undefined){
	if(typeof $ == "undefined"){
		alert("Pagination requires jQuery.");
	}
	var pluginName = 'universal';
	if($.fn.pluginName){
		pluginName = 'universal2';
	}

	// Instance defaults

	$.fn[pluginName] = {
			init:function(){
				_findChildNodes(this, function(el) {
		            var self = el;
		            var url = _setGetAttr(self,"url");
		            if (url) {
		                var type = _setGetAttr(self,"type"),
						 	dataType =_setGetAttr(self,"dataType");
		                ajaxData({
		                    url: url,
		                    type: type,
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
			},
			setData:function(self,data){
				if (self.children().length == 0) {
		            _tagBind(self, data);
		        } else {
		            var eleTagRepeat = _setGetAttr(self,"tagRepeat");
		            if (eleTagRepeat == "true") {
		                _tagBind(self, data);
		            }
		            _findChildNodes(self, function(element) {
		                var eleFieldName = _setGetAttr(element,"fieldName");
		                if (eleFieldName && eleFieldName != "") {
		                    var eleValue = data[eleFieldName];
		                    element.append(eleValue);
		                }
		            });
		        }
			},
			ajaxData:function(){
				var defaults = {
		            url: "",
		            data: "",//要求为Object或String类型的参数，发送到服务器的数据。
		            type: "GET", //要求为String类型的参数，请求方式（post或get）默认为get。
		            async: false, //要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。
		            cache:true,//要求为Boolean类型的参数，默认为true。设置为false将不会从浏览器缓存中加载请求信息。
		            dataType: "json", //数据返回类型默认json.xml/html/script/json/jsonp/text
		            contentType: "application/json",
		            success: null, //成功回调
		            error: null//发生错误时回调,
		        };
		        var settings = $.extend({}, defaults, opt);
		        $.ajax({
		            type: settings.type,
		            url: settings.url,
		            data: settings.data,
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
			},
		}
	// Static method

	$[pluginName] = function(){
		var staticMehod = {
			_setGetAttr:function(self,attr){
				if( typeof attr == "string"){
		 			var elAttr = self.prop(attr) ? self.prop(attr) : self.attr(attr);
		        	return elAttr;
		 		}else if(typeof attr == "object"){//如果传入的是对象，将对象设置为标签的属性
		 			for(var k in attr){
		                self.attr(k,attr[k]);
		 			}
		 		}else{
		 			var attrs = this[0].attributes, k = -1, result = {};
		            while (++k < attrs.length) {
		                attr = attrs[k];
		                result[attr.name] = attr.value === "true" ? true : attr.value === "false" ? false : attr.value;
		            }
		            return result;
		 		}
			},
			_tagBind:function(self, data){
				var result = "", trHtml = "";
		        for (var i = 0; i < data.length; i++) {
		            switch (self.prop("tagName")) {
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
		                            var td = "<td>" + data[i][_setGetAttr(tdAttr,"fieldName")] + "</td>";
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
			},
			_findChildNodes:function(parentNode, callBack){
				parentNode.children().each(function(index) {
		            var childNode = parentNode.children().eq(index);
		            callBack(childNode,index);
		            _findChildNodes(childNode, callBack);
		        });	
			}
		}
	};
	// ============================================================
    // helpers
    // ============================================================
    $.extend($.fn,Universal);

})(jQuery,window,document)