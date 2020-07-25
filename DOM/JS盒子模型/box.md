### JS中的DOM操作：盒子模型属性
> DOM：document object model 文档对象模型，提供系列的属性和方法，让我们能在JS中操作页面中的元素

#### 获取元素的属性和方法
```javascript
//方法
document.getElementById([ID])
document.getElementsByName([NAME])///=>在IE浏览器中只对表单元素的NAME有作用
document.queryselector([SELECTOR])//=>在IE6~8中不兼容
document.queryselectorAll([SELECTPR])//=>在IE6~8中不兼容
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
firstChild/firstElementChild
lastChild/lastElementChild
previousSibling/previousElementSibling
nextSibling/nextElementSibling
//=>所有带Element的，在IE6~8中不兼容
```
#### DOM的增删改操作
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
#### DOM的增删改操作
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
#### JS盒子模型属性
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

##### client
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

#### offset
在client的基础上加上border == 盒子本身的宽高  
box.offsetWidth  
box.offsetHeight

offsetParent：获取它的父参照物（不一定是父元素）  
父参照物和它的父元素没有必然的联系，父参照物查找：  
- 同一个平面中，最外层元素是所有后代元素的父参照物，而基于position:relative/absolute/fixed可以让元素脱离文档流（一个新的平面），从而改变元素的父参照物
- document.body.offsetParent === null

offsetTop：距离其父参照物的上偏移  
offsetLeft：距离其父参照物的左偏移（当前元素的外边框到父参照物的里边框）

#### scroll
在没有内容溢出的情况下，获取的结果和client是一样的
在有内容溢出的情况下，获取的结果约等于真实内容的宽高（上/左PADDING + 真实内容的高度/宽度）
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


