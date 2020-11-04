## 一、选择题

1、
```javascript
console.log(a); 
var a=12; 
function fn(){
	console.log(a); 
	var a=13;	
}
fn();   
console.log(a);

/*
 A、undefined  12 13             
 B、undefined undefined 12   
 C、undefined undefined 13         
 D、有程序报错
*/
```

2、
```javascript
console.log(a); 
var a=12;
function fn(){
	console.log(a);
    a=13;
}
fn();
console.log(a);

/*
 A、undefined  12 13             
 B、undefined undefined 12   
 C、undefined undefined 13         
 D、有程序报错
*/
```

3、
```javascript
console.log(a);
a=12;
function fn(){
	console.log(a);
	a=13;	
}
fn();
console.log(a);

/*
 A、undefined  12 13             
 B、undefined undefined 12   
 C、undefined undefined 13         
 D、有程序报错
*/
```

4、
```javascript
var foo=1; 
function bar(){
    if(!foo){
        var foo=10; 
    }
    console.log(foo); 
}
bar();

/*
 A、1     
 B、10     
 C、undefined    
 D、报错
*/
```
```javascript
let n = 12;
~ function () {
	// 作用域A
	if (1) {
		// 作用域B
		let n = 13;
	}
	console.log(n); 
}();
```
```javascript
let n = 12;
~ function () {
	let n = 0;
	if (1) {
		n = 13;
	}
	console.log(n); 
}();
console.log(n); 
```

5、
```javascript
var n=0; 
function a(){
	var n=10; 
	function b(){
		n++; 
	    console.log(n); 
    }
    b();
    return b; 
}
var c=a();
c(); 
console.log(n);


/*
 A、1 1 1   
 B、11 11 0  
 C、11 12 0  
 D、11 12 12
*/
```

6、
```javascript


/*
 A、1 11 3   
 B、10 11 12  
 C、1 2 3   
 D、10 11 3
*/
```

7、
```javascript
if(!("a" in window)){
   var a=1;
}
console.log(a);

/*
 A、1   
 B、undefined   
 C、报错   
 D、以上答案都不对
*/
```

8、
```javascript
var a=4;
function b(x,y,a) {	   
     console.log(a); 
     arguments[2]=10;        
     console.log(a); 
}
a=b(1,2,3);   
console.log(a); 

/*
 A、3  3  4   
 B、3  10  4   
 C、3  10  10   
 D、3  10  undefined
*/
```

9、
```javascript
var foo='hello'; 
(function(foo){
   console.log(foo);
   var foo=foo||'world';
   console.log(foo);
})(foo);
console.log(foo);

/*
 A、hello hello hello   
 B、undefined world  hello   
 C、hello world world   
 D、以上答案都不正确
*/
```

10、
```javascript
var a=9; 
function fn(){ 
	a=0; 	   
    return function(b){ 
	    return b+a++; 
    }    
}
var f=fn();
console.log(f(5));
console.log(fn()(5));
console.log(f(5));
console.log(a);

/*
 A、6 6 7 2   
 B、5 6 7 3   
 C、5 5 6 3   
 D、以上答案都不正确 
*/
```

## 二、问答题

1、
```javascript
var ary=[1,2,3,4];
function fn(ary){
	ary[0]=0;    
	ary=[0];    
	ary[0]=100;    
	return ary; 
}
var res=fn(ary);    
console.log(ary);    
console.log(res);
```

2、
```javascript
function fn(i) {
    return function (n) {
        console.log(n + (i++));
    }
}
var f = fn(10);
f(20);
fn(20)(40);
fn(30)(50);
f(30);
```

3、
```javascript
var i = 10;
function fn() {
    return function (n) {
        console.log(n + (++i));
    }
}
var f = fn();
f(20);
fn()(20);
fn()(30);
f(30);
```

4、
```javascript
var test = (function(i){
    return function(){
        alert(i*=2);
    }
})(2);
test(5);
```

5、
```javascript
var a=1;
var obj ={
   "name":"tom"
}
function fn(){
   var a2 = a;
   obj2 = obj;
   a2 =a;
   obj2.name ='jack';
}
fn();
console.log(a);
console.log(obj);
```

6、
```javascript
var a = 1;
function fn(a){
    console.log(a);
    var a = 2;
    function a(){}
    console.log(a);
}
fn(a);
```

7、

```javascript
var a=0,
	b=0;
function A(a){
	A=function(b){
    	alert(a+b++);
	};
    alert(a++);
}
A(1);
A(2);
```

8、

```javascript
function fun(n, o) {
    console.log(o);
        return {
            fun: function (m) {
                return fun(m, n);
            }
        };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);
```

9、

```javascript
var i = 5;
function fn(i) {
    return function (n) {
        console.log(n + (++i));
    }
}
var f = fn(1);
f(2);
fn(3)(4);
fn(5)(6);
f(7);
console.log(i)
```  

10、

```javascript
var i = 20;
function fn() {
    i -= 2;
    return function (n) {
    console.log((++i) - n);
    }
}
var f = fn();
f(1);
f(2);
fn()(3);
fn()(4);
f(5);
console.log(i);
```     

11、

```javascript
 var result = [],
        a = 3,
        total = 0
    function f(a) {
        var i = 0;
        for (; i < 3; i = i + 1) {
            result[i] = function () {
                total += a * i
                console.log(total);
            }
        }
    }
    f(1);
   result[0]();
   result[1]();
   result[2]();
```   

## 三：附加思考题（面试题）

1、以下代码的功能是要实现为5个input按钮循环绑定click点击事件，绑定完成后点击1、2、3、4、5五个按钮分别会alert输出0、1、2、3、4五个字符。（腾讯）

- 请问如下代码是否能实现？
- 如果不能实现那么现在的效果是什么样的？
- 应该做怎样的修改才能达到我们想要的效果，并说明原理？  
```html
<div id="btnBox">
	<input type="button" value="button_1" />
    <input type="button" value="button_2" />
    <input type="button" value="button_3" />
    <input type="button" value="button_4" />
    <input type="button" value="button_5" />
</div>

<script type="text/javascript">
    var btnBox=document.getElementById('btnBox'),
        inputs=btnBox.getElementsByTagName('input');
    var l=inputs.length;
    for(var i=0;i<l;i++){
	    inputs[i].onclick=function(){
		    alert(i);
	    }
    }
</script>
```
[参考答案](https://github.com/lancertea/javascript-/blob/master/training/button.html)


2、document.parentNode 和 document.parentnode 的区别？（腾讯）

3、你理解的闭包作用是什么，优缺点？

 



