# 函数
## 函数有三种角色
1. 普通函数
- 形参、实参、arguments、箭头函数
- 私有作用域（栈内存、执行上下文）
- 形参赋值 & 变量提升
- 作用域链      
- 栈内存的释放和不释放（闭包）...
2. 构造函数（类）
- 类和实例
- prototype 和 __proto__ 原型和原型链
- instanceof
- constructor
3. 普通对象
它是由键值对组成的
- hasOwnProperty
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

## 匿名函数
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
## 函数式编程
函数式编程的特性
纯函数、柯里化、函数组合等

为什么现在还要学函数式编程?
1.函数式编程是随着 React 的流行受到越来越多的关注，Vue 3也开始拥抱函数式编程
(vue2创建组件是new Vue()类的方式，当组件比较庞大的时候，我们不好拆分，vue3借鉴了一些函数式编程的思想，用什么import什么，粒度更小，也有利于tree shaking)
2.函数式编程可以抛弃 this
3.打包过程中可以更好的利用 tree shaking 过滤无用代码；方便测试、方便并行处理；
4.有很多库可以帮助我们进行函数式开发:lodash、underscore、ramda

怎么理解函数式编程？
- 面向对象编程的思维方式:把现实世界中的事物抽象成程序世界中的类和对象，通过封装、继承和多态来演示事物事件的联系
- 函数式编程的思维方式:把现实世界的事物和事物之间的联系抽象到程序世界(对运算过程进行抽象），用来描述数据（函数）之间的映射

## 函数
### 函数是一等公民
函数可以存储在变量中
函数作为参数
函数作为返回值

### 高阶函数
高阶函数 (Higher-order function) 
eg:react中的高阶组件就是高阶函数
1. 可以把函数作为参数传递给另一个函数
eg: Array的遍历函数 forEach、map等
好处：屏蔽内部实现细节
```javascript
// forEach
function forEach (array, fn) {
for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
}
// filter
function filter (array, fn) {
let results = []
for (let i = 0; i < array.length; i++) {
if (fn(array[i])) { results.push(array[i])
} }
  return results
}
```
2. 可以把函数作为另一个函数的返回结果
```javascript
// once 支付场景
funciton once (fn){
	let done = false;
	return funciton(){
		if(!done){
			done = true;
			return fn.apply(this,arguments);
		}
	}
}

let pay = once(function (money) { console.log(`支付:${money} RMB`)
})
// 只会支付一次 pay(5)
pay(5)
pay(5)
pay(5)
```

### 纯函数
纯函数:相同的输入永远会得到相同的输出，而且没有任何可观察的副作用
eg: Array的slice是纯函数、splice是不纯的函数

好处：可缓存、可测试、并行处理
eg: memorize函数

#### 副作用
```javascript
// 不纯的,因为mini的值更改了，结果就不一定了
let mini = 18 
function checkAge (age) {
  return age >= mini
}
// 纯的(有硬编码，后续可以通过柯里化解决)
 function checkAge (age) {
let mini = 18
  return age >= mini
}
```
副作用让一个函数变的不纯(如上例)，纯函数的根据相同的输入返回相同的输出，如果函数依赖于外部 的状态就无法保证输出相同，就会带来副作用。
副作用来源：配置文件、数据库、获取用户输入

所有的外部交互都有可能带来副作用，副作用也使得方法通用性下降不适合扩展和可重用性，同时副作
用会给程序中带来安全隐患给程序带来不确定性，但是副作用不可能完全禁止，尽可能控制它们在可控
范围内发生。

### 柯里化
当一个函数有多个参数的时候先传递一部分参数调用它(这部分参数以后永远不变)，然后返回一个新的函数接收剩余的参数，返回结果
```javascript
//硬编码
function checkAge (age) { 
let min = 18
return age >= min
}
// 普通纯函数
function checkAge (min, age) {
  return age >= min
}
checkAge(18, 24)
checkAge(18, 20)

checkAge(20, 30)
// 柯里化
function checkAge (min) {
  return function (age) {
    return age >= min
} }
// ES6 写法
let checkAge = min => (age => age >= min)
let checkAge18 = checkAge(18) 
let checkAge20 = checkAge(20)
checkAge18(24)
checkAge18(20)
```
应用：
1. 固定不常变化的参数：
vue中的patch函数，前面通过柯里化省略了一个对象，这个对象保存了其执行的时候所依赖的一些模块
```javascript
function createPatch(obj){
	let ...
	return function patch(vdom1,vdom2){
		...
	}
}

const patch = createPatch(...)
```
2. 延迟执行
bind函数

### 函数组合
函数组合 (compose):如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间过程的函数合并成一个函数

```javascript
const compose = (...args)=>value=> args.reverse().reduce((res,fn)=>fn(res),value);
```

## [函数柯里化](https://github.com/lancertea/javascript-/blob/master/training/4_function/currying.html) 
## [函数组合](https://github.com/lancertea/javascript-/blob/master/training/4_function/compose.html) 



