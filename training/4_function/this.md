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
               count: 2,
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
   (foo.bar = foo.bar)();
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

```javascript
var name = "window";

var person = {
  name: "person",
  sayName: function () {
    console.log(this.name);
  }
};

function sayName() {
  var sss = person.sayName;
  sss(); 
  person.sayName(); 
  (person.sayName)(); 
  (b = person.sayName)(); 
}

sayName();
```

```javascript
var name = 'window'

var person1 = {
  name: 'person1',
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person2 = { name: 'person2' }

person1.foo1(); 
person1.foo1.call(person2); 

person1.foo2(); 
person1.foo2.call(person2); 

person1.foo3()(); 
person1.foo3.call(person2)(); 
person1.foo3().call(person2); 

person1.foo4()(); 
person1.foo4.call(person2)(); 
person1.foo4().call(person2); 
```

```javascript
var name = 'window'

function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() 
person1.foo1.call(person2) 

person1.foo2() 
person1.foo2.call(person2) 

person1.foo3()() 
person1.foo3.call(person2)() 
person1.foo3().call(person2) 

person1.foo4()() 
person1.foo4.call(person2)() 
person1.foo4().call(person2) 
```

```javascript
var name = 'window'

function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() 
person1.obj.foo1.call(person2)() 
person1.obj.foo1().call(person2) 

person1.obj.foo2()() 
person1.obj.foo2.call(person2)() 
person1.obj.foo2().call(person2) 
```




  
  

