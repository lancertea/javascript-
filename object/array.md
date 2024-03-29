# 数组
数组是动态变化的，JavaScript的Array可以包含任意数据类型，并通过索引来访问修改每个元素
```javascript
let a = [1, 2, 3.14, 'Hello', null, true];
a[1] = 99;
console.log(a); //[1, 99, 3.14, 'Hello', null, true]
//Array的大小是动态调整的
a.length = 8;
console.log(a); //[1, 99, 3.14, 'Hello', null, true，undefined，undefined]

//避免 使用new Array()
//arr与arr1都创建了空数组
let arr = new Array(); // 差
let arr1 = []; // 优
//arr2与arr3创建了内容相同的数组
let arr2 = new Array(40, 100, 1, 5, 25, 10); // 差
let arr3 = [40, 100, 1, 5, 25, 10]; // 优
//new 关键词只会使代码复杂化。它还会产生某些不可预期的结果
console.log(new Array(1, 2)); //[ 1, 2 ]
console.log(new Array(2)); //创建包含 2个未定义元素的数组
```

## 判断一个数据是不是数组
```javascript
let arr = [1, 2, 3];
let obj = {};
//1.Array.isArray(obj)
//ECMAScript 5种的函数，当使用ie8的时候就会出现问题
console.log(Array.isArray(arr)); //true
console.log(Array.isArray(obj)); //false

//2.obj instanceof Array
//当用来检测在不同的window或iframe里构造的数组时会失败。这是因为每一个iframe都有它自己的执行环境，彼此之间并不共享原型链，
//所以此时的判断一个对象是否为数组就会失败。
console.log(arr instanceof Array); //true
console.log(obj instanceof Array); //false

//3.Object.prototype.toString.call(obj) == '[object Array]' 
console.log(Object.prototype.toString.call(arr) == '[object Array]'); //true

//4.obj.constructor === Array
console.log(arr.constructor === Array); //true
```

## Array对象常用方法总结
### 改变原数组  
array.push(item1, item2, ..., itemX)  
在数组的末尾增加一个或多个元素，并返回数组的新长度

array.pop()  
删除数组的最后一个元素，并返回删除的这个元素。有参数不报错，忽略参数

array.shift()  
删除数组的第一个元素，并返回这个元素

array.unshift(item1,item2, ..., itemX)  
在数组的开头增加一个或多个元素，并返回数组的新长度

array.reverse()  
颠倒数组中元素的排列顺序，即原先的第一个变为最后一个，原先的最后一个变为第一个

array.sort(sortfunction)  
对数组元素进行排序，并返回当前数组

array.splice(index,howmany,item1,.....,itemX)  
在任意的位置给数组添加或删除任意个元素。 返回的是删除的元素组成的数组，如果没删除元素返回空数组

array.copyWithin(target, start, end) ES6  
在数组内部，将一段元素序列拷贝到另一段元素序列上，覆盖原有的值
start, end如果有负值，表示从末尾开始计算

array.fill(value, start, end)    ES6  
将数组中指定区间的所有元素的值，都替换成某个固定的值

### 不改变原数组
返回一个新的数组或返回一个其它的期望值：  
array.join(separator)  
用于把数组中的所有元素转换一个字符串。元素是通过指定的分隔符进行分隔的。默认为逗号

array.slice(start, end)  
抽取当前数组中的一段元素组合成一个新数组。-1 指最后一个元素，-2 指倒数第二个元素  

array.concat(array2,array3,...,arrayX)  
返回一个由当前数组和其它若干个数组或者若干个非数组值组合而成的新数组

array.indexOf(item,start)  
返回数组中第一个与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1

array.lastIndexOf(item,start)
返回数组中最后一个（从右边数第一个）与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1  

arr.includes(searchElement)  ES6  
arr.includes(searchElement, fromIndex)  
fromIndex如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。默认为 0  
判断当前数组是否包含某指定的值，如果是返回 true，否则返回 false
可以发现NaN

arr.at() ES6
根据索引返回相应位置的值，接受负数，表示从最后开始找

#### 迭代方法
在下面的众多遍历方法中，有很多方法都需要指定一个回调函数作为参数。在每一个数组元素都分别执行完回调函数之前，数组的length属性会被缓存在某个地方，所以，如果你在回调函数中为当前数组添加了新的元素，那么那些新添加的元素是不会被遍历到的。此外，如果在回调函数中对当前数组进行了其它修改，比如改变某个元素的值或者删掉某个元素，那么随后的遍历操作可能会受到未预期的影响。总之，不要尝试在遍历过程中对原数组进行任何修改
        
array.forEach(function(currentValue, index, arr), thisValue)  
为数组中的每个元素执行一次回调函数(不支持continue、break，会报错，它会遍历所有元素)。默认返回undefined，不能改变返回值

array.map(function(currentValue,index,arr), thisValue)  
返回一个由回调函数的返回值组成的新数组

array.filter(function(currentValue,index,arr), thisValue)  
将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回

array.every(function(currentValue,index,arr), thisValue)  &&  
如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false

array.some(function(currentValue,index,arr),thisValue)  ||  
如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false

array.find(function(currentValue, index, arr),thisValue)  ES6  
找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined
可以发现NaN

array.findIndex(function(currentValue, index, arr), thisValue)  ES6  
找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1
可以发现NaN

array.keys()  ES6  
返回一个数组迭代器对象，该迭代器会包含所有数组元素的键

array.values()  ES6  
返回一个数组迭代器对象，该迭代器会包含所有数组元素的值

array.entries()  ES6  
返回一个数组的迭代对象，该对象会包含所有数组元素的键值对  

#### 归并方法  
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)  
将数组元素计算为一个值（从左到右）

array.reduceRight(function(total, currentValue, currentIndex, arr), initialValue)  
将数组元素计算为一个值（从右到左）

#### 其他  
Array.isArray(obj)
用于判断一个对象是否为数组。如果对象是数组返回 true，否则返回 false

Array.from(object, mapFunction, thisValue)   ES6    
将一个拥有 length 属性的对象或可迭代的对象变成一个数组

Array.of()

## 一些方法的应用举例
### 自实现reverse功能
```javascript
let arr = [1, 2, 3, 4, 5];
let i = 0,
    j = arr.length - 1;
while (i <= j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    i++;
    j--;
}
console.log(arr);
```

### splice()的使用
```javascript
let colors = ["red", "green", "blue"];
let removed = colors.splice(0, 1); //移除第一项
console.log(colors); // [green", "blue" ]
console.log(removed); // [ "red"]

removed = colors.splice(1, 0, "yellow", "orange"); //在索引为1的位置插入两项
console.log(colors); //[ "green", "yellow", "orange", "blue" ]
console.log(removed); //[]

removed = colors.splice(1, 1, "red", "purple"); //i在索引为1的位置删除一项，插入两项
console.log(colors); //[ "green", "red", "purple", "orange", "blue" ]
console.log(removed); //[ "yellow" ]
```

### copyWithin()的使用
```javascript
/*
array.copyWithin(target, start, end)
target: 必需。复制到指定目标索引位置
start : 可选。元素复制的起始位置
end:    可选。停止复制的索引位置 (不包括这一位，默认为 array.length)。如果为负值，表示倒数（也不包括那一位）
*/
let a = [1, 2, 3, 4, 5];
console.log(a.copyWithin(0, 2)); //[ 3, 4, 5, 4, 5 ]
console.log(a); //[ 3, 4, 5, 4, 5 ] 改变原数组
let acopy = [1, 2, 3, 4, 5];
console.log(acopy.copyWithin(2, 0, 2)); //[1,2,1,2,5]
let acopy1 = [1, 2, 3, 4, 5];
console.log(acopy1.copyWithin(1, 0, -2)); //[1,1,2,3,5]
```

### join()常见应用：反转字符串
```javascript
let str = 'hello';
let res = str.split('').reverse().join('');
console.log(res); //'olleh'
```

### concat():可实现数组一层扁平化，多层需要递归实现
```javascript
//浅拷贝 
let a = [1, 2, 3, 4, 5];
let b = a.concat();
console.log(a == b); //false


let colors = ["red", "green", "blue"];
let colors1 = colors.concat("yellow", ["black", "brown"]);
let colors2 = colors.concat("yellow", ["black", "brown", ["white", "grey"]]);

console.log(colors); //["red", "green", "blue"]       
console.log(colors1); //["red", "green", "blue", "yellow", "black", "brown" ]
console.log(colors2); //["red", "green", "blue", "yellow", "black", "brown",["white","grey"]]

// 传递两个参数m，n，返回长度为m，所有元素都为n的数组，要求不能用循环。
// 利用函数的递归和 concat() 方法可以实现
console.log(fn(3, 6));

function fn(m, n) {
    return m ? fn(m - 1, n).concat(n) : [];
}
```

### array.forEach(function(currentValue, index, arr), thisValue)
- 为数组中的每个元素执行一次回调函数(不支持continue、break，会报错，它会遍历所有元素)。
- 自己设置返回值没用，默认返回undefined
```javascript
let arr = [40, 100, 1, 5, 25, 1, 10];
console.log(arr.forEach(item => {
    item = item + 1
    return item;
})); //undefined
let map = new Map();
arr.forEach(item => {
    map.set(item, map.has(item) ? map.get(item) + 1 : 1);
})
console.log(map); //Map(6) { 40 → 1, 100 → 1, 1 → 2, 5 → 1, 25 → 1, 10 → 1 } 
```

### every()
every() 方法使用指定函数检测数组中的所有元素：  
如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测  
如果所有元素都满足条件，则返回 true  
注意： every() 不会对空数组进行检测  
注意： every() 不会改变原始数组

array.every(function(currentValue,index,arr), thisValue)  
function(currentValue,index,arr)  
currentValue:必须。当前元素的值  
index:可选。当前元素的索引值  
arr:可选。当前元素属于的数组对象  
thisValue:可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。如果省略了 thisValue ，"this" 的值为 "undefined"

基于该数组可实现多个表达式的&&判断:   
eg: 判断各变量相等
```javascript
let a = [3, 3, 3, 3];
//错误示范
// if(a[0]===a[1]===a[2]===a[3])
// return true
//if判断返回false

//繁琐做法
if ((a[0] === a[1]) && (a[0] === a[2]) && (a[0] === a[3]))
    console.log(true); //true

//利用数组的遍历方法
let target = a[0];
if (a.every((item) => {
        return item === target;
    }))
    console.log(true); //true
```
短路性测试
```javascript
let arr = [40, 100, 1, 5, 25, 1, 10];
let i = 0;
//every就是当所有都返回true，才会返回true
console.log(arr.every(item => {
    if (item > 5)
        i++;
    //返回true,every才会继续执行
    return item > 5;
}));
console.log(i);
//可以自己设定return true; 这就相当于将every当做forEach来用

i = 0;
console.log(arr.some(item => {
    i++;
    //some返回第一个true，就不再执行后续了
    return item === 1;
}));
console.log(i);
``` 

### filter()
```javascript
//filter()接收的回调函数，其实可以有多个参数。通常我们仅使用第一个参数，表示Array的某个元素。
//回调函数还可以接收另外两个参数，表示元素的位置和数组本身：
let a = ['A', 'B', 'C'];
let r = a.filter(function (element, index, self) {
    console.log(element); // 依次打印'A', 'B', 'C'
    console.log(index); // 依次打印0, 1, 2
    console.log(self); // self就是变量a
});
``` 
去重
```javascript
//去除重复元素依靠的是indexOf总是返回第一个元素的位置，后续的重复元素位置与indexOf返回的位置不相等，因此被filter滤掉了。

//注意这两种过滤方式的区别，一种是去重，一种是删除重复的元素
let arr = [1,1,2,3,3,4,5,7,8,4,5];
let res = arr.filter((item,index)=>{
     return arr.indexOf(item)===index;
})
console.log(res);//[1, 2, 3, 4, 5, 7, 8]
res = arr.filter((item,index)=>{
    return arr.indexOf(item)===arr.lastIndexOf(item);
})
console.log(res);//[2, 7, 8]
console.log(arr);//[1, 1, 2, 3, 3, 4, 5, 7, 8, 4, 5
``` 
过滤数组  
有时需要过滤数组中值为 false 的值. 例如(0, undefined, null, false)，可传入一个 Boolean 函数
```javascript
let arr = [1, 0, undefined, null, false, ''];
console.log(arr.filter(Boolean)); //[1] Boolean()对' '、{}为true,无法过滤

let arr1 = [1, 0, undefined, null, false, '', ' ', {},
    []
];
// let r = arr.filter(function (s) {
//     return s && s.trim();
// });
console.log(arr1.filter(Number)); //[1]  Number([])===0  Number({})===NaN
console.log([1, 2, 'a', 'b', '3'].filter(Number)); //[1,2,3] Number('a')===NaN Number('b')===NaN
console.log([0, 1, 2, 3, 4].every(Number)); //false
console.log([1, 2, 3, 4].every(Number)); //true     
``` 

### reduce()
```javascript
/*
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
function(total,currentValue, index,arr)  必需。用于执行每个数组元素的函数。
total:必需。初始值, 或者计算结束后的返回值。
currentValue:必需。当前元素
index:可选。当前元素的索引
arr:可选。当前元素所属的数组对象。
initialValue:可选。传递给函数的初始值
        
有initialValue，index从0开始，没有的话：index为0的值作为初始initialValue，index从1开始
*/

let numbers = [15.5, 2.3, 1.1, 4.7];
let sum = numbers.reduce((total, num) => {
    return total + Math.round(num);
}, 0);
console.log(sum); //24
``` 

## [ES6对数组的扩展](https://github.com/lancertea/javascript-/blob/master/ES6/array.html)

## 相关练习题
### [数组扁平化](https://github.com/lancertea/javascript-/blob/master/training/2_object/flat.html)
### [并、交、差集的实现](https://github.com/lancertea/javascript-/blob/master/training/2_object/intersection.html)
### [其他](https://github.com/lancertea/javascript-/blob/master/training/2_object/array.html)

### 数组常用API实现
