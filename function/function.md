### 函数
函数数据类型：
1. 普通函数
2. 类（内置类 OR 自定义类）  
对象数据类型:
1. {}普通对象  []数组对象  /^$/正则对象  日期对象  Math数学函数对象  arguments等类数组对象  HTMLCollection/NodeList元素或者节点集合类数组对象...
2. 实例也是对象数据类型的
3. 类的prototype也是对象数据类型的（Function.prototype除外,它是一个匿名空函数）
4. 函数也是对象 

#### 函数有三种角色
1. 普通函数
- 形参、实参、ARGUMENTS、RETURN、箭头函数
- 私有作用域（栈内存、执行上下文）
- 形参赋值 & 变量提升
- 作用域链      
- 栈内存的释放和不释放（闭包）...
2. 构造函数（类）
- 类和实例
- prototype 和 __proto__ 原型和原型链
- instanceof
- constructor
- hasOwnProperty...
3. 普通对象
它是由键值对组成的...
```javascript
function Fn(n, m) {
	this.x = n + m;
	this.y = n - m;
	let total = n * m;
	return total;
}
Fn.prototype.say = function () {
	console.log('SAY');
}

//=>普通函数
let total = Fn(20, 10);
//=>构造函数（类和实例）
let f = new Fn(20, 10);
//=>普通对象
Fn.total = 1000;
```
匿名函数
```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b); //=>函数
})();
console.log(b); //=>10 
let fn = function AAA() {
  // "use strict";
  // AAA = 1000; //=>Uncaught TypeError: Assignment to constant variable.
  console.log(AAA); //=>函数
};
// AAA(); //=>Uncaught ReferenceError: AAA is not defined  
// 1.本应匿名的函数如果设置了函数名，在外面还是无法调用，但是在函数里面是可以使用的
// 2.而且类似于创建常量一样，这个名字存储的值不能再被修改（非严格模式下不错报，但是不会有任何的效果，严格模下直接报错，可以把AAA理解为是用 const 创建出来的）
fn();
```
```javascript
 // {
 //     var b = 10;
 //     (function () {
 //         b = 20;
 //         console.log(b);
 //     })();
 //     console.log(b);
 // }
 // {
 //     var b = 10;
 //     function b() {
 //         b = 20;
 //         console.log(b);
 //     }
 //     b();
 //     console.log(b);
 // }

 var b = 10;
(function b(b) {
	b = 20;
	console.log(b); //=>20 里面的b一定需要是私有的，不能是全局的（声明它或者改为形参）
})();
console.log(b); //=>10 
```
 

/* (function (global, factory) {
	//=>global:window（浏览器下运行） OR global（NODE下运行）
	//=>factory:function (window, noGlobal){...}
	"use strict";
	if (typeof module === "object" && typeof module.exports === "object") {
		//=>NODE下运行
		//...
	} else {
		//=>浏览器下运行
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
	//=>window:window
	//=>noGlobal:undefined
	var jQuery = function (selector, context) {
		return new jQuery.fn.init(selector, context);
	};

	var init;
	init = jQuery.fn.init = function (selector, context, root) {
		// ...
	};
	init.prototype = jQuery.fn = jQuery.prototype;

	if (!noGlobal) {
		//=>!undefined
		window.jQuery = window.$ = jQuery;
	}
}); */
/*
 * jQuery是一个构造函数:jQuery.prototype上有很多供实例操作的方法，例如css...
 *   $().css()
 * jQuery也是一个普通的对象，在它的堆空间中也存在很多的方法，例如ajax...
 *   $.ajax()
 */
// $(); //=>创建了jQuery这个类的一个实例，可以调取jQuery.prototype（jQuery.fn）上的方法

//==========================================
function Foo() {
	getName = function () {
		console.log(1);
	};
	return this;
}
Foo.getName = function () {
	console.log(2);
};
Foo.prototype.getName = function () {
	console.log(3);
};
var getName = function () {
	console.log(4);
};
function getName() {
	console.log(5);
}
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName(); //=>Foo.getName:输出2这个方法(AF2)  =>new AF2()
new Foo().getName();
new new Foo().getName();

