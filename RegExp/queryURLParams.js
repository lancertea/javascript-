~ function () {
	/*
	 * formatTime：时间字符串的格式化处理
	 *   @params
	 *     templete:[string] 我们最后期望获取日期格式的模板
	 *     模板规则:{0}->年  {1~5}->月日时分秒
	 *   @return
	 *     [string]格式化后的时间字符串
	 *  
	 */
	function formatTime(templete = "{0}年{1}月{2}日 {3}时{4}分{5}秒") {
		let timeAry = this.match(/\d+/g);
		return templete.replace(/\{(\d+)\}/g, (...[, $1]) => {
			let time = timeAry[$1] || "00";
			return time.length < 2 ? "0" + time : time;
		});
	}

	/* 
	 * queryURLParams：获取URL地址问号后面的参数信息（可能也包含HASH值）
	 *   @params
	 *   @return
	 *     [object]把所有问号参数信息以键值对的方式存储起来并且返回
	 * 
	 */
	function queryURLParams() {
		let obj = {};
		this.replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => obj[$1] = $2);
		this.replace(/#([^?=&#]+)/g, (...[, $1]) => obj['HASH'] = $1);
		return obj;
	}

	/* 扩展到内置类String.prototype上 */
	["formatTime", "queryURLParams"].forEach(item => {
		String.prototype[item] = eval(item);
	});
}();
let url = "http://www.zhufengpeixun.cn/?lx=1&from=wx#video";
console.log(url.queryURLParams());
//=>{lx:1,from:'wx',HASH:'video'}