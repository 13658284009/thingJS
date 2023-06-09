// FEEDING("上料","feeding"),
// STOKEHOLD_ROLLER("炉前辊道","stokeholdRoller"),
// HEATING_FURNACE("加热炉","heatingFurnace"),
// FURNACE_REAR_ROLLER("炉后辊道","furnaceRearRoller"),
// BEFORE_ROLLING("轧前","beforeRolling"),
// ZHAQU("轧区","zhaQu"),
// AFTER_ROLLING("轧后","afterRolling"),
// COLD_BED("冷床","coldBed"),
// FINISHING_WEIGH("精整-称重","finishingWeigh"),
// FINISHING_BALING("精整-打捆","finishingBaling")
// PERFORM_TASK("执行任务","performtask"),

var websock = null;
var global_callback = null;
var serverPort = "7017"; // webSocket连接端口
var wsuri = "ws://192.168.0.84:7017/websocket";
var pole = 0;
  function createWebSocket(callback) {
    console.log(websock, typeof websock, "sock打印");
    if (websock == null || typeof websock !== WebSocket) {
      initWebSocket(callback);
    }
  }

  function initWebSocket(callback) {
    global_callback = callback;
    // 初始化websocket
    websock = new WebSocket(wsuri);
    websock.onmessage = function (e) {
      websocketonmessage(e);
    };
    websock.onclose = function (e) {
      websocketclose(e);
    };
    websock.onopen = function () {
      pole = 0;
      websocketOpen();
    };

    // 连接发生错误的回调方法
    websock.onerror = function () {
      websock.close();
      pole++;
      if (pole < 10) {
        createWebSocket(callback);
        console.log("WebSocket连接发生错误，重连" + pole + "次");
      } else {
        console.log("WebSocket连接发生重连10次失败");
      }
      // if(pole==false){

      // pole=true
      // }

      //createWebSocket();啊，发现这样写会创建多个连接，加延时也不行
    };
  }

  // 实际调用的方法
  function sendSock(agentData) {
    if (websock.readyState === websock.OPEN) {
      // 若是ws开启状态
      websocketsend(agentData);
    } else if (websock.readyState === websock.CONNECTING) {
      // 若是 正在开启状态，则等待1s后重新调用
      setTimeout(function () {
        sendSock(agentData);
      }, 1000);
    } else {
      // 若未开启 ，则等待1s后重新调用
      setTimeout(function () {
        sendSock(agentData);
      }, 1000);
    }
  }

  function closeSock() {
    websock.close();
  }

  // 数据接收
  function websocketonmessage(msg) {
		console.log('数据回调')
    // console.log("收到数据："+JSON.parse(e.data));
    // console.log("收到数据："+msg);
    // global_callback(JSON.parse(msg.data));
    // 收到信息为Blob类型时
    let result = null;
    if (msg.data instanceof Blob) {
      const reader = new FileReader();
      reader.readAsText(msg.data, "UTF-8");
      reader.onload = (e) => {
        result = JSON.parse(reader.result);
        console.log("websocket收到1", result);
        global_callback(result);
      };
    } else {
      result = JSON.parse(msg.data);
      console.log("websocket收到2", result);
      global_callback(result);
    }
  }

  // 数据发送
  function websocketsend(agentData) {
    console.log("发送数据：", agentData);
    websock.send(agentData);
  }

  // 关闭
  function websocketclose(e) {
    console.log("connection closed (" + e.code + ")");
  }

  function websocketOpen(e) {
    console.log("连接打开");
  }
