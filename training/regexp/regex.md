# 正则表达式练习题
## 字符串匹配

```javascript
//实现一个字符串匹配算法，从字符串 S 中，查找是否存在字符串 T，若存在返回所在位置，
//不存在返回-1！（如果不能基于indexOf/includes等内置的方法，你会如何处理呢？）
String.prototype.myIndexOf = function (T) {
    //=>THIS:S
    let reg = new RegExp(T),
        res = reg.exec(this);
    return res === null ? -1 : res.index;
}
let S = 'hello,my love',
    T = 'love';
console.log(S.myIndexOf(T));
```

```javascript
//编写一个方法execAll，执行一次可以把所有匹配的结果捕获到（前提正则一定要设置全局修饰符g）
RegExp.prototype.execAll = function (str) {
    if (!this.global) {
        return this.exec(str);
    }
    let res = [],
        restr;
    while (restr = reg.exec(str)) {
        res.push(restr[0]);
    }
    return res.length ? res : null;
}

let reg = /\d+/g;
console.log(reg.execAll("去年2019@2020今年@未来2021"));
//=>字符串中的MATCH方法，可以在执行一次的情况下，捕获到所有匹配的数据（前提：正则也得设置G才可以）
console.log("去年2019@2020今年@未来2021".match(reg));
```

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

## 字符串大小写取反

```javascript
//如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc'
//A-Z (65-90)
let str = '123aCedBBB';
str = str.replace(/[a-zA-Z]/g, item => {
    return item.toUpperCase() === item ? item.toLowerCase() : item.toUpperCase();
})
console.log(str);
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

## 实现ES6模板字符串的功能

```javascript
//参考https://www.cnblogs.com/axu1997/p/12633582.html
let data = {
    name: 'zsy',
    date: '2020/4/12',
    address: '科技园'
}
let str = '${name}同学你好，你的面试时间为${date},面试地点为${address},请准时参加';
//arr=str.match(/\$\{(\w+)\}/g)
//Array(3) [ "${name}", "${date}", "${address}" ]

function templateFunc(str, data) {
    let reg = /\$\{(\w+)\}/g;
    let arr = [];
    while (arr = reg.exec(str)) {
        str = str.replace(arr[0], data[arr[1]]);
    }
    return str;
}
console.log(templateFunc(str, data));

let str1 = str.replace(/\$\{(\w+)\}/g, (...arg) => {
    let [context, $1] = arg;
        // context = data[$1];
        // return context;
        return data[$1];
    });
console.log(str1);
```

## 验证IP地址

```javascript
function matchIp(str) {
    let reg = /^(\d+).(\d+).(\d+).(\d+)$/;
    if (reg.test(str)) {
        let arr = str.match(reg).splice(1, 5);
        return arr.every(item => {
            return item >= 0 && item <= 255;
        });
    }
}
    let ip = "0.123.255.0";
    console.log(matchIp(ip));
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

## 网址

```javascript
//在输入框中如何判断输入的是一个正确的网址，例如：用户输入一个字符串，验证是否符合URL网址的格式 
let str = "https://www.baidududu.com.cn";
let reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
console.log(reg.exec(str));
//=>URL格式
//1.协议://  http/https/ftp
//2.域名
// www.baidududu.cn
// baidududu.cn
// kbs.sports.qq.com
// kbs.sports.qq.com.cn
//3.请求路径
// /
// /index.html
// /stu/index.html
// /stu/
//4.问号传参
// ?xxx=xxx&xxx=xxx
//5.哈希值
// #xxx
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

let url = "http://www.shantouuniversity.cn/?lx=1&from=wx#video";
console.log(url.queryURLParams());
//=>{lx:1,from:'wx',HASH:'video'}

//var url="locallhost?key1=val1&key2=val2&key3=val3";
//console.log(url.getParam("key3")); //=>'val3'
String.prototype.getParam = function (key) {
    let obj = {},
        _this = this,
		str = '',
        start = _this.indexOf('?');
    if (start === -1) {
        return;
    }
	let end = _this.indexOf('#');
	if(end === -1){
    	str = _this.slice(start + 1);
	} else{
	    str = _this.slice(start + 1,end);
	}
    str.split('&').forEach(item => {
        let [key, value] = item.split('=');
        obj[key] = value;
    });
	if(end){
		obj['HASH'] = _this.slice(end+1);
	}
    return obj[key];
}
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

