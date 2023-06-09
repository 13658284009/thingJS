let codeImg = "";
let codeKey = "";
let loginView = `
  <div class="login-box" id="loginBox">
    <div class="login-item">
      <div class="login-title">登录</div>
      <div class="login-content">
        <form class="layui-form"  id="loginForm">
          <div class="demo-login-container">
            <div class="layui-form-item">
              <div class="layui-input-wrap">
                <div class="layui-input-prefix">
                  <i class="layui-icon layui-icon-username"></i>
                </div>
                <input type="text" name="username" value="" lay-verify="required" placeholder="用户名" lay-reqtext="请填写用户名" autocomplete="off" class="layui-input" lay-affix="clear">
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-input-wrap">
                <div class="layui-input-prefix">
                  <i class="layui-icon layui-icon-password"></i>
                </div>
                <input type="password" name="password" value="" lay-verify="required" placeholder="密   码" lay-reqtext="请填写密码" autocomplete="off" class="layui-input" lay-affix="eye">
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-row">
                <div class="layui-col-xs9">
                  <div class="layui-input-wrap">
                    <div class="layui-input-prefix">
                      <i class="layui-icon layui-icon-vercode"></i>
                    </div>
                    <input type="text" name="captcha" value="" lay-verify="required" placeholder="验证码" lay-reqtext="请填写验证码" autocomplete="off" class="layui-input" lay-affix="clear">
                  </div>
                </div>
                <div class="layui-col-xs3">
                  <div style="margin-left: 10px;" onclick="getCode()" class="codeCss" id="codeBox">
                  </div>
                </div>
              </div>
            </div>
            <div class="layui-form-item">
              <input type="checkbox" name="remember" lay-skin="primary" title="记住密码">
              <a href="#forget" style="float: right; margin-top: 7px;">忘记密码？</a>
            </div>
            <div class="layui-form-item">
              <button class="layui-btn-fluid layui-btn layui-btn-normal" lay-submit lay-filter="demo-login">登录</button>
            </div>
            <div class="layui-form-item demo-login-other">
              <a href="#reg">注册帐号</a>
            </div>
          </div>
        </form>

      </div>
    </div>
  </div>
`;

app.on("load", function (ev) {
  if (!token) {
    openLogin();
  } else {
    successLogin();
  }
});

// 获取验证码
function getCode() {
  $("#codeBox")[0].innerText = "";
  $("#codeBox").append($(`<p style="padding: 8px 6px;">加载中...</p>`));
  post(
    "/authorize/verification/code/generateVerificationCode",
    {},
    {},
    function (res) {
      console.log('hahah',res);
      $("#codeBox")[0].innerText = "";
      codeImg =
        "data:image/jpg;base64," + res.data.base64VerificationCodeString;
      $("#codeBox").append(
        $(`<img style="cursor: pointer;" id="codeId" src="${codeImg}">`)
      );
      $("#codeId")[0].src = codeImg;
      codeKey = res.data.key;
    },
    false,
    false
  );
}

layui.use(function () {
  var form = layui.form;
  var layer = layui.layer;
  // 提交事件
  form.on("submit(demo-login)", function (data) {
    var field = data.field; // 获取表单字段值
    // 此处可执行 Ajax 等操作
    post(
      "/authorize/authorization/login",
      {
        key: codeKey,
        loginType: "BACKSTAGE",
        username: field.username,
        password: $.base64.btoa(field.password),
        verificationCode: field.captcha,
      },
      {},
      function (res) {
        if (res.status == 0) {
          localStorage.setItem("token", res.data);
          layer.msg("登录成功", { icon: 1 }, function () {
            // layer.msg('提示框关闭后的回调');
          });
          successLogin();
          $("#loginBox").remove();
          console.log(res);
        } else {
          getCode();
          layer.msg(res.message, { icon: 0 }, function () {
            // layer.msg('提示框关闭后的回调');
          });
        }
      }
    );
    return false; // 阻止默认 form 跳转
  });
});

// 打开登录框
function openLogin() {
  if ($("#loginBox").length == 0) {
    $("body").append($(loginView));
    getCode();
  }
}

// 登录成功后处理
function successLogin() {
  $("body").append(
    $(`
    <div class="out-login" id="outLogin">
      <button onclick="onOutLoding()" type="button" class="layui-btn layui-btn-primary">退出登录</button>
    </div>
  `)
  );
}

/**
 * 退出登录
 */
function onOutLoding() {
  layer.open({
    title: `<div>
              <i class="layui-icon layui-icon-question" style="font-size: 20px; color: #faad14;"></i>         
              <span>提示</span>
            </div>`,
    content: "确定要退出登录吗？",
    anim: 1,
    isOutAnim: true,
    moveOut: true,
    btn: ["确认", "取消"],
    // 按钮1 的回调
    btn1: function (index, layero, that) {
      console.log(index, layero, that);
      // 确认
      // 接口或直接清除  token
      post("/authorize/authorization/login/out", {}, {}, function (res) {
        localStorage.removeItem("token");
        $("#outLogin").remove();
        openLogin();
        layer.close(index);
      });
    },
    btn2: function (index, layero, that) {
      return true;
      // 取消
    },
  });
}

$("head").append(
  $(`
  <style>
  .out-login {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 998;
  }
  .out-login > .layui-btn-primary{
    color: #ff5722;
  }
  .out-login > .layui-btn-primary:hover{
    color: #ff5722;
    border-color:  #ff5722;
  }
  .login-box {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(0,0,0,0.5);
    z-index: 999!important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-item {
    width: 350px;
    padding: 20px;
    border-radius: 6px;
    background: #fff;
  }
  
  .login-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .form-check {
    display: flex;
    align-items: center;
  }
  .form-group {
    display: flex;
    align-items: center;
  }
  .form-group > label{
    padding-right: 10px;
  }
  .form-group > input{
    flex: 1;
  }
  .codeCss {
    border: 1px solid #007bff;
    border-radius: 2px;
  }
  .login-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
`)
);
