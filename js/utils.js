/**
 * 发送异步 http GET 请求
 * @param url
 * @param data
 * @param success
 * @param fail
 */
function httpGet(url, data, success, fail) {

	if (isObject(data)) { //传入了 data 参数
		url = buildQueryUrl(url, data);
	} else { // 没有传入 data 参数
		fail = success;
		success = data;
	}
	request(url, "GET", true, null, success, fail);
}

/**
 * 发送同步 http GET 请求
 * @param url
 * @param data
 * @param success
 * @param fail
 */
function asyncHttpGet(url, data, success, fail) {

	if (isObject(data)) { //传入了 data 参数
		url = buildQueryUrl(url, data);
	} else { // 没有传入 data 参数
		fail = success;
		success = data;
	}
	request(url, "GET", false, null, success, fail);
}

/**
 * 发送异步 http POST 请求
 * @param url
 * @param data
 * @param success
 * @param fail
 */
function httpPost(url, data, success, fail) {

	if( !data ){ // 没有传入 data 参数
		fail = success;
		success = data;
	}
	if (typeof success != "function") {
		success = function() {}
	}
	if (typeof fail != "function") {
		fail = function() {}
	}
	request(url, "POST", true, data, success, fail);
}

/**
 * 发送 http 请求
 * @param url 地址
 * @param method 请求方式, POST, GET
 * @param async 是否同步
 * @param data 数据
 * @param success 成功时候回调
 * @param fail 失败时候回调
 * @returns {*}
 */
function request(url, method, async, data, success, fail) {

	if (typeof success != "function") {
		success = function() {}
	}
	if (typeof fail != "function") {
		fail = function() {}
	}
	var options = {
		type: method,
		url: url,
		async: async,
		data: data,
		success: function(result) {
			if (result.code == "000") {
				success(result);
			} else {
				fail(result.message);
			}
		},
		dataType: "json",
		error: function(error) {
			fail(error);
		}
	};
	$.ajax(options);
}

/* 合并对象，使用 dist 覆盖 src */
function mergeObject(src, dist) {

	if (!isObject(src) || !isObject(dist)) {
		return;
	}
	for (var key in dist) {
		src[key] = dist[key];
	}
}

/* 判断是否是 javascript 对象 */
function isObject(obj) {
	return Object.prototype.toString.call(obj) == "[object Object]";
}

/* 判断是否是 javascript 对象 */
function isArray(arr) {
	return Object.prototype.toString.call(arr) == "[object Array]";
}

/* build query url */
function buildQueryUrl(url, params) {

	var p = [];
	for (var key in params) {
		p.push(key + "=" + params[key]);
	}
	if (url.indexOf("?") == -1) {
		url += "?" + p.join("&");
	} else {
		url += "&" + p.json("&");
	}
	return url;
};

// 成功提示
function messageOk(message, callback) {
	var layer = parent.layer === undefined ? layui.layer : top.layer;
	layer.msg(message, {icon:1}, callback);
}
// 失败提示
function messageError(message, callback) {
	var layer = parent.layer === undefined ? layui.layer : top.layer;
	layer.msg(message, {icon:2, anim:6}, callback);
}
function messageInfo(message, callback) {
	var layer = parent.layer === undefined ? layui.layer : top.layer;
	layer.msg(message, callback);
}
// 加载提示
function messageLoading(message) {
	message = message ? message : "正在处理中，请稍后..."
	var layer = parent.layer === undefined ? layui.layer : top.layer;
	return layer.msg(message,{icon: 16,time:false,shade:0.6});
}
// 关闭提示框
function loadingClose(index) {
	var layer = parent.layer === undefined ? layui.layer : top.layer;
	return layer.close(index);
}

//获取url中的参数
function getUrlParam(name)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == name){return pair[1];}
	}
	return(false);
}
/* 删除数组中的某个元素 */
function removeDataByKey(arr, key, value) {

	for (var i = 0; i < arr.length; i++) {
		if (arr[i][key] == value) {
			arr.splice(i, 1);
		}
	}
}

function getDataByKey(arr, key, value) {

	for (var i = 0; i < arr.length; i++) {
		if (arr[i][key] == value) {
			return arr[i];
		}
	}
}