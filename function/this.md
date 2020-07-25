### this
this是执行上下文中的一个属性，而不是某个变量对象的属性。  
this由调用者提供，由调用函数的方式来决定（this的取值是在函数执行的时候决定的，不是在函数定义的时候确定的），能改变this的指向，但是不能给this赋值。    
1. new 的优先级最高：
new中没有返回其他对象，this指向新创建的对象  
new中有返回值：如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向新创建的对象  
2. 使用apply、call、bind 可以绑定this的指向（this是第一个参数）如果没有传递参数，非严格模式下是让函数中的this指向window，严格模式下指向undefined  
3. obj.foo()： 这种调用方式作为某对象的方法调用，this通常指向调用的对象。  
4. foo()：作为函数直接调用，非严格模式下，this指向window，严格模式下，this指向undefined；  
5. 箭头函数的this绑定只取决于外层（函数或全局）的作用域，对于前面的4种绑定规则是不会生效的，this在箭头函数创建时确定，它与声明所在的上下文相同（上级作用域）。(绑定定义时所在的作用域，而不是指向运行时所在的作用域)  
6. 给元素的某个事件绑定方法，当事件触发方法执行的时候，方法中的this是当前操作的元素本身（绑定事件的元素本身）（currentTarget）  
7. 自执行函数执行，this一般都是window；回调函数中的this一般都是window  
```javascript
let obj = {
    fn:(function(n){
    //把自执行函数执行的返回结果赋值给fn
    //this:window
    return function(){
        //=>fn等于这个返回的小函数
        //this:obj
    };
      })(10)
};
obj.fn();
```
```javascript
let obj = {
    funciton fn(){
        //this:window
    console.log(this)
    }
document.body.onclick=function(){
    //this:document.body
    fn();
}
```

#### 原型链中的this问题
 面向对象中有关私有/公有方法中的THIS问题  
 1. 方法执行，看前面是否有点，点前面是谁THIS就是谁
 2. 把方法总的THIS进行替换 
 3. 再基于原型链查找的方法确定结果即可
 ```javascript
function Fn() {
	//=>this:f1这个实例
	this.x = 100;
	this.y = 200;
	this.say = function () {
		console.log(this.x);
	}
}
Fn.prototype.say = function () {
	console.log(this.y);
}
Fn.prototype.eat = function () {
	console.log(this.x + this.y);
}
Fn.prototype.write = function () {
	this.z = 1000;
}
let f1 = new Fn;
f1.say(); //=>this:f1   =>console.log(f1.x)  =>100
f1.eat(); //=>this:f1   =>console.log(f1.x + f1.y)  =>300
f1.__proto__.say(); //=>this:f1.__proto__  =>console.log(f1.__proto__.y)  =>undefined
Fn.prototype.eat(); //=>this:Fn.prototype  =>console.log(Fn.prototype.x + Fn.prototype.y)  =>NaN
f1.write(); //=>this:f1  =>f1.z=1000  =>给f1设置一个私有的属性z=1000
Fn.prototype.write();//=>this:Fn.prototype  =>Fn.prototype.z=1000  =>给原型上设置一个属性z=1000（属性是实例的公有属性）

```