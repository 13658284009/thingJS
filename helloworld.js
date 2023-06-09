let planList = null;

THING.Utils.dynamicLoad(
  [
    "/static/jquery.base64.js",
    "/static/echarts-5.4.2/echarts.min.js",
    // "/static/Bootstrap-4.4.1/bootstrap.min.css",
    // "/static/Bootstrap-4.4.1/bootstrap.min.js",
    // layui
    "/static/layui-2.8.4/css/layui.css",
    "/static/layui-2.8.4/layui.js",
    "/static/utlis/request.js",
    "/static/js/myPlugin.js",
    "/view/login.js",
    "/static/js/css.js",
    "/view/production/index.js",
    "/view/panel/index.js",
    "/view/layerMonitoring/index.js",
    
  ],
  function () {
    console.log('echarts', echarts)
  }
);

var app = new THING.App({
  // 引用场景
  url: "/api/scene/production_170344", // 场景地址
  skyBox: "BlueSky", // 天空盒
  resourceLibraryUrl: "./",
  background: "#000000",
  skyBox: "Night",
  env: "Seaside",
});

// // 初始化完成后开启场景层级
var campus;
app.on("load", function (ev) {
  campus = ev.campus;
  app.level.change(campus);
  // 将层级切换到园区 开启场景层级
  app.level.change(ev.campus);
  new THING.widget.Button("添加计划", createPlan);
  new THING.widget.Button("生产", shengchan);
  new THING.widget.Button("删除钢材", delgangcai);
  new THING.widget.Button("重置", reset);
  new THING.widget.Button("重置", getPlanList);

  // 初始化
  if (token) {
    getPlanList();
  }
  click();
  db();
  createMarker();
  setEnterFly();
});

/**
 * 创建冷床水面
 */
function createWater() {
  // var water = app.create({
  //   type: "Water",
  //   id: "water02",
  //   name: "plane04",
  //   points: [15, 0, 0], // 点坐标
  //   style: {
  //     waterColor: "#60FFFF", // 颜色
  //     waterScale: 4, // 波纹系数
  //     flowXDirection: 1, // 水平流速
  //     flowYDirection: 2, // 垂直流速
  //   },
  //   complete: function () {
  //     initThingJsTip("圆形水面创建完成");
  //   },
  // });
}

/**
 * 重置
 * app.resumeEvent 暂停事件
 * app.off 卸载事件
 */
function reset() {
  // 创建提示
  var curLevel = app.level.current; // 当前层级
  app.skyBox = "Night"; // 设置天空盒
  if (curLevel instanceof THING.Building) {
    curLevel.unexpandFloors({
      time: 500,
      complete: function () {
        console.log("Unexpand complete ");
      },
    });
  }
  app.level.change(campus);
  delgangcai();
}

/**
 * 删除钢材
 */
function delgangcai() {
  dangqiangang = 0;
  // 移除场景中name中包含thing的对象
  var thingArr = app.query(/gang/);
  thingArr.destroyAll();
}
