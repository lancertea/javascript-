### 作用域以及变量提升
#### 浏览器执行代码的机制
代码执行前：  
1.开启栈内存，形成作用域（执行上下文）  
2.词法解析  
3.形参赋值（等号赋值是关联变量和值）  
4.变量提升  
代码自上而下执行

#### 变量提升
变量的提升是以变量作用域来决定的，即全局作用域中声明的变量会提升至全局最顶层，函数内声明的变量只会提升至该函数作用域最顶层。

var关键字会变量提升，不会将赋值提升
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
console.log(delete e); //true
console.log(window.e); //undefined   另外这里直接输出e,会报错,为什么呢
//console.log(e); //error,ReferenceError: e is not defined
var f = 20;
console.log(window.f); //20
console.log(delete f); //false
console.log(window.f); //20
console.log(f); //20
```

let，const关键字不会变量提升，声明的变量存在“暂时性死区”：let 定义变量是有一个“特殊声明”的过程，JS 预解析的时候，先将定义的 let ,const “特殊声明”提前，类似“举手”，JS 引擎规定了同一个作用域，同一个变量只能被一次“举手”。
```javascript
console.log(y);
let y=1;//ReferenceError: y is not defined

var x = 0;
function a() {
console.log(x); //can't access lexical declaration `x' before initialization
//它也不是报错 x not defined，而是 Cannot access。
//实际上代码中赋值的x变量还没读取（在读取变量的时候才可能抛变量未定义的错误）。
let x = 1;
}
a();
```

#### 函数
函数声明会将函数名（变量）及其赋值提升至其所在作用域的最前面
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