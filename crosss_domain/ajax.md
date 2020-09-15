### AJAX
#### AJAX步骤
1. 创建AJAX实例
let xhr=new XMLHttpRequest; //=>IE低版本浏览器中用的是 new ActiveXObject() 高程三中JS惰性编程思想，关于XHR的兼容处理

2. 打开URL（配置发送请求的信息）
xhr.open(METHOD,URL,ASYNC); 

METHOD:HTTP请求方式
URL:请求地址（API接口地址）
ASYNC:设置同步或者异步，默认是TRUE异步，FALSE同步
注：xhr.open第三个参数控制的同步异步指的是：从当前send发送请求，算任务开始，一直到AJAX状态为4才算任务结束
同步是：在此期间所有的任务都不去处理
异步是：在此期间该干啥干啥(在send后会把这个请求的任务放在EventQueue(宏任务)
//USER-NAME:传递给服务器的用户名
//USER-PASS:传递给服务器的密码
xhr.open('GET','./json/xxx.json',true); 

3. 监听AJAX状态，在状态为X的时候，获取服务器响应的内容
AJAX状态码：0 1 2 3 4
xhr.onreadystatechange=function(){
	if(xhr.readyState===4 && /^(2|3)\d{2}$/.test(xhr.status)){
		let result = xhr.responseText;
	}
}

#### AJAX的状态码
> xhr.readyState 获取状态码
- UNSEND 0 : 未发送（创建一个XHR，初始状态是0）
- OPENED 1 ：已经打开（执行了xhr.open）
- HEADERS_RECEIVED 2 : 响应头信息已经返回给客户端（发送请求后，服务器会依次返回响应头和响应主体的信息）
- LOADING 3 : 等待服务器返回响应内容
- DONE 4 : 响应主体信息已经返回给客户端

4. 发送请求
//send中放的是请求主体的内容
xhr.send(null);

AJAX任务（发送一个请求给服务器，从服务器获取到对应的内容）从send后开始，到xhr.readyState===4的时候算任务结束
```javaScript
let xhr = new XMLHttpRequest;
	// console.log(xhr.readyState); //=>0
	xhr.open('GET', 'json/data.json');
	// console.log(xhr.readyState); //=>1
	xhr.onreadystatechange = function () {
		// console.log(xhr.readyState); //=>2 3 4
		if (!/^(2|3)\d{2}$/.test(xhr.status)) return;
		if (xhr.readyState === 2) {
			//=>获取响应头信息
			//获取的服务器时间是标准的日期格式对象（GMT格林尼治时间）
			//new Date()能把格林尼治时间转换为北京时间
			let serverTime = xhr.getResponseHeader('Date');
			// console.log(new Date(serverTime));
		}
		if (xhr.readyState === 4) {
			//=>获取响应主体信息：我们一般用responseText，因为服务器返回的信息一般都是JSON格式的字符串,如果返回的是XML格式，我们用responseXML...
			// xhr.responseXML
			// xhr.response
			// xhr.responseType
			// console.log(xhr.responseText);
		}
	}
xhr.send(null); 
```

#### AJAX请求方法
xhr.abort() 手动中断请求
xhr.getAllResponseHeaders()
xhr.getResponseHeader()
xhr.open()
xhr.send()
xhr.setRequestHeader()

ontimeout 超时
response/responseText/responseType/responseURL/responseXML
status/statusText
withCredentials
```javaScript
let xhr = new XMLHttpRequest;
	// xhr.timeout = 10; //=>设置AJAX等待时间，超过这个时间算AJAX延迟
	// xhr.ontimeout = function () {
	// 	console.log('请求超时~~');
	// 	xhr.abort(); //=>手动中断AJAX的请求
	// }
	// xhr.withCredentials = true; //=>在跨域请求中是否允许携带证书（携带COOKIE）
	xhr.open('GET', 'json/data.json');
	//=>设置请求头信息
	// xhr.setRequestHeader('AAA', encodeURIComponent('元气森林'));
	// Uncaught TypeError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': Value is nota valid ByteString. 设置的请求头信息值不能是中文
	xhr.onreadystatechange = function () {
		if (!/^(2|3)\d{2}$/.test(xhr.status)) return;
		if (xhr.readyState === 4) {
			console.log(xhr.responseText);
		}
	}
	xhr.send(null); 
```
