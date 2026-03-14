# 变量提升及其作用域
## JS引擎
一段 JavaScript 代码在执行之前，会先经过 JavaScript 引擎的编译阶段，然后才进入执行阶段。
编译阶段：把 JS 代码解析成引擎能够执行的结构，并创建执行上下文
* 词法分析：把一段代码拆成一个个“词法单元”（Token）
* 语法解析：根据 JavaScript 的语法规则，检查这些 Token 是否合法，并组织语法结构
* AST(AST 不是原始代码文本，而是更适合程序理解和处理的树状结构)生成
* 创建执行上下文
执行阶段：交给CPU执行
* 优化（JIT）：先解析成 AST / 字节码，再由 JIT 将热点代码优化为机器码
* 垃圾回收

执行上下文可以理解为：JavaScript 代码执行时的运行环境。主要包含：
变量环境（Variable Environment）
*var 声明的变量
*函数声明
*函数参数
*外部引用（outer）
词法环境（Lexical Environment）
* let
* const
作用域链（Scope Chain）
this 指向
可执行代码

JavaScript 代码在执行之前会先经过编译阶段，包括词法分析、语法分析生成 AST，并创建执行上下文；随后进入执行阶段，代码自上而下执行，在执行上下文中通过作用域链查找变量，同时执行上下文由执行上下文栈进行管理。在代码运行过程中，如果某些代码被频繁执行，JIT 编译器会把这些热点代码优化为机器码，以提高执行效率，同时 JavaScript 引擎还会通过垃圾回收机制自动管理内存

## 作用域
作用域：确定当前执行的代码对所有声明的标识符的访问权限
LHS：赋值操作的左侧，赋值操作的目标是谁
RHS：赋值操作的右侧，赋值操作的源头是谁
词法作用域：作用域由代码写在哪里决定，而不是函数在哪里执行决定

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
当函数存在默认参数时，JavaScript 会创建 参数作用域；函数体执行前，函数作用域中的同名变量会用参数值初始化，因此不会出现 undefined
```javascript
var x = 0
function foo(x, y = function() { x = 3; console.log(x) }) {
  console.log(x) 
  var x = 2
  console.log(x)
  y()
  console.log(x)
}

foo(1)
console.log(x)
```

### let/const
let 和 const 声明的变量也会发生变量提升，但不会被初始化，在变量声明之前访问会进入暂时性死区（TDZ）并抛出 ReferenceError。TDZ 是 ES6 为了避免 var 带来的变量提升问题而引入的一种机制。

[TDZ] ES6规定，let/const命令会使区块形成封闭的作用域，若在声明之前使用变量，就会报错。总之，在代码块内，使用let命令声明之前，该变量都是不可用的。这在语法上，称为“暂时性死区”  

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
词法作用域就是指作用域是由代码中函数声明的位置来决定的（和函数怎么调用没有关系），所以词法作用域是静态的作用域
在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。
- 全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
- 函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。

#### 块级作用域
var 声明 → 存在变量环境 Variable Environment 中
let/const 声明 → 存在 词法环境Lexical Environment 中
块级作用域其实就是通过 Lexical Environment 实现

一个执行上下文内部大致是这样的
Execution Context
 ├─ Variable Environment
 │     └─ var / function
 │
 └─ Lexical Environment
       └─ let / const / class

JavaScript 通过词法环境（Lexical Environment）来实现块级作用域。执行上下文中包含变量环境（Variable Environment）和词法环境（Lexical Environment）。通过 var 声明的变量会存放在变量环境中，而通过 let 和 const 声明的变量会存放在词法环境中。当进入一个块级作用域时，JavaScript 引擎会创建一个新的词法环境，并通过 outer 指针与外层环境形成作用域链。在查找变量时，JavaScript 会先在当前词法环境中查找，如果未找到，则沿着作用域链向外层环境继续查找。

当前 Lexical Environment
        ↓
外层 Lexical Environment
        ↓
Variable Environment
        ↓
Global

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


