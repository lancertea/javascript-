# 正则表达式
> regular expression：RegExp
>
> 用来处理字符串的规则
>
> - 只能处理字符串
> - 它是一个规则：可以验证字符串是否符合某个规则（test），也可以把字符串中符合规则的内容捕获到（exec / match...）
```javascript
let str = "good good study , day day up！";
//=>学正则就是用来制定规则（是否包含数字）
let reg = /\d+/;
reg.test(str); //=>false

str = "2019-08-12";
reg.exec(str); //=>["2019",index:0,inputs:"'2019-08-12'(原始字符串)"]
```

## 编写正则表达式
创建方式有两种
```javascript
//=>字面量创建方式（两个斜杠之间包起来的，都是用来描述规则的元字符）
let reg1 = /\d+/;

//=>构造函数模式创建  两个参数：元字符字符串，修饰符字符串
let reg2 = new RegExp("\\d+");
//两种的区别：第二个才能使用变量
```

### 正则两种创建方式的区别
```javascript
//=>构造函数因为传递的是字符串，\需要写两个才代表斜杠
let reg = /\d+/g;
reg = new RegExp("\\d+","g");

//=>正则表达式中的部分内容是变量存储的值
//1.两个斜杠中间包起来的都是元字符（如果正则中要包含某个变量的值，则不能使用字面量方式创建）
let type = "abc";
reg = /^@"+type+"@$/; 
console.log(reg.test("@abc@")); //=>false
console.log(reg.test('@"""typeeeee"@')); //=>true
//2.这种情况只能使用构造函数方式（因为它传递的规则是字符串，只有这样才能进行字符串拼接）
reg = new RegExp("^@"+type+"@$");
console.log(reg.test("@abc@"));//=>true
```
正则表达式由两部分组成
- 元字符
- 修饰符
```javascript
/*常用的元字符*/
//=>1.量词元字符：设置出现的次数
* 零到多次  
+ 一到多次
? 零次或者一次
{n} 出现n次
{n,} 出现n到多次
{n,m} 出现n到m次

//=>2.特殊元字符：单个或者组合在一起代表特殊的含义
\    转义字符（普通->特殊->普通）
.    除\n（换行符）以外的任意字符
^    以哪一个元字符作为开始   注：^出现在开头表示字符边界，在中括号开头表示非(eg:[^xy])，在其它地方就表示字符^
$    以哪一个元字符作为结束
\n   换行符
\d   0~9之间的一个数字
\D   查找非数字字符 （大写和小写的意思是相反的）
\w   数字、字母、下划线中的任意一个字符  [0-9a-zA-Z_]===\w
\s   一个空白字符（包含空格、制表符、换页符等）
\t   一个制表符（一个TAB键：四个空格）
\b   匹配一个单词的边界
x|y  x或者y中的一个字符
[xyz] x或者y或者z中的一个字符
[^xy] 除了x/y以外的任意字符
[a-z] 指定a-z这个范围中的任意字符  [0-9a-zA-Z_]===\w
[^a-z] 上一个的取反“非”
()   正则中的分组符号
(?:) 只匹配不捕获
(?=) 正向预查
(?!) 负向预查 

(x) 匹配 'x' 并且记住匹配项
(?:x) 匹配 'x' 但是不记住匹配项
x(?=y) 匹配'x'仅仅当'x'后面跟着'y'.这种叫做正向肯定查找。
x(?!y) 匹配'x'仅仅当'x'后面不跟着'y',这个叫做正向否定查找

//=>3.普通元字符：代表本身含义的
/abc/ 此正则匹配的就是 "abc"
```

```javascript
/*正则表达式常用的修饰符：img*/
i =>ignoreCase  忽略单词大小写匹配
m =>multiline   可以进行多行匹配
g =>global      全局匹配

/* 
/A/.test('lalala')  =>false
/A/i.test('lalala') =>true
*/
```

## 元字符详细解析
`^ $`                       
```javascript
let reg = /^\d/;
console.log(reg.test("abc")); //=>false
console.log(reg.test("2019abc"));//=>true
console.log(reg.test("abc2019"));//=>false
```

```javascript
let reg = /\d$/;
console.log(reg.test("abc")); //=>false
console.log(reg.test("2019abc"));//=>false
console.log(reg.test("abc2019"));//=>true
```

```javascript
//=>^/$两个都不加：字符串中包含符合规则的内容即可
let reg1 = /\d+/;
//=>^/$两个都加：字符串只能是和规则一致的内容
let reg2 = /^\d+$/;

//=>举个例子：验证手机号码（11位，第一个数字是1即可）
let reg = /^1\d{10}$/;
```

`\`

```javascript
//=>.不是小数点，是除\n外的任意字符
let reg = /^2.3$/;
console.log(reg.test("2.3"));//=>true
console.log(reg.test("2@3"));//=>true
console.log(reg.test("23"));//=>false

//=>基于转义字符，让其只能代表小数点
reg = /^2\.3$/;
console.log(reg.test("2.3"));//=>true
console.log(reg.test("2@3"));//=>false

let str = "\\d";
reg = /^\d$/; //=>\d代表0-9的数字
console.log(reg.test(str)); //=>false
reg = /^\\d$/; //=>把特殊符合转换为普通的
console.log(reg.test(str)); //=>true
```

`x|y`

```javascript
let reg = /^18|29$/;
console.log(reg.test("18")); //=>true
console.log(reg.test("29")); //=>true
console.log(reg.test("129")); //=>true
console.log(reg.test("189")); //=>true1
console.log(reg.test("1829")); //=>true
console.log(reg.test("829")); //=>true
console.log(reg.test("182")); //=>true
//---直接x|y会存在很乱的优先级问题，一般我们写的时候都伴随着小括号进行分组，小括号的第一个作用：分组，改变处理的优先级
reg = /^(18|29)$/;
console.log(reg.test("18")); //=>true
console.log(reg.test("29")); //=>true
console.log(reg.test("129")); //=>false
console.log(reg.test("189")); //=>false
//=>只能是18或者29中的一个了
```

`[]`

```javascript
//1.中括号中出现的字符一般都代表本身的含义
let reg = /^[@+]$/;
console.log(reg.test("@")); //=>true
console.log(reg.test("+")); //=>true
19console.log(reg.test("@@")); //=>false
console.log(reg.test("@+")); //=>false

reg = /^[\d]$/; //=>\d在中括号中还是0-9
console.log(reg.test("d"));//=>false
console.log(reg.test("\\"));//=>false
console.log(reg.test("9"));//=>true
reg = /^[\\d]$/;
console.log(reg.test("d"));//=>true
console.log(reg.test("\\"));//=>true
console.log(reg.test("9"));//=>false

//2.中括号中不存在多位数
reg = /^[18]$/;
console.log(reg.test("1")); //=>true
console.log(reg.test("8")); //=>true
console.log(reg.test("18")); //=>false

reg = /^[10-29]$/; //=>1或者0-2或者9
console.log(reg.test("1"));//=>true
console.log(reg.test("9"));//=>true
console.log(reg.test("0"));//=>true
console.log(reg.test("2"));//=>true
console.log(reg.test("10"));//=>false
```

## 常用的正则表达式

1. 验证是否为有效数字

   ```javascript
   /*
    * 规则分析
    * 1.可能出现 + - 号，也可能不出现  [+-]?
    * 2.一位0-9都可以，多位首位不能是0 (\d|([1-9]\d+))
    * 3.小数部分可能有可能没有，一旦有后面必须有小数点+数字 (\.\d+)?
    */
   let reg = /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/;
   ```
 
2. 验证密码

   ```javascript
   //=>数字、字母、下划线
   //=>6~16位
   let val = userPassInp.value,
       reg = /^\w{6,16}$/;
   let flag=reg.test(val);
   /*
   function checkPass(val){
       if(val.length<6 || val.length>16){
       	alert('长度必须介于6-16位之间！');
       	return;
   	}
       let area=['a','b'....'_']; //=>包含数字、字母、下划线
       for(let i=0;i<val.length;i++){
           let char=val[i];
           if(!area.includes(char)){
               alert('格式不正确！');
       		return;
           }
       }
   }
   */
   ```

3. 验证真实姓名的

   ```javascript
   /*
    * 1.汉字  /^[\u4E00-\u9FA5]$/
    * 2.名字长度 2~10位
    * 3.可能有译名 ·汉字  (·[\u4E00-\u9FA5]{2,10}){0,2}
    */
   let reg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/;
   ```

4. 验证邮箱的

   ```javascript
   let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
   
   //=> \w+((-\w+)|(\.\w+))*
   //1.开头是数字字母下划线（1到多位）
   //2.还可以是 -数字字母下划线 或者 .数字字母下划线,整体零到多次
   //=>邮箱的名字由“数字、字母、下划线、-、.”几部分组成，但是-/.不能连续出现也不能作为开始
   
   //=> @[A-Za-z0-9]+
   //1.@后面紧跟着：数字、字母 （1-多位）
   
   //=> ((\.|-)[A-Za-z0-9]+)*
   //1.对@后面名字的补充
   // 多域名     .com.cn
   // 企业邮箱    zxt@abc-studyhard-office.com
   
   //=> \.[A-Za-z0-9]+
   //1. 这个匹配的是最后的域名（.com/.cn/.org/.edu/.net...）
   ```

5. 身份证号码

   ```javascript
   /*
    * 1. 一共18位
    * 2. 最后一位可能是X
    *
    * 身份证前六位：省市县  130828
    * 中间八位：年月日
    * 最后四位：
    *   最后一位 => X或者数字
    *   倒数第二位 => 偶数 女  奇数 男
    *   其余的是经过算法算出来的
    */
   //let reg = /^\d{17}(\d|X)$/;
   //=>小括号分组的第二个作用：分组捕获，不仅可以把大正则匹配的信息捕获到，还可以单独捕获到每个小分组的内容
   let reg = /^(\d{6})(\d{4})(\d{2})(\d{2})\d{2}(\d)(\d|X)$/;
   reg.exec("130828199012040617"); //=>["130828199012040617", "130828", "1990", "12", "04", "1", "7"...] 捕获结果是数组，包含每一个小分组单独获取的内容
   ```

## 正则的捕获
> 实现正则捕获的办法
>
> - 正则RegExp.prototype上的方法
>   - exec
> 1. 正则表达式不含g的时候会一直返回第一个匹配项，返回的数组中第一个为整个正则表达式匹配的结果，第二个为括号内匹配的结果
> 2. 加入g后会挨个匹配，一直到null，再从第一个开始匹配

>   - test
> 1. 1.test匹配模式同exec,可通过lastIndex这个属性知道下一次匹配哪个属性
>
> - 字符串String.prototype上支持正则表达式处理的方法
>   - replace
>   - match
> 1. 不加g时候的匹配模式和匹配结果跟exec的一模一样
> 2. 加g会将所有匹配结果组成的一个数组，且数组中不再有之前index，input这些属性了。多次匹配的情况下,match只能把大正则匹配的内容获取到，小分组匹配的信息无法获取
>   - splite
>   

```javascript
let str = "abc2019yangfan2020qihang2021";
let reg = /\d+/;
/*
 * 基于exec实现正则的捕获
 *   1.捕获到的结果是null或者一个数组
 *     第一项：本次捕获到的内容
 *     其余项：对应小分组本次单独捕获的内容
 *     index：当前捕获内容在字符串中的起始索引
 *     input：原始字符串
 *   2.每执行一次exec，只能捕获到一个符合正则规则的，但是默认情况下，我们执行一百遍，获取的结果永远都是第一个匹配到的，其余的捕获不到
 *     =>“正则捕获的懒惰性”：默认只捕获第一个
 */
console.log(reg.exec(str)); //=>["2019", index: 7, input: "abc2019yangfan2020qihang2021"]
console.log(reg.exec(str)); //=>["2019"...]

/*
//=>实现正则捕获的前提是：当前正则要和字符串匹配，如果不匹配捕获的结果是null
let reg = /^\d+$/;
console.log(reg.test(str)); //=>false
console.log(reg.exec(str)); //=>null
*/
```

懒惰性的解决办法

```javascript
let str = "abc2019yangfan2020qihang2021";
/*
 * reg.lastIndex：当前正则下一次匹配的起始索引位置 
 *   懒惰性捕获的原因：默认情况下lastIndex的值不会被修改，每一次都是从字符串开始位置查找，所以找到的永远只是第一个
 *   解决办法：全局修饰符g
 */
// let reg = /\d+/;
// console.log(reg.lastIndex); //=>0 下面匹配捕获是从STR索引零的位置开始找
// console.log(reg.exec(str));
// console.log(reg.lastIndex); //=>0 第一次匹配捕获完成，lastIndex没有改变，所以下一次exec依然是从字符串最开始找，找到的永远是第一个匹配到的

// let reg = /\d+/g;
// console.log(reg.exec(str)); //=>["2019"...]
// console.log(reg.lastIndex); //=>7 设置全局匹配修饰符g后，第一次匹配完，lastIndex会自己修改
// console.log(reg.exec(str)); //=>["2020"...]
// console.log(reg.lastIndex); //=>18
// console.log(reg.exec(str)); //=>["2021"...]
// console.log(reg.lastIndex); //=>28
// console.log(reg.exec(str)); //=>null 当全部捕获后，再次捕获的结果是null，但是lastIndex又回归了初始值零，再次捕获又从第一个开始了...
// console.log(reg.lastIndex); //=>0
// console.log(reg.exec(str)); //=>["2019"...]
// console.log(reg.lastIndex); //=>7

// let reg = /\d+/g;
// if (reg.test(str)) {
// 	//=>验证一下:只有正则和字符串匹配我们在捕获
// 	console.log(reg.lastIndex); //=>7 基于TEST匹配验证后，LASTINDEX已经被修改为第一次匹配后的结果，所以下一次捕获不再从头开始了
// 	console.log(reg.exec(str)); //=>["2020"...]
// }

//=>需求：编写一个方法execAll，执行一次可以把所有匹配的结果捕获到（前提正则一定要设置全局修饰符g）
~ function () {
    function execAll(str = "") {
        //=>str:要匹配的字符串
        //=>this:RegExp的实例（当前操作的正则）
        //=>进来后的第一件事，是验证当前正则是否设置了G，不设置则不能在进行循环捕获了，否则会导致死循环
        if (!this.global) return this.exec(str);
        //=>ARY存储最后所有捕获的信息  RES存储每一次捕获的内容（数组）
        let ary = [],
            res = this.exec(str);
        while (res) {
            //=>把每一次捕获的内容RES[0]存放到数组中
            ary.push(res[0]);
            //=>只要捕获的内容不为NULL，则继续捕获下去
            res = this.exec(str);
        }
        return ary.length === 0 ? null : ary;
    }
    RegExp.prototype.execAll = execAll;
}();

let reg = /\d+/g;
console.log(reg.execAll("zz2019@2020qq"));
//=>字符串中的MATCH方法，可以在执行一次的情况下，捕获到所有匹配的数据（前提：正则也得设置G才可以）
console.log("zz2019@2020qq".match(reg));
```
```javascript
let str = "abc!2019!yangfan!2020!qihang!2021!";
let reg = /\d+/;
let res = reg.exec(str);
console.log(res);
//["2019", index: 4, input: "abc2019yangfan2020qihang2021", groups: undefined, length:1]
res = reg.exec(str);
console.log(res);
//["2019", index: 4, input: "abc2019yangfan2020qihang2021", groups: undefined, length:1]

reg = /(\d+)/;
res = reg.exec(str);
console.log(res);
// ["2019", "2019", index: 4, input: "abc2019yangfan2020qihang2021", groups: undefined, length:2]
res = reg.exec(str);
console.log(res);
// ["2019", "2019", index: 4, input: "abc2019yangfan2020qihang2021", groups: undefined, length:2]     
//可看出这里的length是匹配到的内容的个数+组内匹配到的个数

reg = /!(\d+)!/;
res = reg.exec(str);
console.log(res);
// ["！2019！", "2019", index: 3, input: "abc！2019！yangfan！2020！qihang！2021！", groups: undefined, length:2]
res = reg.exec(str);
console.log(res);
// ["！2019！", "2019", index: 3, input: "abc！2019！yangfan！2020！qihang！2021！", groups: undefined, length:2]

reg = /!(\d+)!/g;
res = reg.exec(str);
console.log(res);
// ["！2019！", "2019", index: 3, input: "abc！2019！yangfan！2020！qihang！2021！", groups: undefined, length:2]
res = reg.exec(str);
console.log(res);
// ["！2020！", "2020", index: 16, input: "abc！2019！yangfan！2020！qihang！2021！", groups: undefined, length:2]
res = reg.exec(str);
console.log(res);
//["!2021!", "2021", index: 28, input:"abc!2019!yangfan!2020!qihang!2021!", groups: undefined, length:2]
res = reg.exec(str);
console.log(res);
//null

reg = /!(\d0)(\d+)!/g;
res = reg.exec(str);
console.log(res);
//["!2019!", "20", "19", index: 3, input: "abc!2019!yangfan!2020!qihang!2021!", groups: undefined, length: 3]
res = reg.exec(str);
console.log(res);
//["!2020!", "20", "20", index: 16, input: "abc!2019!yangfan!2020!qihang!2021!", groups: undefined, length: 3]
res = reg.exec(str);
console.log(res);
//["!2021!", "20", "21", index: 28, input: "abc!2019!yangfan!2020!qihang!2021!", groups: undefined, length: 3]
res = reg.exec(str);
console.log(res);
//null

str = "{0}年{1}月{2}日";
reg = /\{(\d+)\}/g;
while(reg.test(str)){
    console.log(reg.lastIndex);//3 7 11    
}

console.log(reg.test(str)); //true
console.log(RegExp.$1); //"0"
//一次匹配的结果
console.log(RegExp.$1,RegExp.$2,RegExp.$3);//"0"

console.log(reg.test(str)); //true
console.log(RegExp.$1); //"1"

console.log(reg.test(str)); //true
console.log(RegExp.$1); //"2"

console.log(reg.test(str)); //false
console.log(RegExp.$1); //"2" 存储的是上次捕获的结果

reg = /!(\d0)(\d+)!/g;
str = "abc!2019!yangfan!2020!qihang!2021!";
console.log(reg.test(str)); //true
console.log(RegExp.$1,RegExp.$2);//"20" "19"

let time = "2019-08-13";
//变为"2019年08月13日"
reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
res = time.replace(reg,"$1年$2月$3日");
console.log(res);//"2019年08月13日"

res = time.replace(reg,((big,$1,$2,$3)=>{
    console.log(big,$1,$2,$3);//"2019-08-13" "2019" "08" "13"
    
}))
console.log(res);//undefined
```
正则的分组捕获

```javascript
//=>身份证号码
let str = "130828199012040112";
let reg = /^(\d{6})(\d{4})(\d{2})(\d{2})\d{2}(\d)(?:\d|X)$/;
console.log(reg.exec(str));
console.log(str.match(reg));
//=>["130828199012040112", "130828", "1990", "12", "04", "1", index: 0, input: "130828199012040112"]
//=>第一项：大正则匹配的结果
//=>其余项：每一个小分组单独匹配捕获的结果
//=>如果设置了分组（改变优先级），但是捕获的时候不需要单独捕获，可以基于?:来处理
```

```javascript
//=>既要捕获到{数字}，也想单独的把数字也获取到，例如：第一次找到 {0} 还需要单独获取0
let str = "{0}年{1}月{2}日";

/*
//=>不设置g只匹配一次，exec和match获取的结果一致（既有大正则匹配的信息，也有小分组匹配的信息）
let reg = /\{(\d+)\}/;
console.log(reg.exec(str));
console.log(str.match(reg));
//["{0}", "0",...]
*/

let reg = /\{(\d+)\}/g;
//console.log(str.match(reg)); //=>["{0}", "{1}", "{2}"] 多次匹配的情况下,match只能把大正则匹配的内容获取到，小分组匹配的信息无法获取
let aryBig=[],
    arySmall=[],
    res=reg.exec(str);
while(res){
    let [big,small]=res;
    aryBig.push(big);
    arySmall.push(small);
    res=reg.exec(str);
}
console.log(aryBig,arySmall); //=>["{0}", "{1}", "{2}"] ["0", "1", "2"]
```

```javascript
//=>分组的第三个作用：“分组引用”
let str = "book"; //=>"good"、"look"、"moon"、"foot"...
let reg = /^[a-zA-Z]([a-zA-Z])\1[a-zA-Z]$/; //=>分组引用就是通过“\数字”让其代表和对应分组出现一模一样的内容
console.log(reg.test("book")); //=>true
console.log(reg.test("deep")); //=>true
console.log(reg.test("some")); //=>false
```

## 正则捕获的贪婪性

```javascript
let str = "mount2019@2020study";
//=>正则捕获的贪婪性：默认情况下，正则捕获的时候，是按照当前正则所匹配的最长结果来获取的
let reg = /\d+/g;
console.log(str.match(reg)); //=>["2019","2020"]

//=>在量词元字符后面设置？：取消捕获时候的贪婪性（按照正则匹配的最短结果来获取）
reg = /\d+?/g;
console.log(str.match(reg)); //=>["2", "0", "1", "9", "2", "0", "2", "0"]
```

问号在正则中的五大作用：

- 问号左边是非量词元字符：本身代表量词元字符，出现零到一次
- 问号左边是量词元字符：取消捕获时候的贪婪性
- (?:) 只匹配不捕获
- (?=) 正向预查
- (?!) 负向预查



## 其它正则捕获的方法

1. test也能捕获（本意是匹配）

   ```javascript
   let str = "{0}年{1}月{2}日";
   let reg = /\{(\d+)\}/g;
   console.log(reg.test(str)); //=>true
   console.log(RegExp.$1); //=>"0"
   
   console.log(reg.test(str)); //=>true
   console.log(RegExp.$1); //=>"1"
   
   console.log(reg.test(str)); //=>true
   console.log(RegExp.$1); //=>"2"
   
   console.log(reg.test(str)); //=>false
   console.log(RegExp.$1); //=>"2" 存储的是上次捕获的结果
   
   //=>RegExp.$1~RegExp.$9：获取当前本次正则匹配后，第一个到第九个分组的信息
   ```

2. replace 字符串中实现替换的方法（一般都是伴随正则一起使用的）

   ```javascript
   let str = "abc@2019|abc@2020";
   //=>把"abc"替换成"mount"
   //1.不用正则，执行一次只能替换一个
   /*
   str = str.replace("abc","mount").replace("abc","mount");
   console.log(str);
   */
   //2.使用正则会简单一点
   str = str.replace(/abc/g,"mount");
   console.log(str);
   ```

   ```javascript
   let str = "abc@2019|abc@2020";
   //=>把"abc"替换为"abcstudyhard"
   //str=str.replace("abc","abcstudyhard").replace("abc","abcstudyhard");
   //"abcstudyhardstudyhard@2019|abc@2020" 每一次替换都是从字符串第一个位置开始找的（类似于正则捕获的懒惰性）
   
   //=>基于正则g可以实现
   str = str.replace(/abc/g,"abcstudyhard");
   ```

   案例：把时间字符串进行处理

   ```javascript
   let time = "2019-08-13";
   //=>变为"2019年08月13日"
   let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
   
   //=>这样可以实现
   //time = time.replace(reg,"$1年$2月$3日");
   //console.log(time); //=>2019年08月13日
   
   //=>还可以这样处理 [str].replace([reg],[function])
   //1.首先拿REG和TIME进行匹配捕获，能匹配到几次就会把传递的函数执行几次（而且是匹配一次就执行一次）
   //2.不仅把方法执行，而且REPLACE还给方法传递了实参信息（和exec捕获的内容一致的信息：大正则匹配的内容，小分组匹配的信息....）
   //3.在函数中我们返回的是啥，就把当前大正则匹配的内容替换成啥
   /*
   time = time.replace(reg,(big,$1,$2,$3)=>{
       //=>这里的$1~$3是我们自己设置的变量
       console.log(big,$1,$2,$3);
   });
   */
   time = time.replace(reg,(...arg)=>{
       let [,$1,$2,$3]=arg;
       $2.length<2?$2="0"+$2:null;
       $3.length<2?$3="0"+$3:null;
       return $1+"年"+$2+"月"+$3+"日";
   });
   ```
 
   	

   













