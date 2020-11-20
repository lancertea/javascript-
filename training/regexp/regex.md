# 正则表达式练习题
## 单词首字母大写

```javascript
let str = "good good study，day day up！";
let reg = /\b([a-zA-Z])[a-zA-Z]*\b/g;
//=>函数被执行了六次，每一次都把正则匹配信息传递给函数
//=>每一次ARG:["good","g"] ["good","g"] ["study","s"]...
str = str.replace(reg,(...arg)=>{
    let [content,$1]=arg;
    $1=$1.toUpperCase();
    content=content.substring(1);
    return $1+content;
});
console.log(str); //=>"Good Good Study，Day Day Up！"
```

## 验证一个字符串中那个字母出现的次数最多，多少次？

```javascript
/*去重思维*/
let str = "abcstudyhardzhoulaoshi";
let obj = {};
[].forEach.call(str, char => {
	if (typeof obj[char] !== "undefined") {
		obj[char]++;
		return;
	}
	obj[char] = 1;
});
let max = 1,
	res = [];
for (let key in obj) {
	let item = obj[key];
	item > max ? max = item : null;
}
for (let key in obj) {
	let item = obj[key];
	if (item === max) {
		res.push(key);
	}
}
console.log(`出现次数最多的字符：${res}，出现了${max}次`);
   
/*排序*/
let str = "abcstudyhardzhoulaoshi";
str = str.split('').sort((a, b) => a.localeCompare(b)).join('');
// console.log(str);//=>"aeefghhhiilnnoopsuuuxzz"
let ary = str.match(/([a-zA-Z])\1+/g).sort((a, b) => b.length - a.length);
// console.log(ary); //=>["hhh", "uuu", "ee", "ii", "nn", "oo", "zz"]
let max = ary[0].length,
    res = [ary[0].substr(0, 1)];
    for (let i = 1; i < ary.length; i++) {
let item = ary[i];
   	if (item.length < max) {
    	break;
   	}
   	res.push(item.substr(0, 1));
}
console.log(`出现次数最多的字符：${res}，出现了${max}次`);
   
/*从最大到最小去试找*/
let str = "abcstudyhardzhoulaoshi",
   	max = 0,
   	res = [],
   	flag = false;
    str = str.split('').sort((a, b) => a.localeCompare(b)).join('');
    for (let i = str.length; i > 0; i--) {
let reg = new RegExp("([a-zA-Z])\\1{" + (i - 1) + "}", "g");
   	str.replace(reg, (content, $1) => {
   		res.push($1);
   		max = i;
   		flag = true;
   	});
   	if (flag) break;
   }
   console.log(`出现次数最多的字符：${res}，出现了${max}次`);
```

## 时间字符串格式化

```javascript
//=>服务器获取的
// "2019-8-13 16:51:3"
// "2019/8/13 16:51:3"
// "2019/8/13"
//=>想要转变为的格式
// "08月13日 16时51分"
// "2019年08月13日"
// "2019年08月13日 16时51分03秒"

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

/* 扩展到内置类String.prototype上 */
["formatTime"].forEach(item => {
	String.prototype[item] = eval(item);
});

let time = "2019-8-13 16:51:3";
console.log(time.formatTime());
console.log(time.formatTime("{0}年{1}月{2}日"));
console.log(time.formatTime("{1}-{2} {3}:{4}"));
time = "2019/8/13";
console.log(time.formatTime());
console.log(time.formatTime("{0}年{1}月{2}日"));
console.log(time.formatTime("{1}-{2} {3}:{4}"));
```

## 获取URL参数
```javascript
/* 
 * queryURLParams：获取URL地址问号后面的参数信息（可能也包含HASH值）
 *   @params
 *   @return
 *   [object]把所有问号参数信息以键值对的方式存储起来并且返回
 * 
 */
String.prototype.queryURLParams() {
	let obj = {};
	this.replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => obj[$1] = $2);
	this.replace(/#([^?=&#]+)/g, (...[, $1]) => obj['HASH'] = $1);
	return obj;
}

let url = "http://www.zhufengpeixun.cn/?lx=1&from=wx#video";
console.log(url.queryURLParams());
//=>{lx:1,from:'wx',HASH:'video'}
```

## 格式化金钱
```javascript
/* 
 * millimeter：实现大数字的千分符处理
 *   @params
 *   @return
 *     [string]千分符后的字符串
 */
String.prototype.millimeter = function () {
    return this.replace(/\d{1,3}(?=(\d{3})+$)/g, content => content + ',');
}


//如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。
//如果提供initialValue，从索引0开始。
function format(str) {
    // var str = num + '';
    //[ "4", "5", "9", "8",  "2", "6", "5", "1"]
    return str.split("").reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev;
    })
}

let num = "15628954"; //=>"15,628,954" 千分符
console.log(num.millimeter());
console.log(format(num));
num = "112345678256874"; //=>"12,345,678,256,874"
console.log(num.millimeter());
console.log(format(num));
```

