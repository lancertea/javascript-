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

## [函数柯里化](https://github.com/lancertea/javascript-/blob/master/training/4_function/currying.html) 
## [函数调用扁平化](https://github.com/lancertea/javascript-/blob/master/training/4_function/compose.html) 



