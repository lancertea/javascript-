# ES6
## var const和let的区别
[全局变量/属性]：全局变量/属性的作用域不是单个文件的，如果有多个文件，在一个文件定义了全局变量，在其他文件也是可以访问到的  
两者的区别：全局属性可以被delete删除（返回true），全局变量不可以被delete删除（返回false）

var:variable(可变的)  
在 ES6 之前，JavaScript 只有两种作用域： 全局变量与函数内的局部变量，没有块级作用域（{}）。let和const是ES6新增的关键字，let，const声明的变量只在 let 命令所在的代码块{}内有效，可实现块级作用域。const 声明一个只读的常量，一旦声明，就不能再重新赋值。
具体区别如下：
- 全局声明的var变量会挂载在window对象上，而let和const不会
在全局作用域下，带var/function声明的全局变量相当于给window设置了对应的属性（既是全局变量也是属性），不带var的声明只是给window设置了对应的属性，如果使用的是let/const声明的，只是全局变量，没有给window设置属性
- 重置变量：在相同的作用域中，只有var声明的变量可以重新声明
- 变量提升：创建变量的六种方式中：var/function有变量提升，也就是变量的使用可以写在变量的声明之前，因为无论声明写到当前作用域哪里，在代码执行前都会提升到当前作用域最前面。而let/const/class/import都不存在这个机制，必须先声明赋值才能使用。在块作用域内，let声明的变量被提升，但变量只是创建被提升，初始化并没有被提升，在初始化之前使用变量，就会形成一个暂时性死区。const必须声明的时候就要立即赋值，且赋值后不能再重新赋值。
- 并非真正的常量：使用const定义的对象或者数组可以修改，但不能重新赋值（const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。）

### 变量提升
- 什么是变量提升
在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的 “行为”。变量被提升后，会给变量设置undefined默认值。

- 为什么要实现变量提升
之所以需要实现变量提升，是因为ES6之前是不支持块级作用域的：当初设计这门语言时是按照最简单的方式来设计：没有块级作用域，再把作用域内部的变量统一提升

-如何实现变量提升
JavaScript在执行之前需要先编译：经过编译后，会生成两部分内容：执行上下文（Execution context，JS执行一段代码时的运行环境）和可执行代码。在执行上下文中存在一个变量环境的对象（Viriable Environment），该对象中保存了变量提升的内容。在代码执行阶段，JavaScript 引擎会从变量环境中去查找自定义的变量和函数

- 带来的问题
1. 变量覆盖：变量容易在不被察觉的情况下被覆盖掉
```javascript
//执行上面这段代码，想要打印极客时间，但打印出来的是undefined
var myname = "极客时间"
function showName(){
  console.log(myname);
  if(0){
   var myname = "极客邦"
  }
  console.log(myname);
}
showName()
```
2. 变量污染：本应销毁的变量没有被销毁
```javascript
//在 for 循环结束之后，i合理应该被销毁，但打印出来是7
function foo(){
  for (var i = 0; i < 7; i++) {
  }
  console.log(i); 
}
foo()
```

### 块级作用域
JavaScript 是如何支持块级作用域的：
通过 var 声明的变量，在编译阶段会被存放到变量环境，而通过 let 声明的变量，会被存放到词法环境（Lexical Environment）中。词法环境内部维护了一个小型栈结构（栈底是最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出）
在JS执行阶段，如果需要在词法环境和变量环境中查找某个变量，具体查找方式是：沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给 JavaScript 引擎，如果没有查找到，那么继续在变量环境中查找。
```javascript
//词法声明不能出现在单个语句的上下文中
if (true)
    let a = 5; //Lexical declaration cannot appear in a single-statement context
```
```javascript
  if (true) {
    let a = 5;
  }
```

### 暂时性死区
暂时性死区：在代码块内，使用let命令声明变量之前，该变量是不可用的
暂时性死区的本质：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
ES6 规定暂时性死区和let、const语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为
```javascript
//console.log(a);//ReferenceError: a is not defined
console.log(typeof a);//undefined 这是浏览器的bug，本应该是报错的，因为没有a（暂时性死区）
//let const解决了typeof检测时出现的暂时性死区问题
//console.log(typeof b);//ReferenceError: Cannot access 'b' before initialization
let b;
```

### 函数声明
ES5规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。但是浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数。
```javascript
   if (true) {
    function f() {}
  }
//不报错
```
不过，“严格模式”下还是会报错
```javascript
'use strict';
   if (true) {
    function f() {}
  }
//报错
```
ES6引入了块级作用域，明确允许在块级作用域之中声明函数
```javascript
'use strict';
   if (true) {
    function f() {}
  }
//不报错
```
ES6的浏览器：
- 允许在块级作用域内声明函数
- 函数声明类似于var，即会提升到全局作用域或函数作用域的头部，函数定义会提升到所在块级作用域的头部
```javascript
console.log(f); //undefined
if (true) {
    function f() {}
}
console.log(f); //function f() {}
```
```javascript        
var a = 0;
console.log(a, window.a); //0  0
//a();  报错，说明函数定义是块级作用域，如果注释掉第一句，上一句输出两个undefined，说明函数声明是提升到全局位置了

if (true) {
    a(); //'function'  函数声明提到函数级作用域最前面(这里是全局)，函数定义提升到块级作用域最前面
    console.log(a, window.a); //输出 function a 和 0
    a = 1; // 取作用域最近的块级作用域的 function a ,且被重置为 1了，本质又是一个变量的赋值。
    console.log(a, window.a); // a 是指向块级作用域的 a, 输出 1 和 0 
    function a() {
        console.log('function');
    } // 函数的声明，将执行函数的变量的定义同步到函数级的作用域。
    console.log(a, window.a); // 输出 1 和 1
    a = 21; // 仍然是函数定义块级作用域的 a ,重置为 21
    console.log(a, window.a); // 输出为函数提升的块级作用域的 a, 输出 21，1
    console.log("里面", a);
  }
console.log("外部", a);
```
### [ES5实现ES6块级作用域](https://github.com/lancertea/javascript-/blob/master/ES6/ES6_with_ES5/scope.md)

## 顶层对象
顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。
顶层对象的属性与全局变量挂钩的设计带来了几个很大的问题：
1. 没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；
2. 容易误创全局变量
3. 顶层对象的属性是到处可以读写的，这非常不利于模块化编程
4. window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的

## 解构赋值
- 只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值
- 对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。
- 对象的解构赋值可以取到继承的属性，扩展运算符的解构赋值，不能复制继承自原型对象的属性
```javascript
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```
- 解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错

解构赋值的应用场景
- 交换变量的值
```javascript
let x = 1;
let y = 2;
[x, y] = [y, x];
```
- 从函数返回多个值
```javascript
// 返回一个数组

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```
- 函数参数定义
```javascript
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```
- 提取JSON数据
```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```
- 遍历 Iterator 接口的对象
```javascript
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```
- 输入模块的指定方法
```javascript
const { SourceMapConsumer, SourceNode } = require("source-map");
```

## 对象的扩展运算符
对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
```javascript
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }
```
由于数组是特殊的对象，所以对象的扩展运算符也可以用于数组。
```javascript
let foo = { ...['a', 'b', 'c'] };
foo
// {0: "a", 1: "b", 2: "c"}
```
如果扩展运算符后面是一个空对象，则没有任何效果。
```javascript
{...{}, a: 1}
// { a: 1 }
```
如果扩展运算符后面不是对象，则会自动将其转为对象。
```javascript
// 等同于 {...Object(1)}
{...1} // {}
//1会自动转为数值的包装对象Number{1}。由于该对象没有自身属性，所以返回一个空对象
```
对象的扩展运算符等同于使用Object.assign()方法
```javascript
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```
扩展运算符可以用于合并两个对象
```javascript
let ab = { ...a, ...b };
// 等同于
let ab = Object.assign({}, a, b);
```

它只是拷贝了对象实例的属性，如果想完整克隆一个对象，还拷贝对象原型的属性，可以：
```javascript
// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```

## 属性的遍历
### 属性描述符
 Object.getOwnPropertyDescriptor() 方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
 一个属性描述符是一个记录，由下面属性当中的某些组成的:
 - configurable: 当且仅当指定对象的属性描述可以被改变或者属性可被删除时(表示能否通过delete删除属性从而重新定义属性)，为true; 默认为false
 - enumerable: 当且仅当指定对象的属性可以被枚举出时，为 true; 默认为false
 - writable: 当且仅当属性的值可以被改变时为true。(仅针对数据属性描述有效); 默认为false
 - value: 该属性的值(仅针对数据属性描述符有效); 默认为undefined
 - get
 - set

 ps: 使用Object.defineProperty() 定义对象属性时，如已设置 set 或 get, 就不能设置 writable 和 value 中的任何一个了，不然会报错，因为不再需要value和writable的属性了，所有关于value的操作都由get和set代理了
        
 Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。默认情况下，通过Object.defineProperty()添加的属性是不可修改的(上面三个属性默认为false)
 ```javascript
//Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
  let a = {};
  Object.defineProperty(a, 'name', {});
  console.log(Object.getOwnPropertyDescriptor(a, 'name'));
//  {
//    value: undefined,
//    writable: false,
//    enumerable: false,
//    configurable: false
//  }
```

以上前四个属性在不显示调用Object.defineProperty()的时候，即通过赋值操作添加的属性，前三个默认值都为true，而value为你自己设定的值，如果不设定的话则为undefined
```javascript
//Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```
### [对象防篡改](https://github.com/lancertea/javascript-/blob/master/ES6/change.html)
     
### 可枚举
可枚举属性是指那些内部 “可枚举” 标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false。常见不可枚举的属性：name prototype length 

实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到

目前，有四个操作会忽略enumerable为false的属性。
- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

ES6 规定，所有Class 的原型的方法都是不可枚举的

### 遍历方法
1. for...in 循环
该方法依次访问一个对象及其原型链中所有可枚举的属性(不含Symbol属性).同时使用 hasOwnProperty()+in，可确定该属性到底是存在于对象中，还是原型中
```javascript
let ary = [10,20,30];
console.log('0' in ary);  //true
console.log('push' in ary); //true
for(let key in ary){
    console.log(key);//"0"  "1"  "2"   为啥
}
console.log(ary.hasOwnProperty('0'));  //true
console.log(ary.hasOwnProperty('push')); //false "push"是它公有的属性不是私有的

console.log(Array.prototype.hasOwnProperty('push')); //true 是公有还是私有属性，需要看相对谁来说的
console.log(Array.prototype.hasOwnProperty('hasOwnProperty')); //false
console.log(Object.prototype.hasOwnProperty('hasOwnProperty')); //true   
//自己堆中有的就是私有属性，需要基于__proto__查找的就是公有属性
```
检测某个属性是否为对象的公有属性：hasPubProperty  
方法：是它的属性，但是不是私有的
```javascript
//基于内置类原型扩展方法
Object.prototype.hasPubProperty = function (property) {
	//=>验证传递的属性名合法性（一般只能是数字或字符串等基本值）
	let x = ["string", "number", "boolean"],
		y = typeof property;
	if (!x.includes(y)) return false;
	//=>开始校验是否为公有的属性（方法中的THIS就是要校验的对象）
	let n = property in this,
		m = this.hasOwnProperty(property);
	return n && !m;
}
console.log(Array.prototype.hasPubProperty('push')); //=>FALSE
console.log([].hasPubProperty('push')); //=>TRUE
```

2. Object.keys(obj)  
取得对象上所有可枚举的实例属性(不含Symbol属性),该方法返回对象自身包含（不包括原型中）的所有可枚举属性的名称的数组。
相应还有Object.values(obj)、Object.entries(obj)

3. Object.getOwnPropertyNames(obj)
该方法返回对象自身包含（不包括原型中）的所有属性(无论是否可枚举)(不含Symbol属性)的名称的数组。
```javascript
let ary = [10,20,30];
for(let key in ary){
    console.log(key);//"0"  "1"  "2"   
}
let res = Object.keys(ary);
  console.log(res);//["0", "1", "2"]

res = Object.getOwnPropertyNames(ary);
console.log(res);//["0", "1", "2", "length"]
```

4. Object.getOwnPropertySymbols(obj)
该方法返回一个数组，包含对象自身的所有 Symbol 属性的键名。

5. Reflect.ownKeys(obj)
该方法返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。

### for in 和for of的区别
JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6提供for...of循环，允许遍历获得键值,其作为遍历所有数据结构的统一方式(内部通过调用被遍历对象的Symbol.interator方法,得到一个迭代器，从而去遍历内部所有的数据，这也是Interable接口所约定的内容，如果一个普通对象也实现了该接口，就可以被for of 遍历)
for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。
```javascript
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```
```javascript
//obj这一层实现了一个可迭代接口（Iterable）
 const obj = {
   //这个接口约定了内部必须有一个返回一个迭代器的方法
   [Symbol.iterator]: function () {
     //迭代器（Iterator）
     return {
       next: function() {
         //迭代结果（iterationResult）
         return {
           value: 'zce',
           done: true
         }
       }
     }
   }
 }
```
```javascript
 const obj = {
   store: [1,2,3],
   [Symbol.iterator]: function () {
     let index = 0;
     const self = this;
     return {
       next: function() {
         const result = {
           value: self.store[index],
           done: index >= self.store.length
         }
         index ++;
         return result;
       }
     }
   }
 }
 for(const item of obj){
   console.log(item);
 }
```
for...in循环有几个缺点。
1. 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
2. for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
3. 某些情况下，for...in循环会以任意顺序遍历键名。
总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。

for...of的优点
1. 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
2. 不同于forEach方法，它可以与break、continue和return配合使用。
3. 提供了遍历所有数据结构的统一操作接口。

## symbol
【引入原因】：ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突

ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。Symbol值通过[Symbol函数]生成，Symbol函数可以接受一个字符串作为参数(如果是一个对象，会调用对象的toString()方法)，表示对 Symbol 实例的描述, Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。
```javascript
typeof Symbol //"function"
typeof Symbol() //"symbol"

let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```
Symbol 值不能与其他类型的值进行运算，会报错。Symbol 值可以显式转为字符串,也可以转为布尔值，但是不能转为数值。
```javascript
let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'

Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```
### 应用
1. 作为属性名的Symbol
Symbol 值作为对象属性名时，不能用点运算符。
```javascript
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!';
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

```javascript
 //example 1
 var a={}, b='123', c=123;  
 a[b]='b';
 a[c]='c';  
 console.log(a[b]);//"c"
 ---------------------
 //example 2
 var a={}, b=Symbol('123'), c=Symbol('123');  
 a[b]='b';
 a[c]='c';  
 console.log(a[b]);//"b"
 ---------------------
 //example 3
 var a={}, b={key:'123'}, c={key:'456'};  
 a[b]='b';
 a[c]='c';  
 console.log(a[b]);//"c"
 ```

Symbol 作为属性名，遍历对象的时候，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。
但是，它也不是私有属性，有一个Object.getOwnPropertySymbols()方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```javascript
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
 ```

 另一个新的 API，Reflect.ownKeys()方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
 ```javascript
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
 ```

在全局注册同一个symbol
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。
 ```javascript
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
 ```
```javascript
//参数会先转换为string类型，再比较
let s1 = Symbol.for(true);
let s2 = Symbol.for('true');

s1 === s2 // true
 ```
```javascript
let a = Symbol("a");
let obj = {};
obj.a = 1;
obj.b = 2;
console.log(obj);//{a: 1, b: 2}
let obj1 = {};
obj1[a] = 1;
obj1.b = 2;
console.log(obj1);//{b: 2, Symbol(a): 1}
//console.log(obj1[b]); ReferenceError: b is not defined
console.log(obj1.b);//2
console.log(obj1["b"]);//2
console.log(obj1[a]);//1
console.log(obj1["a"]);//undefined
let obj2 = {
    [a]: 1,
    b: 2,
    c: 3
};
console.log(obj2);//{b: 2, c: 3, Symbol(a): 1}
for (let key in obj2) {
    console.log(obj2[key]);//2 3
}
console.log(Object.keys(obj2));//["b", "c"]
console.log(Object.getOwnPropertyNames(obj2));//["b", "c"]
console.log(Reflect.ownKeys(obj2));// ["b", "c", Symbol(a)]
```

2. 模拟类的私有方法
```javascript
 const speak = Symbol();
 class person {    [speak]() {    }}
 ```
## Iterator
遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：
1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

Iterator 的遍历过程是这样的。
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个[指针对象]。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

### 原生具备Iterator接口的数据结构
Array  Map  Set  String  TypedArray arguments NodeList

### 调用 Iterator 接口的场合
- 解构赋值
- 扩展运算符
- yield*
- 任何接受数组作为参数的场合
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()

### “...”的作用
- 拓展运算符（多用在解构赋值中）
- 展开运算符（多用在传递实参中）
- 剩余运算符（多用在接收实参中）
```javascript
//=>解构赋值
let [n,...m] = [12,23,34];
//n:12
//m:[23,34]

//=>传递实参
let ary=[12,23,13,24,10,25];
let min=Math.min(...ary);
//数组克隆（浅克隆）
let cloneAry=[...ary];
//对象克隆（浅克隆）
let obj={name:'园园',age:16};
let cloneObj={...obj,sex:'girl',age:17};

//=>接收实参
let fn=(n,...arg)=>{
    //n:10
    //arg:[20,30]
};
fn(10,20,30);
```
### [ES5实现...](https://github.com/lancertea/javascript-/blob/master/ES6/ES6_with_ES5/rest_spread.html)

### super
super这个关键字，既可以当作函数使用，也可以当作对象使用
- super作为函数调用时，代表父类的构造函数，
在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例
- super作为对象，super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。
在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例

## 函数
### 默认参数
1. ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。
```javascript
function f(x, y = 'World') {
            console.log(x, y);
}
//当y===undefined，才会被改为默认值
 f('Hello');//'Hello World'
 f('Byebye','');//'Byebye'
```
2. 参数变量是默认声明的，所以不能用let或const再次声明(var可以)
```javascript
function f(x=1, y=2) {
  console.log(x, y);
  var x=3,y=4;
  console.log(x, y);
}
f();//1 2    3 4

function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}
```
3. 通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
```javascript
// 例一
function f(x = 1, y) {
  return [x, y];
}

f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
f(undefined, 1) // [1, 1]

// 例二
function f(x, y = 5, z) {
  return [x, y, z];
}

f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]
```
上面代码中，有默认值的参数都不是尾参数。这时，无法只省略该参数，而不省略它后面的参数，除非显式输入undefined。

默认值可以是表达式,但是表达式中的变量必须是已经初始化过的
```javascript
function f (x, y = 7, z = x + y) {
  console.log(f.length)
  return x * 10 + z
}
```

必填参数的检查
```javascript
    function checkParameter() {
      throw new Error('can\'t be empty')
    }

    function f(x = checkParameter(), y = 7, z = 42) {
      return x + y + z
    }
    console.log(f(1)); //50
    try {
      f()
    } catch (e) {
      console.log(e);
    };
```

4. 函数的length属性，将返回没有指定默认值的参数个数。
```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```
如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。
```javascript
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

#### 如何处理不确定参数的问题
```javascript
  // 不确定参数有几个，但是要对他们求和  
  // ES3,ES5 
  //arguments：实参长度
  function f() {
    var sum = 0;
    //[].forEach.call(arguments,item=>{});
    Array.prototype.forEach.call(arguments, function (item) {
      sum += item * 1;
    });
    return sum;
  }
  console.log(f(1, 2, 3, 6)); //12

  //ES6
  function f1(...arg) {
    var sum = 0;
    arg.forEach(item => {
      sum += item;
    });
    return sum;
  }
  console.log(f1(1, 2, 3, 6)); //12
```

### [ES5实现默认参数](https://github.com/lancertea/javascript-/blob/master/ES6/ES6_with_ES5/default_parameter.html)

### 箭头函数和普通函数的区别
1. 箭头函数语法上比普通函数更加简洁（ES6中每一种函数都可以使用形参赋默认值和剩余运算符）
2. 普通function的声明在变量提升中是最高的，箭头函数的创建都是函数表达式方式（变量=函数），这种模式下，不存在变量提升，函数只能在创建完成后被执行（也就是创建的代码之后执行）
3. 箭头函数没有自己的this，它里面的this是继承函数所处上下文中的this（使用call/apply等任何方式都无法改变this的指向）
4. 箭头函数中没有arguments（类数组），但是可以基于...arg扩展运算符获取实参集合
5. 箭头函数不能用于构造函数，不能用new关键字去调用
- 没有自己的 this，无法调用 call，apply
- 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的__proto__
6. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
```javascript
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;

foo.call({ id: 42 });
// id: 42
```
### [ES5实现箭头函数](https://github.com/lancertea/javascript-/blob/master/ES6/ES6_with_ES5/arrow_function.html)

### ES5构造函数和ES6构造函数的区别
ES5：  
- this.xxx 声明实例属性和方法  每个实例各一份
- 一般在构造函数外：类.prototype.xxx 声明原型属性和方法  所有实例共享
- 构造函数外：类.xxx  声明静态属性和方法  实例不能用，只有类可以用  
注：静态方法可以和非静态方法重名

ES6:  
- constructor内的this.xxx 声明实例属性和方法  或者直接在类内部以xxx方式声明属性   每个实例各一份 
- 一般在构造函数外：类.prototype.xxx 声明原型属性  直接在类内部以xxx(){}声明原型方法  所有实例共享
- 构造函数外：类.xxx  声明静态属性和方法  或者在类内部以static xxx声明静态属性和方法 ，实例不能用，只有类可以用（静态方法中的this指向类）

- class 声明内部会启用严格模式。
- class 声明不会提升
- class 的方法（包括静态方法和原型方法）都是不可枚举的。
- 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。
- 父类的静态方法可以被子类继承

## 严格模式
### 定义
JavaScript 严格模式就是让 JS 代码以更严格的模式执行，不允许可能会引发错误的代码执行。在正常模式下静默失败的代码，严格模式下就会抛出错误。

### 为什么要过渡到严格模式
1. 严格模式下的代码在运行的时候，更容易通过抛出的错误定位到问题所在的地方
2. 严格模式能够帮助你编写更符合规范的代码
3. 消除 JavaScript 语言上一些不合理，比较怪异的行为
4. 为未来新版本的 JavaScript 做铺垫
5. 有时候，严格模式下的 JavaScript 代码运行起来更快

### 如何使用
脚本文件范围：  
将 "use strict"; 放在脚本文件的第一行。整个脚本文件就会以“严格模式”执行

函数作用域范围：  
将 "use strict"; 放在函数体的第一行，则整个函数以"严格模式"运行。  
文件合并时，写在脚本文件第一行的 "use strict"; 来实现严格模式会失效，可以将脚本文件的代码放在一个立即执行表达式中。

```javascript
function doSomething(a, b) {
  'use strict';
  // code
}
```
从 ES5 开始，函数内部可以设定为严格模式。  
ES6规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。现在的 webpack 会在打包的时候默认是严格模式，所以现在不用再手动写 use strict了。

### 严格模式的具体定义
- 严格模式下无法再隐式创建全局变量，也就是，变量必须声明后才能使用，正常模式直接赋值给一个未定义的变量时，会将变量定义为全局变量。
```javascript
"use strict";
var a = b = 3;  // Uncaught ReferenceError: b is not defined
​
//以上代码等于：
var a;
b = 3;
a = b;
```
- 严格模式会使引起静默失败(silently fail,注:不报错也没有任何效果)的赋值操作抛出异常
1. 无法删除var声明的变量
2. 给只读属性(getter-only)赋值
3. 给不可扩展对象(non-extensible object)添加新属性
4. 删除对象的不可设置属性
```javascript
"use strict";

// 给不可写属性赋值
var obj1 = {};
Object.defineProperty(obj1, "x", { value: 42, writable: false });
obj1.x = 9; // 抛出TypeError错误

// 给只读属性赋值
var obj2 = { get x() { return 17; } };
obj2.x = 5; // 抛出TypeError错误

// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = "ohai"; // 抛出TypeError错误

delete Object.prototype; // 抛出TypeError错误
```
- 对象不允许有重名的属性，函数不允许有重名的参数。在正常模式中，对象的重名属性，位置靠后会覆盖位置靠前的重名属性。函数也是，函数体查找到的参数，靠后的重名参数会覆盖靠前的重名参数。
```javascript
'use strict';
var o = { p: 1, p: 2 }; // !!! 语法错误
```
```javascript
function sum(a, a, c) { // !!! 语法错误
  "use strict";
  return a + a + c; // 代码运行到这里会出错
}
```
- 严格模式禁止八进制数字语法，在ECMAScript 6中支持为一个数字加"0o"的前缀来表示八进制

- 禁止 this 关键字指向全局对象。正常模式下，函数中如果没有指明this  对象，JS 则会将 this 隐式指向为全局对象。如果绑定的值是非对象，将被自动转为对象再绑定上去，而 null 和 undefined 这两个无法转成对象的值，将被忽略。严格模式下，必须指明 this 的指向对象。如果没有指明的话，this的值为 undefined

- 不允许在函数内部遍历调用栈 禁止使用 arguments.callee、arguments.caller、fn.caller、fn.callee; 在严格模式下，arguments.callee 是一个不可删除属性，而且赋值和读取时都会抛出异常

- 禁用with语句

- 正常模式中，对参数重新赋值，会修改 arguments 类数组对象下的参数值。同时，修改 arguments 类数组对象的值，也会修改函数参数的值。严格模式下，不仅参数的值不会随着 arguments 类数组对象的变化而变化，参数的变化也不会引起 arguments 对象的变化，arguments 对象会记住参数的传入初始值。

- ES5禁止在非函数代码块声明函数。ES5 的严格模式只允许在全局作用域或函数作用域声明函数。


## reflect
静态对象，内部封装了一系列对对象的底层操作，其成员方法就是proxy处理对象的默认实现

```javascript
const obj = {
  foo: '123',
  bar: '456'
};
const proxy = new Proxy(obj,{
  get(target,property){
    console.log('自己的一些劫持逻辑')
    return Reflect.get(target,property)
  }
})
```

为什么有reflect
统一提供一套用于操作对象的API
```javascript
//before
const obj = {
  foo: '123',
  bar: '456'
};

console.log('foo' in obj);
console.log(delete obj.bar);
console.log(Object.keys(obj));

console.log(Reflect.has(obj,'foo'));
console.log(Reflect.deleteProperty(obj,'bar'));
console.log(Reflect.ownKeys(obj);)
```