/**
 * 地区选择器高级版本
 * @version 1.0.0
 * @author <yangjian102621@gmail.com>
 */
// 加载 css 文件
(function () {
	var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
	var cssPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1)+"css/jareaselect.css"
	$("head:eq(0)").append('<link href="'+cssPath+'" rel="stylesheet" type="text/css" />');
})();
layui.use(["layer"], function () {
	(function ($) {
		$.fn.JAreaSelect2 = function(options) {

			if ( this.find(".jarea-select-box").length > 0 ) {
				this.find(".jarea-select-box").toggle();
				return;
			}
			//dom UI 变量定义
			var $dom = {};
			var $container = $(this);
			$container.css({"position":"relative"});

			var areaData = __AREADATA__;  //地区数据
			//初始化参数
			var defaults = {
				prov : 0, //省
				city : 0, //市
				dist : 0, //区

				callback : function(data) {
					console.log(data);
				}

			};

			/* 合并参数 */
			options = $.extend(defaults, options);

			//创建元素
			function createElement() {
				//创建tab ul
				$dom.areaBox = $('<div class="jarea-select-box"></div>');
				$dom.tabul = $('<ul class="tab-ul"></ul>');
				//创建tab panel
				var $tabContent = $('<div class="tab-content"></div>');
				$dom.provPanel = $('<div class="tab-panel tab-prov active"></div>');
				$dom.cityPanel = $('<div class="tab-panel tab-city"></div>');
				$dom.distPanel = $('<div class="tab-panel tab-dist"></div>');
				$tabContent.append($dom.provPanel);
				$tabContent.append($dom.cityPanel);
				$tabContent.append($dom.distPanel);

				//省份
				var id = 0, name = "请选择";
				if ( options.prov > 0 ) {
					id = options.prov;
					name = areaData.prov[options.prov];
				}
				$dom.prov = $('<li class="tab-item active"><a href="#prov" data-id="'+id+'">'+name+'</a></li>');
				$dom.tabul.append($dom.prov);

				//城市
				if ( options.city > 0 ) {
					id = options.city;
					name = getCityName(options.prov, options.city);
					$dom.city = $('<li class="tab-item"><a href="#city" data-id="'+id+'">'+name+'</a></li>');
					$dom.tabul.append($dom.city);
					appendCity(options.prov);   //追加城市列表

					$dom.prov.removeClass('active');
					$dom.city.addClass('active');
				}

				//地区
				if ( options.dist > 0 ) {
					id = options.dist;
					name = getDistName(options.city, options.dist);
					$dom.dist = $('<li class="tab-item"><a href="#dist" data-id="'+id+'">'+name+'</a></li>');
					$dom.tabul.append($dom.dist);
					appendDist(options.city);   //追加城市列表

					$dom.city.removeClass('active');
					$dom.dist.addClass('active');
				}

				//追加省份
				var $ul = $('<ul></ul>');
				$.each(areaData.prov, function(id, name) {
					$ul.append('<li><a href="javascript:void(0);" data-id="'+id+'">'+name+'</a></li>');
				});
				$dom.provPanel.append($ul);

				$dom.areaBox.append($dom.tabul);
				$dom.areaBox.append($tabContent);

				//关闭按钮
				var $close = $('<a href="#" class="close-btn">x</a>');
				$close.on("click", function() {
					$dom.areaBox.hide();
				});
				$dom.areaBox.append($close);
				$container.append($dom.areaBox);

				//绑定tab切换事件
				$dom.areaBox.find(".tab-item").on("click", function() {
					var href = $(this).find("a").attr("href").replace("#", "");
					$dom.areaBox.find(".tab-panel").hide();
					$dom.areaBox.find(".tab-"+href).show();
					$dom.areaBox.find(".tab-item").removeClass("active");
					$(this).addClass("active");
				});

				//选择省份
				$dom.provPanel.find("a").on("click", function() {
					var id = $(this).data("id");
					var name = $(this).text();

					$dom.prov.find("a").text(name);
					$dom.prov.find("a").attr("data-id", id);

					$dom.prov.next().find("a").html("请选择");
					$dom.prov.next().next().hide();

					$dom.prov.next().trigger("click");
					appendCity(id);
				});


			} //end of create elements

			//追加城市
			function appendCity(provId) {
				var $ul = $('<ul></ul>');
				$.each(areaData.city[provId], function(i, item) {
					$ul.append('<li><a href="javascript:void(0);" data-id="'+item.id+'">'+item.name+'</a></li>');
				});
				$dom.cityPanel.empty().append($ul);

				$dom.provPanel.hide();
				$dom.cityPanel.show();

				//绑定事件
				$dom.cityPanel.find("a").on("click", function() {
					var id = $(this).data("id");
					var name = $(this).text();

					$dom.city.find("a").text(name);
					$dom.city.find("a").attr("data-id", id);

					if ( areaData.dist[id].length > 0 ) {
						$dom.city.next().show();
						$dom.city.next().find("a").html("请选择");

						$dom.city.next().trigger("click");
						appendDist(id);
					} else {
						selectCompleted();
					}
				});
			}

			//追加地区
			function appendDist(cityId) {
				var $ul = $('<ul></ul>');
				$.each(areaData.dist[cityId], function(i, item) {
					$ul.append('<li><a href="javascript:void(0);" data-id="'+item.id+'">'+item.name+'</a></li>');
				});
				$dom.distPanel.empty().append($ul);

				$dom.cityPanel.hide();
				$dom.distPanel.show();

				//绑定事件
				$dom.distPanel.find("a").on("click", function() {
					var id = $(this).data("id");
					var name = $(this).text();

					$dom.dist.find("a").text(name);
					$dom.dist.find("a").attr("data-id", id);

					selectCompleted();
				});
			}

			//选择完成
			function selectCompleted() {
				var address = $dom.prov.find("a").text() + ","+ $dom.city.find("a").text();
				if ( $dom.dist.find("a").is(":visible") ) {
					address += ","+$dom.dist.find("a").text();
				}
				var ids = $dom.prov.find("a").data("id") + "," + $dom.city.find("a").data("id");
				if ( $dom.dist.find("a").is(":visible") ) {
					ids += "," + $dom.dist.find("a").data("id");
				}
				//回调函数
				options.callback({address : address, ids : ids});
				$dom.areaBox.hide();
			}

			//根据城市ID查找城市名称
			function getCityName(provId, cityId) {
				var str = '';
				$.each(areaData.city[provId], function(i, item) {
					if ( item.id == cityId ) {
						str = item.name;
						return;
					}
				});
				return str;
			}

			//根据地区ID查找地区名称
			function getDistName(cityId, distId) {
				var str = '';
				$.each(areaData.dist[cityId], function(i, item) {
					if ( item.id == distId ) {
						str = item.name;
						return;
					}
				});
				return str;
			}

			createElement(); //创建元素
		}
	})(jQuery);
});

