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

var关键字会变量提升，不赋值也不会报错(不赋值前为undefined)
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