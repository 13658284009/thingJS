
// 加载场景代码 
var app = new THING.App({
   url: '/api/scene/fa0c1bd3d86c48f089f684be'
});
/**
* 引入场景预览脚本
* 说明：引用该脚本需要传递参数，参数为创建的app对象、类型type，type的值有两种，scene和city，
*      用于区分园区和地图、如果type值为city，需要额外传递参数，参数值为创建的map对象。
* 备注：
*      1. 如果引入该脚本是预览园区，自v0.1.8版本起，需要自行决定是否在“load”事件中调用初始
*         化方法，初始化方法示例为：new AppPreview({app:app, type:'scene'})
*      2. 如果引入该脚本是预览地图，则应在引用地图组件脚本complete回调中引用，初始化
*         方法示例为：new AppPreview({app:app, type:'city', map:event.object})
*/

let line;
let wajueji1;

THING.Utils.dynamicLoad(['https://www.thingjs.com/guide/ScenePreview/v0.1.9/AppPreview.min.js'],
   function () {
       // 在load事件中的调用示例如下所示：
       app.on('load', function (ev) {
           app.background = 0xff8844;
           var campus = ev.campus;
           new AppPreview({ app: app, type: 'scene' });
           // 挖机对象
           wajueji1 = app.query('wajueji1')[0]
           // 货车对象
           huoche1 = app.query('huoche1')[0]
           yundongdewajueji1()
           yundongdehuoche1()
           new THING.widget.Button('查看路线', luxian);
           // 小地图
           xiaoditu()

       });
   }
)

// 路线图
function luxian() {
   console.log(huoche1.position, 'huoche1-position')
   var path = [[236, 0, -118], [-275, 0, -98], [-238, 0, 133], [246, 0, 135], [248, 0, -119], [321, 0, -126]];
   // var path = [[192, 0, -35], [170, 0, -35], [170, 0, -60], [192, 0, -60], [192, 0, -35]];
   line = app.create({
       type: 'Line',
       dotSize: 2, // 轨迹点的大小
       dotColor: 0xff0f30, // 轨迹点的颜色
       points: path,
   })
}

// 自由飞行
let ctrl = null
function feixing() {
   if (!ctrl) {
       ctrl = app.addControl(new THING.FlyControl());
   }
}

/**
* 自定运行的挖机1
*/
function yundongdewajueji1() {
   var path = [[192, 0, -35], [170, 0, -35], [170, 0, -60], [192, 0, -60], [192, 0, -35]];
   wajueji1.movePath({
       orientToPath: true, // 物体移动时沿向路径方向
       path: path, // 路径坐标点数组
       time: 30 * 1000, // 路径总时间 毫秒
       delayTime: 1000, // 延时 1s 执行
       lerpType: null, // 插值类型（默认为线性插值）此处设置为不插值
       complete: function (ev) {
           yundongdewajueji1()
       }
   });
}

/**
* 自定运行的货车1
*/
function yundongdehuoche1() {
   var path = [[236, 0, -118], [-275, 0, -98], [-238, 0, 133], [246, 0, 135], [248, 0, -119], [321, 0, -126], [321, 0, -128], [236, 0, -118]];
   huoche1.movePath({
       orientToPath: true, // 物体移动时沿向路径方向
       path: path, // 路径坐标点数组
       time: 30 * 1000, // 路径总时间 毫秒
       delayTime: 1000, // 延时 1s 执行
       lerpType: null, // 插值类型（默认为线性插值）此处设置为不插值
       // 仅当无循环时 有回调函数
       complete: function (ev) {
           setTimeout(() => {
               yundongdehuoche1()
           }, 100)
       }
   });
}

// 小地图控件
function xiaoditu() {
   var control = new THING.MiniMapControl({
       width: 200,
       height: 200,
       position: THING.CornerType.RightBottom,
       opacity: 0.8,
       cameraViewImg: 'https://www.thingjs.com/static/images/minimap1.png',
       cameraCenterImg: 'https://www.thingjs.com/static/images/minimap0.png',
       // hasClose: true, // 是否有关闭按钮（默认没有）当点击关闭按钮时，小地图 enable 为 false
       // closeBtnImg: 'https://www.thingjs.com/static/images/minimap2.png'
   })
   // 添加小地图控件
   app.addControl(control);
}

/**
* 重置
*/
function reset() {
   wajueji1.stopMoving();
   wajueji1.stopRotating();
   wajueji1.position = position;
   wajueji1.angles = [0, 0, 0];
   wajueji1.scale = [1, 1, 1];
   wajueji1.stopScaling();
   wajueji1.stopAnimation();
   app.camera.stopFlying();
   if (line) {
       line.destroy();
       line = null;
   }

   // 创建提示
   initThingJsTip(`点击左侧按钮，可以对查询到的对象进行连续运动控制以及动画控制（部分模型在制作阶段就内置了动画，可以通过脚本直接控制模型动画播放）`);
}

// 鼠标拾取物体显示边框
app.on(THING.EventType.MouseEnter, '.Thing', function (ev) {
   ev.object.style.outlineColor = '#FF0000';
});
// 鼠标离开物体边框取消
app.on(THING.EventType.MouseLeave, '.Thing', function (ev) {
   ev.object.style.outlineColor = null;
});

// 设置背景光线
app.skyEffect = {
   // 显示光源位置
   showHelper: false,
   // 光源扩散大小
   turbidity: 10,
   // 大气散射 
   rayleigh: 2,
   // 时间 [0~24]
   time: 12,
   // 水平角度
   beta: 30
};


// 火焰
var particle = app.create({
   id: 'fire01',
   type: 'ParticleSystem',
   name: 'Fire',
   url: 'https://model.3dmomoda.com/models/19061018snbajhvuzrheq9sbgwdoefuk/0/particles',
   position: [234, 0, -65] // 设置粒子相对于父物体的位置
});


// 延迟器
function yanci(){

}