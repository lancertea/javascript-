### ES5与ES6的比较
#### var const和let的区别
在 ES6 之前，JavaScript 只有两种作用域： 全局变量与函数内的局部变量，没有块级作用域（{}）。let和const是ES6新增的关键字，let，const声明的变量只在 let 命令所在的代码块{}内有效，可实现块级作用域。const 声明一个只读的常量，一旦声明，就不能再重新赋值。
具体区别如下：
- 全局声明的var变量会挂载在window对象上，而let和const不会
在全局作用域下，带var/function声明的全局变量相当于给window设置了对应的属性（既是全局变量也是属性），不带var的声明只是给window设置了对应的属性，如果使用的是let/const声明的，只是全局变量，没有给window设置属性的.  
属性可以被delete删掉，变量不可以
- 重置变量：在相同的作用域中，只有var声明的变量可以重新声明
- 变量提升：创建变量的六种方式中：var/function有变量提升，也就是变量的使用可以写在变量的声明之前，因为无论声明写到当前作用域哪里，在代码执行前都会提升到当前作用域最前面。而let/const/class/import都不存在这个机制，必须先声明赋值才能使用。const必须声明的时候就要立即赋值，且赋值后不能再重新赋值。
- 并非真正的常量：使用const定义的对象或者数组可以修改，但不能重新赋值（const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。）

##### 暂时性死区
暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。
```javascript
//console.log(a);//ReferenceError: a is not defined
console.log(typeof a);//undefined 这是浏览器的bug，本应该是报错的，因为没有a（暂时性死区）
//let const解决了typeof检测时出现的暂时性死区问题
//console.log(typeof b);//ReferenceError: Cannot access 'b' before initialization
let b;
```

#### symbol
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
##### 作为属性名的Symbol
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
 ```javascript
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

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
#### “...”的作用
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

#### Iterator
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

##### 原生具备Iterator接口的数据结构
Array  Map  Set  String  TypedArray arguments NodeList

##### 调用 Iterator 接口的场合
- 解构赋值
- 扩展运算符
- yield*
- 任何接受数组作为参数的场合
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()


#### 属性的遍历
##### 属性的特性
在JS对象中的属性有4个描述其行为的特性：
- configurable:表示能否通过delete删除属性从而重新定义属性
- enumerable:表示能否通过for-in循环或Object.keys方法返回属性
- writable:表示能否修改属性的值
- value:包含这个属性的数据值
以上四个属性在不显示调用Object.defineProperty()的时候，即通过赋值操作添加的属性，前三个默认值都为true，而value为你自己设定的值，如果不设定的话则为undefined
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
     
##### 可枚举不可枚举
可枚举属性是指那些内部 “可枚举” 标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false。可枚举的属性可以通过 for...in 循环进行遍历（除非该属性名是一个 Symbol）  
常见不可枚举的属性：name prototype length 

目前，有四个操作会忽略enumerable为false的属性。
- for...in循环：只遍历对象自身的和继承的可枚举的属性。
- Object.keys()：返回对象自身的所有可枚举的属性的键名。
- JSON.stringify()：只串行化对象自身的可枚举的属性。
- Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

##### 遍历方法
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

##### for in 和for of的区别
JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6 提供for...of循环，允许遍历获得键值。
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
for...in循环有几个缺点。
1. 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
2. for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
3. 某些情况下，for...in循环会以任意顺序遍历键名。
总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。

for...of的优点
1. 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
2. 不同于forEach方法，它可以与break、continue和return配合使用。
3. 提供了遍历所有数据结构的统一操作接口。

#### 箭头函数和普通函数的区别
1. 箭头函数语法上比普通函数更加简洁（ES6中每一种函数都可以使用形参赋默认值和剩余运算符）
2. 普通function的声明在变量提升中是最高的，箭头函数的创建都是函数表达式方式（变量=函数），这种模式下，不存在变量提升，函数只能在创建完成后被执行（也就是创建的代码之后执行）
3. 箭头函数没有自己的this，它里面的this是继承函数所处上下文中的this（使用call/apply等任何方式都无法改变this的指向）
3. 箭头函数中没有arguments（类数组），但是可以基于...arg扩展运算符获取实参集合
4. 箭头函数不能用于构造函数，不能用new关键字去调用
- 没有自己的 this，无法调用 call，apply
- 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的__proto__
5. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
