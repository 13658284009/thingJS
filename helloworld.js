var app = new THING.App({
  // 引用场景
  url: "/api/scene/20210616095248956300069", // 场景地址
  skyBox: "BlueSky", // 天空盒
  resourceLibraryUrl: "./",
});

app.on("load", function () {
  // 创建模型
  let obj = app.create({
    type: "Thing",
    name: "宇航员",
    url: "/api/models/7bfb3321557a40fead822d7285ac5324/0/gltf/",
    position: [0, 0, 0],
    angle: 45,
  });

  obj.playAnimation({
    name: "_defaultAnim_",
    loopType: THING.LoopType.Repeat,
  });
});
