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

#### 属性的遍历（见ES6.md）

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
```