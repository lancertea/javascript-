# 变量类型及转换

## JavaScript 是什么类型的语言
静动是类型检查维度来说的
静态语言：一个变量声明时它的类型就是明确的，声明过后，它的类型就不允许再修改
动态语言：在运行过程中才能明确一个变量的类型，而且变量的类型随时可以改变

强弱类型是从类型安全维度来说的
强类型：语言层面限制函数的实参类型必须与形参相同
弱类型语言：支持隐式类型转换，不支持则为强类型语言

JavaScript是动态弱类型语言，灵活多变，但缺失了类型系统的可靠性

为什么JavaScript是动态弱类型语言？
1.早前的JS应用简单，提供类型系统反而多余
2.JS是脚本语言，不需要显式（手动）编译代码成可执行文件，解释器（浏览器、Node.js）会在运行时即时（Just-In-Time, JIT）编译并执行

源代码 → 解析（Parsing）→ 编译（JIT 编译）→ 执行

| 特性        | JavaScript（JS）       | TypeScript（TS）        |
| --------- | -------------------- | --------------------- |
| 文件后缀      | `.js`                | `.ts`                 |
| 是否需手动编译   | ❌ 不需要                | ✅ 需要（`tsc` 编译器）       |
| 执行方式      | 直接在浏览器 / Node.js 中运行 | 先编译为 JS，再运行           |
| 编译阶段      | ✅ JIT 编译（运行时由引擎完成）   | ✅ 静态编译（由开发者触发）        |
| 错误检查      | 运行时发现                | 编译时提前发现（类型检查）         |
| 浏览器是否直接支持 | ✅ 是                  | ❌ 否，需要先编译为 JS         |
| 示例执行流程    | `.js` → 浏览器解释执行      | `.ts` → `.js` → 浏览器运行 |
| 调试成本      | 高（运行时报错）             | 低（开发期报错）              |
| 类型系统      | 动态类型                 | 静态类型（带类型注解）           |
| 使用体验      | 快速实验，灵活但易出错          | 安全可靠，适合大型项目           |
```typescript
function greet(name: string): string {
  return `Hello, ${name}`
}

const userName: string = "Lancer"
console.log(greet(userName))
```
使用tsc编译为
```javascript
function greet(name) {
  return "Hello, " + name;
}

var userName = "Lancer";
console.log(greet(userName));
```


弱类型产生的问题
1.运行时才能发现异常
```javascript
const obj = {}
obj.foo();
setTimeout(()=>{
    //
    obj.foo();
},100000)
```
2.类型不明确导致函数功能发生改变
```javascript
function sum(a,b){
    return a+b;
}
//因类型传错导致结果不为预期
console.log(sum(100,200));
console.log(sum(100,'100'));
```
3.对象功能索引的错误用法
```javascript
const obj ={}
obj[true] = 100;
console.log(obj['true']) //转换成string
```
强类型的优势
1.错误更早暴露（在编译前暴露很多问题，而不是运行时）
2.代码更智能（确定类型后，可用类型推断），编码更准确
3.重构更牢靠
4.减少不必要的类型判断

## 变量类型
基本类型（原始值）：字符串(String)、数字(Number)、布尔(Boolean)、空（Null）、未定义（Undefined）、Symbol（独一无二的值）、BigInt(支持任意精度表示整数)  
存储在栈（stack）中的简单数据段，也就是说，它们的值直接存储在变量访问的位置   

引用数据类型（引用值）：对象(Object)、数组(Array)、日期(Date)、正则(RegExp)、函数(Function) 、Set、Map
基本包装类型：字符串(String)、数字(Number)、布尔(Boolean)  
存储在堆（heap）中的对象，也就是说，存储在变量处的值是一个指针（point），指向存储对象的内存处  

### 基本类型和引用类型的区别
- 基本类型是存储在栈（stack）中的简单数据段，它们的值直接存储在变量访问的位置  
- 引用类型是存储在堆（heap）中的对象，即它的存储空间将从堆中分配。存储在变量处的值是一个指针（point），指向存储对象的内存处。 由于引用值的大小会改变，所以不能把它放在栈中，否则会降低变量查寻的速度。相反，放在变量的栈空间中的值是该对象存储在堆中的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响  

栈内存：存储执行上下文和基本类型的值 （调用栈是 JavaScript 引擎追踪函数执行的一个机制） 
堆内存：存储引用类型的值

1. 栈内存(Stack)
- 栈是一种后进先出(LIFO)的数据结构
- 栈内存主要存储：
    - 基本类型的值(如 number, string, boolean, null, undefined, symbol)
    - 执行上下文(包含函数调用的信息)
- 特点：
    - 空间较小但运行效率高
    - 存储的值大小固定
    - 系统自动分配和释放
2. 堆内存(Heap)
- 堆是一种树形的存储结构
- 主要存储：
    - 引用类型的值(如对象、数组、函数等)
- 特点：
    - 空间较大但运行效率相对较低
    - 存储的值大小不固定
    - 需要手动清理(通过垃圾回收机制)
3. 执行上下文(Execution Context)
- 是 JavaScript 代码执行的环境
- 包含三个主要部分：
    - 变量对象(Variable Object)：存储变量声明、函数声明等
    - 作用域链(Scope Chain)：决定变量访问权限
    - this 值：确定当前执行的上下文
- 当调用函数时，会创建新的执行上下文，这个执行上下文被推入调用栈。函数执行完后，这个执行上下文会从栈中弹出。执行上下文的栈式管理保证了代码执行的有序性

### 基本类型和基本包装类型的区别
基本类型是没有属性和方法的，但仍然可以使用对象才有的属性方法。这时因为在对基本类型使用属性方法的时候，后台会隐式的创建这个基本类型的对象（即基本包装类型），之后再销毁这个对象    
通过字面量的方式创建：var a = 'string'，这时它是基本类型值,对其使用属性方法的时候会隐式地创建这个基本类型的对象     
通过构造函数的方式创建：var a = new String('string');这时它是对象类型
```javascript
//1 与 Number(1)有什么区别
var a = new Number(1);
console.log(typeof 1); //"number"
console.log(typeof a); //"object"
console.log(1 == a); //true
console.log(1 instanceof Number); //false
console.log(a instanceof Number); //true
console.log(1 === a); //false
```

```javascript
//1 与 Number(1)有什么区别
console.log(!!new Boolean(false)); //true
console.log(new Boolean(false).valueOf()); //false
```

### 基本包装类型和引用类型的区别
引用类型和基本包装类型的主要区别是对象的生存期。引用类型在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁

### undefined和null的区别
javascript的最初版本是这样区分的：  
null是一个表示“无”的对象，转为数值时为0  
undefined是一个表示“无”的原始值，转为数值时为NaN  

undefined：表示这个变量尚未存在。  
变量被声明但未初始化、数组没有赋值的位置、对象没有赋值的属性等均为undefined；当函数无明确返回值时，默认返回undefined  
```javascript
//1.变量被声明但未初始化时为undefined
var a;
console.log(a == undefined); //true
console.log(a === undefined); //true

//2.未声明的变量,数据类型为'undefined'
console.log(typeof b); //'undefined'
//console.log(b==undefined); b未声明，报错

//3.数组没有赋值的位置，也为undefined
var b = [1, 2];
b[4] = 3;
console.log(b); //[ 1, 2, undefined, undefined, 3 ]

//4.对象没有赋值的属性，也为undefined
var obj = {};
console.log(obj.name); //undefined

//5.当函数无明确返回值时，默认返回undefined
function c() {}
console.log(c() == undefined); //true
console.log(c() === undefined); //true
```
null:用于表示有这个变量，但是它当前没有值（对象的占位符,空对象指针）。或主动释放一个变量引用的对象，表示一个变量不再指向任何对象地址

区别联系：
- undefined 实际上是从null派生来的，因此 ECMAScript 把它们定义为相等的（==）
- 两者均为基本类型（原始值），保存在栈中，但数据类型不同（typeof返回不同）
- 转为布尔类型均为false，但转为数值类型不同，undefined:NaN,null:0
- 都没有valueOf()和toString()方法，但可通过String()方法转为字符串类型
```javascript
//值 undefined 实际上是从值 null 派生来的，因此 ECMAScript 把它们定义为相等的。
console.log(undefined == null); //true
console.log(undefined === null); //false
//当使用完一个比较大的对象时，需要对其进行释放内存时，设置为 null。

//两者均为基本类型（原始值），保存在栈中，但数据类型不同
console.log(typeof undefined); //'undefined'
console.log(typeof null); //'object'

//转为布尔类型均为false，但转为数值类型不同
console.log(Boolean(undefined)); //false
console.log(Boolean(null)); //false
console.log(Number(undefined)); //NaN
console.log(Number(null)); //0

//都没有valueOf()和toString()方法，但可通过String()方法转为字符串类型
console.log(String(undefined)); //'undefined'
console.log(String(null)); //'null'
```
## 类型识别
### typeof
- 识别所有基本类型，除了null
- 识别函数
- 判断是否是引用类型，但无法判断其具体类型，因为都是返回"object"  
[局限性]能判断是引用类型，但是无法判断具体是什么引用类型

"undefined"  未声明的变量或声明后未初始化  
"boolean"   布尔值true/false  
"string"  字符串（包括空字符串）  
"number"  数值(包括一些Math里的数、特殊的Number值：NaN、Infinity、-Infinity、NaN等)  
"symbol"  Symbol  
"object"  对象（包括空对象、new、数组，日期）或null  
"function"  函数(包括class、 一些Math里的函数 、new Function)  
对于正则表达式，有的浏览器返回"function"，有的返回"object"  
为什么 typeof 运算符对于 null 值会返回 "Object"？这实际上是 JavaScript 最初实现中的一个错误，然后被 ECMAScript 沿用了。现在，null 被认为是对象的占位符，从而解释了这一矛盾，但从技术上来说，它仍然是原始值。

### instanceof
用来检测构造函数的prototype属性是否出现在某个实例对象的原型链上  
语法：实例 instanceof 类  
属于返回true，不属于返回false    
[局限性]
- 要求检测的实例必须是对象数据类型的，基本数据类型的实例是无法基于它检测出来的   
```javascript
let ary = [12, 23];
console.log(ary instanceof Array); //true
console.log(ary instanceof RegExp); //false
console.log(ary instanceof Object); //true 
console.log(1 instanceof Number); //false
```
- 如果有原型重定向的情况，重定向前的实例无法通过这种方式检测
```javascript
function Fn() {
    this.x = 100;
    this.y = 200;
}
Fn.prototype.getX = function () {
    console.log(this.x);
};
let f1 = new Fn;
Fn.prototype = {
    getY: function () {
        console.log(this.y);
    }
}

let f2 = new Fn;
console.log(f1 instanceof Fn); //false
console.log(f2 instanceof Fn); //true
```
instanceof原理  
判断实例对象的__proto__属性与构造函数的prototype是不是用一个引用。如果不是，他会沿着对象的__proto__向上查找的，直到顶端的Object.prototype

### constructor
constructor属性返回对创建此对象的函数(构造函数)的引用  
[局限性] 只能验证对象实例（对象才有属性），实例的constructor指向其构造函数，但是可以随意修改对应的constructor值或者手动给ary增加一个私有的constructor属性
```javascript
let ary = [];
let n = new Number(1);
console.log(ary.constructor === Array); //true
console.log(n.constructor === Number); //true
ary.constructor = 3;
console.log(ary.constructor === Array); //false
```

### Object.prototype.toString.call(obj)
- 使用Object.prototype.toString()来进行类型识别，返回代表该对象的[object 数据类型]的字符串表示
- Object.prototype.toString()可以识别标准类型及内置对象类型(Array、Set、Map、Regexp、Date、Function、Object)，但不能识别自定义类型
- 如果是原始类型，他会将原始类型包装为引用类型  
[局限性] 可以识别标准类型及内置对象类型，但不能识别自定义类型

#### obj.toString() 和Object.prototype.toString.call(obj)的区别
toString为Object的原型方法，而Array ，function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串.....），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object上原型toString方法。

### 如何判断一个数据是不是Array
- Array.isArray(obj)   
ECMAScript 5中的函数，但它不兼容IE8及其以下低版本。
- obj instanceof Array   
当用来检测在不同的window或iframe里构造的数组时会失败。这是因为每一个iframe都有它自己的执行环境，彼此之间并不共享原型链，所以此时的判断一个对象是否为数组就会失败。此时我们有一个更好的方式去判断一个对象是否为数组
- Object.prototype.toString.call(obj) == '[object Array]' 
- obj.constructor === Array   
constructor属性返回对创建此对象的函数的引用

## 类型转换
### valueOf()和toString()
valueOf()用于返回指定对象的原始值（基本类型值）  
1. undefined、null没有这个方法  
2. String、bool、Number返回其基本类型值  
3. Array、Function、RegExp、Object、自定义对象类型返回其本身  
4. Date：返回当前时间距1970年1月1日午夜的毫秒数

toString()用于返回该对象的字符串  
1. undefined、null没有这个方法  
2. String、bool、Number返回其基本类型值的字符串表示  
3. Array：转换为由数组中每个值的字符串形式拼接而成的一个以逗号分隔的字符串
["CodePlayer", true, 12, -5] —>'CodePlayer,true,12,-5'  
4. Function:把整个函数转换为字符串（返回函数代码的字符串表示）  
5. RegExp:返回正则表达式字面量的字符串表示  
6. Date：把 Date 对象转换为字符串（确切日期，非毫秒数）  
7. Object/自定义对象类型：返回[object Object]  

```javascript
function people(name,age){
    this.name = name;
    this.age = age;
}

let p1 =new people('jane',18);
console.log(p1.toString());//'[object Object]'
console.log(p1.valueOf());//people {name: "jane", age: 18}
```

### Boolean(obj)
Boolean():将任何类型的值转换为布尔值。以下值会被转换为false：false、''、0、NaN、null、undefined。其余任何值都会被转换为true  
Symbol值可以转为布尔值，但是不能转为数值
```javascript
console.log(!!(new Boolean(false))); //true
console.log((new Boolean(false)).valueOf()); //false
```

### Number类型
这种类型使用IEEE754格式来表示整数和浮点数值     
- 整数也可以被表示为八进制（以 8 为底）或十六进制（以 16 为底）的字面量。
1. 八进制字面量的首数字必须是 0，其后的数字可以是任何八进制数字（0-7），若数值超出范围，被当做十进制来解析
2. 十六进制字面量的前两位必须是 0x,然后是任意的十六进制数字（0 到 9 和 A 到 F）,大小写不敏感
3. 尽管所有整数都可以表示为八进制或十六进制的字面量，但所有数学运算返回的都是十进制结果  
- 浮点数必须包括小数点和小数点后的一位数字,也可用科学计数法表示浮点数  浮点数e/E(正整数/负整数)

特殊的Number值:
- Number.MAX_VALUE和 Number.MIN_VALUE：定义了 Number 值集合的外边界
当计算生成的数大于 Number.MAX_VALUE 时，它将被赋予值 Number.POSITIVE_INFINITY，意味着不再有数字值。同样，生成的数值小于 Number.MIN_VALUE 的计算也会被赋予值 Number.NEGATIVE_INFINITY，也意味着不再有数字值。如果计算返回的是无穷大值，那么生成的结果不能再用于其他计算。Number.POSITIVE_INFINITY 的值为 Infinity。Number.NEGATIVE_INFINITY 的值为 -Infinity。  
可以对任何数调用 isFinite() 方法，以确保该数不是无穷大,这个函数在参数位于最小最大数值之间时会返回true

- NaN，表示非数（Not a Number）任何涉及NaN的操作都会返回NaN.NaN与任何值都不相等，包括NaN本身  
可以对任何数调用 isNaN() 方法，以确定这个数是否“不是数值”。
ES5时，isNaN() 在接收到一个值后，会尝试将其转换为数值，不能转换的返回true（相当于调用了Number()）
```javascript
console.log(typeof Number.MAX_VALUE); //"number"
console.log(typeof Number.MIN_VALUE); //"number"
console.log(typeof Infinity); //"number"
console.log(typeof NaN); //"number"
console.log(isFinite(NaN)); //"false"
console.log(isFinite(Infinity)); //"false"
console.log(isFinite(Number.MIN_VALUE)); //"true"

//另外，数字属性不可用于变量。数字属性属于名为 number 的 JavaScript 数字对象包装器。这些属性只能作为 Number.MAX_VALUE 访问。使用 myNumber.MAX_VALUE，其中 myNumber 是变量、表达式或值，将返回 undefined：
console.log(Number.NEGATIVE_INFINITY); //-Infinity
var x = 6;
console.log(x.NEGATIVE_INFINITY); //undefined
```
#### Number(obj)
将任何类型的值转换为数值。  
原始类型转换：  
1. 如果是布尔值，true和false分别被转换为1和0
2. 如果是数字值，返回本身
3. 如果是null，返回0
4. 如果是undefined，返回NaN
5. 如果是字符串，遵循以下规则：
- 如果字符串中只包含数字，则将其转换为十进制（忽略前导0）
- 如果字符串中包含有效的浮点格式，将其转换为浮点数值（忽略前导0）
- 如果字符串包含有效的十六进制格式（eg:'0xf'），将其转换为相同大小的十进制整数值。
- 如果是空字符串，将其转换为0
- 如果字符串中包含非以上格式，则将其转换为NaN  
复合类型转换：  
6. 如果是对象
- 先调用对象的valueOf()方法，如果该方法返回的原始类型的值（数值、字符串、布尔值），则直接对该值使用Number方法，不再进行后续步骤。
- 如果valueOf()方法返回复合类型的值，再调用对象自身的toString（）方法，如果toString()返回原始类型的值，则对该值使用Number()方法，不再进行后续步骤。
- 如果toString()返回复合类型的值，则报错
```javascript
console.log(Number([]));//0
console.log(Number([1]));//1
console.log(Number([1,2]));//NaN
console.log(Number(""));//0
console.log(Number(" "));//0
console.log(Number({}));//NaN
```
### String(obj)
将任何类型的值转换为字符串。  
原始类型转换:
1. 如果值是null,返回‘null’
2. 如果值是undefined,返回‘undefined’
3. 如果值为数值，则转换为相应的字符串
4. 如果值为字符串，则返回原来的值
5. 如果值为布尔值，true返回"true",false返回"false"  
复合类型转换：  
6. 如果值为对象
- 先调用对象的toString()方法，如果该方法返回的原始类型的值（数值、字符串、布尔值），则直接对该值使用String方法，不再进行后续步骤。
- 如果toString()方法返回复合类型的值，再调用valueOf()方法，如果valueOf()返回原始类型的值，则对该值使用String方法，不再进行后续步骤。
- 如果valueOf()返回复合类型的值，则报错


