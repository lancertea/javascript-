# this
## 为什么需要 this
JavaScript 的 **词法作用域（Lexical Scope）** 决定了：函数内部访问变量 → 取决于函数定义的位置，而不是函数被哪个对象调用，这样就没办法实现在对象内部方法中使用对象内部属性的需求， this**让函数在运行时能够知道自己是被哪个对象调用的，从而访问该对象的数据。**

例如：

```javascript
function foo() {
  console.log(this.name);
}

const obj = {
  name: "Tom",
  foo
};

obj.foo();
```

如果没有 `this`，函数内部就无法知道 **当前是哪个对象调用了它**。

## this 的本质
this 是执行上下文（Execution Context）中的一个属性。除了 **箭头函数**，this 的值在函数调用时确定，而不是在函数定义时确定


## this 的绑定规则（优先级）
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

### new 绑定
```javascript
function Foo() {
  this.a = 1;
}

const obj = new Foo();
```

`new` 做了四件事：

1️⃣ 创建新对象
2️⃣ 新对象的 `__proto__` 指向构造函数 `prototype`
3️⃣ `this` 指向新对象
4️⃣ 执行函数代码

返回规则：

```text
如果构造函数返回对象 → 返回该对象
如果返回原始值 → 返回新对象
```

例如：

```javascript
function Foo(){
  this.a = 1
  return {b:2}
}

new Foo() // {b:2}
```

---

### 显式绑定

```javascript
foo.call(obj)
foo.apply(obj)
foo.bind(obj)
```

特点：

```text
this 由第一个参数决定
```

如果传：

```javascript
foo.call(null)
```

非严格模式：

```text
this → window
```

严格模式：

```text
this → null
```

---

###  隐式绑定

例如：

```javascript
obj.foo()
```

规则：

```text
谁调用函数，this 就指向谁
```

例如：

```javascript
const obj = {
  a:1,
  foo(){
    console.log(this.a)
  }
}

obj.foo() // this = obj
```

复杂一点：

```javascript
obj.b.a.foo()
```

调用点是：

```text
a.foo()
```

所以：

```text
this → a
```

---

### 默认绑定

直接调用：

```javascript
foo()
```

非严格模式：

```text
this → window
```

严格模式：

```text
this → undefined
```

---

### 关于自执行函数

```javascript
(function(){
 console.log(this)
})()
```

非严格模式：

```text
window
```

严格模式：

```text
undefined
```

### 回调函数
回调函数的 this 取决于调用方式

例如：

```javascript
setTimeout(function(){
  console.log(this)
})
```

浏览器：

```text
window
```

但：

```javascript
obj.method(callback)
```

就可能不同。

---

### 箭头函数

箭头函数没有自己的 this，它的 `this` 来自外层作用域，在定义时确定

```javascript
const obj = {
  a:1,
  foo(){
    const bar = () => {
      console.log(this.a)
    }
    bar()
  }
}

obj.foo() // 1
```

### DOM 事件中的 this

```javascript
button.onclick = function(){
 console.log(this)
}
```

这里：

```text
this → 触发事件的元素
```

等价于：

```text
event.currentTarget
```

**this 是 JavaScript 执行上下文中的一个属性，用来表示函数运行时的调用对象。this 的值是在函数调用时确定的，而不是在函数定义时确定的。其绑定规则按照优先级依次为：new 绑定、显式绑定（call/apply/bind）、隐式绑定（对象调用）、默认绑定（函数直接调用）。箭头函数没有自己的 this，它的 this 继承自外层作用域。**


https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA
为什么有this:
基于JavaScript的作用域机制，没办法实现在对象内部的方法中使用对象内部的属性的需求

函数在调用时，JS会默认给this绑定一个值
this的绑定和定义的位置（编写的位置）没有关系
this的绑定和调用方式以及调用的位置有关
this是在运行时被绑定的

this是执行上下文中的一个属性，总是指向函数所在的当前对象  
this由调用者提供，由调用函数的方式来决定（this的取值是在函数执行的时候决定的，不是在函数定义的时候确定的），能改变this的指向，但是不能给this赋值，会报错。  
绑定规则可按优先级从高到低分为以下几种：  
1. new绑定
new中没有返回其他对象，this指向新创建的对象  
new中有返回值：如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象，那么this还是指向新创建的对象  
2. 显式绑定
使用apply、call、bind 可以绑定this的指向（this是第一个参数）如果没有传递参数，非严格模式下是让函数中的this指向window，严格模式下指向undefined  
3. 隐式绑定
obj.foo()： 这种调用方式作为某对象的方法调用，this通常指向调用的对象（obj）
obj.b.a.foo() this指向a，即上级对象
4. 默认绑定
foo()：作为函数直接调用，非严格模式下，this指向window，严格模式下，this指向undefined 
自执行函数执行，this一般都是window；回调函数中的this一般都是window
5. 箭头函数的this绑定只取决于外层（函数或全局）的作用域，对于前面的4种绑定规则是不会生效的，this在箭头函数编译时确定，它与声明所在的上下文相同（上级作用域）。
6. 给元素的某个事件绑定方法，当事件触发方法执行的时候，方法中的this是当前操作的元素本身（绑定事件的元素本身）（currentTarget）  

this的设计缺陷：
1.嵌套函数中的 this 不会从外层函数中继承
解决方式：箭头函数
2.普通函数中的 this 默认指向全局对象 window
解决方法：严格模式
```javascript
let obj = {
    fn:(function(n){
    //把自执行函数执行的返回结果赋值给fn
    //this:window
    return function(){
        //=>fn等于这个返回的小函数
        //this:obj
    };
      })(10)
};
obj.fn();
```
```javascript
    function fn() {
      console.log(this)
    }

    document.getElementById('b').onclick = fn;
```

## 原型链中的this问题
 面向对象中有关私有/公有方法中的THIS问题  
 1. 方法执行，看前面是否有点，点前面是谁THIS就是谁
 2. 把方法总的THIS进行替换 
 3. 再基于原型链查找的方法确定结果即可
 ```javascript
function Fn() {
	//=>this:f1这个实例
	this.x = 100;
	this.y = 200;
	this.say = function () {
		console.log(this.x);
	}
}
Fn.prototype.say = function () {
	console.log(this.y);
}
Fn.prototype.eat = function () {
	console.log(this.x + this.y);
}
Fn.prototype.write = function () {
	this.z = 1000;
}
let f1 = new Fn;
f1.say(); //=>this:f1   =>console.log(f1.x)  =>100
f1.eat(); //=>this:f1   =>console.log(f1.x + f1.y)  =>300
f1.__proto__.say(); //=>this:f1.__proto__  =>console.log(f1.__proto__.y)  =>undefined
Fn.prototype.eat(); //=>this:Fn.prototype  =>console.log(Fn.prototype.x + Fn.prototype.y)  =>NaN
f1.write(); //=>this:f1  =>f1.z=1000  =>给f1设置一个私有的属性z=1000
Fn.prototype.write();//=>this:Fn.prototype  =>Fn.prototype.z=1000  =>给原型上设置一个属性z=1000（属性是实例的公有属性）
```

## call / apply / bind 
call / apply / bind是原型上提供的三个公有属性方法，每一个函数都可以调用这个方法，用来改变函数中的THIS指向的
```javascript
//Function.prototype => function anonymous(){}
function fn(){}
fn.call(); //=>fn函数基于原型链找到Function.prototype上的call方法，并且让其执行（执行的是call方法：方法中的this是fn）
fn.call.call(); //=>fn.call就是Function.prototype上的call方法，也是一个函数，只要是函数就能用原型上的方法，所以可以继续调用call来执行

/*
Function.prototype.call = function $1(){
    //...
}
fn.call => $1
fn.call() => $1()  this:fn
fn.call.call() => $1.call() => 继续让call执行,this:$1

实例.方法()：都是找到原型上的内置方法，让内置方法先执行（只不过执行的时候做了一些事情会对实例产生改变，而这也是这些内置方法的作用），内置方法中的THIS一般都是当前操作的实例
*/
```

### call方法
> 语法：函数.call([context],[params1],....)
>
> 函数基于原型链找到Function.prototype.call这个方法，并且把它执行，在call方法执行的时候完成了一些功能
>
> - 让当前函数执行
> - 把函数中的THIS指向改为第一个传递给CALL的实参
> - 把传递给CALL其余的实参，当做参数信息传递给当前函数
>
> 如果执行CALL一个实参都没有传递，非严格模式下是让函数中的THIS指向WINDOW，严格模式下指向的是UNDEFINED   

### [自实现call方法](https://github.com/lancertea/javascript-/blob/master/function/call.html)

### apply方法
> 和call方法一样，都是把函数执行，并且改变里面的this关键字的，唯一的区别就是传递给函数参数的方式不同
>
> - call是一个个传参
> - apply是按照数组传参

```javascript
let obj={name:'OBJ'};
let fn=function(n,m){
    console.log(this.name);
}
//=>让fn方法执行，让方法中的this变为obj，并且传递10/20
fn.call(obj,10,20);
fn.apply(obj,[10,20]);
```
### [自实现apply方法](https://github.com/lancertea/javascript-/blob/master/function/apply.html)

##### bind方法
> 和call/apply一样，也是用来改变函数中的this关键字的，只不过基于bind改变this，当前方法并没有被执行，类似于预先改变this

```javascript
let obj={name:'OBJ'};
function fn(){
    console.log(this.name);
}
document.body.onclick=fn; //=>当事件触发,fn中的this:BODY

//=>点击BODY，让FN中的THIS指向OBJ
//document.body.onclick=fn.call(obj); //=>基于call/apply这样处理，不是把fn绑定给事件，而是把fn执行后的结果绑定给事件
document.body.onclick=function(){
    //this:BODY
    fn.call(obj);
}
document.body.onclick=fn.bind(obj); //=>bind的好处是：通过bind方法只是预先把fn中的this修改为obj，此时fn并没有执行呢，当点击事件触发才会执行fn（call/apply都是改变this的同时立即把方法执行） =>在IE6~8中不支持bind方法  预先做啥事情的思想被称为“柯理化”
```
### [自实现bind方法](https://github.com/lancertea/javascript-/blob/master/function/bind.html)

## 练习题 
### [this练习](https://github.com/lancertea/javascript-/blob/master/training/4_function/this.md)