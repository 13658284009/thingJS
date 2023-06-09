/**
 * 单击事件
 */
function click() {
  var mouseDownPos = null;
  // 右键按下记录下当前位置
  app.on("mousedown", function (event) {
    // if (event.button == 0) { mouseDownPos = [event.x, event.y]; }
  });

  // click时，小于4像素执行才执行
  app.on("click", function (event) {
    // if (event.button == 0) {
    //     if (event.picked && THING.Math.getDistance(mouseDownPos, [event.x, event.y]) < 4) {
    //         app.query('car01')[0].position = event.pickedPosition;
    //     }
    // }
  });
}
/**
 * 双击事件
 */
function db() {
  // initThingJsTip("鼠标左键双击物体，物体顶牌");
  app.on("dblclick", function (ev) {
    console.log(ev);
    if (ev.object) {
      var obj = ev.object;
    } else {
      if ($("#screenID").length != 0) {
        $("#screenID")[0].style.display = "none";
      }
      return;
    }
    // e.button 0 为左键 2为右键
    if (!ev.picked || ev.button != 0) {
      return;
    }
    if (obj.id == 1) return;
    if (ev.picked) {
      console.log("物体详情", ev);

      var item = app.query("#" + obj.id)[0];

      // 详细数据大屏
      if (item.id.indexOf("db-") == -1) {
        if ($("#screenID").length != 0) {
          $("#screenID")[0].style.display = "none";
        }
      } else {
        ui = app.create({
          type: "UIAnchor",
          parent: item,
          element: createElement(item),
          localPosition: [0, 0.5, 0],
          pivot: [0.5, 1], //  [0,0]即以界面左上角定位，[1,1]即以界面右下角进行定位
        });
        $("#" + item.id + " .text").text("name：" + item.name);

        // console.log($("#screenID").length);
        if ($("#screenID").length == 0) {
          $("head").append($(dbCss));
          setTimeout(() => {
            $("body").append($(dbHtml));

            var chartDom = document.getElementById("screenIDLiftBox1");
            var myChart = echarts.init(chartDom);
            var option;

            option = {
              xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: "line",
                },
              ],
            };

            option && myChart.setOption(option);
            THING.Utils.dynamicLoad([
              "/view/panel/left/index.js"
            ], function() {

            })
          }, 200);
        } else {
          $("#screenID")[0].style.display = "block";
        }
      }
    }
  });
}

let dbHtml = `
  <div id="screenID" class="screen">
    <div class="left">
      <div id="screenIDLiftBox1" class="screenIDLiftBox1"></div>
    </div>
    <div id="sreeIDContent" class="content"></div>
    <div class="right"></div>
  </div>
`;

let dbCss = `
  <style>
    .screen{
    }
    .screen .screenIDLiftBox1 {
      width: 100%;
      height: 400px;
      background: #fff;
    }
    .screen > .left {
      background: rgba(0,0,0,0.5);
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px;
      z-index: 10;
      width: 30%;
      height: 100%;
      box-sizing: border-box;
    }
    .screen > .content {
      background: rgba(0,0,0,0.5);
      position: absolute;
      bottom: 0;
      left: 31%;
      padding: 10px;
      z-index: 10;
      width: 38%;
      min-height: 10px;
      padding: 10px;
      box-sizing: border-box;
    }
    .screen > .right {
      background: rgba(0,0,0,0.5);
      position: absolute;
      top: 0;
      right: 0;
      padding: 10px;
      z-index: 10;
      width: 30%;
      height: 100%;
      box-sizing: border-box;
    }
  </style>
`;
