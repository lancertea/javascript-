# 继承

## 原型链实现继承

[原理]：把子类的 prototype（原型对象）设置为父类的实例.利用原型链的特性，子类实例可以访问到父类原型上的属性和方法。 
[形式]：Child.prototype = new Parent() 
[优点]：父类原型上的方法可以被所有子类实例复用
[缺点]
1.construcor 指向错误：：Child.prototype.constructor === P 
2.父类引用类型属性共享，造成污染：所有子类实例共享父类实例的引用类型属性，修改一个会影响其他
3.无法向父类传参：创建子类实例时，无法向父类构造函数传递参数（因为子类的原型是指向一个父类的实例，所以一开始父类的属性就被初始化了）

```javascript
function P(name, parr) {
  this.name = name;
  this.parr = parr;
  this.pstr = ["A", "B", "C"];
  pp = "pp"; //全局属性
  ppp: "ppp"; //错误写法
}
P.pnum = 1;
P.prototype.pact = "eat";
P.prototype.prr = [1, 2, 3];

//原型链继承实现方式
C.prototype = new P("zz", ["z1", "z2"]);

function C(age, carr) {
  this.age = age;
  this.carr = carr;
  this.cstr = ["a", "b", "c"];
}
C.cnum = 1;
C.prototype.cact = "game";
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ["z3", "z4"]);
console.log(c1);

/*
子类构造函数的属性(this.xx)作为实例属性，每个实例都有一份        
age: 18
​carr: Array [ "z3", "z4" ]
​cstr: Array [ "a", "b", "c" ]
<prototype>: 
子类构造函数的原型对象上的属性(C.prototype.xx)作为原型属性
​​      cact: "game"
​      crr: Array [ 7, 8, 9 ]
父类构造函数的实例属性作为子类的原型属性
​​      name: 'zz'
​​      parr: Array [ "z1", "z2" ]
​​      pstr: Array [ "A", "B", "C" ]
​​         <prototype>:
​​​                   constructor: function P(name, parr)
​​​                   pact: "eat"
​​​                   prr: Array(3) [ 1, 2, 3 ]
​                       <prototype>: Object { … }
 */

//一个实例改变原型上的引用类型属性，其他实例也会受影响
let c2 = new C(18, ["z3", "z4"]);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.crr.pop();
console.log(c1.crr); //Array [ 7, 8 ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B" ]
c2.prr.pop();
console.log(c1.prr); //Array [ 1, 2 ]
console.log(c2.name); //'zz'
c2.name = "c2";
console.log(c2.name); //'c2'
console.log(c1.name); //'zz'
c2.parr.pop();
console.log(c1.parr); //Array [ "z1" ]

//遍历：
for (let key in c1) {
  console.log(key);
  //age carr cstr name parr pstr cact crr pact prr(实例+原型)
}
console.log(Object.keys(c1)); //Array [ "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); //Array [ "age", "carr", "cstr" ]

for (let key in C) {
  console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C)); //Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
  console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P)); //Array ["length", "name", "arguments", "caller", "prototype", "pnum"]
```

## 借用构造函数
[原理]：在子类构造函数中，使用 Parent.call/apply(this)调用父类构造函数，从而在子类实例上复制一份父类的实例属性  
[形式]：function Child(){
Parent.call(this,xxx);
}
[优点]：
1.解决了引用类型属性被共享的问题（每个实例都有独立的属性）
2.可以在创建子类实例时向父类传递参数  
[缺点]：Parent 原型链上的属性和方法并不会被子类继承

```javascript
function P(name, parr) {
  this.name = name;
  this.parr = parr;
  this.pstr = ["A", "B", "C"];
  pp = "pp";
  ppp: "ppp";
}
P.pnum = 1;
P.prototype.pact = "eat";
P.prototype.prr = [1, 2, 3];

function C(age, carr) {
  P.call(this, "zz", ["z1", "z2"]);
  this.age = age;
  this.carr = carr;
  this.cstr = ["a", "b", "c"];
  cc = "cc";
  ccc: "ccc";
}
C.cnum = 1;
C.prototype.cact = "game";
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ["z3", "z4"]);
console.log(c1);
/*
子类、父类构造函数的属性作为实例属性，每个实例都有一份       
age: 18
​carr: Array ['z3', 'z4']
​cstr: Array [ "a", "b", "c" ]
name: 'zz'
​parr: Array ['z1', 'z2']
​pstr: Array [ "A", "B", "C" ]
<prototype>: 
        cact: "game"
        ​​crr: Array [ 7, 8, 9 ]
        constructor: function C(age, carr)
        ​​<prototype>: Object { … }
*/

let c2 = new C(18, ["z3", "z4"]);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.crr.pop();
console.log(c1.crr); //Array [7, 8]
// c2.prr.pop();
// console.log(c1.prr);
console.log(c2.name); //'zz'
c2.name = "c2";
console.log(c2.name); //'c2'
console.log(c1.name); //'zz'
c2.parr.pop();
console.log(c1.parr); //Array ['z1', 'z2']

for (let key in c1) {
  console.log(key);
  //age carr cstr name parr pstr cact crr （父类原型上的方法继承不到）
}
console.log(Object.keys(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]

for (let key in C) {
  console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C)); //Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
  console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P)); //Array ["length", "name", "arguments", "caller", "prototype", "pnum"]
```

## 组合继承方式

[原理]：组合使用原型链继承和借用构造函数继承  
[形式]：子类构造函数中使用 Parent.call(this);的方式可以继承写在父类构造函数中 this 上绑定的各属性和方法；使用 Child.prototype = new Parent()的方式可以继承挂在在父类原型上的各属性和方法 
```javascript
function Parent(name) { this.name = name; }
function Child(name) { Parent.call(this, name); } // 借用构造函数
Child.prototype = new Parent(); // 原型链继承
Child.prototype.constructor = Child; // 修正构造函数指向
``` 
[优点]：既能向父类传参、保证实例属性独立，又能复用父类原型上的方法。
[缺点]：父类构造函数在子类构造函数中执行了一次，在子类绑定原型时又执行了一次; 导致子类原型上多了一份不必要的父类实例属性。

```javascript
function P(name, parr) {
  this.name = name;
  this.parr = parr;
  this.pstr = ["A", "B", "C"];
  pp = "pp";
  ppp: "ppp";
}
P.pnum = 1;
P.prototype.pact = "eat";
P.prototype.prr = [1, 2, 3];

function C(age, carr) {
  P.call(this, "zz", ["z1", "z2"]);
  this.age = age;
  this.carr = carr;
  this.cstr = ["a", "b", "c"];
  cc = "cc";
  ccc: "ccc";
}
C.prototype = new P();
C.prototype.constructor = C;
C.cnum = 1;
C.prototype.cact = "game";
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ["z3", "z4"]);
console.log(c1);
/*
执行两次可以看出一些属性是重复的      
age: 18
​carr: Array ['z3', 'z4']
​cstr: Array [ "a", "b", "c" ]
name: 'zz'
​parr: Array ['z1', 'z2']
​pstr: Array [ "A", "B", "C" ]
<prototype>: 
        cact: "game"
        ​​crr: Array [ 7, 8, 9 ]
        name: undefined
        parr: undefined
        pstr: Array [ "A", "B", "C" ]
        ​​<prototype>: Object 
                pact: 'eat'
                prr: [1,2,3]
                constructor: ƒ P(name, parr)
                 ​​<prototype>: Object {...}
*/

let c2 = new C(18, ["z3", "z4"]);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.crr.pop();
console.log(c1.crr); //Array [7, 8]
// c2.prr.pop();
// console.log(c1.prr);
console.log(c2.name); //'zz'
c2.name = "c2";
console.log(c2.name); //'c2'
console.log(c1.name); //'zz'
c2.parr.pop();
console.log(c1.parr); //Array ['z1', 'z2']

for (let key in c1) {
  console.log(key);
  //age carr cstr name parr pstr cact crr pact prr（父类原型上的方法可以继承到）
}
console.log(Object.keys(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]

for (let key in C) {
  console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C)); //Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
  console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P)); //Array ["length", "name", "arguments", "caller", "prototype", "pnum"]
```

## 原型式继承
[原理]：借助 Object.create 方法实现普通对象的继承
[形式]：Child.prototype = Object.create(Parent.prototype)
```javascript
function createObj(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
const person = { names: ['a'] };
const p1 = createObj(person);
``` 
⬇️
```javascript
function createObj(o) {
 var newObj = {}
  Object.setPrototypeOf(newObj, o)
  return newObj
}
const person = { names: ['a'] };
const p1 = createObj(person);
``` 
⬇️
```javascript
const person = { names: ['a'] };
const p1 = Object.create(person);
``` 
[优点]：适合在已有对象的基础上进行简单包装，无需定义新的构造函数
[缺点]：与原型链继承一样，引用类型属性会被所有实例共享。

```javascript
let p = {
  name: "p",
  friends: ["p1", "p2", "p3"],
  getName: function () {
    return this.name;
  },
};

let p1 = Object.create(p);
p1.name = "tom";
p1.friends.push("jerry");

let p2 = Object.create(p);
p2.friends.push("lucy");

console.log(p1.name); // tom
console.log(p1.name === p1.getName()); // true
console.log(p2.name); // p
console.log(p1.friends); // ["p1", "p2", "p3","jerry","lucy"]
console.log(p2.friends); // ["p1", "p2", "p3","jerry","lucy"]
```
## 寄生式继承
[原理]在原型式继承的基础上，增强对象（给对象添加新方法），然后返回这个对象
```javascript
// 1. 基础对象（可以是任何对象）
const person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
  sayName() {
    console.log(this.name);
  }
};

// 2. 寄生式继承函数
function createAnother(original) {
  // 3. 创建新对象（基于 original）
  const clone = Object.create(original);
  
  // 4. 增强对象
  clone.sayHi = function() {
    console.log("hi");
  };
  
  // 5. 返回增强后的对象
  return clone;
}

// 使用
const anotherPerson = createAnother(person);
anotherPerson.sayName(); // "Nicholas" (继承自 person)
anotherPerson.sayHi();   // "hi"      (新增的方法)
``` 
[优点]：不需要定义复杂的构造函数或类，可以快速为对象添加功能；可以将通用的增强逻辑封装在一个函数里，复用性强
[缺点]：方法无法复用：每次调用 createAnother 都会创建一个全新的 sayHi 函数。如果有 100 个实例，就会有 100 个 sayHi 函数副本，浪费内存。这是它与“原型链继承”最大的区别——原型链上的方法是共享的，而寄生式继承新增的方法是独立的

## 寄生组合式继承
```javascript
// 1. 定义父类
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.colors = ['red', 'blue']; // 引用类型属性
}

Person.prototype.sayName = function() {
    console.log(this.name);
};

// 2. 定义子类
function Student(name, age, sno) {
    // 【第一步】借用构造函数：继承实例属性
    // 这一步只负责把 name, age, colors 复制到 Student 实例上
    Person.call(this, name, age); 
    this.sno = sno;
}

// 【第二步】寄生式继承：继承原型方法
// 核心函数：inheritPrototype
function inheritPrototype(subType, superType) {
    subType.prototype = Object.create(superType.prototype); 
    subType.prototype.constructor = subType; 
}

// 执行继承
inheritPrototype(Student, Person);

// 3. 给子类添加特有方法
Student.prototype.saySno = function() {
    console.log(this.sno);
};
``` 
[优点]：只调用了一次 Parent 构造函数；保持了原型链的正常查找；实例属性互不干扰
[缺点]：代码相对繁琐

```javascript
function P(name, parr) {
  this.name = name;
  this.parr = parr;
  this.pstr = ["A", "B", "C"];
  pp = "pp";
  ppp: "ppp";
  this.sayHip = function () {
    console.log("hi~ " + this.name);
  };
}
P.pnum = 1;
P.prototype.pact = "eat";
P.prototype.prr = [1, 2, 3];
P.prototype.sayByep = function () {
  console.log("bye~ " + this.name);
};

C.prototype = Object.create(P.prototype);
C.prototype.constructor = C;

function C(age, carr) {
  P.call(this, "zz", ["z1", "z2"]);
  this.age = age;
  this.carr = carr;
  this.cstr = ["a", "b", "c"];
  this.sayHic = function () {
    console.log("hi~ ");
  };
  cc = "cc";
  ccc: "ccc";
}
C.cnum = 2;
C.prototype.cact = "game";
C.prototype.crr = [7, 8, 9];
C.prototype.sayByec = function () {
  console.log("bye~ ");
};
let c1 = new C(18, ["z3", "z4"]);
console.log(c1);
/*
ES5:
this.xxx 声明实例的私有属性和方法  每个实例各一份，互不影响
一般在构造函数外：类.prototype.xxx 声明原型属性和方法  所有实例共享
构造函数外：类.xxx  声明静态属性和方法  实例不能用，只有类可以用
*/
/*
age: 18
​carr: Array [ "z3", "z4" ]
​cstr: Array [ "a", "b", "c" ]
        ​
name: 'zz'
​parr: Array [ "z1", "z2" ]
​pstr: Array [ "A", "B", "C" ]

sayHic: function sayHic()
​sayHip: function sayHip()
<prototype>: 
        ​​cact: "game"
        constructor: function C(age, carr)
        ​​crr: Array [ 7, 8, 9 ]
        sayByec: function sayByec()
        ​​    <prototype>: 
        ​​​            constructor: function P(name, parr)
        ​​​            pact: "eat"
        ​​​            prr: Array [ 1, 2, 3 ]
                    sayByep: function sayByep()
        ​​​            <prototype>: Object { … }
*/
let c2 = new C(18, ["z3", "z4"]);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.crr.pop();
console.log(c1.crr); //Array [ 7, 8 ] 原型上的引用类型还是会受影响
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.prr.pop();
console.log(c1.prr); //Array [ 1, 2 ]
console.log(c2.name); //'zz'
c2.name = "c2";
console.log(c2.name); //'c2'
console.log(c1.name); //'zz'
c2.parr.pop();
console.log(c1.parr); //Array ['z1', 'z2']

for (let key in c1) {
  console.log(key);
  //age carr cstr sayHic name parr pstr sayHip   实例属性+方法(8)
  //cact crr pact prr constructor sayByec sayByep  原型属性+方法(7)
}
console.log(Object.keys(c1)); // Array(8) [ "name", "parr", "pstr", "sayHip", "age", "carr", "cstr", "sayHic" ]
console.log(Object.getOwnPropertyNames(c1)); // Array(8) [ "name", "parr", "pstr", "sayHip", "age", "carr", "cstr", "sayHic" ]

for (let key in C) {
  console.log(key); //cnum 静态方法
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C)); //Array(6) ["length", "name", "arguments", "caller", "prototype", "cnum"]
console.log(Object.keys(C.prototype)); //Array(4) [ "constructor", "cact", "crr", "sayByec" ]
console.log(Object.getOwnPropertyNames(C.prototype)); //Array(4) [ "constructor", "cact", "crr", "sayByec" ]

for (let key in P) {
  console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P)); //Array(6) ["length", "name", "arguments", "caller", "prototype", "pnum"]
console.log(Object.keys(P.prototype)); //Array(3) [ "pact", "prr", "sayByep" ]
console.log(Object.getOwnPropertyNames(P.prototype)); //Array(4) [ "constructor", "pact", "prr", "sayByep" ]
```

## ES6 class
class 是语法糖，底层依然基于原型链和构造函数。extends 关键字在底层做了两件事：
1.使用 Object.create() 将子类的原型指向父类的原型（继承方法）。
2.使用 Object.setPrototypeOf() 将子类本身的原型指向父类本身（继承静态方法）。
在子类的 constructor 中必须调用 super()，底层等价于 Parent.call(this)
```javascript
// 1. 实现继承的核心函数 (类似 Object.create)
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  // 关键点：建立原型链，但不执行父类构造函数
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  // 设置静态属性的继承 (Student.__proto__ = Person)
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

// 2. 确保构造函数被正确调用 (防止直接调用 Student() 而不是 new Student())
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// --- 正式代码 ---

var Person = function () {
  function Person(name) {
    _classCallCheck(this, Person); // 检查是否使用了 new
    this.name = name;
  }

  // 将方法定义在原型上
  Person.prototype.sayHello = function sayHello() {
    console.log("Hello, " + this.name);
  };

  return Person;
}();

var Student = function (_Person) {
  // 【步骤 A】：建立继承关系 (对应 extends)
  _inherits(Student, _Person);

  function Student(name, sno) {
    _classCallCheck(this, Student);

    // 【步骤 B】：借用构造函数 (对应 super(name))
    // 注意：这里不能直接写 _Person.call(this)，因为 _Person 可能是 undefined
    // Babel 会使用一个更复杂的 _possibleConstructorReturn 来处理
    var _this = _Person.call(this, name) || this; 
    
    _this.sno = sno;
    return _this;
  }

  // 子类独有的方法
  Student.prototype.study = function study() {
    console.log('Studying...');
  };

  return Student;
}(Person);
``` 

```javascript
class Parent { constructor(name) { this.name = name; } }
class Child extends Parent {
  constructor(name) { super(name); } // 核心代码
}
``` 
[优点]：
语法更清晰，接近传统面向对象语言。
内置严格模式，防止 this 指向错误。
自动处理原型链和构造函数指向，避免了组合继承的繁琐和冗余。
支持 static、getter/setter 等现代特性。
[缺点]：
底层依然是原型链，对于习惯了传统 OOP 的开发者来说，理解其本质仍需要扎实的原型链基础。

```javascript
function Animal(name) {
  "use strict"; // 1. 默认严格模式
  this.name = name;
}
// 2. 方法不可枚举
Object.defineProperty(Animal.prototype, 'speak', {
  value: function() { console.log(`${this.name} makes a noise.`); },
  enumerable: false,
  configurable: true,
  writable: true
});
// 3. 静态方法
Animal.create = function(name) { return new Animal(name); };

function Dog(name) {
  "use strict";
  Animal.call(this, name); // 借用父类构造函数
}
// 4. 继承原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
// 5. 继承静态方法（子类原型指向父类本身）
Object.setPrototypeOf(Dog, Animal); 

// Dog 自己的 speak 方法（同样不可枚举）
Object.defineProperty(Dog.prototype, 'speak', {
  value: function() { console.log(`${this.name} barks.`); },
  enumerable: false,
  configurable: true,
  writable: true
});
``` 

```javascript
class P {
  //实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
  constructor(name, parr) {
    //实例属性
    this.name = name;
    this.parr = parr;
    this.pstr = ["A", "B", "C"];
    //实例方法
    this.sayHip = function () {
      console.log("hi~ " + this.name);
    };
  }
  //实例属性
  pp = "pp";
  //静态属性
  static pact = "eat";
  //原型方法
  sayByep() {
    console.log("bye~ " + this.name);
  }
  //静态方法
  static numberp() {
    console.log(P.pnum);
  }
}
//静态方法
P.pnum = 1;
//原型属性
P.prototype.prr = [1, 2, 3];

class C extends P {
  constructor(name, parr, age, carr) {
    super(name, parr);
    this.age = age;
    this.carr = carr;
    this.cstr = ["a", "b", "c"];
    this.sayHic = function () {
      console.log("hi~ ");
    };
  }
  cc = "cc";
  static cact = "game";
  sayByec() {
    console.log("bye~ ");
  }
  static numberc() {
    console.log(C.cnum);
  }
}
C.cnum = 2;
C.prototype.crr = [7, 8, 9];

let c1 = new C("zz", ["z1", "z2"], 18, ["z3", "z4"]);
console.log(c1);
/*
ES6:
constructor内的this.xxx 声明实例属性和方法  或者直接在类内部以xxx方式声明属性   每个实例各一份 
一般在构造函数外：类.prototype.xxx 声明原型属性  直接在类内部以xxx(){}声明原型方法  所有实例共享
构造函数外：类.xxx  声明静态属性和方法  或者在类内部以static xxx声明静态属性和方法 ，实例不能用，只有类可以用
*/

/*
age: 18
​carr: Array [ "z3", "z4" ]
​cc: "cc"
​cstr: Array(3) [ "a", "b", "c" ]
​name: "zz"
​parr: Array [ "z1", "z2" ]
​pp: "pp"
​pstr: Array(3) [ "A", "B", "C" ]
​sayHic: function sayHic()
​sayHip: function sayHip()
​<prototype>: 
​​        constructor: class C { constructor(name, parr, age, carr) }
​​        crr: Array(3) [ 7, 8, 9 ]
​​        sayByec: function sayByec()
​​               <prototype>: 
​​​                      constructor: class P { constructor(name, parr) }
​​​                      prr: Array(3) [ 1, 2, 3 ]
​​​                      sayByep: function sayByep()
​​​                      <prototype>: Object { … }
*/
let c2 = new C("c2", ["z11", "z22"], 20, ["z33", "z44"]);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.crr.pop();
console.log(c1.crr); //Array [ 7, 8 ] 原型上的引用类型还是会受影响
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.prr.pop();
console.log(c1.prr); //Array [ 1, 2 ]
//父类的静态方法可以被子类继承
console.log(C.pnum); //1
C.numberp(); //1

for (let key in c1) {
  console.log(key);
  //pp name parr pstr sayHip cc age carr cstr sayHic (10)实例属性+方法
  //crr prr  原型属性 没有原型方法(类定义在prototype上的方法是不可枚举的)
}
console.log(Object.keys(c1)); // Array(10) [ "pp", "name", "parr", "pstr", "sayHip", "cc", "age", "carr", "cstr", "sayHic" ]

console.log(Object.getOwnPropertyNames(c1)); //Array(10) [ "pp", "name", "parr", "pstr", "sayHip", "cc", "age", "carr", "cstr", "sayHic" ]

for (let key in P) {
  console.log(key); //pact pnum  静态属性 没有静态方法(类的内部所有定义的方法，都是不可枚举的)
}
console.log(Object.keys(P)); //Array [ "pact", "pnum" ]
console.log(Object.getOwnPropertyNames(P)); //Array(6) [ "prototype", "numberp", "pact", "pnum", "length", "name" ]
console.log(Object.keys(P.prototype)); //Array [ "prr" ]
console.log(Object.getOwnPropertyNames(P.prototype)); //Array(3) [ "constructor", "sayByep", "prr" ]

for (let key in C) {
  //父类的静态方法可以被子类继承
  console.log(key); //cact cnum pact pnum
}
console.log(Object.keys(C)); //Array [ "cact", "cnum" ]
console.log(Object.getOwnPropertyNames(C)); //Array(6) [ "prototype", "numberc", "cact", "cnum", "length", "name" ]
console.log(Object.keys(C.prototype)); //Array [ "crr" ]
console.log(Object.getOwnPropertyNames(C.prototype)); //Array(3) [ "constructor", "sayByec", "crr" ]
```

## 封装一个原生的继承方法

```javascript
function extendsClass(Parent, Child) {
  function F() {}
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  return Child;
}
```

## 重载重写的区别，应用场景

重载： 方法名相同，参数类型或者数量不同  
重写： 当父类的方法不能完全满足子类使用的时候，既可以保留父类的功能(沿袭、传承)，还可以有自己特有的功能

## 练习题

```javascript
function C1(name) {
  if (name) {
    this.name = name;
  }
}

function C2(name) {
  this.name = name;
}

function C3(name) {
  this.name = name || "join";
}
C1.prototype.name = "Tom";
C2.prototype.name = "Tom";
C3.prototype.name = "Tom";
alert(new C1().name + new C2().name + new C3().name);
```
