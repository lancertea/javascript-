## 性能优化
### 内存管理
内存：由可读写单元组成，表示一片可操作空间
管理：人为地去操作一片空间的申请、使用和释放
内存管理：开发者主动申请空间、使用空间、释放空间

### 垃圾回收机制
不管什么程序语言，内存生命周期基本是一致的：
1. 分配你所需要的内存
2. 使用分配到的内存（读，写）
3. 不需要时将其释放\归还

垃圾数据回收分为手动回收和自动回收两种策略，如 C/C++ 就是使用手动回收策略，何时分配内存、何时销毁内存都是由代码控制的；如果这段数据已经不再需要了，但是又没有主动调用相关函数来释放内存，那么这种情况就被称为内存泄漏。

JS中的内存管理是自动的，对象不再被引用、或者不能从根上访问到的就会被视为垃圾

### 调用栈中的数据是如何回收的
栈内存保存JS简单数据类型及函数的执行上下文，与此同时，还有一个记录当前执行状态的指针（称为 ESP），指向当前执行函数的执行上下文，表示当前正在执行该函数。当这个函数执行结束之后，JavaScript引擎会通过向下移动 ESP 来销毁该函数保存在栈中的执行上下文。

### 堆中的数据是如何回收的
v8中采用分代回收的思想，会把堆分为新生代和老生代两个区域，新生代中存放的是生存时间短的对象，老生代中存放的是生存时间久的对象。
v8的内存空间一分为二（新生，老生），新生区通常只支持 1~8M 的容量，而老生区支持的容量就大很多了。对于这两块区域，V8 分别使用两个不同的垃圾回收器，以便更高效地实施垃圾回收。
副垃圾回收器，主要负责新生代的垃圾回收
主垃圾回收器，主要负责老生代的垃圾回收
#### 垃圾回收器的通用工作流程
1. 标记空间中活动对象和非活动对象。所谓活动对象就是还在使用的对象，非活动对象就是可以进行垃圾回收的对象
2. 回收非活动对象所占据的内存。其实就是在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象
3. 内存清理（可选）。一般来说，频繁回收对象后，内存中就会存在大量不连续空间，我们把这些不连续的内存空间称为内存碎片。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以最后一步需要整理这些内存碎片

#### 副垃圾回收器
副垃圾回收器主要负责新生代的垃圾回收。而通常情况下，大多数小的对象都会被分配到新生区，所以说这个区域虽然不大，但是垃圾回收还是比较频繁的。
新生代中用 Scavenge 算法来处理。所谓 Scavenge 算法，是把新生代空间对半划分为两个区域，一半是对象区域，一半是空闲区域；新加入的对象都会存放到对象区域，当对象区域快被写满时，就需要执行一次垃圾清理操作：
1.在垃圾回收过程中，首先要对对象区域中的垃圾做标记；标记完成之后，就进入垃圾清理阶段，副垃圾回收器会把这些存活的对象复制到空闲区域中，同时它还会把这些对象有序地排列起来，所以这个复制过程，也就相对于完成了内存清理操作，复制后空闲区域就没有内存碎片了。
2.完成复制后，对象区域与空闲区域进行角色翻转，也就是原来的对象区域变成空闲区域，原来的空闲区域变成了对象区域。这样就完成了垃圾对象的回收操作，同时这种角色翻转的操作还能让新生代中的这两块区域无限重复使用下去。
由于新生代中采用的 Scavenge 算法，所以每次执行清理操作时，都需要将存活的对象从对象区域复制到空闲区域。但复制操作需要时间成本，如果新生区空间设置的太大了，那么每次清理的时间就会过久，所以为了执行效率，一般新生区的空间会被设置的比较小。也正是因为新生区的空间不大，所以很容易被存活的对象装满整个区域。为了解决这个问题，JavaScript 引擎采用了对象晋升策略，也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。

#### 主垃圾回收器
主垃圾回收器主要负责老生区中的垃圾回收。除了新生区中晋升的对象，一些大的对象会直接被分配到老生区。因此老生区中的对象有两个特点，一个是对象占用空间大，另一个是对象存活时间长。主垃圾回收器是采用标记清除、标记整理、增量标记的算法进行垃圾回收的：
首先使用标记清除完成垃圾空间的回收
采用标记整理进行空间优化
采用增量标记进行效率优化

#####  全停顿
由于 JavaScript 是运行在主程序之上的，一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来，待垃圾回收完毕后再恢复脚本执行。我们把这种行为叫做全停顿（Stop-The-World）。
为了降低老生代的垃圾回收而造成的卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成，我们把这个算法称为 增量标记（Incremental Marking）算法。
使用增量标记算法，可以把一个完整的垃圾回收任务拆分为很多小的任务，这些小的任务执行时间比较短，可以穿插在其他的 JavaScript 任务中间执行，这样当执行上述动画效果时，就不会让用户因为垃圾回收任务而感受到页面的卡顿了。

#### 两者对比
新生代区域垃圾回收使用空间换时间
老生代区域垃圾回收不适合复制算法（空间大，数据多）
### 垃圾回收算法对比
JavaScript在创建变量时自动进行了内存分配，并且在它们不使用时"自动"释放，释放的过程就被称为垃圾回收。   
现在各大浏览器通常采用的垃圾回收有两种方法：标记清除、引用计数
1.引用计数：把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。
优点：
- 可以即时回收垃圾对象
- 最大限度减少程序暂停，从而减少程序卡顿时间（时刻监控引用为0的对象，并对其进行释放）

缺点
- 无法处理循环引用问题
- 时间开销大（时刻维护引用数值的变化）
```javascript
let o1 = {
    a:{
        b:2
    }
};
let o2 = {};
o2.o=o1;
o1.o=o2;

//需要手动切断循环引用
o2.o=null;
o1.o=null;
```
2.标记清除：是js中最常用的垃圾回收方式，把“对象是否不再需要”简化定义为“对象是否可以获得”，定期会执行以下的"垃圾回收"步骤（这正是标记清除算法垃圾收集的工作原理）：
1.遍历所有对象找标记活动对象（根可达）
2.遍历所有对象清除没有标记对象，回收相应的空间

JavaScript内存管理有一个主要概念是可达性，“可达性” 值是那些以某种方式可访问或可用的值，它们被保证存储在内存中。

可达对象：
- 可以访问到的对象就是可达对象（引用、作用域链）
- 可达的标准就是从根出发是否能够被找到
- JS中的根就可以理解为是全局变量对象（浏览器中为window,node.js中为global）

优：
- 可以回收循环引用的对象

缺：
- 容易产生碎片化空间，浪费空间
- 不会立即回收垃圾对象

3.标记整理：可看做是标记清除的增强，标记阶段的操作和标记清除一致；清除阶段会先执行整理，移动对象位置
优：
- 减少碎片化空间

缺：
- 不会立即回收垃圾对象


### 内存问题的外在表现
- 页面出现延迟加载或经常性暂停
网络正常的情况下，可能是GC存在频繁的垃圾回收操作
注：为什么不要频繁垃圾回收：
1.GC工作时应用程序是停止的
2.频繁且过长的GC会导致应用假死
3.用户使用中感知应用卡顿
界定标准：
1.通过内存变化图进行分析：Timeline中频繁的上升下降
2.任务管理器中数据频繁的增加减小

- 页面持续性出现糟糕的性能
可能存在内存膨胀：为了更好的效果去不断申请内存空间，但申请的空间大于我们能提供的大小
界定标准：在多数设备上都存在性能问题

- 页面的性能随时间延长越来越差
可能存在内存泄漏
界定标准：内存使用持续升高

### 监控内存的几种方式
浏览器任务管理器
Timeline时序图记录
堆快照查找分离DOM 

正常情况下，界面元素存活在DOM树上
分离状态的DOM节点： 在DOM树上进行了脱离，但JS代码中还引用（表现为在界面上看不见，但在内存中却占据空间）
垃圾对象时的DOM节点： 在DOM树上进行了脱离，JS代码中也不引用了

### 常见的内存泄漏的情况
1. 全局变量
在非严格模式下，当应用未声明的变量时，会在全局对象中创建一个新变量。在浏览器中，全局对象将是 window，这意味着
```javascript
funciton foo(arg){
    bar = 'some text'; //bar将泄漏到全局
}
```
等价于：
```javascript
funciton foo(arg){
   window.bar = 'some text'; 
}
```
假如变量 bar 的目的是仅在 foo 函数中引用一个变量。如果不使用 var 进行声明，则会创建一个冗余的全局变量

解决方法： 严格模式
全局变量是在页面关闭后，才会被垃圾回收机制回收，如果必须使用全局模式来存储数据，请确保使用完，将其指定为 null 或将其重新分配


2. 被遗忘的定时器和回调函数
```javascript
var someResource = getData();
  setInterval(function() {
      var node = document.getElementById('node');
      if(node) {
          node.innerHTML = JSON.stringify(someResource));
          // 定时器也没有清除
      }
  }, 1000);
```
上面的代码段展示了：计时器引用了不再需要的节点或数据的后果：someResource不会被垃圾收集

解决方法：在定时器完成工作的时候，手动清除定时器
```javascript
var element = document.getElementById('launch-button');
var counter = 0;
function onClick(event) {
   counter++;
   element.innerHtml = 'text ' + counter;
}

element.addEventListener('click', onClick);

// Do stuff
element.removeEventListener('click', onClick);
// element.parentNode.removeChild(element); 能 console 出整个div 没有被回收
element = null;
```

3. 闭包
```javascript
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing) // a reference to 'originalThing'
      console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log("message");
    }
  };
};
setInterval(replaceThing, 1000);
```

4. DOM引用
```javascript
  var refA = document.getElementById('refA');
  document.body.removeChild(refA); // dom删除了
  console.log(refA, "refA");  // 但是还存在引用
  // 能 console 出整个div 没有被回收
```
因为变量还在引用DOM节点，导致GC没有回收
解决方法：使用完及时设置null

### 执行顺序
当从服务器接收HTML页面的第一批数据时，DOM解析器就开始工作了，在解析过程中，如果遇到了JS脚本，如下所示：
```HTML
<html>
    <body>
        极客时间
        <script>
        document.write("--foo")
        </script>
    </body>
</html>
```
那么DOM解析器会先执行JavaScript脚本，执行完成之后，再继续往下解析。

那么第二种情况复杂点了，我们内联的脚本替换成js外部文件，如下所示：
```HTML
<html>
    <body>
        极客时间
        <script type="text/javascript" src="foo.js"></script>
    </body>
</html>
```
这种情况下，当解析到JavaScript的时候，会先暂停DOM解析，并下载foo.js文件，下载完成之后执行该段JS文件，然后再继续往下解析DOM。这就是JavaScript文件为什么会阻塞DOM渲染。

我们再看第三种情况，还是看下面代码：
```HTML
<html>
    <head>
        <style type="text/css" src = "theme.css" />
    </head>
    <body>
        <p>极客时间</p>
        <script>
            let e = document.getElementsByTagName('p')[0]
            e.style.color = 'blue'
        </script>
    </body>
</html>
```
当我在JavaScript中访问了某个元素的样式，那么这时候就需要等待这个样式被下载完成才能继续往下执行，所以在这种情况下，CSS也会阻塞DOM的解析。

所以这时候如果头部包含了js文件，那么同样也会暂停DOM解析，等带该JavaScript文件下载后，便开始编译执行该文件，执行结束之后，才开始继续DOM解析。

### src和href的区别
href是Hypertext Reference的简写，表示超文本引用，指向网络资源所在位置
```HTML
<a href="http://www.baidu.com"></a> 
<link type="text/css" rel="stylesheet" href="common.css">
```
src是source的简写，目的是要把文件下载到html页面中去
```HTML
<img src="img/girl.jpg"> 
<iframe src="top.html"> 
<script src="show.js">
```
作用结果：
1. href 用于在当前文档和引用资源之间确立联系
2. src 用于替换当前内容

浏览器解析方式：
1. 当浏览器遇到href会并行下载资源并且不会停止对当前文档的处理。(同时也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式)
2. 当浏览器解析到src ，会暂停其他资源的下载和处理，直到将该资源加载或执行完毕。(这也是script标签为什么放在底部而不是头部的原因)

### 怎样向页面添加JS
浏览器在读取一个网页时都发生什么:浏览器在读取一个网页时，代码（HTML, CSS 和 JavaScript）将在一个运行环境（浏览器标签页）中得到执行。就像一间工厂，将原材料（代码）加工为一件产品（网页）。在 HTML 和 CSS 集合组装成一个网页后，浏览器的 JavaScript 引擎将执行 JavaScript 代码。这保证了当 JavaScript 开始运行之前，网页的结构和样式已经就位。

这样很好，因为JavaScript 最普遍的用处是通过 DOM API（见上文）动态修改 HTML 和 CSS 来更新用户界面 （user interface）。如果 JavaScript 在 HTML 和 CSS 就位之前加载运行，就会引发错误。

内部脚本：
1. 把脚本元素放在文档体的底端（</body> 标签之前，与之相邻）
2. 内部脚本可使用DOMContentLoaded事件，HTML 文档体加载、解释完毕事件
```JavaScript
document.addEventListener("DOMContentLoaded", function() {
  . . .
});
```
外部脚本：
1. async
浏览器遇到 async 脚本时不会阻塞页面渲染，而是直接下载然后运行。这样脚本的运行次序就无法控制，只是脚本不会阻止剩余页面的显示。当页面的脚本之间彼此独立，且不依赖于本页面的其它任何脚本时，async是最理想的选择
```HTML
<!-- 三者的调用顺序是不确定的 -->
<script async src="js/vendor/jquery.js"></script>

<script async src="js/script2.js"></script>

<script async src="js/script3.js"></script>
```
2. defer
脚本会被延迟到整个页面都解析完毕后再运行。设置该属性相当于告诉浏览器立即下载，但延迟执行
```HTML
<!-- 脚本将按照在页面中出现的顺序加载和运行 -->
<script defer src="js/vendor/jquery.js"></script>

<script defer src="js/script2.js"></script>

<script defer src="js/script3.js"></script>
```
如果脚本无需等待页面解析，且无依赖独立运行，那么应使用async。
如果脚本需要等待页面解析，且依赖于其它脚本，调用这些脚本时应使用defer，将关联的脚本按所需顺序置于 HTML中。

## JS代码优化
jsperf.com
### 慎用全局变量
为什么要慎用
1.全局变量定义在全局执行上下文，是所有作用域链的顶端
2.全局执行上下文一直存在于上下文执行栈，直到程序退出
3.如果某个局部作用域出现了同名变量会遮蔽或污染全局

### 优化
1. 将使用中无法避免的全局变量缓存到局部(cacheGlobal.html)
2. 在原型对象上新增实例对象需要的方法
3. 避开闭包陷阱
4. 避免属性访问方法使用
5. for循环优化（缓存数组长度, 遍历性能foreach > for > forin）


## 认识v8
v8是一款主流的JS执行引擎，采用即时编译，内存设限（64位OS不超过1.5G 32位OS不超过800M）
### v8是如何执行一段JS代码的
编译器（Compiler）
解释器（Interpreter）
抽象语法树（AST）
字节码（Bytecode）
即时编译器（JIT）

1.在编译型语言的编译过程中，编译器首先会依次对源代码进行词法分析、语法分析，生成抽象语法树（AST），然后是代码优化，最后再生成处理器能够理解的机器码。如果编译成功，将会生成一个可执行的文件。但如果编译过程发生了语法或者其他的错误，那么编译器就会抛出异常，最后的二进制文件也不会生成成功。
2.在解释型语言的解释过程中，同样解释器也会对源代码进行词法分析、语法分析，并生成抽象语法树（AST），不过它会再基于抽象语法树生成字节码，最后再根据字节码来执行程序、输出结果。
JS是后者

#### 生成AST
1.分词（词法分析）：其作用是将一行行的源码拆解成一个个token。所谓token，指的是语法上不可能再分的、最小的单个字符或字符串
2.解析（语法分析）：其作用是将上一步生成的token数据，根据语法规则转为AST。如果源码符合语法规则，这一步就会顺利完成。但如果源码存在语法错误，这一步就会终止，并抛出一个 “语法错误”

AST应用：
1.Babel 的工作原理就是先将 ES6 源码转换为 AST，然后再将 ES6 语法的 AST 转换为 ES5 语法的 AST，最后利用 ES5 的 AST 生成 JavaScript 源代码。
2.ESLint 也使用 AST。ESLint 是一个用来检查 JavaScript 编写规范的插件，其检测流程也是需要将源码转换为 AST，然后再利用 AST 来检查代码规范化的问题

AST的生成：
词法分析：其作用是将一行行的源码拆解成一个个token（语法上不能再分的最小的单个字符或字符串）
语法分析：根据语法规则将token转为AST

有了 AST 后，那接下来 V8 就会生成该段代码的执行上下文

#### 生成字节码
有了 AST 和执行上下文后，那接下来的第二步，解释器 lgnition 就登场了，它会根据 AST 生成字节码，并解释执行字节码

- 字节码就是介于 AST 和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行
- 机器码所占用的空间远远超过了字节码，所以使用字节码可以减少系统的内存使用

#### 执行代码
对于第一次执行的字节码由解释器解释执行
编译器 TurboFan 就会把该段热点的字节码编译为高校的机器码
热点代码：被重复执行多次的一段代码

即时编译（JIT）技术：解释器 lgnition 在解释执行字节码的同时，收集代码信息，当它发现某一部分代码变热了之后，TurboFan 编译器便闪亮登场，把热点的字节码转换为机器码，并把转换后的机器码保存起来，以备下次使用



 