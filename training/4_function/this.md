1. 写出下面代码输出结果

   ```javascript
   var num = 10;
   var obj = {num: 20};
   obj.fn = (function (num) {
       this.num = num * 3;
       num++;
       return function (n) {
           this.num += n;
           num++;
           console.log(num);
       }
   })(obj.num);
   var fn = obj.fn;
   fn(5);
   obj.fn(10);
   console.log(num, obj.num);
   ```

2. 写出下面代码输出结果

   ```javascript
   var fullName='language';
   var obj={
   	fullName:'javascript',
   	prop:{
   		getFullName:function(){
   			return this.fullName;
   		}
   	}
   };
   console.log(obj.prop.getFullName());
   var test=obj.prop.getFullName;
   console.log(test());
   ```

   ```javascript
    const user = {
           count: 1,
           action: {
               getCount: () => this.count //window window window 
               // getCount:function(){
               //     return this.count;       //this:action action window
               // }            
           }
       };
    const action = user.action;
    const getCount = user.action.getCount;
    console.log(user.action.getCount());
    console.log(action.getCount());
    console.log(getCount());
   ```

   ```javascript
   var name='window';
   var Tom={
   	name:"Tom",
   	show:function(){
   		console.log(this.name);
   	},
   	wait:function(){
   		var fun=this.show;
   		fun();
   	}
   };
   Tom.wait();
   ```

3. 腾讯面试题

   ```javascript
   function fun(){
   	this.a=0;
   	this.b=function(){
   		alert(this.a);
   	}
   }
   fun.prototype={
   	b:function(){
   		this.a=20;
   		alert(this.a);
   	},
   	c:function(){
   		this.a=30;
   		alert(this.a)
   	}
   }
   var my_fun=new fun();
   my_fun.b();
   my_fun.c();
   ```

4.  怎么规避多人开发函数重名的问题？（百度搜索）

5. 360面试题

   ```javascript
   window.val=1; 
   var json={ 
       val:10, 
       dbl:function(){ 
           this.val*=2; 
       } 
   } 
   json.dbl(); 
   var dbl = json.dbl; 
   dbl(); 
   json.dbl.call(window); 
   alert(window.val + json.val);
   ```

   ```javascript
   <!-- 做错 -->
   (function(){
       var val =1;
       var json ={
             val:10,
             dbl:function(){
               val*=2;
             }
       };
       json.dbl();
       alert(json.val+val);
   })();
   ```

   ```javascript
   function C1(name){
       if(name) {
       	this.name = name;
       }
   }
   function C2(name){
       this.name =name;
   }
   function C3(name){
       this.name = name ||'join';
   }
   C1.prototype.name='Tom';
   C2.prototype.name='Tom';
   C3.prototype.name='Tom';
   alert((new C1().name)+(new C2().name)+(new C3().name));
   ```

6. 滴滴面试题
（做错）
   ```javascript
   var foo = {
     bar: function () {
       console.log(this);
     }
   };
   foo.bar(); 
   (foo.bar)(); 
   ```
   ```javascript
   var x = 3,
   obj = {
       x: 5
   };
   obj.fn = (function () {
   this.x *= ++x;
   return function (y) {
       this.x *= (++x) + y;
       console.log(x);
   }
   })();
   var fn = obj.fn;
   obj.fn(6);
   fn(4);
   console.log(obj.x, x);
   ```

7. 美团
   ```javascript
   var name = 'global';
   var obj = {
       name: 'local',
       foo: function () {
           console.log(this);
           this.name = 'foo';
       }.bind(window)
   };
   var bar = new obj.foo();
   setTimeout(function () {
       console.log(window.name);
   }, 0);
   console.log(bar.name);
   var bar3 = bar2 = bar;
   bar2.name = 'foo2';
   console.log(bar3.name);
   ```

   那我给你整理 **10 道最经典的 `this` 面试题**，这些题基本覆盖了 `this` 的所有坑。很多大厂面试都会从这里面变形。

我会给你 **题目 + 结果 + 核心原因**。

---

# 1 默认绑定

```javascript
function foo() {
  console.log(this);
}

foo();
```

结果：

```
window
```

严格模式：

```
undefined
```

原因：

```
默认绑定
```

---

# 2 隐式绑定

```javascript
const obj = {
  a: 1,
  foo() {
    console.log(this.a);
  }
};

obj.foo();
```

结果：

```
1
```

原因：

```
obj 调用 foo
this = obj
```

---

# 3 隐式丢失

```javascript
const obj = {
  a: 1,
  foo() {
    console.log(this.a);
  }
};

const bar = obj.foo;

bar();
```

结果：

```
undefined
```

原因：

```
foo 被单独调用
this = window
```

---

# 4 作为回调函数

```javascript
const obj = {
  a: 1,
  foo() {
    console.log(this.a);
  }
};

setTimeout(obj.foo, 100);
```

结果：

```
undefined
```

原因：

```
setTimeout 调用 foo
this = window
```

---

# 5 call 显式绑定

```javascript
function foo() {
  console.log(this.a);
}

const obj = { a: 10 };

foo.call(obj);
```

结果：

```
10
```

原因：

```
显式绑定
```

---

# 6 bind

```javascript
function foo() {
  console.log(this.a);
}

const obj = { a: 20 };

const bar = foo.bind(obj);

bar();
```

结果：

```
20
```

原因：

```
bind 固定 this
```

---

# 7 new 绑定

```javascript
function Foo() {
  this.a = 1;
}

const obj = new Foo();

console.log(obj.a);
```

结果：

```
1
```

原因：

```
this = 新对象
```

---

# 8 new vs bind

```javascript
function Foo(a) {
  this.a = a;
}

const obj = {};

const bar = Foo.bind(obj);

const baz = new bar(5);

console.log(baz.a);
```

结果：

```
5
```

原因：

```
new 优先级 > bind
```

---

# 9 箭头函数

```javascript
const obj = {
  a: 1,
  foo: () => {
    console.log(this.a);
  }
};

obj.foo();
```

结果：

```
undefined
```

原因：

```
箭头函数没有 this
this = 外层作用域 (window)
```

---

# 10 箭头函数继承 this

```javascript
const obj = {
  a: 1,
  foo() {
    const bar = () => {
      console.log(this.a);
    };
    bar();
  }
};

obj.foo();
```

结果：

```
1
```

原因：

```
箭头函数继承 foo 的 this
```

---

# 最重要的一张图（this优先级）

记住这个顺序：

```
new绑定
   ↓
显式绑定(call/apply/bind)
   ↓
隐式绑定(obj.foo())
   ↓
默认绑定(foo())
```

箭头函数：

```
完全无视上面规则
```

只看：

```
定义时的外层作用域
```

---

# 面试最经典的一题（很多人会错）

```javascript
var name = "window";

const obj = {
  name: "obj",
  foo() {
    console.log(this.name);
  }
};

const bar = obj.foo;

bar();
```

结果：

```
window
```

因为：

```
默认绑定
```

---

如果你愿意，我可以再给你讲 **一题几乎所有前端都答错的 `this` 终极题（阿里/字节面试题）**。
那题会同时考：

```
this
箭头函数
new
call
作用域
```


这道题是 **阿里 / 字节非常经典的 `this` 综合题**，基本把 `this` 的所有规则都放在一起了。

先看题：

```javascript
var name = "window";

function Person(name) {
  this.name = name;
  
  this.say = function() {
    console.log(this.name);
  };
  
  this.say2 = () => {
    console.log(this.name);
  };
}

const p1 = new Person("p1");

const say = p1.say;
const say2 = p1.say2;

say();
say2();

p1.say();
p1.say2();
```

---

# 一、先分析 `new Person("p1")`

执行 `new`：

```text
this → 新对象 p1
```

对象结构：

```
p1 = {
  name: "p1",
  say: function(){...},
  say2: arrowFunction
}
```

注意一个关键点：

```
say2 是箭头函数
```

箭头函数的 `this` 在 **创建时确定**。

创建位置：

```
Person 构造函数内部
```

当时：

```
this = p1
```

所以：

```
say2 的 this 永远是 p1
```

---

# 二、第一句

```javascript
say();
```

`say` 是：

```javascript
const say = p1.say;
```

调用：

```
say()
```

属于：

```
默认绑定
```

所以：

```
this = window
```

输出：

```
window
```

---

# 三、第二句

```javascript
say2();
```

`say2` 是箭头函数。

箭头函数：

```
this = 创建时的 this
```

创建时：

```
this = p1
```

所以输出：

```
p1
```

---

# 四、第三句

```javascript
p1.say();
```

调用方式：

```
对象调用
```

属于：

```
隐式绑定
```

所以：

```
this = p1
```

输出：

```
p1
```

---

# 五、第四句

```javascript
p1.say2();
```

虽然是对象调用，但：

```
箭头函数没有自己的 this
```

仍然使用创建时的：

```
this = p1
```

输出：

```
p1
```

---

# 六、最终输出

```
window
p1
p1
p1
```

---

# 七、这题真正考的 3 个知识点

### 1 默认绑定

```
say()
```

```
this = window
```

---

### 2 隐式绑定

```
p1.say()
```

```
this = p1
```

---

### 3 箭头函数 this

箭头函数：

```
this 在定义时确定
```

不是调用时。

---

# 八、一句话总结

普通函数的 `this` 由 **调用方式决定**；箭头函数的 `this` 在 **定义时确定并继承外层作用域**。

---

如果你愿意，我可以再给你一道 **更变态的 this 面试题（字节跳动内部题）**，里面同时考：

```
this
new
call
bind
箭头函数
优先级
```

几乎所有人第一次都会算错。


  
  

