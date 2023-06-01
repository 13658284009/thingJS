let planList = null;

THING.Utils.dynamicLoad(["/static/utlis/request.js"], function () {
  post(
    "/production/planInformation/queryWithPage?page=1&size=10",
    {},
    function (res) {
      console.log("请求成功", res);
      planList = res.data.rows;
      createPlan()
    },
    false,
    false
  );
});

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
  // 将层级切换到园区 开启场景层级
  app.level.change(ev.campus);
  new THING.widget.Button("添加计划", createPlan);
  new THING.widget.Button("生产", shengchan);
  new THING.widget.Button("删除钢材", delgangcai);
  new THING.widget.Button("重置", reset);
  new THING.widget.Button("重置", getPlanList);
  //   setEnterFly();
});

/**
 * 创建冷床水面
 */
function createWater() {
  var water = app.create({
    type: "Water",
    id: "water02",
    name: "plane04",
    points: [15, 0, 0], // 点坐标
    style: {
      waterColor: "#60FFFF", // 颜色
      waterScale: 4, // 波纹系数
      flowXDirection: 1, // 水平流速
      flowYDirection: 2, // 垂直流速
    },
    complete: function () {
      initThingJsTip("圆形水面创建完成");
    },
  });
}

// /**
//  * 创建计划
//  */
let plan = {};
let gang = {};
let planGnagSize = 0; // 计划支数
function createPlan() {
  for (let j = 0; j < planList.length; j++) {
    planGnagSize = planList[j].planExpenditure
    plan["plan" + planList[j].planNo] = app.create({
      type: "Box",
      name: "plan",
      id: "plan",
      position: [-27, 0, 3.05],
      center: "Bottom", // 轴心
      width: 3,
      height: 0.5,
      depth: 1,
      angle: 0,
      style: {
        color: "#ffffff",
        opacity: 0.8,
      },
      complete: function () {},
    });
    // app.selection.select(plan)
    console.log("查询某物体是否在选择集中", app.selection.has(plan));
    for (let i = 0; i < planGnagSize; i++) {
      let lie = i % 16;
      let ceng = Math.floor(i / 16);
      let positiona = [-27, 0 + ceng * 0.06, 2.6 + lie * 0.06];
      gang["gang" + i] = app.create({
        type: "Box",
        name: "gang" + i,
        id: "gang" + i,
        position: positiona,
        center: "Bottom", // 轴心
        width: 3,
        height: 0.05,
        depth: 0.05,
        angle: 0,
        parent: plan["plan" + planList[j].planNo],
        style: {
          color: "#0000ff",
        },
        complete: function () {},
      });
    }
  }
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
  getPlanList(); // 获取计划列表
}

/**
 * 修改默认的层级飞行响应
 * 双击进入建筑层级，展开楼层
 * 退出建筑关闭摊开的楼层
 */
function setEnterFly() {
  // 重置
  reset();

  //  暂停默认退出园区行为
  app.pauseEvent(
    THING.EventType.LeaveLevel,
    ".Campus",
    THING.EventTag.LevelSceneOperations
  );

  // 进入建筑摊开楼层
  app.on(
    THING.EventType.EnterLevel,
    ".Building",
    function (ev) {
      var previous = ev.previous; // 上一层级
      ev.current.expandFloors({
        time: 1000,
        complete: function () {
          console.log("ExpandFloor complete ");
        },
      });
    },
    "customEnterBuildingOperations"
  );
  // 进入建筑保留天空盒
  app.pauseEvent(
    THING.EventType.EnterLevel,
    ".Building",
    THING.EventTag.LevelSetBackground
  );

  //  退出建筑关闭摊开的楼层
  app.on(
    THING.EventType.LeaveLevel,
    ".Building",
    function (ev) {
      var current = ev.current; // 当前层级

      ev.object.unexpandFloors({
        time: 500,
        complete: function () {
          console.log("Unexpand complete ");
        },
      });
    },
    "customLeaveBuildingOperations"
  );
}

/**
 * 生产
 */
let dangqiangang = 0;
function shengchan() {
  console.log(dangqiangang, planGnagSize);
  if (dangqiangang > planGnagSize - 1) {
    initThingJsTip("计划钢材已执行完");
    return;
  }
  let dangqianid = dangqiangang;
  gang["gang" + dangqianid].moveTo({
    position: [-27, 0.35, 1.05], // 世界坐标系下的绝对位置
    time: 2 * 1000,
    orientToPath: false, // 物体移动时沿向路径方向
    complete: function () {
      gang["gang" + dangqianid].moveTo({
        position: [20, 0.35, 1.05], // 世界坐标系下的绝对位置
        time: 15 * 1000,
        orientToPath: false, // 物体移动时沿向路径方向
        complete: function () {},
      });
    },
  });
  dangqiangang++;
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
/**
 * 获取计划数据
 */
function getPlanList() {
  let token =
    "Authorize_eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJjb2RlXCI6XCJhZG1pblwiLFwibG9naW5UeXBlXCI6XCJCQUNLU1RBR0VcIixcInVzZXJJZFwiOjEsXCJ1c2VyVHlwZVwiOlwiU1VQRVJfQURNSU5JU1RSQVRPUlwiLFwidXNlcm5hbWVcIjpcIui2hee6p-euoeeQhuWRmFwifSIsImV4cCI6MTY4NTYxMTg3MSwiaWF0IjoxNjg1NTI1NDcxLCJuYmYiOjE2ODU1MjU0NzEsImlzcyI6ImF1dGhvcml6ZSIsImF1ZCI6Inlvbmd5YW5nLXN0ZWVsLWF1dGhvcml6ZSJ9.nbUl8q8RYxspEFQB-7TLAnWzgbZlmhvkEpT49Fltqjw";
  let url = "/production/planInformation/queryWithPage?page=1&size=10";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", token);
    },
    headers: {
      Authorization: token,
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Length": "2",
      "Content-Type": "application/json;charset=UTF-8",
      Host: "39.100.16.240:7014",
      Pragma: "no-cache",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
    },
    success: function (data) {
      console.log(data);
    },
    catch: function (err) {
      console.log("error:", err);
    },
  });
}
