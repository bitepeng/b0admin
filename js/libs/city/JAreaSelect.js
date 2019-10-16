/**
 * 地区选择器
 * @version 1.1.0
 * @author <yangjian102621@gmail.com>
 */
layui.use("form", function () {

    var form = layui.form;
	$.fn.JAreaSelect = function(options) {

		var obj = {};
		var $container = $(this);
		var areaData = __AREADATA__; //地区数据
		var r = Math.random();
		//初始化参数
		var defaults = {
			prov: 0, //省
			city: 0, //市
			dist: 0, //区
			name: {
				prov: 'province',
				city: 'city',
				dist: 'dist'
			},

			filter: {
				prov: 'p' + r,
				city: 'c' + r,
				dist: 'd' + r,
			},

			selectClassName: '', //select class名称

		};

		/* 合并参数 */
		options = $.extend(defaults, options);

		//创建元素
		obj.create = function() {

			var $provinceWrapper = $('<div class="layui-input-inline"></div>');
			var $cityWrapper = $('<div class="layui-input-inline"></div>');
			var $distWrapper = $('<div class="layui-input-inline"></div>');
			obj.province = $('<select class="' + options.selectClassName + '" name="' + options.name.prov + '" lay-filter="' + options.filter.prov + '"></select>');
			obj.city = $('<select class="' + options.selectClassName + '" name="' + options.name.city + '" lay-filter="' + options.filter.city + '"></select>');
			obj.dist = $('<select class="' + options.selectClassName + '" name="' + options.name.dist + '" lay-filter="' + options.filter.dist + '"></select>');
			$provinceWrapper.append(obj.province);
			$cityWrapper.append(obj.city);
			$distWrapper.append(obj.dist);
			$container.append($provinceWrapper);
			$container.append($cityWrapper);
			$container.append($distWrapper);

			//加载所有省级
			obj.province.append('<option value="0" selected>请选择省份</option>');
			$.each(areaData.prov, function(id, name) {
				if (id == options.prov) {
					obj.province.append('<option value="' + id + '" selected>' + name + '</option>');
				} else {
					obj.province.append('<option value="' + id + '">' + name + '</option>');
				}
			});


			// 切换省份的时候加载城市
			obj.province.on('change', function() {

				//清空元素
				try {
					obj.city.html("");
					obj.dist.html("");
				} catch (e) {}

				var pid = $(this).val(); //获取省份id

				if (areaData.city[pid] && areaData.city[pid].length > 0) {
					obj.city.append('<option value="0" selected>请选择城市</option>');
					$.each(areaData.city[pid], function(i, item) {
						if (item.id == options.city) {
							obj.city.append('<option value="' + item.id + '" selected>' + item.name + '</option>');
						} else {
							obj.city.append('<option value="' + item.id + '">' + item.name + '</option>');
						}
					});

				}
				obj.city.trigger("change"); //触发省份选择事件

			});

			//切换城市的时候加载地区
			obj.city.on("change", function() {

				try {
					obj.dist.html("");
				} catch (e) {}

				var cid = $(this).val();
				if (areaData.dist[cid] && areaData.dist[cid].length > 0) {
					obj.dist.append('<option value="0" selected>请选择地区</option>');
					$.each(areaData.dist[cid], function(i, item) {
						if (item.id == options.dist) {
							obj.dist.append('<option value="' + item.id + '" selected>' + item.name + '</option>');
						} else {
							obj.dist.append('<option value="' + item.id + '">' + item.name + '</option>');
						}
					});
				}

			});

			// 传入了初始化参数
			if (options.prov) {
				obj.province.trigger("change"); //自动触发事件
			}
			form.render('select');

			// //绑定省份选择事件
			form.on('select(' + options.filter.prov + ')', function(data) {

				obj.province.trigger("change"); //触发省份选择事件
				form.render('select');
			});

			//绑定城市选择事件
			form.on('select(' + options.filter.city + ')', function(data) {

				obj.city.trigger("change"); //触发城市选择事件
				form.render('select');
			});

		}

		//获取区域id
		obj.getAreaId = function() {
			return {
				prov: obj.province.val(),
				city: obj.city ? obj.city.val() : 0,
				dist: obj.dist ? obj.dist.val() : 0
			};
		}

		//获取区域字符串
		obj.getAreaString = function() {
			var html = obj.province.find("option:selected").html();
			try {
				html += obj.city.find("option:selected").html();
				html += obj.dist.find("option:selected").html();
			} catch (e) {}
			return html;
		}

		obj.create();
		return obj;

	}
});