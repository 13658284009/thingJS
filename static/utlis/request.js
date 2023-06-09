var layer = layui.layer;

//页面加载所要进行的操作
$(function () {});

let headerUrl = "http://192.168.0.84:7014";
// let token =
// "Authorize_eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJjb2RlXCI6XCJhZG1pblwiLFwibG9naW5UeXBlXCI6XCJCQUNLU1RBR0VcIixcInVzZXJJZFwiOjEsXCJ1c2VyVHlwZVwiOlwiU1VQRVJfQURNSU5JU1RSQVRPUlwiLFwidXNlcm5hbWVcIjpcIui2hee6p-euoeeQhuWRmFwifSIsImV4cCI6MTY4NTcwMTAzNywiaWF0IjoxNjg1NjE0NjM3LCJuYmYiOjE2ODU2MTQ2MzcsImlzcyI6ImF1dGhvcml6ZSIsImF1ZCI6Inlvbmd5YW5nLXN0ZWVsLWF1dGhvcml6ZSJ9.Pn87vDD5fp4S-4EO3bqes69-nCEnut6zxokIXclUc2o";
let token = localStorage.getItem("token");

//设置ajax当前状态(是否可以发送);
let ajaxStatus = true;

let baimingdan = [
  "/authorize/authorization/login",
  "/authorize/verification/code/generateVerificationCode",
];

// ajax封装
function ajax(
  url,
  urls,
  data,
  success,
  cache,
  alone,
  async,
  type,
  dataType,
  error
) {
  var type = type || "post"; //请求类型
  var dataType = dataType || "json"; //接收数据类型
  var async = async || true; //异步请求
  var alone = alone || false; //独立提交（一次有效的提交）
  var cache = cache || false; //浏览器历史缓存
  var success1 = function (data) {
    console.log("success1", data);
    if (data.status == 0) {
      success(data);
    } else if (data.status == 1) {
      //服务器处理成功
      success(data);
    } else if (data.status == 3) {
      //服务器处理成功
      localStorage.removeItem("token");
      layer.msg("token失效,请重新登录");
      openLogin();
    } else {
      layer.msg(data.message);
    }
  };
  var error1 =
    error ||
    function (data) {
      /*console.error('请求成功失败');*/
      /*data.status;//错误状态吗*/
      // layer.closeAll("loading");
      console.log("请求失败", data);
      if (data.status == 404) {
        layer.msg("请求失败，请求未找到");
      } else if (data.status == 503) {
        layer.msg("请求失败，服务器内部错误");
      } else if (data.status == 400) {
        layer.msg("请求失败，参数错误");
      } else {
        layer.msg("请求失败,网络连接超时");
      }
      ajaxStatus = true;
    };
  /*判断是否可以发送请求*/
  // if (!ajaxStatus) {
  //   return false;
  // }
  ajaxStatus = false; //禁用ajax请求
  /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
  if (!alone) {
    setTimeout(function () {
      ajaxStatus = true;
    }, 1000);
  }

  let ajaxContent = {
    // contentType: 'application/json',
    url: url,
    data: JSON.stringify(data),
    type: type,
    dataType: dataType,
    async: async,
    success: success1,
    error: error1,
    // jsonpCallback: "jsonp" + new Date().valueOf().toString().substr(-4),
    beforeSend: function (request) {
      if (!baimingdan.includes(urls)) {
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Authorization", token);
      }
      layui.util.on("lay-on", {});
      // initThingJsTip("加载中", {
      //   //通过layer插件来进行提示正在加载
      //   icon: 16,
      //   shade: 0.01,
      // });
    },
  };
  // console.log(ajaxContent);
  $.ajax(ajaxContent);
}

// submitAjax(post方式提交)
function submitAjax(form, success, cache, alone) {
  cache = cache || true;
  var form = $(form);
  var url = form.attr("action");
  var data = form.serialize();
  ajax(url, data, success, cache, alone, false, "post", "json");
}

// ajax提交(post方式提交)
function post(url, parmas, data, success, cache, alone) {
  console.log(baimingdan.includes(url), url);

  if (!baimingdan.includes(url)) {
    if (token) {
    } else {
      return;
    }
  }

  let newParmas = disposeParmas(parmas); // url传参
  ajax(
    headerUrl + url + newParmas,
    url,
    data,
    success,
    cache,
    alone,
    false,
    "post",
    "json"
  );
}

// ajax提交(get方式提交)
function get(url, success, cache, alone) {
  ajax(headerUrl + url, {}, success, alone, false, "get", "json");
}

// jsonp跨域请求(get方式提交)
function jsonp(url, success, cache, alone) {
  ajax(headerUrl + url, {}, success, cache, alone, false, "get", "jsonp");
}

// 设置url传参
function disposeParmas(parmas) {
  let newParmas;
  if (JSON.stringify(parmas) == "{}") {
    newParmas = "";
  } else {
    newParmas = "?";
  }
  for (let key in parmas) {
    if (newParmas == "?") {
      newParmas = newParmas + key + "=" + parmas[key];
    } else {
      newParmas = newParmas + "&" + key + "=" + parmas[key];
    }
  }
  return newParmas;
}
