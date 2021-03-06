# 面向对象
## 单例设计模式
把描述当前事务特征的信息进行分组归类（减少全局变量的污染）
```javascript
let name='hope';
let age=18;
let sex='woman';

let name='jack';
let age=23;
let sex='man';

//单例：
let beautyGirl={
    name:'hope',
    age:18,
    sex='woman'
};
let oldMan={
    name:'jack',
    age:23,
    sex='man'
};
```
```javascript
let namespace = (function(){
    //创建一些方法（闭包中的私有方法）
    let fn=function(){
      	//....  
    };
    ...
    return {
        name:'xxx',
        fn:fn
    }
})();
namespace.name
namespace.fn();
```
## 工场模式
批量化生产：把实现某个功能的代码进行封装，后期在想实现这个功能，直接执行函数
- 低耦合：减少页面中冗余的代码
- 高内聚：提高代码的重复使用率
```javascript
function createPerson(name,age){
    let person={};
    person.name=name;
    person.age=age;
    return person;
}
let beautyGirl=createPerson('hope',18);
let oldMan=createPerson('jack',23);
beautyGirl.name
oldMan.name
...
```

## 创建对象
1. 字面量创建
2. new关键字创建
```javascript
let obj1 = {a:1,b:2};
let obj2 = new Object(obj1);
console.log(obj1 == obj2); //true
console.log(obj1 === obj2); //true
```

```javascript
function P(num) {
    this.num = num;
}
var p = new P('zz');
console.log(p.constructor); //function P(num)
function P1(num) {
    this.num = num;
}
var p1 = P1('ss'); //p1为undefined
//console.log(p1.constructor);
console.log(P1 === P1.prototype.constructor); //true
function P2(num) {
    return {
        num: num
    };
}
var p2 = P2('yy');
console.log(p2.constructor); //function Object()
console.log(P2 === P2.prototype.constructor); //true
```

```javascript
function O(name, num) {
    this.name = name;
    this.num = num;
    //这样写算什么
    gender: 'woman';
}
O.prototype.age = 18;
O.prototype.arr = [1, 2, 3];

var o1 = new O('o1', [1, 2]);
console.log(o1); //Object { name: "o1",num:[1,2] }
console.log(o1.gender); //undefined
console.log(O.gender);//undefined
o1.num.push(3);
//重写原型的引用类型值时，自己不会添加相应属性，会改变原型的引用类型值
o1.arr.push(4);
//重写原型对象的基本类型值时，在实例中添加了一个与原型的属性同名的属性，该属性会屏蔽原型中的那个属性，不会改变原型的基本类型值
o1.age = 20;
console.log(o1); //Object { name: "o1",num:[1,2,3], age: 20 }
console.log(O.prototype); //Object { age: 18, arr: [1,2,3,4],constructor: function O(name)}
//使用delete操作符可以删除实例属性，从而能重新访问原型中的属性
delete o1.age;
console.log(o1.age); //18
console.log(o1.hasOwnProperty('name')); //true
console.log(o1.hasOwnProperty('arr')); //false

console.log(O.prototype.isPrototypeOf(o1)); //true
console.log(Object.getPrototypeOf(o1) === O.prototype); //true
console.log(o1 instanceof O); //true
console.log(o1 instanceof Object); //true
console.log(o1.constructor === O); //true
console.log(o1.constructor === Object); //false

//遍历属性：
//1.for-in 所有属性
//该方法依次访问一个对象及其原型链中所有可枚举的属性
for (var pro in o1) {
    console.log(pro); //'name','num','age','arr'
}

//同时使用 hasOwnProperty()+in，可确定该属性到底是存在于对象中，还是原型中
for (var pro in o1) {
    if (o1.hasOwnProperty(pro)) {
        console.log(pro); //'name','num'
    }
}

//2.Object.keys()  取得对象上所有可枚举的实例属性
//该方法返回对象自身包含（不包括原型中）的所有可枚举属性的名称的数组
console.log(Object.keys(O)); //[]
console.log(Object.keys(o1)); //[ "name", "num" ]
console.log(Object.keys(O.prototype)); //[ "age", "arr" ]

//3.Object.getOwnPropertyNames():
//该方法返回对象自身包含（不包括原型中）的所有属性(无论是否可枚举)的名称的数组
console.log(Object.getOwnPropertyNames(O)); //  ["length", "name", "arguments", "caller", "prototype"]
console.log(Object.getOwnPropertyNames(o1)); //[ "name", "num" ]
console.log(Object.getOwnPropertyNames(O.prototype)); // [ "constructor", "age", "arr" ]

//4.Reflect.ownKeys(obj)
//该方法返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
console.log(Reflect.ownKeys(O));//  ["length", "name", "arguments", "caller", "prototype"]
console.log(Reflect.ownKeys(o1));//[ "name", "num" ]
console.log(Reflect.ownKeys(O.prototype));// [ "constructor", "age", "arr" ]
```

3. Object.create(obj)
创建一个新对象，使用现有的对象来提供新创建的对象的__proto__（充当原型）
```javascript
var P = {
    name: 'o1',
    arr: [1, 2, 3]
};
var o1 = Object.create(P);

console.log(o1); //Object {}
console.log(o1.name); //'o1'
o1.name = 'oo';
o1.arr.push(4);
console.log(o1.name); //'oo'
console.log(o1.arr); //[1,2,3,4]
console.log(o1); //Object { name: "oo" }
console.log(P); //Object { name: "o1", arr: [1,2,3,4] }

// console.log(P.prototype.isPrototypeOf(o1));  P.prototype is undefined
console.log(Object.getPrototypeOf(o1) === P); //true
//console.log(o1 instanceof P); P不是构造函数，会报错
console.log(o1 instanceof Object); //true
console.log(o1.constructor === P); //false
console.log(o1.constructor === Object); //true
```

4. Object.assign(obj)
```javascript
/*
创建一个空对象
有时我们需要创建一个纯净的对象, 不包含什么原型链等等. 
一般创建空对象最直接方式通过字面量 {}, 但这个对象中依然存在 __proto__ 属性来指向 Object.prototype
*/
let cle = {};
console.log(cle.__proto__);//Object.prototype
let cle1 = Object.create(null);
console.log(cle1.__proto__); //undefined
```
#### Object.create(obj)和Object.assign(obj)
Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
Object.create(proto[, propertiesObject])
```javascript
// 用于创建一个新对象,被创建的对象继承另一个对象(o)的原型
function createObj(o) {//传入的参数o为返回实例的__porto__,也就是实例构造函数的显示原型
    function F() {}//构造函数
    F.prototype = o;
    return new F();//返回实例
}
```
Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象(sources)复制到目标对象(target)。它将返回目标对象。
Object.assign(target, ...sources)
```javascript
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```
如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。
```javascript
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```
如果只有一个参数，Object.assign()会直接返回该参数。
```javascript
const obj = {a: 1};
Object.assign(obj) === obj // true
```
```javascript
// 复制一个对象
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
console.log(obj===copy); // false
```

## [属性的遍历](https://github.com/lancertea/javascript-/blob/master/ES6/ES6.md)

