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
