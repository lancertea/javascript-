# 原型及原型链模式
每个函数数据类型的值，都有prototype属性（原型），这个属性的属性值是一个对象（“用来存储实例公用属性和方法”）这个属性指向其原型对象，原型对象有个constructor属性，指回其构造函数  
- 普通的函数
- 类（自定义类和内置类）
JavaScript 的所有对象中都包含了一个 __proto__ 内部属性，这个属性所对应的就是该对象的构造函数的原型对象。函数(普通函数/构造函数/内置类（Function、Object）)的__proto__为Function.prototype是一个空的匿名函数，其上面有很多常用方法：call apply bind
- 普通对象、数组、正则、Math、日期、类数组等等
- 实例也是对象数据类型的值
- 函数的原型prototype属性的值也是对象类型的
- 函数也是对象数据类型的值
当函数对象作为构造函数创建实例时，该 prototype 属性值将被作为实例对象的原型__proto__。

## 原型链查找机制
1. 先找自己私有的属性，有则调取使用，没有继续找
2. 基于__proto__找所属类原型上的方法（Fn.prototype），如果还没有则继续基于__proto__往上找...一直找到Object.prototype为止

### 补充：为什么getElementById的上下文只能是document?
document的原型链：  
document  
->HTMLDocument.prototype  
->Document.prototype
- createElement
- getElementById
- ...

->Node.prototype
- appendChild
- cloneNode
- ...  

->EventTarget.prototype
- addEventListener  

->Object.prototype

div的原型链  
div  
->HTMLDivElement.prototype  
->HTMLElement.prototype  
->Element.prototype  
- getElementsByClassName
- getElementsByTagName
- ...

->Node.prototype  
->EventTarget.prototype  
->Object.prototype

## 原型方法
构造函数  Person  
原型对象  Person.prototype  
实例对象  p1  

- instanceof  
判断实例对象的__proto__属性与构造函数的prototype是不是同一个引用。
如果不是，他会沿着对象的__proto__向上查找的，直到顶端Object.prototype  
eg: p1 instanceof Person
- construcor  
判断对象是哪个类的直接实例  
eg:p1.construcor===Person

- isPrototypeOf(obj)  
返回一个布尔值，用来判断某个原型对象和某个实例之间的关系  
eg:Person.prototype.isPrototypeOf(p1)

- Object.getPrototypeOf(obj)  
获得一个对象的原型  
eg:Object.getPrototypeOf(p1)===Person.prototype

- hasOwnProperty()  
检测一个属性是存在于实例还是存在与原型

## 构造函数，new时发生了什么
var obj  = {}; 
obj.__proto__ = Base.prototype;
Base.call(obj);  

1. 创建一个新的对象 obj;
2. 将这个空对象的__proto__成员指向了Base函数对象prototype成员对象
3. Base函数对象的this指针替换成obj, 相当于执行了Base.call(obj);
4. 如果构造函数显示的返回一个对象，那么则这个实例为这个返回的对象。 否则返回这个新创建的对象
 

## 重构类的原型
重构类的原型：让某个类的原型指向新的堆内存地址（重定向指向）  
问题：
1. 重定向后的空间中不一定有constructor属性（只有浏览器默认给prototype开辟的堆内存中才存在constructor），这样导致类和原型机制不完整；所以需要手动再给新的原型空间设置constructor属性   
2. 在重新指向之前，需要确保原有原型的堆内存中没有设置属性和方法，因为重定向后，原有的属性和方法就没啥用了（如果需要克隆到新的原型堆内存中，需要额外处理） 
3. 内置类的原型，由于担心这样的改变会让内置的方法都消失，所以禁止给内置类原型的空间重定向，例如：Array.prototype={...}这样没有用，如果想加方法Array.prototype.xxx=function(){...}可以这样处理
```javascript
function Fn() {
	// ...
}
Fn.prototype.xxx = function () {}
//=>批量给原型设置属性方法的时候：重构类的原型
Fn.prototype = {
	constructor: Fn,
	getA: function () {},
	getB: function () {}
}; 

//=>批量给原型设置属性方法的时候：设置别名
let proto = Fn.prototype;
proto.getA = function () {}
proto.getB = function () {}
proto.getC = function () {}
proto.getD = function () {} 
```
```javascript
 function Fn(num) {
     this.x = this.y = num;
 }
 Fn.prototype = {
     x: 20,
     sum: function () {
         console.log(this.x + this.y);
     }
 };
 let f = new Fn(10);
 console.log(f.sum === Fn.prototype.sum);
 f.sum();
 Fn.prototype.sum();
 console.log(f.constructor);
```
```javascript
function Fn() {
	let a = 1;
	this.a = a;
}
Fn.prototype.say = function () {
    this.a = 2;
}
Fn.prototype = new Fn;
let f1 = new Fn;
Fn.prototype.b = function () {
    this.a = 3;
};
console.log(f1.a);
console.log(f1.prototype);
console.log(f1.b);
console.log(f1.hasOwnProperty('b'));
console.log('b' in f1);
console.log(f1.constructor == Fn);
```

## 练习题 
### [原型练习](https://github.com/lancertea/javascript-/blob/master/training/5_proto/proto.md)


