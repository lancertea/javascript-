### 面向对象
#### 单例设计模式
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
#### 工场模式
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
#### 可枚举不可枚举
可枚举属性是指那些内部 “可枚举” 标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 true，对于通过 Object.defineProperty 等定义的属性，该标识值默认为 false。可枚举的属性可以通过 for...in 循环进行遍历（除非该属性名是一个 Symbol）  
常见不可枚举的属性：name prototype length 

#### 遍历属性的方法
1. for...in 循环
该方法依次访问一个对象及其原型链中所有可枚举的属性.同时使用 hasOwnProperty()+in，可确定该属性到底是存在于对象中，还是原型中
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

2. Object.keys()  
取得对象上所有可枚举的实例属性,该方法返回对象自身包含（不包括原型中）的所有可枚举属性的名称的数组。

3. Object.getOwnPropertyNames()
该方法返回对象自身包含（不包括原型中）的所有属性(无论是否可枚举)的名称的数组。
```javascript
let ary = [10,20,30];
for(let key in ary){
    console.log(key);//"0"  "1"  "2"   浏览器限制还是啥？？
}
let res = Object.keys(ary);
  console.log(res);//["0", "1", "2"]

res = Object.getOwnPropertyNames(ary);
console.log(res);//["0", "1", "2", "length"]
```