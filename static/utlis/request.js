//页面加载所要进行的操作
$(function () {});
//设置ajax当前状态(是否可以发送);
let headerUrl = "http://192.168.0.76:7014";
let ajaxStatus = true;
let token =
  "Authorize_eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJjb2RlXCI6XCJhZG1pblwiLFwibG9naW5UeXBlXCI6XCJCQUNLU1RBR0VcIixcInVzZXJJZFwiOjEsXCJ1c2VyVHlwZVwiOlwiU1VQRVJfQURNSU5JU1RSQVRPUlwiLFwidXNlcm5hbWVcIjpcIui2hee6p-euoeeQhuWRmFwifSIsImV4cCI6MTY4NTYxMTg3MSwiaWF0IjoxNjg1NTI1NDcxLCJuYmYiOjE2ODU1MjU0NzEsImlzcyI6ImF1dGhvcml6ZSIsImF1ZCI6Inlvbmd5YW5nLXN0ZWVsLWF1dGhvcml6ZSJ9.nbUl8q8RYxspEFQB-7TLAnWzgbZlmhvkEpT49Fltqjw";

// ajax封装
function ajax(url, data, success, cache, alone, async, type, dataType, error) {
  var type = type || "post"; //请求类型
  var dataType = dataType || "json"; //接收数据类型
  var async = async || true; //异步请求
  var alone = alone || false; //独立提交（一次有效的提交）
  var cache = cache || false; //浏览器历史缓存
  var success =
    success ||
    function (data) {
      /*console.log('请求成功');*/
      setTimeout(function () {
        initThingJsTip(data.msg);
        console.log(data.msg);
      }, 500);
      if (data.status) {
        //服务器处理成功
        setTimeout(function () {
          if (data.url) {
            location.replace(data.url);
          } else {
            location.reload(true);
          }
        }, 1500);
      } else {
        //服务器处理失败
        if (alone) {
          //改变ajax提交状态
          ajaxStatus = true;
        }
      }
    };
  var error =
    error ||
    function (data) {
      /*console.error('请求成功失败');*/
      /*data.status;//错误状态吗*/
      // layer.closeAll("loading");
      setTimeout(function () {
        if (data.status == 404) {
          initThingJsTip("请求失败，请求未找到");
        } else if (data.status == 503) {
          initThingJsTip("请求失败，服务器内部错误");
        } else {
          initThingJsTip("请求失败,网络连接超时");
        }
        ajaxStatus = true;
      }, 500);
    };
  /*判断是否可以发送请求*/
  if (!ajaxStatus) {
    return false;
  }
  ajaxStatus = false; //禁用ajax请求
  /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
  if (!alone) {
    setTimeout(function () {
      ajaxStatus = true;
    }, 1000);
  }
  $.ajax({
    headers: {
      Authorization: token,
    },
    contentType: "application/json",
    url: url,
    data: JSON.stringify(data),
    type: type,
    dataType: dataType,
    async: async,
    success: success,
    error: error,
    jsonpCallback: "jsonp" + new Date().valueOf().toString().substr(-4),
    beforeSend: function () {
      initThingJsTip("加载中", {
        //通过layer插件来进行提示正在加载
        icon: 16,
        shade: 0.01,
      });
    },
  });
}

// submitAjax(post方式提交)
function submitAjax(form, success, cache, alone) {
  cache = cache || true;
  var form = $(form);
  var url = form.attr("action");
  var data = form.serialize();
  ajax(url, data, success, cache, alone, false, "post", "json");
}
/*//调用实例
$(function () {
  $('#form-login').submit(function () {
      submitAjax('#form-login');
      return false;
  });
});*/

// ajax提交(post方式提交)
function post(url, data, success, cache, alone) {
  ajax(headerUrl + url, data, success, cache, alone, false, "post", "json");
}

// ajax提交(get方式提交)
function get(url, success, cache, alone) {
  ajax(headerUrl + url, {}, success, alone, false, "get", "json");
}

// jsonp跨域请求(get方式提交)
function jsonp(url, success, cache, alone) {
  ajax(headerUrl + url, {}, success, cache, alone, false, "get", "jsonp");
}
