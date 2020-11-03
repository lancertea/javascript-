# 操作符
## 逻辑运算
逻辑非操作符（！）会将操作数转换为一个布尔值（Boolean()），再进行运算  
&&、||具备好短路性，在有一个操作数不是布尔值的情况下，不一定返回布尔值：  
&&：  
1. 如果第一个操作数为对象，则返回第二个操作数
2. 如果第二个操作数为对象，只有在第一个操作数求值结果为true的情况下才会返回该对象
3. 如果两个操作数都是对象，则返回第二个操作数
4. 如果有一个数是null/NaN/undefined，则返回null/NaN/undefined。(同时有很多个null/NaN/undefined以第一个为主)   

||:  
1. 如果第一个操作数为对象，则返回第一个操作数
2. 如果第一个操作数求值结果为false，则返回第二个操作数
3. 如果两个操作数都是null/NaN/undefined，则返回null/NaN/undefined。(同时有很多个null/NaN/undefined以最后一个为主，如果有Boolean()转换为true的值和null/NaN/undefined一起，则返回前者)
```javascript
console.log({} && 3); //3
console.log(1 && {}); //{}
console.log({} && {
        a: 11
    }); //{a:11}
console.log(null && 1); //null
console.log(null && undefined); //null
console.log(3 && undefined && null); //undefined
console.log(undefined && null && 3); //undefined

console.log({} || 0); //{}
console.log(null || 3); //3
console.log(null || null); //null
console.log(null || undefined); //undefined
console.log(undefined || null); //null
console.log(3 || undefined || null); //3
console.log(undefined || null || 3); //3


//&&的优先级高于||
var a = 0 || 1 && 2 || 3; //=>先算1&&2  =>0||2||3  =>再算0||2 =>2 =>最后2||3 =>2
console.log(a); //2
```
应用场景：形参初始化:
```javascript
function fn(x, callback) {
	// => typeof x === 'undefined' ? x = 0 : null;
    x = x || 0;
    
//保证是函数
	// callback代表回调函数（传递的是个函数）：我们需要保证它是一个函数才能执行
	// typeof callback === 'function' ? callback() : null;
	callback && callback();
}
fn();
fn(10);
fn(10, function () {console.log("123");});//"123" 
```
数组中两两比较，更好的选择：  
array.every(function(currentValue,index,arr), thisValue)  
array.some(function(currentValue,index,arr), thisValue)

## ==和===
### ==
#### 比较大小
对于 == 来说，如果对比双方的类型不一样的话，就会进行类型转换  
判断流程：  
首先会判断两者类型是否相同。相同的话就是比大小了  
类型不相同的话，就会进行类型转换：  
1. 先判断是否在对比 null 和 undefined，是的话就会返回 true
2. 如果两者是类型不同的基本类型，就将两者都先转换为number，再判断。 注意：flase->0  true->1
3. 比较相等性之前，不能将null和undefined转换成其他任何值(null==undefined)
4. 判断其中一方是否为 object 且另一方为 string、number 或者 symbol，是的话就会把 object转为原始类型再进行判断  
'1' == { a: 'b' } ->'1' == '[object Object]'  
5. 两边都是对象的话，那么只要不是同一对象的不同引用（不管对象里的内容等不等），都为false  
6. 只要出现NaN，就一定是false，因为就连NaN自己都不等于NaN 对于NaN，判断的方法是使用全局函数 isNaN()  
```javascript
console.log(null == undefined); //true
//判断两者类型是否为 string 和 number，是的话就会将字符串转换为 number
console.log(1 == '1'); //true
console.log(1 == 'b'); //false  "b"转换为number为NaN
//判断其中一方是否为 boolean，是的话就会把 boolean 转为 number 再进行判断
//注意：flase->0  true->1
console.log(false == 0); //true
console.log(true == 1); //true
console.log(true == 2); //false
console.log(true == '1') //true
//比较相等性之前，不能将null和undefined转换成其他任何值
console.log(undefined == 0); //false
console.log(null == 0); //false
//判断其中一方是否为 object 且另一方不是object，将对象转为原始类型再进行判断
console.log('1' == {
            a: "b"
        }); //false {a:"b"}=>"[object Object]"
console.log(1 == {
            a: 1
        }); //false {a:1}=>"[object Object]"=>NaN
var a = {};
console.log(a == true); //false
console.log(a == false); //false
//因为 a => "[object Object]"=>NaN

//两边都是对象的话，那么只要不是同一对象的不同引用，都为false
var obj = {
    a: 1,
    b: 2
}
var obj1 = {
    a: 1,
    b: 2,
    c: 3
}
var obj2 = {
    a: 1,
    b: 2
};

var obj3 = obj;

console.log(obj == obj1); //false
console.log(obj == obj2); //false
console.log(obj == obj3); //true
//（7）只要出现NaN,就一定是false
console.log("NaN" == NaN); //false
console.log(5 == NaN); //false 
console.log(NaN == NaN); //false
console.log(NaN != NaN); //true
```
注意==操作和其他操作的区别：  
如果两边类型不同，==会将其转换为类型相同的再比大小
+等操作如果一边是对象类型，一边是基本类型，只要都是基本类型就可以运算了
```javascript
console.log(3+[20])//"320"
//3已经是基本类型number，([20]).valueOf()=>[20]，还是引用类型，所以调用([20]).toString()=>'20'，变为3+'20'=>'320'
console.log(3==[20])//false
// 同上，([20]).toString()=>'20'，Number('20')=>NaN
```

#### 赋值操作
js中变量的连续赋值  
普通赋值
```javascript
var a=3;
var b=a=5;
console.log(a);
console.log(b);
```
一般来说，等号赋值的方向是从右至左，那么上面的代码等同于下面这段代码：
```javascript
var a=3;　　//全局变量a被赋值为3
var a=5;　　//此时a被重新赋值为5
var b=a;　　//将a的值赋给全局变量b
console.log(a);//a最终的值就是第二次被赋的值：5
console.log(b);//按照代码执行顺序b的值也是：5
```

```javascript
var a = {
        n: 1
    },
    b = a;
a.x = a = {
    n: 2
};
console.log(a);
console.log(b);
console.log(a.x);
console.log(b.x);
```
```javascript
var a = {n: 1}；//a第一次被赋值，是一个引用类型值，请记得变量赋值为引用类型值的时候，通过变量改变这个对象的时候，对象本身也发生了变化
var b = a;//b被赋值为a,因此b就是对象{n:1}
a.x = a = {n: 2}；//这个赋值与之前的简单案例有所不同，a.x指的是给a添加一个x属性，在js的运算中“.”和"="运算符同时出现，会先执行"."运算//因此，赋值顺序被改变了，是先给a.x赋值，再给a赋值//就是先执行：a.x={n:2},注意这里a并未改变，是给a的x属性赋值为{n:2},a还是{n:1}//再回到我代码中的第一句话，这个赋值行为，改变了{n:1}这个对象，即给它增加了名为x的属性//再执行a={n:2}，这是变量a不再是对象{n:1},而被重新赋值为一个新的对象{n:2};

console.log(a);//自然此时a是对象{n:2}console.log(b);//a的二次赋值，并没有影响b，b还是对象{n:1},但是由于a在重新赋值之前，给{n:1}这个对象，增加了一个x属性，因此，这时的b已经有了x属性
console.log(a.x);//{n:2}对象没有x属性，所以结果是undefined
console.log(b.x)；//综上所述，这个结果是{n:2}
```

### ===   
不转类型，直接判断类型和值是否相同。 但是 NaN === NaN 还是false  
注意和Set的区别，Set判断有没有重复键的时候用的是"==="，不会进行类型转换，但是NaN===NaN

### 何时使用 ===  何时使用 == ？
一般我们都应该使用===，在代码中obj.a==null代表obj.a===null || obj.a===undefined，所以可以在判断对象中某个属性是否有值时用==null，其他地方都使用===
