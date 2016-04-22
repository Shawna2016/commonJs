;(function($,window,document,undefined){
	//操作Dom
	function HandDom(){
		this.self = $(this);
		// this.options = $.extend({},defaults, options);
	};
	HandDom.prototype = {
		_findChildNodes:function(parentNode, callBack) {//遍历子节点
	        parentNode.children().each(function(index) {
	            var childNode = parentNode.children().eq(index);
	            callBack(childNode,index);
	            table._findChildNodes(childNode, callBack);
	        });
	    },
	    _setGetAttr:function(self,attr){//设置和获取属性
	    	if( typeof attr == "string"){//如果传入的是字符串
	 			var elAttr = self.prop(attr) ? self.prop(attr) : self.attr(attr);
	        	return elAttr;
	 		}else if(typeof attr == "object"){//如果传入的是对象，将对象设置为标签的属性
	 			for(var k in attr){
	                self.attr(k,attr[k]);
	 			}
	 		}else{
	 		}
		},
		ajaxData:function(opt){
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
		_saveRows:function(row,rowNum){//储存行
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
		},
		_findCell:function(self,row,col){//查找单元格
			var row = self.children('tr').eq(parseInt(row)-1),
            col = row.children('td').eq(parseInt(col)-1);
            return col;
		}
	};
	//搜索自动补全
	function CompleteSearch(self,options){
		var completeSearchDefaults = {
			inputId:"inputId",
			listId:"listId",
			data:""
		};
		this.self = self;
		this.settings = set = $.extend({},completeSearchDefaults,options);
		this.init();
	}
	$.extend(CompleteSearch.prototype,new HandDom(),{
		init:function(){
			this.eventBind();
		},
		listRende:function(){
			var inputValue = $("#"+set.inputId).text();
			if(inputValue.replace(/(^\s*)|(\s*$)/g,'')==""){ return; }//值为空，退出
            try{ var reg = new RegExp("(" + inputValue + ")","i");}
            catch (e){ return; }
            set.data.sort();
            var result = "";
            for(var i=0;i<set.data.length;i++){
            	if(reg.test(set.data[i])){
            		var div = $('<div>'+set.data[i]+'</div>');
            		result += div;
            	}
            }
            $("#"+set.listId).append(result);
		},
		eventBind:function(event){
			if(event.keyCode!=13&&event.keyCode!=38&&event.keyCode!=40){
				this.listRende();
			}
		}


	});
	var completeSearch = function(self,obj){
		return new CompleteSearch(self,obj);
	}
	//全国省市区三级联动
	function Address(self,options){
		var addressDefaults = {
			provinceId:'',//省份select class
			cityId:'',//城市select class
			areaId:'',//区select class
			defaultProvince:"北京",//默认省
			defaultCity:"北京",//默认市
			defaultArea:"东城区",//默认区,
			data:""//数据
		};
		this.self = self;
		this.settings = set = $.extend({},addressDefaults,options);
		this.init();
	}
	$.extend(Address.prototype,new HandDom(),{
		init:function(){
			this.addOptions(set.data,set.provinceId);
			this.selcetDefaults(set.provinceId,set.defaultProvince);
			this.changeProvince(set.provinceId);
			this.eventBind();
		},
		addOptions:function(data,selectId){//添加option ,data:遍历的数据，selectId:select的Id
			var result ="";
			var oFragmeng = document.createDocumentFragment();
			for(var i=0;i<data.length;i++){
				var option = document.createElement("option");
				option.value = data[i].name;
		        option.text = data[i].name;
		        option.obj = data[i];	
		 	 	oFragmeng.appendChild(option);
			}
			$("#"+selectId).html(oFragmeng);
		},
		selcetDefaults:function(threeCl,defaults){//显示默认省市区的值
			var options = $("#"+threeCl).children('option');
			for(var k=0; k<options.length; k++){
				if(options[k].value == defaults){
					$("#"+threeCl).selectIndex = k;
					options[k].selected = true;
					return;
				}
			}
		},
		findSelected:function(opts){//找到selected的option
			for(var k=0;k<opts.length;k++){
				if(opts[k].selected){
					var objs = opts[k],
						sub = objs.obj.sub;
					return sub;
				}
			}
		},
		changeProvince:function(threeCl){//省份改变
			var opts = $("#"+threeCl).children('option');
			var sub = this.findSelected(opts);
			this.addOptions(sub,set.cityId);
			this.selcetDefaults(set.cityId,set.defaultCity);
			this.changeCity(set.cityId);
		
		},
		changeCity:function(threeCl){//市改变
			var opts = $("#"+threeCl).children('option');
			var sub = this.findSelected(opts);
			this.addOptions(sub,set.areaId);
			this.selcetDefaults(set.areaId,set.defaultArea);
		},
		eventBind:function(){//事件绑定
			var pag = this;
			$("#"+set.provinceId).on("change",function(){
				pag.changeProvince(set.provinceId);
			});
			$("#"+set.cityId).on("change",function(){
				pag.changeCity(set.cityId);
			})
		}
	});
	var address = function(self,obj){
		new Address(self,obj);
	}
	//分页
	function Pagination (self,options){
		if(!(this instanceof Pagination)){
          return new Pagination(this,options);
        }
		//配置参数
		var paginationDefaults = {
			totalData:0,			//数据总条数
			showData:0,				//每页显示的条数
			pageCount:9,			//总页数,默认为9
			current:1,				//当前第几页
			prevCls:'prev',			//上一页class
			nextCls:'next',			//下一页class
			prevContent:'<',		//上一页内容
			nextContent:'>',		//下一页内容
			activeCls:'active',		//当前页选中状态
			coping:false,			//首页和尾页
			homePage:'',			//首页节点内容
			endPage:'',				//尾页节点内容
			count:3,				//当前页前后分页个数
			jump:false,				//跳转到指定页数
			jumpIptCls:'jump-ipt',	//文本框内容
			jumpBtnCls:'jump-btn',	//跳转按钮
			jumpBtn:'跳转',			//跳转按钮文本
			callback:function(){}	//回调
			};
		this.self = self;
		this.settings= set = $.extend({},paginationDefaults,options);
		this.init();
	}
	Pagination.prototype = {
		init:function(){
			this.filling(set.current);
			this.eventBind();
		},
		getTotalPage:function(){//获取总页数
			return set.totalData && set.showData?Math.ceil(parseInt(set.totalData/set.showData)) : set.pageCount;
		},
		getCurrent:function(){//获取当前页
			return set.current;
		},
		filling:function(cur){
			var html="";
			current = cur || set.current;//当前页码
			var pageCount = this.getTotalPage();
			if(current > 1){//上一页
				html += '<a href="javascript:;" class="'+set.prevCls+'">'+set.prevContent+'</a>';
			}else{
				$(this.self).find('.'+set.prevCls) && $(this.self).find('.'+set.prevCls).remove();
			}
			if(current >= set.count * 2 && current != 1 && pageCount != set.count){
				var home = set.coping && set.homePage ? set.homePage : '1';
				html += set.coping ? '<a href="javascript:;" data-page="1">'+home+'</a><span>...</span>' : '';
			}
			var start = current - set.count,
				end = current + set.count;
			((start > 1 && current < set.count) || current == 1) && end++;
			(current > pageCount - set.count && current >= pageCount) && start++;
			for (;start <= end; start++) {
				if(start <= pageCount && start >= 1){
					if(start != current){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+set.activeCls+'">'+ start +'</span>';
					}
				}
			}
			if(current + set.count < pageCount && current >= 1 && pageCount > set.count){
				var end = set.coping && set.endPage ? set.endPage : pageCount;
				html += set.coping ? '<span>...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			if(current < pageCount){//下一页
				html += '<a href="javascript:;" class="'+set.nextCls+'">'+set.nextContent+'</a>'
			}else{
				$(this.self).find('.'+set.nextCls) && $(this.self).find('.'+set.nextCls).remove();
			}

			html += set.jump ? '<input type="text" class="'+set.jumpIptCls+'"><a href="javascript:;" class="'+set.jumpBtnCls+'">'+set.jumpBtn+'</a>' : '';

			$(this.self).empty().html(html);
		},
		eventBind:function(){
			var pag = this;
			var pageCount = this.getTotalPage();
			$(this.self).on("click","a",function(){
				if($(this).hasClass(set.prevCls)){
					var cur = parseInt($(pag.self).find("."+set.activeCls).text())-1;
				}else if($(this).hasClass(set.nextCls)){
					var cur = parseInt($(pag.self).find('.'+set.activeCls).text())+1;
				}else if($(this).hasClass(set.jumpBtnCls)){
					if($(pag.self).find("."+set.jumpIptCls).val() != ""){
						var cur = parseInt($(pag.self).find("."+set.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					var cur = parseInt($(this).attr("data-page"));
				}
				pag.filling(cur);
			});
			$(this.self).on('input propertychange','.'+set.jumpIptCls,function(){
				var val = $(this).val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $(this).val(val.replace(reg, ''));
	            }
	            (parseInt(val) > pageCount) && $(this).val(pageCount);
	            if(parseInt(val) === 0){//最小值为1
	            	$(this).val(1);
	            }
			});
			$(document).keydown(function(e){ 
		        if(e.keyCode == 13 && self.find('.'+set.jumpIptCls).val()){
		        	var cur = parseInt(self.find('.'+set.jumpIptCls).val());
		            pag.filling(cur);
		        }
		    });

		}
	}
	var pagination = function(self,options){
		return new Pagination(self,options);
	};
	//表格操作
		function Table(){};
		$.extend(Table.prototype,new HandDom(),{
			constructor:Table,
			setGetCell:function(self,arr){//获取或设置单元格的值
				var l = arr.length;
		        if(l<2){
		            return self;
		        }else{
		            var col = table._findCell(self,arr[0],arr[1]);
		            switch(l){
		                case 2:
		                    return col.html();
		                    break;
		                case 3: 
		                    col.html(arr[2]);
		                    break;
		            }
		        }
			},
			mergeCells:function(self,arr){//合并单元格
				for(var k = 0;k<arr.length;k++){
					var col = table._findCell(self,arr[k].rowIndex,arr[k].colIndex);
	           		 table._setGetAttr(col,{rowspan:arr[k].rowSpan,colspan:arr[k].colSpan});
				}
			},
			updateRow:function(self,row,rowData){//更新行
				var row = self.children('tr').eq(parseInt(row)-1);
		        for(var i =0; i<rowData.length;i++){
		            row.children('td').eq(i).html(rowData[i]);
		        }
			},
			removeRows:function(self,row){//删除行
				if(row instanceof Array){
		            var rowArr = table._saveRows(self,row);
		            for(var i=0;i<rowArr.length;i++){
		                rowArr[i].remove();
		            }
		        }else{
		            var row = self.children('tr').eq(parseInt(row)-1);
		            row.remove();
		        }
			},
			addRows:function(self,rowIndex,rows){//增加行
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
			},
			moveUpRows:function(self,arr){//向上移动行
				var row = self.children('tr').eq(parseInt(arr.rowIndex)-1),
		            rowArr = table._saveRows(row,parseInt(arr.rows)),
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
			},
			moveDownRows:function(self,arr){//向下移动行
				if(parseInt(arr.rowIndex) == 0){
		            var row = self;
		        }else{
		             var row = self.children('tr').eq(parseInt(arr.rowIndex)-1);
		        }
		        var rowArr = table._saveRows(row,parseInt(arr.rows)),
		            rowDown = self.children('tr').eq(parseInt(arr.rowIndex)+parseInt(arr.toRows)+1);
		            for(var i=rowArr.length-1;i>=0;i--){
		                rowDown.after(rowArr[i]);
		            }
			}

		})
		var table = new Table();
	//数据绑定
	function DataBind(){};
	$.extend(DataBind.prototype,new HandDom(),{
		constructor:DataBind,
		init:function(self,str){//数据不用经过处理直接可以应用到实例
			dataBind._findChildNodes(self, function(el) {
	            var self = el;
	            var url = url?table._setGetAttr(self,"url"):str;
	            if (url) {
	                var type = table._setGetAttr(self,"type"),
					 	dataType =table._setGetAttr(self,"dataType");
	                dataBind.ajaxData({
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
		setData:function(self,data){//绑定数据
			if (self.children().length == 0) {
	            dataBind._tagBind(self, data);
	        } else {
	            var eleTagRepeat = table._setGetAttr(self,"tagRepeat");
	            if (eleTagRepeat == "true") {
	                dataBind._tagBind(self, data);
	            }
	            dataBind._findChildNodes(self, function(element) {
	                var eleFieldName = table._setGetAttr(element,"fieldName");
	                if (eleFieldName && eleFieldName != "") {
	                    var eleValue = data[eleFieldName];
	                    element.append(eleValue);
	                }
	            });
	        }
		},
   		 _tagBind:function (self, data) {//判别标签进行数据绑定
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
	                            var td = "<td>" + data[i][table._setGetAttr(tdAttr,"fieldName")] + "</td>";
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
	});
	var dataBind = new DataBind();

	$.extend($.fn,{
		setGetCell:function(arr){
			table.setGetCell(this,arr);
		},
		mergeCells:function(arr){
			table.mergeCells(this,arr);
		},
		updateRow:function(row,rowData){
			table.updateRow(this,row,rowData);
		},
		removeRows:function(row){
			table.removeRows(this,row);
		},
		addRows:function(rowIndex,rows){
			table.addRows(this,rowIndex,rows)
		},
		moveUpRows:function(arr){
			table.moveUpRows(this,arr);
		},
		moveDownRows:function(arr){
			table.moveDownRows(this,arr);
		},
		fit:function(str){
			dataBind.init(this,str);
		},
		setData:function(data){
			dataBind.setData(this,data);
		},
		ajaxData:function(obj){
			dataBind.ajaxData(obj);
		},
		pagination:function(obj){
			pagination(this,obj);
		},
		address:function(obj){
			address(this,obj);
		},
		completeSearch:function(obj){
			completeSearch(this,obj);
		}
	});

})(jQuery,window,document)