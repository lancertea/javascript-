## 操作符
### 逻辑运算
逻辑非操作符（！）会将操作数转换为一个布尔值（Boolean()），再进行运算  
&&、||具备好短路性，在有一个操作数不是布尔值的情况下，不一定返回布尔值：  
&&：  
1. 如果第一个操作数为对象，则返回第二个操作数
2. 如果第二个操作数为对象，只有在第一个操作数求值结果为true的情况下才会返回该对象
3. 如果两个操作数都是对象，则返回第二个操作数
4. 如果有作数是null/NaN/undefined，则返回null/NaN/undefined。(同时有很多个null/NaN/undefined以第一个为主)  
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

### ==和===
#### ==
对于 == 来说，如果对比双方的类型不一样的话，就会进行类型转换  
判断流程：  
首先会判断两者类型是否相同。相同的话就是比大小了  
类型不相同的话，就会进行类型转换：  
1. 先判断是否在对比 null 和 undefined，是的话就会返回 true
2. 判断两者类型是否为 string 和 number，是的话就会将字符串转换为 number
3. 判断其中一方是否为 boolean，是的话就会把 boolean 转为 number 再进行判断。注意：flase->0  true->1
4. 比较相等性之前，不能将null和undefined转换成其他任何值(null==undefined)
5. 判断其中一方是否为 object 且另一方为 string、number 或者 symbol，是的话就会把 object转为原始类型再进行判断  
'1' == { a: 'b' } ->'1' == '[object Object]'  
6. 两边都是对象的话，那么只要不是同一对象的不同引用（不管对象里的内容等不等），都为false  
7. 只要出现NaN，就一定是false，因为就连NaN自己都不等于NaN 对于NaN，判断的方法是使用全局函数 isNaN()  
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
console.log(3==[20])//false
 
```

#### ===   
不转类型，直接判断类型和值是否相同。 但是 NaN === NaN 还是false  
注意和Set的区别，Set判断有没有重复键的时候用的是"==="，不会进行类型转换，但是NaN===NaN

#### 何时使用 ===  何时使用 == ？
一般我们都应该使用===，在代码中obj.a==null代表obj.a===null || obj.a===undefined，所以可以在判断对象中某个属性是否有值时用==null，其他地方都使用===
