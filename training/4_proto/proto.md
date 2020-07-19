 1. 
   ```javascript
   function Fn() {
       this.x = 100;
       this.y = 200;
       this.getX = function () {
           console.log(this.x);
       }
   }
   Fn.prototype.getX = function () {
       console.log(this.x);
   };
   Fn.prototype.getY = function () {
       console.log(this.y);
   };
   let f1 = new Fn;
   let f2 = new Fn;
   console.log(f1.getX === f2.getX);
   console.log(f1.getY === f2.getY);
   console.log(f1.__proto__.getY === Fn.prototype.getY);
   console.log(f1.__proto__.getX === f2.getX);
   console.log(f1.getX === Fn.prototype.getX);
   console.log(f1.constructor);
   console.log(Fn.prototype.__proto__.constructor);
   f1.getX();
   f1.__proto__.getX();
   f2.getY();
   Fn.prototype.getY();
   ```

2. 
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

3. 一到经典的面试题

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
        this.name = name || 'join';
    }
    C1.prototype.name = 'Tom';
    C2.prototype.name = 'Tom';
    C3.prototype.name = 'Tom';
    alert((new C1().name) + (new C2().name) + (new C3().name));
    ```

5. 还是要先画图在计算结果

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

5. 计算输出的结果（先画图）

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

6. 编写两个方法 plus / minus 实现如下的执行效果

   ```javascript
   let n = 10;
   let m = n.plus(10).minus(5);
   console.log(m);//=>15（10+10-5）
   ```

7. 阿里超经典面试题（超有难度，可以暂时先不做，看看）

    ```javascript
    function Foo() {
        getName = function () {
            console.log(1);
        };
        return this;
    }
    Foo.getName = function () {
        console.log(2);
    };
    Foo.prototype.getName = function () {
        console.log(3);
    };
    var getName = function () {
        console.log(4);
    };
    function getName() {
        console.log(5);
    }
Foo.getName();
    getName();
    Foo().getName();
    getName();
    new Foo.getName();
    new Foo().getName();
    new new Foo().getName();
    ```

    1. false
       true 
       true 
       false 
       false 
       ƒ Fn() {} 
       ƒ Object() { [native code] } 
       100 
       undefined 
       200 
       undefined

    2. "0"
       "30"
    
    3."Tomundefinedjoin"
