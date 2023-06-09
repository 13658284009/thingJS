/**
 * 监听图层变化
 */
function setEnterFly() {
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

  // 退出物体层级默认操作行为
  app.on(
    THING.EventType.LeaveLevel,
    ".Thing",
    function (ev) {
      console.log(ev);
      var current = ev.current; // 当前层级
      if ($("#screenID").length != 0) {
        $("#screenID")[0].style.display = "none";
        $(".marker").remove();  // 移除标注
        createMarker()
      }
      console.log("退出物体层");
    },
    "customLeaveBuildingOperations"
  );
}
