### 原型及原型链模式

每个函数数据类型的值，都有prototype属性（原型），这个属性的属性值是一个对象（“用来存储实例公用属性和方法”）这个属性指向其原型对象，原型对象有个constructor属性，指向其构造函数
- 普通的函数
- 类（自定义类和内置类）
JavaScript 的所有对象中都包含了一个 __proto__ 内部属性，这个属性所对应的就是该对象的构造函数的原型对象。函数(普通函数/构造函数/内置类（Function、Object）)的__proto__为Function.prototype是一个空的匿名函数，其上面有很多常用方法：call apply bind
- 普通对象、数组、正则、Math、日期、类数组等等
- 实例也是对象数据类型的值
- 函数的原型prototype属性的值也是对象类型的
- 函数也是对象数据类型的值
当函数对象作为构造函数创建实例时，该 prototype 属性值将被作为实例对象的原型__proto__。

#### 原型链查找机制
1. 先找自己私有的属性，有则调取使用，没有继续找
2. 基于\__proto\__找所属类原型上的方法（Fn.prototype），如果还没有则继续基于\__proto\__往上找...一直找到Object.prototype为止



**hasOwnProperty**

> 检测某一个属性名是否为当前对象的私有属性
>
> “in” ：检测这个属性是否属于某个对象（不管是私有属性还是公有属性，只要是它的属性，结果就为TRUE）

```javascript
let ary = [10,20,30];
console.log('0' in ary);  //=>TRUE
console.log('push' in ary); //=>TRUE
console.log(ary.hasOwnProperty('0'));  //=>TRUE
console.log(ary.hasOwnProperty('push')); //=>FALSE "push"是它公有的属性不是私有的

console.log(Array.prototype.hasOwnProperty('push')); //=>TRUE 是公有还是私有属性，需要看相对谁来说的
console.log(Array.prototype.hasOwnProperty('hasOwnProperty')); //=>FALSE
console.log(Object.prototype.hasOwnProperty('hasOwnProperty')); //=>TRUE   
//自己堆中有的就是私有属性，需要基于__proto__查找的就是公有属性（__proto__在IE浏览器中（EDGE除外）给保护起来了，不让我们在代码中操作它）
```

> 检测某个属性是否为对象的公有属性：hasPubProperty
>
> 方法：是它的属性，但是不是私有的

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
