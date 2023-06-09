/**
 * 数据对接
 */
function updateData(obj) {

	// 对接自有websoket服务器
	if (!webSocket) {

		// 如果 ThingJS 网站是 https 则对应 wss
		// 如果 ThingJS 网站是 http 则对应 ws 即可
		webSocket = new WebSocket('wss://3dmmd.cn/wss');
		// 建立 websocket 连接成功触发事件
		webSocket.onopen = function () {
			console.log("websoket服务器连接成功...");
		};

		// 接收服务端数据时触发事件
		webSocket.onmessage = function (evt) {
			var data = evt.data;
			nowDatetime();
			if (($('.empty').length)) {
				$('.empty').remove();
			}
			if (!($('.tj-group').length)) {
				let tbody = `<tbody class="tj-group" id="tb-line"></tbody>`;
				$('.tj-table').prepend(tbody);
			}
			let tr =
				`<tr class="tj-group-content">
					<td class="tj-key">` + dateString + `</td>
					<td class="tj-value">` + data + `℃</td>
				</tr>`;
			$('.tj-group').prepend(tr);
			// 设置物体身上的监控数据
			obj.setAttribute("monitorData/温度", data);
			changeColor(obj);
		};

		webSocket.onclose = function (evt) {
			console.log("websoket关闭...");
			webSocket = null;
		}
	}
}

/**
 * 关闭数据请求
 */
function stopUpdate() {
	// 关闭连接
	webSocket.close();
}