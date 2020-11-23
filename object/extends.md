# 继承
## 原型链实现继承
[原理]：把子类的prototype（原型对象）设置为父类的实例  
[形式]：Child.prototype = new Parent()     
[缺点]：子类只进行一次原型更改，所以子类的所有实例保存的是同一个父类的值。 当子类对象上进行值修改时，如果是修改的原始类型的值，那么会在实例上新建这样一个值； 但如果是引用类型的话，他就会去修改子类上唯一一个父类实例里面的这个引用类型，这会影响所有子类实例  

```javascript
function P(name, parr) {
    this.name = name;
    this.parr = parr;
    this.pstr = ['A', 'B', 'C'];
    pp = 'pp';
    ppp: 'ppp';
}
P.pnum = 1;
P.prototype.pact = 'eat';
P.prototype.prr = [1, 2, 3];

//原型链继承实现方式
C.prototype = new P('zz', ['z1', 'z2']);

function C(age, carr) {
    this.age = age;
    this.carr = carr;
    this.cstr = ['a', 'b', 'c']
    cc = 'cc';
    ccc: 'ccc';
}
C.cnum = 1;
C.prototype.cact = 'game';
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ['z3', 'z4']);
console.log(c1);

/*
子类构造函数的属性(this.xx)作为实例属性，每个实例都有一份        
age: 18
​carr: Array [ "z3", "z4" ]
​cstr: Array [ "a", "b", "c" ]
<prototype>: 
子类构造函数的原型对象上的属性(C.prototype.xx)作为原型属性
​​      cact: "game"
​      crr: Array [ 7, 8, 9 ]
父类构造函数的实例属性作为子类的原型属性
​​      name: 'zz'
​​      parr: Array [ "z1", "z2" ]
​​      pstr: Array [ "A", "B", "C" ]
​​         <prototype>:
​​​                   constructor: function P(name, parr)
​​​                   pact: "eat"
​​​                   prr: Array(3) [ 1, 2, 3 ]
​                       <prototype>: Object { … }
 */

//一个实例改变原型上的引用类型属性，其他实例也会受影响
let c2 = new C(18, ['z3', 'z4']);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.crr.pop();
console.log(c1.crr); //Array [ 7, 8 ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B" ]
c2.prr.pop();
console.log(c1.prr); //Array [ 1, 2 ]
console.log(c2.name);//'zz'
c2.name='c2';
console.log(c2.name);//'c2'
console.log(c1.name);//'zz'
c2.parr.pop();
console.log(c1.parr);//Array [ "z1" ]

//遍历：
for (let key in c1) {
    console.log(key);
    //age carr cstr name parr pstr cact crr pact prr(实例+原型)
}
console.log(Object.keys(c1)); //Array [ "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); //Array [ "age", "carr", "cstr" ]

for (let key in C) {
    console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C));//Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
    console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P));//Array ["length", "name", "arguments", "caller", "prototype", "cnum"]
```

## 借用构造函数
[原理]：在子类构造函数中 使用Parent.call(this)继承父类属性  
[形式]：function Child(){
             Parent.call(this);
        }    
[缺点]：Parent原型链上的属性和方法并不会被子类继承 

```javascript
function P(name, parr) {
    this.name = name;
    this.parr = parr;
    this.pstr = ['A', 'B', 'C'];
    pp = 'pp';
    ppp: 'ppp';
}
P.pnum = 1;
P.prototype.pact = 'eat';
P.prototype.prr = [1, 2, 3];

function C(age, carr) {
    P.call(this, 'zz', ['z1', 'z2']);
    this.age = age;
    this.carr = carr;
    this.cstr = ['a', 'b', 'c']
    cc = 'cc';
    ccc: 'ccc';
}
C.cnum = 1;
C.prototype.cact = 'game';
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ['z3', 'z4']);
console.log(c1);
/*
子类、父类构造函数的属性作为实例属性，每个实例都有一份       
age: 18
​carr: Array ['z3', 'z4']
​cstr: Array [ "a", "b", "c" ]
name: 'zz'
​parr: Array ['z1', 'z2']
​pstr: Array [ "A", "B", "C" ]
<prototype>: 
        cact: "game"
        ​​crr: Array [ 7, 8, 9 ]
        constructor: function C(age, carr)
        ​​<prototype>: Object { … }
*/
        
let c2 = new C(18, ['z3', 'z4']);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.crr.pop();
console.log(c1.crr); //Array [7, 8]
// c2.prr.pop();
// console.log(c1.prr); 
console.log(c2.name);//'zz'
c2.name='c2';
console.log(c2.name);//'c2'
console.log(c1.name);//'zz'
c2.parr.pop();
console.log(c1.parr);//Array ['z1', 'z2']

for (let key in c1) {
    console.log(key);
    //age carr cstr name parr pstr cact crr （父类原型上的方法继承不到）
}
console.log(Object.keys(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]

for (let key in C) {
    console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C));//Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
    console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P));//Array ["length", "name", "arguments", "caller", "prototype", "pnum"]   
```

## 组合继承方式
[原理]：组合使用原型链继承和借用构造函数继承  
[形式]：子类构造函数中使用Parent.call(this);的方式可以继承写在父类构造函数中this上绑定的各属性和方法；使用Child.prototype = new Parent()的方式可以继承挂在在父类原型上的各属性和方法  
[缺点]：父类构造函数在子类构造函数中执行了一次，在子类绑定原型时又执行了一次
```javascript
function P(name, parr) {
    this.name = name;
    this.parr = parr;
    this.pstr = ['A', 'B', 'C'];
    pp = 'pp';
    ppp: 'ppp';
}
P.pnum = 1;
P.prototype.pact = 'eat';
P.prototype.prr = [1, 2, 3];

function C(age, carr) {
    P.call(this, 'zz', ['z1', 'z2']);
    this.age = age;
    this.carr = carr;
    this.cstr = ['a', 'b', 'c']
    cc = 'cc';
    ccc: 'ccc';
}
C.prototype = new P();
C.cnum = 1;
C.prototype.cact = 'game';
C.prototype.crr = [7, 8, 9];

let c1 = new C(18, ['z3', 'z4']);
console.log(c1);
/*
执行两次可以看出一些属性是重复的      
age: 18
​carr: Array ['z3', 'z4']
​cstr: Array [ "a", "b", "c" ]
name: 'zz'
​parr: Array ['z1', 'z2']
​pstr: Array [ "A", "B", "C" ]
<prototype>: 
        cact: "game"
        ​​crr: Array [ 7, 8, 9 ]
        name: undefined
        parr: undefined
        pstr: Array [ "A", "B", "C" ]
        ​​<prototype>: Object 
                pact: 'eat'
                prr: [1,2,3]
                constructor: ƒ P(name, parr)
                 ​​<prototype>: Object {...}
*/
        
let c2 = new C(18, ['z3', 'z4']);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.crr.pop();
console.log(c1.crr); //Array [7, 8]
// c2.prr.pop();
// console.log(c1.prr); 
console.log(c2.name);//'zz'
c2.name='c2';
console.log(c2.name);//'c2'
console.log(c1.name);//'zz'
c2.parr.pop();
console.log(c1.parr);//Array ['z1', 'z2']

for (let key in c1) {
    console.log(key);
    //age carr cstr name parr pstr cact crr pact prr（父类原型上的方法继承不到）
}
console.log(Object.keys(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]
console.log(Object.getOwnPropertyNames(c1)); // Array[ "name", "parr", "pstr", "age", "carr", "cstr" ]

for (let key in C) {
    console.log(key); //cnum
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C));//Array ["length", "name", "arguments", "caller", "prototype", "cnum"]

for (let key in P) {
    console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P));//Array ["length", "name", "arguments", "caller", "prototype", "pnum"]    
```    

## 组合继承优化版
```javascript
function P(name, parr) {
    this.name = name;
    this.parr = parr;
    this.pstr = ['A', 'B', 'C'];
    pp = 'pp';
    ppp: 'ppp';
    this.sayHip = function () {
        console.log('hi~ ' + this.name);
    }
}
P.pnum = 1;
P.prototype.pact = 'eat';
P.prototype.prr = [1, 2, 3];
P.prototype.sayByep = function () {
    console.log('bye~ ' + this.name);
}

C.prototype = Object.create(P.prototype);
C.prototype.constructor = C;

function C(age, carr) {
    P.call(this, 'zz', ['z1', 'z2']);
    this.age = age;
    this.carr = carr;
    this.cstr = ['a', 'b', 'c'];
    this.sayHic = function () {
        console.log('hi~ ');
    }
    cc = 'cc';
    ccc: 'ccc';
}
C.cnum = 2;
C.prototype.cact = 'game';
C.prototype.crr = [7, 8, 9];
C.prototype.sayByec = function () {
    console.log('bye~ ');
}
let c1 = new C(18, ['z3', 'z4']);
console.log(c1);
/*
ES5:
this.xxx 声明实例的私有属性和方法  每个实例各一份，互不影响
一般在构造函数外：类.prototype.xxx 声明原型属性和方法  所有实例共享
构造函数外：类.xxx  声明静态属性和方法  实例不能用，只有类可以用
*/
/*
age: 18
​carr: Array [ "z3", "z4" ]
​cstr: Array [ "a", "b", "c" ]
        ​
name: 'zz'
​parr: Array [ "z1", "z2" ]
​pstr: Array [ "A", "B", "C" ]

sayHic: function sayHic()
​sayHip: function sayHip()
<prototype>: 
        ​​cact: "game"
        constructor: function C(age, carr)
        ​​crr: Array [ 7, 8, 9 ]
        sayByec: function sayByec()
        ​​    <prototype>: 
        ​​​            constructor: function P(name, parr)
        ​​​            pact: "eat"
        ​​​            prr: Array [ 1, 2, 3 ]
                    sayByep: function sayByep()
        ​​​            <prototype>: Object { … }
*/
let c2 = new C(18, ['z3', 'z4']);
    c2.cstr.pop();
    console.log(c1.cstr); //Array[ "a", "b", "c" ]
    c2.crr.pop();
    console.log(c1.crr); //Array [ 7, 8 ] 原型上的引用类型还是会受影响
    c2.pstr.pop();
    console.log(c1.pstr); //Array [ "A", "B", "C"]
    c2.prr.pop();
    console.log(c1.prr); //Array [ 1, 2 ]
    console.log(c2.name); //'zz'
    c2.name = 'c2';
    console.log(c2.name); //'c2'
    console.log(c1.name); //'zz'
    c2.parr.pop();
    console.log(c1.parr); //Array ['z1', 'z2']

for (let key in c1) {
            console.log(key);
            //age carr cstr sayHic name parr pstr sayHip   实例属性+方法(8)
            //cact crr pact prr constructor sayByec sayByep  原型属性+方法(7)
}
console.log(Object.keys(c1)); // Array(8) [ "name", "parr", "pstr", "sayHip", "age", "carr", "cstr", "sayHic" ]
console.log(Object.getOwnPropertyNames(c1)); // Array(8) [ "name", "parr", "pstr", "sayHip", "age", "carr", "cstr", "sayHic" ]

for (let key in C) {
    console.log(key); //cnum 静态方法
}
console.log(Object.keys(C)); //Array [ "cnum" ]
console.log(Object.getOwnPropertyNames(C));//Array(6) ["length", "name", "arguments", "caller", "prototype", "cnum"]
console.log(Object.keys(C.prototype)); //Array(4) [ "constructor", "cact", "crr", "sayByec" ]
console.log(Object.getOwnPropertyNames(C.prototype));//Array(4) [ "constructor", "cact", "crr", "sayByec" ]

for (let key in P) {
    console.log(key); //pnum
}
console.log(Object.keys(P)); //Array [ "pnum" ]
console.log(Object.getOwnPropertyNames(P));//Array(6) ["length", "name", "arguments", "caller", "prototype", "pnum"]
console.log(Object.keys(P.prototype)); //Array(3) [ "pact", "prr", "sayByep" ]
console.log(Object.getOwnPropertyNames(P.prototype));//Array(4) [ "constructor", "pact", "prr", "sayByep" ]
```

## ES6 class
```javascript
class P {
    //实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
    constructor(name, parr) {
        //实例属性
        this.name = name;
        this.parr = parr;
        this.pstr = ['A', 'B', 'C'];
        //实例方法
        this.sayHip = function () {
            console.log('hi~ ' + this.name);
        }
    }
    //实例属性
    pp = 'pp';
    //静态属性
    static pact = 'eat';
    //原型方法
    sayByep() {
        console.log('bye~ ' + this.name);
    }
    //静态方法
    static numberp() {
        console.log(P.pnum);
    }
}
//静态方法
P.pnum = 1;
//原型属性
P.prototype.prr = [1, 2, 3];


class C extends P {
    constructor(name, parr, age, carr) {
        super(name, parr);
        this.age = age;
        this.carr = carr;
        this.cstr = ['a', 'b', 'c']
        this.sayHic = function () {
            console.log('hi~ ');
        }
    }
    cc = 'cc';
    static cact = 'game';
    sayByec() {
        console.log('bye~ ');
    }
    static numberc() {
        console.log(C.cnum);
    }
}
C.cnum = 2;
C.prototype.crr = [7, 8, 9];

let c1 = new C('zz', ['z1', 'z2'], 18, ['z3', 'z4']);
console.log(c1);
/*
ES6:
constructor内的this.xxx 声明实例属性和方法  或者直接在类内部以xxx方式声明属性   每个实例各一份 
一般在构造函数外：类.prototype.xxx 声明原型属性  直接在类内部以xxx(){}声明原型方法  所有实例共享
构造函数外：类.xxx  声明静态属性和方法  或者在类内部以static xxx声明静态属性和方法 ，实例不能用，只有类可以用
*/

/*
age: 18
​carr: Array [ "z3", "z4" ]
​cc: "cc"
​cstr: Array(3) [ "a", "b", "c" ]
​name: "zz"
​parr: Array [ "z1", "z2" ]
​pp: "pp"
​pstr: Array(3) [ "A", "B", "C" ]
​sayHic: function sayHic()
​sayHip: function sayHip()
​<prototype>: 
​​        constructor: class C { constructor(name, parr, age, carr) }
​​        crr: Array(3) [ 7, 8, 9 ]
​​        sayByec: function sayByec()
​​               <prototype>: 
​​​                      constructor: class P { constructor(name, parr) }
​​​                      prr: Array(3) [ 1, 2, 3 ]
​​​                      sayByep: function sayByep()
​​​                      <prototype>: Object { … }
*/
let c2 = new C('c2', ['z11', 'z22'], 20, ['z33', 'z44']);
c2.cstr.pop();
console.log(c1.cstr); //Array[ "a", "b", "c" ]
c2.crr.pop();
console.log(c1.crr); //Array [ 7, 8 ] 原型上的引用类型还是会受影响
c2.pstr.pop();
console.log(c1.pstr); //Array [ "A", "B", "C"]
c2.prr.pop();
console.log(c1.prr); //Array [ 1, 2 ]
//父类的静态方法可以被子类继承
console.log(C.pnum);//1
C.numberp();//1

for (let key in c1) {
    console.log(key);
    //pp name parr pstr sayHip cc age carr cstr sayHic (10)实例属性+方法
    //crr prr  原型属性 没有原型方法(类定义在prototype上的方法是不可枚举的)
}
console.log(Object.keys(c1)); // Array(10) [ "pp", "name", "parr", "pstr", "sayHip", "cc", "age", "carr", "cstr", "sayHic" ]

console.log(Object.getOwnPropertyNames(c1)); //Array(10) [ "pp", "name", "parr", "pstr", "sayHip", "cc", "age", "carr", "cstr", "sayHic" ]

for (let key in P) {
    console.log(key); //pact pnum  静态属性 没有静态方法(类的内部所有定义的方法，都是不可枚举的)
}
console.log(Object.keys(P)); //Array [ "pact", "pnum" ]
console.log(Object.getOwnPropertyNames(P));//Array(6) [ "prototype", "numberp", "pact", "pnum", "length", "name" ]
console.log(Object.keys(P.prototype));//Array [ "prr" ]
console.log(Object.getOwnPropertyNames(P.prototype));//Array(3) [ "constructor", "sayByep", "prr" ]

for (let key in C) {
    //父类的静态方法可以被子类继承
    console.log(key); //cact cnum pact pnum
}
console.log(Object.keys(C)); //Array [ "cact", "cnum" ]
console.log(Object.getOwnPropertyNames(C));//Array(6) [ "prototype", "numberc", "cact", "cnum", "length", "name" ]
console.log(Object.keys(C.prototype));//Array [ "crr" ]
console.log(Object.getOwnPropertyNames(C.prototype));//Array(3) [ "constructor", "sayByec", "crr" ]
```

## 封装一个原生的继承方法
```javascript
function extendsClass(Parent, Child) {
    function F() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    return Child;
}
```

## 练习题
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