# 闭包
## 闭包的两大作用  
- 保护：私有变量和外界没有必然联系
- 保存：形成不销毁的栈内存，里面的私有变量等信息保存下来了

## 闭包作用域
1. 创建函数
   - 开辟一个堆内存
   - 把函数体中的代码当做字符串存储进去
   - 把堆内存的地址赋值给函数名/变量名
   - **函数在哪创建，那么它执行时候所需要查找的上级作用域就是谁**
2. 函数执行
   - 形成一个全新的私有作用域、执行上下文、私有栈内存（执行一次形成一个，多个之间也不会产生影响）
   - 形参赋值 & 变量提升
   - 代码执行（把所属堆内存中的代码字符串拿出来一行行执行）  
[作用域链查找机制] 遇到一个变量，首先看它是否为私有变量（形参和在私有作用域中声明的变量是私有变量），是私有的就操作自己的变量即可，不是私有的则向上级作用域中查找...一直找到全局作用域为止    
[闭包的保护机制] 私有变量和外界的变量没有必然关系，可以理解为被私有栈内存保护起来了

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
1. 一般情况下，函数只要执行完成，形成的私有栈内存就会被销毁释放掉（排除出现无限递归、出现死循环的模式）  
```javascript
function fn(){

    }
    fn(); //函数执行形成栈内存，执行完成栈内存销毁
```
2.一旦栈内存中的某个东西（一般都是堆地址）被私有作用域以外的事物给占用了，则当前私有栈内存不能立即被释放销毁（特点：私有作用域中的私有变量等信息保留下来了）。这就是通常所说的闭包：函数执行形成不能被释放的私有栈内存
```javascript
function X(){
    return function(){
            //...
    }
let f=X(); //=>f占用了X执行形成的栈内存中的一个东西（返回小函数对应的堆），则X执行形成的栈内存不能被释放了
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
       
### 深度递归引起的堆栈溢出
执行setTimeout函数这个时候虽然它又继续调用自己，但是这里可以理解为多线程操作：开启另一个线程来启动foo，而当前线程仍然继续执行，当当前线程的foo执行完成后，就出栈了，每一次的foo执行都是这个过程，所以栈里不会容量超标的。
```javaScript
function foo() {
foo(); 

//setTimeout(foo, 0);
   
}
foo()//Uncaught RangeError: Maximum call stack size exceeded
```

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