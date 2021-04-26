# 数组相关练习题
## 数组去重
```javaScript
var arr = [1, 2, 3, 3, 4, 2, 5, 3, 7, 6];
//保留一个重复数字
//1
var res = arr.filter((item, index, self) =>
    self.indexOf(item) === index
)
console.log(res);

//2
console.log([...new Set(arr)]);

//3
var unique = (arr) => {
    var obj = {};
    return arr.filter(item => obj.hasOwnProperty(item) ? false : obj[item] = true);
}
console.log(unique(arr));

//4
var uniques = function (arr) {
    arr.sort((a, b) => a - b);
    let res = [arr[0]],
        pre = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[pre] !== arr[i]) {
            res.push(arr[i])
        }
        pre = i;
    }
    return res;
}
console.log(uniques(arr));

//5
var m = new Map();
arr.forEach(item => {
    m.set(item, m.has(item) ? m.get(item) + 1 : 1);
})
res = [...m.keys()];



//消除所有重复的数字
//1
var res1 = arr.filter(item =>
    arr.indexOf(item) === arr.lastIndexOf(item)
)
console.log(res1);
```

## 合并数组
```javaScript
var ary1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
var ary2 = ['A', 'B', 'C', 'D'];
//=>合并后的数组为：['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']
ary2 = ary2.map(item => item + '3');
var arr = ary1.concat(ary2).sort((a, b) => a.localeCompare(b)).map(item => {
    return item.replace('3', '');
});
console.log(arr);

ary1 = ['D1', 'D2', 'A1', 'A2', 'C1', 'C2', 'B1', 'B2'];
ary2 = ['B', 'A', 'D', 'C'];
//=>合并后的数组为：['D1', 'D2','D', 'A1', 'A2','A', 'C1', 'C2','C' ,'B1', 'B2','B']
let n = 0;
for (let i = 0; i < ary2.length; i++) {
    let item2 = ary2[i];
    for (let j = 0; j < ary1.length; j++) {
        let item1 = ary1[j];
        if (item1.includes(item2)) {
            n = j;
        }
    }
    ary1.splice(n + 1, 0, item2);
}
console.log(ary1);
```

## 旋转数组
```javaScript
/* 
旋转数组
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数
输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
输出: [5, 6, 7, 1, 2, 3, 4]
解释:
向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]
​
输入: [-1, -100, 3, 99] 和 k = 2
输出: [3, 99, -1, -100]
解释: 
向右旋转 1 步: [99, -1, -100, 3]
向右旋转 2 步: [3, 99, -1, -100] 
*/

function rotate(arr, k) {
    if (k <= 0 || k === arr.length)
        return arr;
    if (k > arr.length)
        k = k % arr.length;
    return arr.slice(-k).concat(arr.slice(0, arr.length - k));
}

let arr = [1, 2, 3, 4, 5, 6, 7];
console.log(rotate(arr, 3));
```
## 其它
1. 

```javaScript
// Array.prototype.push=function(val){
//     this[this.length++]=val;
//     return this.length;
// }
let obj = {
    2: 3,
    3: 4,
    length: 2,
    push: Array.prototype.push
}
obj.push(1); //this:obj  obj[obj.length++]=1=>obj[2]=1 obj.length=3
obj.push(2);
console.log(obj);
```

2. 

```javaScript
/* 
某公司1到12月份的销售额存在一个对象里面
如下： {
    1: 222,
    2: 123,
    5: 888
}，
请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null] 
*/

let obj = {
    1: 222,
    2: 123,
    5: 888
}

//1
var arr = Array(12).fill(null).map((item, index) => {
    return obj[index + 1] || null;
});
console.log(arr);

//2
//=>Object.keys(obj):获取obj中所有的属性名，以数组的方式返回
// console.log(Object.keys(obj)); //=>["1","2","5"]
var res = Array.from({
    length: 12
}, function () {
    return null
})
Object.keys(obj).forEach(item => {
    res[item - 1] = obj[item];
});
console.log(res);


//3
obj.length = 13;
arr = Array.from(obj).slice(1).map(item => {
    return typeof item === 'undefined' ? null : item;
})
console.log(arr);
```

## ['1','2','3'].map(parseInt)
```javaScript
console.log(['1','2','3'].map(parseInt));
//[1,NaN,NaN]
console.log(['1','2','4'].map(parseInt));
//[1,NaN,NaN]
console.log(['1','2','1'].map(parseInt));
//[1,NaN,1]
console.log(['1','2','0'].map(parseInt));
//[1,NaN,0]
```

```javaScript
//map标准定义是会传递3个参数:
arr.map(function(item, key, arr){
	...
})

// parseInt(string, radix)
// string：需要转化的字符，如果不是字符串会被转换，忽视空格符。
// radix：数字2-36之间的整型。默认使用10，表示10进制。这个参数的意义是指把前面的字符看作多少进制的数字，所谓的基数。如果radix在2-36之外会返回NaN。

//在没有指定基数，或者基数为0的情况下，javascript作如下处理:
// 如果字符串string以 “0x” 或者 “0X” 开头，则基数是16，16进制；
// 如果字符串string以 “0” 开头，基数是8（8进制）或者10（10进制）,根据实现环境决定。	
// ECMAScript 5规定使用10，但是并不是所有浏览器都遵循这个规定，最好明确给出radix的值。
// 如果字符串string 以其他任何值开头，则基数是10，10进制

let arr = ['1','2','3'].map(function(item, key, arr){
		//3个参数
		parseInt("1", 0) //0为10进制
		parseInt("2", 1) //radix中没有1进制
		parseInt("3", 2) //2进制中超过1的值不存在
	});
//[1, NaN, NaN]
```