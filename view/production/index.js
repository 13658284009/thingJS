/**
 * 获取计划数据
 */
function getPlanList() {
  post(
    "/production/planInformation/queryWithPage",
    { page: 1, size: 10 },
    {},
    function (res) {
      console.log("计划列表", res);
      if (res.data && res.data.rows) {
        planList = res.data.rows;
      } else {
        planList = [];
      }
      createPlan();
    },
    false,
    false
  );
}

// /**
//  * 创建计划 3D 模型
//  */
let plan = {};
let gang = {};
let planGnagSize = 0; // 计划支数
function createPlan() {
  for (let j = 0; j < planList.length; j++) {
    if(planList[j].planExpenditure > 200) {
      planGnagSize = 200; // 计划支数
    } else {
      planGnagSize = planList[j].planExpenditure; // 计划支数
    }
    
    plan["plan" + planList[j].planNo] = app.create({
      type: "Box",
      name: "plan" + planList[j].planNo,
      id: "plan" + planList[j].planNo,
      position: [-32, 0, 3.05],
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
      let positiona = [-32, 0 + ceng * 0.06, 2.6 + lie * 0.06];
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
    position: [-32, 0.35, 0.95], // 世界坐标系下的绝对位置
    time: 2 * 1000,
    orientToPath: false, // 物体移动时沿向路径方向
    complete: function () {
      gang["gang" + dangqianid].moveTo({
        position: [25, 0.35, 0.95], // 世界坐标系下的绝对位置
        time: 15 * 1000,
        orientToPath: false, // 物体移动时沿向路径方向
        complete: function () {},
      });
    },
  });
  dangqiangang++;
}
/**
 * 创建物体顶牌
 */
function createMarker() {
  var html = `
      <div id="board" class="marker" style="position: absolute;display:none;">
          <div class="text" style="background: #fff;padding: 10px;border-radius: 4px;color: #FF0000;font-size: 12px;text-shadow: white  0px 2px, white  2px 0px, white  -2px 0px, white  0px -2px, white  -1.4px -1.4px, white  1.4px 1.4px, white  1.4px -1.4px, white  -1.4px 1.4px;margin-bottom: 5px;">
          </div>
      </div>`;
  $("#div3d").append($(html));
}
// 生成一个新面板
function createElement(item) {
  var srcElem = document.getElementById("board");
  var newElem = srcElem.cloneNode(true);
  newElem.style.display = "block";
  newElem.setAttribute("id", item.id);
  app.domElement.insertBefore(newElem, srcElem);
  return newElem;
}
