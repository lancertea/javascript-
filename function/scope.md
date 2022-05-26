# 变量提升及其作用域
## 浏览器执行代码的机制
编译器（把代码解析成为浏览器看的懂的结构）  
- 词法解析  
- AST抽象语法树  
- 构建出浏览器能够执行的代码 
  
引擎（V8 / webkit内核）  
- 变量提升  
- 作用域 / 闭包  
- 变量对象  
- 堆栈内存  
- GO/VO/AO/EC/ECStack  
   ...  


一段 JavaScript 代码在执行之前需要被JavaScript引擎编译，编译完成之后，才会进入执行阶段
编译阶段：生成执行上下文和可执行代码
执行上下文是JavaScript 执行一段代码时的运行环境：
- 变量环境(var声明的变量、函数声明、函数的形参、外部引用outer)
- 词法环境（let、const声明的变量）
- 作用域链
- this
可执行代码

执行阶段：代码自上而下执行，JavaScript引擎会从执行上下文中查找自定义的变量和函数（如果上一行代码报错，下面的代码都不会再去执行了）

## 变量提升
变量的提升是以变量作用域来决定的，即全局作用域中声明的变量会提升至全局最顶层，函数内声明的变量只会提升至该函数作用域最顶层。

### var
var关键字会变量提升，只是将声明提升到作用域最前面，不会将赋值提升，默认值是undefined
```javascript
console.log(a);//undefined
// console.log(c); //error,ReferenceError: c is not defined
var a=1;
var b;
c=1;//给全局对象创建了一个新属性c(但它不是变量),也不会变量提升。
console.log(a);//1
console.log(b);//undefined
console.log(c);//1
// console.log(d); //error,ReferenceError: d is not defined
```

变量相对于简单属性来说，变量有一个特性(attribute)：{DontDelete},这个特性的含义就是不能用delete操作符直接删除变量属性。
```javascript
e = 10;
console.log(window.e); //10 
console.log(e);//10
console.log(delete e); //true
console.log(window.e); //undefined   
//console.log(e); //error,ReferenceError: e is not defined
var f = 20;
console.log(window.f); //20
console.log(f); //20
console.log(delete f); //false
console.log(window.f); //20
console.log(f); //20
```
关于条件判断的变量提升：不管条件是否成立都要进行变量提升
```javascript
console.log(a); //=>undefined
if (!('a' in window)) { //=>'a' in window  =>TRUE
    var a = 13;
}
console.log(a); //=>undefined       
```

### let/const
let，const关键字不会变量提升，声明的变量存在“暂时性死区”：let 定义变量是有一个“特殊声明”的过程，JS 预解析的时候，先将定义的 let ,const “特殊声明”提前，类似“举手”，JS 引擎规定了同一个作用域，同一个变量只能被一次“举手”（即不能重复声明）。

[理解暂时性死区] ES6规定，let/const命令会使区块形成封闭的作用域，若在声明(没赋值的话，默认赋值为undefined)之前使用变量，就会报错。总之，在代码块内，使用let命令声明之前，该变量都是不可用的。这在语法上，称为“暂时性死区”  
- 影响：意味着typeof不再是一个百分之百安全的操作
```javascript
console.log(typeof a);//undefined;
console.log(a)//ReferenceError: a is not defined
```
```javascript
console.log(typeof a);//ReferenceError: Cannot access 'a' before initialization
let a;
```
```javascript
console.log(1);//1
console.log(a);//ReferenceError: Cannot access 'a' before initialization
//ReferenceError为代码执行时的错误
console.log(2);
let a=13;
```
```javascript
let b;
console.log(b);//undefined
```
```javascript
console.log(1);
let a=12;
console.log(a);
let a=13;//SyntaxError: Identifier 'a' has already been declared
//SyntaxError为语法错误，词法解析时的错误
console.log(a);
```

### 函数
函数声明(function关键字)不仅会将函数名（变量）提升至其所在作用域的最前面（全局/函数作用域），还会将其赋值提升至所在作用域最前面（块级作用域），准确说就是让变量和某个值进行关联
```javascript
console.log(sum(10,20));//30
    function sum(n,m){
        return n+m;
    }
```
函数表达式的方式，由于是用var或其他关键字来创建函数，变量提升阶段只会声明变量，不会赋值，所以此时函数在前面执行是没有值的，不能执行（推荐使用，更严谨）
```javascript
//console.log(sum(10,20));//Uncaught TypeError: sum is not a function
console.log(sum);//undefined
var sum = function(n,m) {
     return n+m;
}
console.log(sum(10,20));//30
```
```javascript
fn();//5

function fn() {
    console.log(1);
}
fn();//5

function fn() {
    console.log(2);
}
fn();//5
var fn = function () {
    console.log(3);
}
fn();//3

function fn() {
    console.log(4);
}
fn();//3

function fn() {
    console.log(5);
}
fn();//3
```

函数声明提升会覆盖变量提升，函数表达式不会声明提升
```javascript
console.log(a); //function a()  
var a = 1
console.log(a); //1 
function a() {}
console.log(a); //1
```
```javascript
var a = 1;
function fn(a) {
    console.log(a);//ƒ a() {}
    var a = 2;
    function a() {}
    console.log(a);//2
}
fn(a)
```

如果是变量提升，是不存在块级作用域的，但是函数提升是存在的。函数 function a(){} 在经过预解析之后，将函数声明提到函数级作用域最前面，然后将函数定义提升到块级作用域最前面。
```javascript
console.log(a); // undefined
if ('a' in window) {
    console.log(a); // function a()
    a();//'variable'
function a() {
    console.log('variable')
}
}
a();//'variable'
```
```javascript
console.log(b); //undefined
console.log(c); //function c()
c(); //'c'
//b(); 报错
if (true) {
    function b() {
    console.log('b');
}
}
b(); //'b'
function c() {
    console.log('c');
}
```

形参会变量提升，并赋值，不能用let重新声明
```javascript
function sum(a) {
    console.log(a);
    let a = 100; //=>Uncaught SyntaxError: Identifier 'a' has already been declared
    console.log(a);
}
sum(200);
```
```javascript
function sum(a) {
    console.log(a);
    var a = 100;
    console.log(a);
}
var a =200;
sum(a); //200  100
console.log(a);//200
```
```javascript
var ary = [12, 23];

function fn(ary) {
console.log(ary);//[12, 23]
ary[0] = 100;
ary = [100];
ary[0] = 0;
console.log(ary);//[0]
}
fn(ary);
console.log(ary);//[100,23]
```

#### 自执行函数
自执行函数：前面加的（）或者！、-、~、+只有一个目的，让语法符合而已。自执行函数本身不进行变量提升（没名字）  
(function(n){})(10);  
 ~function(n){}(10);  
 -function(n){}(10);  
 !function(n){}(10);  
 +function(n){}(10);
```javascript
f = function () {
        return true;
} //=>window.f=...
g = function () {
        return false;
}

~ function () {
    // 函数执行会形成一个私有作用域
    // 1.变量提升 function g
    // 2.代码执行
    if (g() && [] == ![]) { //=>Uncaught TypeError: g is not a function
        f = function () {
            return false;
            }

        function g() {
            return true;
            }
    }
}();
console.log(f());
console.log(g());
```
```javascript
var x = 10;
~ function(x) {
    console.log(x);
    x = x || 10 && 30 ||40;
    console.log(x);
}();
console.log(x);
```

### 作用域及作用域链
#### 作用域
通俗的理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。
在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。
- 全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
- 函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。
词法作用域就是指作用域是由代码中函数声明的位置来决定的（和函数怎么调用没有关系），所以词法作用域是静态的作用域

#### 作用域链
在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为outer。
当一段代码使用了一个变量时，JavaScript 引擎首先会在 “当前的执行上下文” 中查找该变量。找不到会继续在 outer 所指向的执行上下文中查找，直到全局上下文。这个查找的链条称为作用域链

作用域链查找机制关键在于如何查找上级作用域：  
1.从函数创建开始，作用域就已经制定好了  
2.当前函数是在哪个作用域（N）下创建的，那么函数执行形成的作用域（M）的上级作用域就是N，和函数在哪执行的没关系，只和创建的地方有关系
```javascript
var i = 0;

function A() {
    var i = 10;

    function x() {
        console.log(i);
    }
    return x;
}
var y = A();
    y();//10

function B() {
    var i = 20;
    y();
}
    B();//10
```

## 练习题  
### [变量提升及其作用域查找练习](https://github.com/lancertea/javascript-/blob/master/training/4_function/variable_lift.md)


