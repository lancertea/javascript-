# string
```javascript
//字符串的“只读性”
var s = "hello";
console.log(s.length); //5
console.log(s[0]); //'h'
s[0] = 'x';
//字符串是不可变的，对字符串某个索引赋值，不会出错，但也没有任何效果
console.log(s[0]); //'h' 
s[6] = '!'; //s[6]会返回undefined
console.log(s); //'hello'
```

## String对象常用方法总结
str.charAt(index)  
返回指定索引位置的字符(一个单字符串)  
如果没有提供索引，charAt() 将使用0; 如果指定的 index 值超出了该范围，则返回一个空字符串。

str.charCodeAt(index)  
返回指定索引位置字符的 Unicode 值  
如果 index 超出范围，charCodeAt() 返回 NaN。

str.concat(str2, [, ...strN])  
连接两个字符串文本，并返回一个新的字符串。

str.fromCharCode()  
将 Unicode 转换为字符串

str.indexOf(searchValue [, fromIndex])  
返回字符串中检索指定字符第一次出现的位置

str.lastIndexOf(searchValue[, fromIndex]) 
返回字符串中检索指定字符最后一次出现的位置  
fromIndex默认值是 +Infinity。如果 fromIndex >= str.length ，则会搜索整个字符串。如果 fromIndex < 0 ，则等同于 fromIndex == 0。

str.split([separator[, limit]])  
通过分离字符串成字串，将字符串对象分割成字符串数组。
JavaScript为字符串提供了一些常用方法，注意，调用这些方法本身不会改变原有字符串的内容，而是返回一个新字符串
所以一般想对字符串操作的时候，可先用split("")将其转换为字符串数组再操作

str.slice(beginIndex[, endIndex])
摘取一个字符串区域，返回一个新的字符串。 如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。
也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推

str.substring(indexStart[, indexEnd])  
返回在字符串中指定两个下标之间的字符。有负值时，把所有负值转换为0

substr(start, len)  
通过指定字符数返回在指定位置开始的字符串中的字符。 有负值时，将第一个参数加上字符串长度，而将第二个负的转换为0

str.trim() 
从字符串的开始和结尾去除空格
        
str.match(regexp) 
使用正则表达式与字符串相比较。
regexp:一个正则表达式对象。如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp 
- 如果使用g标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组
- 如果未使用g标志，则仅返回第一个完整匹配及其相关的捕获组（Array）

str.search(regexp)  
对正则表达式和指定字符串进行匹配搜索，返回第一个出现的匹配项的下标。

str.replace(regexp|substr, newSubStr|function)  
返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。原字符串不会改变

str.replaceAll(regexp|substr, newSubstr|function)    
regex必须设置全局标志

str.matchAll(regexp) ES6  
返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。
regexp:正则表达式对象。如果所传参数不是一个正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp   RegExp必须是设置了全局模式g的形式，否则会抛出异常TypeError  

str.includes(searchString[, position]) ES6    
用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或 false。区分大小写

str.startsWith(searchString[, position]) ES6  
用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 true 或 false。

str.endsWith(searchString[, length])   ES6  
用来判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 true 或 false

str.padStart(targetLength [, padString])  ES6  
用另一个字符串填充当前字符串(如果需要的话，会重复多次)，以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充  
targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身  
padString:填充字符串,默认为空

str.padEnd(targetLength [, padString])  ES6  
用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充  

str.repeat(count)  ES6  
构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本

### 一些方法的对比
```javascript
var s = "helloworld";
console.log(s.slice(0, 6)); //"hellow" 
console.log(s.slice(-5, -1)); //"worl"
console.log(s.slice(-1, -5)); //""
        
console.log(s.substring(0, 6)); //"hellow"
console.log(s.substring(-5, -1)); //""
console.log(typeof s.substring(-5, -1));//"string"
console.log(s.substring(-1, 6)); //"hellow" 
        
console.log(s.substr(0, 5)); //"hello"
console.log(s.substr(-5, 5)); //"world"
console.log(s.substr(-3, -1)); //""
        
//split()
console.log(s.split()); //[ "helloworld" ]
console.log(s.split('')); //[ "h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d" ]
```

## [ES6对字符串的扩展](https://github.com/lancertea/javascript-/blob/master/ES6/string.html)


