# 闭包
在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。

闭包是怎么回收的：
1.如果引用闭包的函数是一个全局函数，那么闭包会一直存在直到页面关闭；但如果这个闭包以后不再使用的话，就会造成内存泄露。
2.如果引用闭包的函数是个局部变量，等函数销毁后，在下次 JavaScript 引擎执行垃圾回收时，判断闭包这块内容如果已经不再被使用了，那么 JavaScript 引擎的垃圾回收器就会回收这块内存。
所以在使用闭包的时候，你要尽量注意一个原则：
如果该闭包会一直使用，那么它可以作为全局变量而存在；但如果使用频率不高，而且占用内存又比较大的话，那就尽量让它成为一个局部变量

站在内存模型的视角分析闭包的产生过程：
1.需要预扫描内部函数
2.把内部函数引用的外部变量保存到堆中

## 堆栈内存释放问题（以谷歌webkit内核为例子）
### 栈内存
产生栈内存的方式：  
- 打开浏览器形成的全局作用域是栈内存  
- 手动执行函数形成的私有作用域是栈内存  
- 基于ES6中的let/const形成的块作用域也是栈内存  
....

栈内存释放：  
全局栈内存：关掉页面的时候才会销毁  
私有栈内存：  
1. 一般情况下，函数只要执行完成，当前执行状态的指针下移，该函数的执行上下文就会被销毁释放掉
```javascript
function fn(){

    }
    fn(); //函数执行形成栈内存，执行完成栈内存销毁
```
2.存在闭包的情况下，外部函数执行结束后，执行上下文还是会被销毁释放掉；内部函数引用的外部变量会保存到堆中，建立新的引用
```javascript
function X(){
    return function(){
            //...
    }
let f=X(); //返回的内部函数会保存在堆中，并将这个堆的地址赋给f变量
```

### 堆内存  
产生堆内存的方式：创建一个引用类型值，就会产生一个堆内存  

堆内存释放
创建一个引用类型值，就会产生一个堆内存。如果当前创建的堆内存不被其它东西所占用了（浏览器会在空闲的时候，查找每一个内存的引用状况，不被占用的（为null）都会给回收释放掉），则会释放
```javascript
let obj = {
      name : 'zzz'
  };
let oop = obj;
//此时obj和oop都占用着对象的堆内存，想要释放堆内存，需要手动解除变量和值的关联（null：空对象指针）
obj = null;
oop = null;
```
       
### 栈溢出
栈溢出：调用栈是有大小的，当入栈的执行上下文超过一定数目，JavaScript 引擎就会报错，我们把这种错误叫做栈溢出。一般函数是递归的，并且没有任何终止条件的情况下容易引起栈溢出

解决方法：
1. 使用加入定时器的方法来把当前任务拆分为其他很多小任务：执行setTimeout函数这个时候虽然它又继续调用自己，但是这里可以理解为多线程操作：开启另一个线程来启动foo，而当前线程仍然继续执行，当当前线程的foo执行完成后，就出栈了，每一次的foo执行都是这个过程，所以栈里不会容量超标的。
```javaScript
function foo() {
foo(); 

//setTimeout(foo, 0);
   
}
foo()//Uncaught RangeError: Maximum call stack size exceeded
```
2. 把递归算法改用迭代实现
比如分治问题（归并排序）

## 闭包应用
私有变量：隐藏数据，只提供API
```javaScript
function example() {
   var count = 0;
   return function () {
        return ++count;
    }
}

var getCount = example();
console.log(getCount()); //1
console.log(getCount()); //2

           
function createCache() {
    const data = {} // 闭包中的数据，被隐藏，不被外界访问
    return {
        set: function (key, val) {
            data[key] = val
        },
        get: function (key) {
            return data[key]
        }
    }
}

const c = createCache()
c.set('a', 100)
console.log(c.get('a')) //100
```

延长变量的生命周期
一般函数的词法环境在函数返回后就被销毁，但是闭包会保存对创建时所在词法环境的引用，即便创建时所在的执行上下文被销毁，但创建时所在词法环境依然存在，以达到延长变量的生命周期的目的

柯里化函数
柯里化(Currying)是函数式编程的一个很重要的概念，将使用多个参数的一个函数转换成一系列使用一个参数的函数
主要有三个作用:
1. 参数复用
```javaScript
// 正则验证字符串
// before
funciton check(reg,txt){
    return reg,test(txt);
}

check(/\d+/g,'test') //false
check(/[a-z]+/g, 'test') //true

// 需要复用第一个参数
funciton curryingCheck(reg){
    return funciton(txt){
         return reg,test(txt);
    }
}

let hasNum = curryingCheck(/\d+/g);
let hasLetter = curryingCheck(/[a-z]+/g);
hasNum('test1') //true
hasLetter('2121') //false
```
2. 提前返回
```javaScript
// eg: 解决原生方法在现代浏览器和IE之间的兼容问题
const addEvent = (funciton(){
    if(window.addEventListener){
        return funciton(ele, type, fn, isCapture){
            ele.addEventListener(type,fn,isCapture);
        }
    } else if(window.attachEvent){
        return funciton(ele, type, fn){
            ele.attachEvent('on' + type, fn);
        }
    }
})();
```

3. 延迟计算/运行
```javaScript
// js的bind实现机制
Function.prototype.bind = funciton (context, ...params){
    let self = this;
    context = context || window;
    return funciton(){
        return self.apply(context,params);
    }
}
```

不太理解的一个例子
```javaScript
var Person = function (_name, _age) {
    this.name = _name;
    var age = _age;
    this.getName = function () {
        return this.name;
    };
    this.setName = function (_name) {
        this.name = _name;
    };
    this.getAge = function () {
        return age;
    };
    this.setAge = function (_age) {
        age = _age;
    };
}

var p1 = new Person('zz', 12);
console.log(p1.getName()); //'zz'
console.log(p1.getAge()); //12

p1.name = 'ss';
p1.age = 7;
console.log(p1.getName()); //'ss'
console.log(p1.getAge()); //12
```

定时器传参
```javaScript
function foo(param) {
    return function () {
        console.log(param);
    };
}
var bar = foo(111);
setTimeout(bar, 100);
```

网站访问计数、广告点击地址，如果设置成对象，以对象属性方式访问，很容易被外面改
```javaScript
var tracker = (function () {
var accessCounter = 0;
var adAcce  ss = [];
// 模块化  module.exports={}  用这句    替换return
    return {
    increaseAccessCounter: function () {
        accessCounter++;
    },
    getAccessCounter() {
        return accessCounter;
    },
    storeAccessPage: function (page) {
        adAccess.push(page);
    },
    checkAccessPage: function () {
        return adAccess;
    }
};
})();
tracker.increaseAccessCounter();
tracker.increaseAccessCounter();
console.log(tracker.getAccessCounter());

var page1 = "http://xxx.com/yyy.html";
var page2 = "http://xxx.com/zzz.html";

tracker.storeAccessPage(page1);
tracker.storeAccessPage(page2);

console.log(tracker.checkAccessPage());
```
      
## 练习题 
### [闭包练习](https://github.com/lancertea/javascript-/blob/master/training/4_function/closure.md)