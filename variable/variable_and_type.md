## 变量类型及转换
### 变量类型
基本类型（原始值）：字符串(String)、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol（独一无二的值）  
存储在栈（stack）中的简单数据段，也就是说，它们的值直接存储在变量访问的位置   

引用数据类型（引用值）：对象(Object)、数组(Array)、日期(Date)、正则(RegExp)、函数(Function) 
基本包装类型：字符串(String)、数字(Number)、布尔(Boolean)  
存储在堆（heap）中的对象，也就是说，存储在变量处的值是一个指针（point），指向存储对象的内存处  

#### 基本类型和引用类型的区别
- 基本类型是存储在栈（stack）中的简单数据段，它们的值直接存储在变量访问的位置  
- 引用类型是存储在堆（heap）中的对象，即它的存储空间将从堆中分配。存储在变量处的值是一个指针（point），指向存储对象的内存处。 由于引用值的大小会改变，所以不能把它放在栈中，否则会降低变量查寻的速度。相反，放在变量的栈空间中的值是该对象存储在堆中的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响  

栈内存：提供代码运行的环境，存储基本类型值。主线程在栈里面执行  
堆内存：提供引用类型存储的环境

#### 基本类型和基本包装类型的区别
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

#### 基本包装类型和引用类型的区别
引用类型和基本包装类型的主要区别是对象的生存期。引用类型在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁

#### undefined和null的区别
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
null:用于表示有这个变量，但是它当前没有值（对象的占位符）。或主动释放一个变量引用的对象，表示一个变量不再指向任何对象地址

区别联系：
- undefined 实际上是从null派生来的，因此 ECMAScript 把它们定义为相等的（==）
- 两者均为基本类型（原始bu值），保存在栈中，但数据类型不同（typeof返回不同）
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
### 类型识别
#### typeof操作符
- 识别所有基本类型，除了null
- 识别函数
- 判断是否是引用类型，但无法判断其具体类型，因为都是返回"object"

"undefined"  未声明的变量或声明后未初始化  
"boolean"   布尔值true/false  
"string"  字符串（包括空字符串）  
"number"  数值(包括一些Math里的数、特殊的Number值：NaN、Infinity、-Infinity、NaN等)  
"symbol"  Symbol  
"object"  对象（包括空对象、new、数组，日期）或null  
"function"  函数(包括class、 一些Math里的函数 、new Function)  
对于正则表达式，有的浏览器返回"function"，有的返回"object"  
为什么 typeof 运算符对于 null 值会返回 "Object"？这实际上是 JavaScript 最初实现中的一个错误，然后被 ECMAScript 沿用了。现在，null 被认为是对象的占位符，从而解释了这一矛盾，但从技术上来说，它仍然是原始值。

#### instanceof

#### Object.prototype.toString.call(obj)
- 使用Object.prototype.toString()来进行类型识别，返回代表该对象的[object 数据类型]的字符串表示
- Object.prototype.toString()可以识别标准类型及内置对象类型，但不能识别自定义类型
- 如果是原始类型，他会将原始类型包装为引用类型

##### obj.toString() 和Object.prototype.toString.call(obj)的区别
toString为Object的原型方法，而Array ，function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串.....），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object上原型toString方法。

#### 如何判断一个数据是不是Array
- Array.isArray(obj)   
ECMAScript 5中的函数，但它不兼容IE8及其以下低版本。
- obj instanceof Array   
当用来检测在不同的window或iframe里构造的数组时会失败。这是因为每一个iframe都有它自己的执行环境，彼此之间并不共享原型链，所以此时的判断一个对象是否为数组就会失败。此时我们有一个更好的方式去判断一个对象是否为数组。
- Object.prototype.toString.call(obj) == '[object Array]' 
- obj.constructor === Array   
constructor属性返回对创建此对象的函数的引用

### 类型转换
#### valueOf()和toString()
valueOf()用于返回指定对象的原始值（基本类型值）  
1. undefined、null没有这个方法  
2. String、bool、Number返回其基本类型值  
3. Array、Function、RegExp、Object返回其本身  
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

#### Boolean(obj)
Boolean():将任何类型的值转换为布尔值。以下值会被转换为false：false、''、0、NaN、null、undefined。其余任何值都会被转换为true  
Symbol值可以转为布尔值，但是不能转为数值
```javascript
console.log(!!(new Boolean(false))); //true
console.log((new Boolean(false)).valueOf()); //false
```

#### Number类型
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
可以对任何数调用 isNaN() 方法，以确定这个数是否“不是数值”。isNaN() 在接收到一个值后，会尝试将其转换为数值，不能转换的返回true（相当于调用了Number()）
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
#### String(obj)
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


