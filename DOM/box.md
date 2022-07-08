# DOM
## window对象和document对象
window
window 对象表示一个包含DOM文档的窗口，其document属性指向窗口中载入的DOM文档
```javaScript
var win = document.defaultView
```
window作为全局变量，代表了脚本正在运行的窗口，暴露给Javascript代码，是 JavaScript 的顶级对象。
我们创建的所有对象、函数、变量都是 Window 对象的成员。
Window 对象的方法和属性是在全局范围内有效的。

document
Document接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是DOM树，是HTML文档的根节点与所有其他节点（元素节点，文本节点，属性节点, 注释节点）
Document对象使我们可以通过脚本对 HTML 页面中的所有元素进行访问
Document对象是 Window 对象的一部分，即 window.document

## JS中的DOM操作：盒子模型属性
> DOM：document object model 文档对象模型，提供系列的属性和方法，让我们能在JS中操作页面中的元素

## 获取元素的属性和方法
```javascript
//方法
document.getElementById([ID])
document.getElementsByName([NAME])///=>在IE6-8浏览器中只对表单元素的NAME有作用
[context].queryselector([SELECTOR])//=>在IE6~8中不兼容
[context].queryselectorAll([SELECTPR])//=>在IE6~8中不兼容
[context].getElementsByTagName([TAG-NAME])
[context].getElementsByClassName([CLASS-NAME])

//属性
document
document.documentElement //HTML整个文档
document.head
document.body
childNodes //所有子节点(包括文本这些)
children //所有元素子节点  IE6~8中会把注释节点当做元素节点获取到
parentNode
firstChild//所有子节点的第一个
firstElementChild//所有元素子节点的第一个
lastChild//所有子节点的最后一个
lastElementChild//所有元素子节点的最后一个
previousSibling/previousElementSibling
nextSibling/nextElementSibling
//=>所有带Element的，在IE6~8中不兼容
```
## DOM的增删改操作
```javascript
//创建元素
document.createElement([tag-name])
document.createTextNode([text content])
//字符串拼接（模板字符串），基于innerHTML/innerText存放到容器中

//增加元素
//在父元素最后增加一个子元素
[parent].appendChild(child)
//在父元素中指定元素前面增加一个元素
[parent].insertBefore(newNode,existingNode)

//拷贝元素
[element].cloneNode(true/false)

//移除元素
[parent].removeChild(element)

//设置自定义属性
[element].xxx=xxx;
console.log([element].xxx);
delete [element].xxx;

[element].setAttribute("xxx",xxx);
console.log([element].getAttribute("xxx");
[element].removeAttribute("xxx");
```
### [用例](https://github.com/lancertea/javascript-/blob/master/DOM/DOM.html)

## 获取元素样式和操作样式
```javaScript
//修改元素样式
[element].style.xxx=xxx;  //修改和设置它的行内样式
[element].className=xxx;  //设置样式类

//获取元素的样式
[element].style.xxx //只能取到内联样式
[element].currentStyle.xxx //拿到的是渲染之后的样式，但是仅IE支持
window.getComputedStyle([ELEMENT],[伪类]) / [ELEMENT].currentStyle//拿到的是渲染后的样式，通用性好
第一个参数是操作的元素  第二个参数是元素的伪类:after/:before。获取的结果是CSSStyleDeclaration这个类的实例（对象），包含了当前元素所有的样式信息
```

### JS如何设置获取盒模型对应的宽和高
1. dom.style.width/height
缺点：只能取到内联样式

2. Dom.currentStyle.width/height
优点：拿到的是渲染之后的样式
缺点：仅IE支持

3. Window.getComputedStyle(dom).width/height
优点：拿到的是渲染之后的样式，通用性好

4. dom.getBoundingClientRect()返回一个（类似）对象，可拿到8个属性：left、right、bottom、top、width、height、x、y  不带单位
可以用来计算元素的绝对位置


## JS盒子模型属性
 - client
   - width / height
   - top / left
 - offset
   - width / height
   - top / left
   - parent
 - scroll
   - width / height
   - top / left

### client
获取盒子可视区域的宽高（内容宽度+左右padding）  
1. 内容溢出与否对他无影响
2. 获取的结果是没有单位的（其余的盒模型属性也是）
3. 获取的结果是整数，它会自己进行四舍五入（其余的盒模型属性也是）  
box.clientWidth  
box.clientHeight

获取当前页面一屏幕（可视化）区域的宽高  
let winW = document.documentElement.clientWidth || document.body.clientWidth;  
let winH = document.documentElement.clientHeight || document.body.clientHeight;

获取盒子左边框和上边框的大小(没有右下)  
box.clientLeft  
box.clientTop

### offset
在client的基础上加上border == 盒子本身的宽高  
box.offsetWidth  
box.offsetHeight

offsetParent：获取它的父参照物（不一定是父元素）  
父参照物和它的父元素没有必然的联系，父参照物查找：  
- 同一个平面中，最外层元素是所有后代元素的父参照物，而基于position:relative/absolute/fixed可以让元素脱离文档流（一个新的平面），从而改变元素的父参照物
- document.body.offsetParent === null

offsetTop：距离其父参照物的上偏移  
offsetLeft：距离其父参照物的左偏移（当前元素的外边框到父参照物的里边框）

### scroll
在没有内容溢出的情况下，获取的结果和client是一样的
在有内容溢出的情况下，获取的结果约等于真实内容的宽高（上/左padding + 真实内容的高度/宽度）
1. 不同浏览器获取的结果不尽相同
2. 设置overflow属性值对最后的结果也会产生一定的影响  
box.scrollWidth  
box.scrollHeight

获取整个页面真实的高度:  
document.documentElement.scrollHeight || document.body.scrollHeight

box.scrollTop  竖向滚动条卷去的高度  
box.scrollLeft  横向滚动条卷去的宽度

1. 边界值  min=0 max=整个的高度scrollHeight - 一屏幕高度clientHeight
2. 13个盒子模型属性，只有这两个是“可读写”的属性（既可以获取也可以设置对应的值），
其余的都是“只读”属性（不能设置值，只能获取）

常用：  
盒子：    
回到顶部：box.scrollTop=0  
回到底部：box.scrollTop=box.scrollHeight-box.clientHeight

整个页面：
回到顶部：document.documentElement.scrollTop=0
回到底部：document.documentElement.scrollTop=document.documentElement.scrollHeight-document.documentElement.clientHeight

### css单位
px
绝对单位,传统上一个像素对应于计算机屏幕上的一个点
物理像素：设备屏幕实际拥有的像素点
逻辑像素：也叫“设备独立像素”（Device Independent Pixel, DIP），可以理解为反映在CSS/JS代码里的像素点数
很久之前两者是没有区别的，直到Retina（视网膜技术）技术的兴起，这种技术使用4个乃至更多物理像素来渲染1个逻辑像素，这样一来，同样的CSS代码设置的尺寸，在Retina和非Retina屏幕上看起来大小是一样的，但在Retina屏幕上要精细得多

%
相对单位，父元素宽度的比例

em
相对单位，相对于父元素的字体（font-size）大小（如果有设置）

rem
相对于根元素 html 的 font-size 

vw/vh
基于视窗的宽度/高度计算，1vw/vh等于视窗宽度/高度的百分之一
### 视口
视口(viewport)代表当前可见的计算机图形区域。 在浏览器范畴里，它代表的是浏览器中网站可见内容的部分。视口外的内容在被滚动进来前都是不可见的。
文档的 Element.clientWidth 是指一个文档使用 CSS pixels 单位表示的内部宽度, 包括其 padding (不包括 borders, margins 或垂直滚动条，如果有的话）. 这就是 viewport 的宽度。
Window.innerWidth 是用 CSS pixels 单位表示的浏览器窗口 viewport 宽度，包括垂直滚动条，如果渲染了的话。
Window.outerWidth 是指包括了浏览器外边框的窗口宽度。

Web 浏览器包含两个 viewport，布局视口(layout viewport)和可视视口(visual viewport)。visual viewport 指当前浏览器中可见的部分，并且可以变化。当使用触屏双指缩放，当动态键盘在手机上弹出的时候，或者之前隐藏的地址栏变得可见的时候，visual viewport 缩小了，但是 layout viewport 却保持不变。

innerHeight 和 innerWidth 所组成的区域通常被认为是布局视口(layout viewport) 。 1vh单位是1%布局视口的高度，vw单位与此类似

对于各种不同形状，不同设备像素比移动设备，其浏览器的视口（窗口中显示网页信息的区域）不一定与渲染页面大小相同。移动设备的视口的默认值为 980px，一般情况下都要比这些设备的屏幕尺寸要大。
为了让页面能够全部展示，这些浏览器在渲染时会对页面进行缩放。比如在一个宽 320px 的移动设备显示一个视觉视口宽为 980px 的页面，移动设备浏览器会对这个页面进行缩放直至其视觉视口宽度为 320px（具体取决于浏览器实现）。但直接缩放页面会导致页面字体变小，使得缩放后的页面显示效果都不会很理想。
如果开发者想让移动端浏览器使用屏幕宽度作为视口替换默认的 980px 宽度视口，则可以在 HTML 的头部添加以下标签：
```HTML
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```


### demo
#### 判断用户是否阅读过文本
checkRead = this.scrollHeight - Math.round(this.scrollTop) === this.clientHeight

#### [获取盒子上偏移值](https://github.com/lancertea/javascript-/blob/master/DOM/offset.html)
#### [回到顶部](https://github.com/lancertea/javascript-/blob/master/DOM/top.html)

