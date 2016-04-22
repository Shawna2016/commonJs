/**
 * universal v1.0
 * require jquery 1.11+
 */
 ;(function($,window,document,undefined){
    //向下移动行
    function moveDownRows(self,arr){
        if(parseInt(arr.rowIndex) == 0){
            var row = self;
        }else{
             var row = self.children('tr').eq(parseInt(arr.rowIndex)-1);
        }
        var rowArr = _saveRows(row,parseInt(arr.rows)),
            rowDown = self.children('tr').eq(parseInt(arr.rowIndex)+parseInt(arr.toRows)+1);
            for(var i=rowArr.length-1;i>=0;i--){
                rowDown.after(rowArr[i]);
            }
    }
    //向上移动行
    function moveUpRows (self,arr){
        var row = self.children('tr').eq(parseInt(arr.rowIndex)-1),
            rowArr = _saveRows(row,parseInt(arr.rows)),
            rowNum = parseInt(arr.rowIndex)-parseInt(arr.toRows),
            rowNum = rowNum > 0?rowNum:0,
            rowUp = self.children('tr').eq(rowNum-1);
            for(var i=rowArr.length-1;i>=0;i--){
                if(rowNum == 0){
                    self.children('tr').eq(0).before(rowArr[i]);
                }else{
                    rowUp.after(rowArr[i]);
                }
            }
            
    }
    //增加行
    function addRows (self,rowIndex,rows){
        if(parseInt(rowIndex) == 0){
            var row = self;
            for(var i=0;i<parseInt(rows);i++){
                var trHtml = '<tr></tr>';
                trHtml += trHtml;
             }
             row.children('tr').eq(0).before(trHtml);
        }else{
            var row = self.children('tr').eq(parseInt(rowIndex)-1);
            for(var i=0;i<parseInt(rows);i++){
                var trHtml = '<tr></tr>';
                trHtml += trHtml;
            }
             row.after($(trHtml));
        }
      
    }
    //删除行
    function removeRows (self,row){
        if(row instanceof Array){
            var rowArr = _saveRows(self,row);
            for(var i=0;i<rowArr.length;i++){
                rowArr[i].remove();
            }
        }else{
            var row = self.children('tr').eq(parseInt(row)-1);
            row.remove();
        }
    }
    //更新行
    function updateRow (self,row,rowData){
        var row = self.children('tr').eq(parseInt(row)-1);
        for(var i =0; i<rowData.length;i++){
            row.children('td').eq(i).html(rowData[i]);
        }
    }
    //合并单元格
    function mergeCells (self,arr){
                                                                                                                                                                                                                                                                                                                     for(var k =0;k<arr.length;k++){
            var col = _findCell(self,arr[k].rowIndex,arr[k].colIndex);
            _setGetAttr(col,{rowspan:arr[k].rowSpan,colspan:arr[k].colSpan});
        }
    }
    //获取或设置单元格的值
    function setGetCell (self,arr){//$("#tableA").setGetCell([row,col,val])
        var l = arr[0].length;
        if(l<2){
            return self;
        }else{
            var col = _findCell(self,arr[0][0],arr[0][1]);
            switch(l){
                case 2:
                    return col.html();
                    break;
                case 3: 
                    col.html(arr[0][2]);
                    break;
            }
        }
    }
    //保存行
    function _saveRows(row,rowNum){//row下面的rowNum行保存为[]
        var rowArr = [];
        if(rowNum instanceof Array){
             for(var i=0;i<rowNum.length;i++){
                var row1 = row.children('tr').eq(parseInt(rowNum[i])-1);
                rowArr.push(row1);
            }
        }else if(row.prop("tagName") == "TR"){
            for(var i=0;i<rowNum;i++){
                var row1 = row.nextAll("tr").eq(i);
                rowArr.push(row1);
            }
        }else if(row.prop("tagName") == "TBODY"){
            for(var i=0;i<rowNum;i++){
                var row1 = row.children("tr").eq(i);
                rowArr.push(row1);
            }
        }
        
        return rowArr;
    }
    //查找单元格
    function _findCell(self,row,col){
        var row = self.children('tr').eq(parseInt(row)-1),
            col = row.children('td').eq(parseInt(col)-1);
            return col;
    }
 	//load
 	function load(self,url){
 		if(typeof url == "string"){
 			url = {url:url}
 		}
 		_setGetAttr(self,url);
 		url.success = function(data){
 			self.setData(data);
 		}
 		self.ajaxData(url);
 	};
 	//reload
 	function reload(self){
 		var url = _setGetAttr(self,"url");
 		if(url){
 			load(self,url);
 		}
 	};
 	 //数据不用经过处理直接可以应用到实例
    function init() {
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
    }
 	//绑定数据
 	function setData(self,data){
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
 	};
 	//ajax请求
 	function ajaxData(opt){
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
 	};
 	//设置和获取属性
 	function _setGetAttr(self,attr){
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
 	};
 	//判别标签进行数据绑定
    function _tagBind(self, data) {
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
    }
 	//遍历子节点
 	function _findChildNodes(parentNode, callBack) {
        parentNode.children().each(function(index) {
            var childNode = parentNode.children().eq(index);
            callBack(childNode,index);
            _findChildNodes(childNode, callBack);
        });
    };



    var universal = {
        fit:init,
        ajaxData:ajaxData,
        setData:function(data){
                     setData(this,data);
                },
        load:function(url){
                load(this,url);
            },
        reload:function(){
                reload(this);
                },
        setGetCell:function(row,col,val){
                setGetCell(this,arguments);
        },
        mergeCells:function(arr){
            mergeCells(this,arr);
        },
        updateRow:function(row,rowData){
            updateRow(this,row,rowData)
        },
        removeRows:function(rowIndex,rows){
            removeRows(this,rowIndex,rows);
        },
        addRows:function(rowIndex,rows){
            addRows(this,rowIndex,rows);
        },
        moveUpRows:function(arr){
            moveUpRows(this,arr);
        },
        moveDownRows:function(arr){
            moveDownRows(this,arr);
        }
    }
    $.extend($.fn,universal);

    // function DataBind(){}//数据绑定
    // DataBind.prototype = {
    //     init:function(){
    //         _findChildNodes(this, function(el) {
    //             var self = el;
    //             var url = _setGetAttr(self,"url");
    //             if (url) {
    //                 var type = _setGetAttr(self,"type"),
    //                     dataType =_setGetAttr(self,"dataType");
    //                 ajaxData({
    //                     url: url,
    //                     type: type,
    //                     dataType: dataType,
    //                     success: function(data) {
    //                         $(self).setData(data);
    //                     },
    //                     error: function(data) {
    //                         _error(data);
    //                     }
    //                 });
    //             }
    //         });
    //     },
    //     setData:function(self,data){
    //         if (self.children().length == 0) {
    //             _tagBind(self, data);
    //         } else {
    //             var eleTagRepeat = _setGetAttr(self,"tagRepeat");
    //             if (eleTagRepeat == "true") {
    //                 _tagBind(self, data);
    //             }
    //             _findChildNodes(self, function(element) {
    //                 var eleFieldName = _setGetAttr(element,"fieldName");
    //                 if (eleFieldName && eleFieldName != "") {
    //                     var eleValue = data[eleFieldName];
    //                     element.append(eleValue);
    //                 }
    //             });
    //         }
    //     },
    //     ajaxData:function(){
    //         var defaults = {
    //             url: "",
    //             data: "",//要求为Object或String类型的参数，发送到服务器的数据。
    //             type: "GET", //要求为String类型的参数，请求方式（post或get）默认为get。
    //             async: false, //要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。
    //             cache:true,//要求为Boolean类型的参数，默认为true。设置为false将不会从浏览器缓存中加载请求信息。
    //             dataType: "json", //数据返回类型默认json.xml/html/script/json/jsonp/text
    //             contentType: "application/json",
    //             success: null, //成功回调
    //             error: null//发生错误时回调,
    //         };
    //         var settings = $.extend({}, defaults, opt);
    //         $.ajax({
    //             type: settings.type,
    //             url: settings.url,
    //             data: settings.data,
    //             dataType: settings.dataType,
    //             async: settings.async,
    //             contentType: settings.contentType,
    //             success: function(text) {
    //                 settings.success(text);
    //             },
    //             error: function(text) {
    //                 settings.error(text);
    //             }
    //         });
    //     }
    // }
    // function Table(){ }
    // Table.prototype = {
    //     _saveRows:function(row,rowNum){//row下面的rowNum行保存为[]
    //         var rowArr = [];
    //         if(rowNum instanceof Array){
    //              for(var i=0;i<rowNum.length;i++){
    //                 var row1 = row.children('tr').eq(parseInt(rowNum[i])-1);
    //                 rowArr.push(row1);
    //             }
    //         }else if(row.prop("tagName") == "TR"){
    //             for(var i=0;i<rowNum;i++){
    //                 var row1 = row.nextAll("tr").eq(i);
    //                 rowArr.push(row1);
    //             }
    //         }else if(row.prop("tagName") == "TBODY"){
    //             for(var i=0;i<rowNum;i++){
    //                 var row1 = row.children("tr").eq(i);
    //                 rowArr.push(row1);
    //             }
    //         }
            
    //         return rowArr; //保存行
    //     }
    //     _findCell:function (self,row,col){
    //         var row = self.children('tr').eq(parseInt(row)-1),
    //             col = row.children('td').eq(parseInt(col)-1);
    //             return col;//查找单元格
    //     }
    // }
    // function Tr(){}
    // Tr.prototype = new Table();
    // Tr.constructor = Tr;
    // Tr.prototype = {
    //     addRows:function(rowIndex,rows){
    //             if(parseInt(rowIndex) == 0){
    //             var row = self;
    //             for(var i=0;i<parseInt(rows);i++){
    //                 var trHtml = '<tr></tr>';
    //                 trHtml += trHtml;
    //              }
    //              row.children('tr').eq(0).before(trHtml);
    //             }else{
    //                 var row = self.children('tr').eq(parseInt(rowIndex)-1);
    //                 for(var i=0;i<parseInt(rows);i++){
    //                     var trHtml = '<tr></tr>';
    //                     trHtml += trHtml;
    //                 }
    //                  row.after($(trHtml));
    //             }
    //     },
    //     moveUpRows:function(arr){
    //     },
    //     moveDownRows:function(arr){
    //     }
    // }
    // $.extend($.fn,{
    //     setData:function(){
    //         DataBind.setData();
    //     },
    //     addRows:function(){
    //         Tr.addRows();
    //     }
    // });

 })(jQuery,window,document)