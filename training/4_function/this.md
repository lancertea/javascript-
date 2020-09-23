1. 写出下面代码输出结果

   ```javascript
   <!-- 做错 -->
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


