
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
let uiAnchorPanel;
let selectDmoe;

THING.Utils.dynamicLoad(['https://www.thingjs.com/guide/ScenePreview/v0.1.9/AppPreview.min.js'],
    function () {
        // 在load事件中的调用示例如下所示：
        app.on('load', function (ev) {
            app.background = 0xff8844;
            var campus = ev.campus;
            new AppPreview({ app: app, type: 'scene' });

            // 创建模型
            var a = app.create({
                type: "Thing",
                name: 'huoche2',
                url: "models/truck/",
                position: [170, 0, -35],
                opacity: 0.5,
                complete: function () {
                    console.log("truck created!"); //创建完成后日志窗口显示返回信息
                }
            })

            // 挖机对象
            wajueji1 = app.query('wajueji1')[0]
            // 货车对象
            huoche1 = app.query('huoche1')[0]
            yundongdewajueji1()
            yundongdehuoche1()
            new THING.widget.Button('查看路线', luxian);
            // 小地图
            xiaoditu()

            app

            // 点击挖掘机事件
            wajueji1.on('click', function (ev) {
                selectDmoe = ev
                uiAnchorPanel = new CreateUIAnchor()
            })

        });
    }
)

/**
 * 创建 UIAnchor
 */
class CreateUIAnchor {
    constructor() {
        this.ui = null;
        this.init();
    }

    /**
     * 初始化面板
     */
    init() {
        console.log(selectDmoe, '当前选择的dome')
        var _this = this;
        var template =
            `<div class="sign" id="board" style="font-size: 12px;width: 120px;text-align: center;background-color: rgba(0, 0, 0, .6);border: 3px solid #eeeeee;border-radius: 8px;color: #eee;position: absolute;top: 0;left: 0;z-index: 10;display: none;">
           <div style="display: flex; justify-content:"end"><span id="clear" style="cursor: pointer;">X</span></div>
    <div class="s1" style="margin: 5px 0px 5px 0px;line-height: 32px;overflow: hidden;">
      <span class="span-l font" style="float: left;margin: 0px 0px 0px 3px;">运行状态</span>
      <span class="span-r point" style="float: right;width: 12px;height: 12px;background-color: #18EB20;border-radius: 50%;margin: 10px 5px 10px 0px;"></span>
    </div>
    <div class="s2" style="margin: 5px 0px 10px 0px;line-height: 18px;font-size: 10px;overflow: hidden;">
      <span class="span-l font1" style="float: left;margin: 0px 10px 0px 10px;">名称</span>
      <span class="span-l font2" style="float: left;width: 70px;background-color: #2480E3;">`+ selectDmoe.object.name + `</span>
    </div>
    <div class="point-top" style="position: absolute;top: -7px;right: -7px;background-color: #3F6781;width: 10px;height: 10px;border: 3px solid #eee;border-radius: 50%;"></div>
  </div>`
        $('#div3d').append($(template));
        this.test_create_ui();
        $('#clear').click(function () {
            if (uiAnchorPanel && uiAnchorPanel.ui) {
                uiAnchorPanel.ui.destroy(); // 移除UIAnchor
                uiAnchorPanel.ui = null;
            }
        })
    }

    /**
     * 创建UIAnchor
     */
    test_create_ui() {
        var _this = this;
        _this.ui = app.create({
            type: 'UIAnchor',
            parent: app.query('wajueji1')[0],
            element: _this.create_element(),
            localPosition: [0, 2, 0],
            pivot: [0.5, 1] //  [0,0]即以界面左上角定位，[1,1]即以界面右下角进行定位
        });
    }

    /**
     * 创建dom元素
     */
    create_element() {
        var srcElem = document.getElementById('board');
        var newElem = srcElem.cloneNode(true);
        newElem.style.display = "block";
        app.domElement.insertBefore(newElem, srcElem);
        return newElem;
    }
}

// 路线图
function luxian() {
    // console.log(huoche1.position, 'huoche1-position')
    // var path = [[236, 0, -118], [-275, 0, -98], [-238, 0, 133], [246, 0, 135], [248, 0, -119], [321, 0, -126]];
    // // var path = [[192, 0, -35], [170, 0, -35], [170, 0, -60], [192, 0, -60], [192, 0, -35]];
    // line = app.create({
    //     type: 'Line',
    //     dotSize: 2, // 轨迹点的大小
    //     dotColor: 0xff0f30, // 轨迹点的颜色
    //     points: path,
    // })

    // 请求
    $.ajax({
        type: "get",
        url: "../luxian.js",
        dataType: "json", // 返回的数据类型，设置为JSONP方式
        jsonpCallback: "callback", // 设置回调函数名 与返回数据的 函数名一致
        success: function (d) {
            console.log(d, '测试')
        }
    });
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
    var path = [[321, 0, -128], [-275, 0, -98], [-238, 0, 133], [246, 0, 135], [248, 0, -119], [321, 0, -126], [321, 0, -128]];
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
function yanci() {

}

