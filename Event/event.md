# 事件
## 事件及事件绑定
[事件] 是元素天生自带的默认操作行为，不论我们是否给其绑定了方法，当我们操作的时候，也会把对应的事件触发   
[事件绑定] 是给元素的某个行为绑定一个方法,目的是当事件行为触发的时候，可以做一些事情

## 常用的事件行为
  [鼠标事件]  
    click 点击（移动端click被识别为单击）  
    dblclick 双击  
    mousedown 鼠标按下  
    mouseup  鼠标抬起  
    mousemove 鼠标移动  
    mouseover 鼠标滑过  
    mouseout  鼠标滑出  
    mouseenter 鼠标进入  
    mouseleave 鼠标离开  
    mousewhell 鼠标滚轮滚动  

  [键盘事件]  
    keydown 按下某个键  
    keyup 抬起某个键  
    keypress 除Shift/Fn/CapsLock键以外，其它键按住（连续触发）  

  [移动端手指事件]  
  - 单手指事件模型 Touch  
       touchstart 手指按下  
       touchmove 手指移动  
       touchend  手指松开  
       touchcancel 操作取消（一般应用于非正常状态下操作结束）  
  - 多手指事件模型 Gesture
       gesturestart  
       gesturechange / gestureupdate  
       gestureend  
       gesturecancel  

  [表单元素常用事件]  
    focus 获取焦点  
    blur 失去焦点  
    change 内容改变  

  [音视频常用事件]  
    canplay  可以播放（资源没有加载完，播放中可能会卡顿）  
    canplaythrough 可以播放（资源已经加载完，播放中不会卡顿）  
    play 开始播放  
    playing 播放中  
    pause 暂停播放  
     
  [其它常用事件]  
    load 资源加载完  
    unload 资源卸载  
    beforeunload 当前页面关闭之前  
    error 资源加载失败  
    scroll 滚动事件  
    readystatechange AJAX请求状态改变事件  
    contextmenu 鼠标右键触发  

查看事件的方式：     
https://developer.mozilla.org/zh-CN/docs/Web/Events
或者查看元素的属性（属性中onxxx就是元素拥有的事件行为）


## DOM0事件绑定 VS DOM2事件绑定
### DOM0
  元素.on事件行为=function(){}

DOM0事件绑定的原理：给元素(box)的私有属性赋值，当事件触发，浏览器会帮我们把赋的值执行，
但是这样也导致 “只能给当前元素某一个事件行为绑定一个方法”
```javaScript
box.onclick = function () {
			console.log('哈哈哈~~');
}
box.onclick = function () {
			console.log('呵呵呵~~');//'呵呵呵~~'
} 

box.onclick = function () {
	console.log('哈哈哈~~');//'哈哈哈~~'
	//=>移除事件绑定：DOM0直接赋值为null即可
	box.onclick = null;
} 
```
### DOM2
  元素.addEventListener(事件行为,function(){},true/false)  
  IE6~8中：元素.attachEvent('on事件行为',function(){})

DOM2事件绑定的原理：基于原型链查找机制，找到EventTarget.prototype上的方法并且执行，此方法执行，会把给当前元素某个事件行为绑定的所有方法，存放到浏览器默认的事件池中（绑定几个方法，会向事件池存储几个），当事件行为触发，会把事件池中存储的对应方法，依次按照顺序执行 “给当前元素某一个事件行为绑定多个不同方法” 
```javaScript
box.addEventListener('click', function () {
			console.log('哈哈哈~~');//'哈哈哈~~'
		}, false);
box.addEventListener('click', function () {
			console.log('呵呵呵~~');//'呵呵呵~~'
		}, false); 

//=>DOM2事件绑定的时候，我们一般都采用实名函数
//=>目的：这样可以基于实名函数去移除事件绑定
function fn() {
  console.log('哈哈哈~~');
//=>移除事件绑定：从事件池中移除，所以需要指定好事件类型、方法等信息（要和绑定的时候一样才可以移除）
  box.removeEventListener('click', fn, false);
}

box.addEventListener('click', fn, false); 


function fn1(){ console.log(1); }
function fn2(){ console.log(2); }
function fn3(){ console.log(3); }
box.addEventListener('click', fn2, false); 
box.addEventListener('click', fn3, false); 
box.addEventListener('click', fn1, false); 
//=>基于addEventListener向事件池增加方法，存在去重的机制 “同一个元素，同一个事件类型，在事件池中存储一遍这个方法，不能重复存储”
box.addEventListener('click', fn1, false); 
box.addEventListener('mouseover', fn1, false);  
```

DOM0和DOM2可以混在一起用：执行的顺序以绑定的顺序为主 
```javaScript
box.addEventListener('click', function () {
			console.log('哔咔哔咔~~');//'哔咔哔咔~~'
		});
box.onclick = function () {
			console.log('哇咔咔~~');//'哇咔咔~~'
		}
box.addEventListener('click', function () {
			console.log('call~~');//'call~~'
		}); 
```
DOM0中能做事件绑定的事件行为，DOM2都支持；DOM2里面一些事件，DOM0不一定能处理绑定，例如：transitionend、DOMContentLoaded... 
```javaScript
box.style.transition = 'opacity 1s';
// box.ontransitionend = function () {
// 			console.log('哇咔咔~~');
// 		} 
box.addEventListener('transitionend', function () {
			console.log('哇咔咔~~');//'哇咔咔~~'
		}); 

window.addEventListener('load', function () {
			//=>所有资源都加载完成触发
			console.log('LOAD');
    });
window.addEventListener('DOMContentLoaded', function () {
			//=>只要DOM结构加载完就会触发
			console.log('DOMContentLoaded');
		}); 
```

### window.onload VS $(document).ready()
1. $(document).ready() 采用的是DOM2事件绑定，监听的是DOMContentLoaded这个事件，所以只要DOM结构加载完成就会被触发执行，而且同一个页面中可以使用多次（绑定不同的方法，因为基于DOM2事件池绑定机制完成的）
2. window.onload必须等待所有资源都加载完成才会被触发执行，采用DOM0事件绑定，同一个页面只能绑定一次（一个方法），想绑定多个也需要改为window.addEventListener('load', function () {})DOM2绑定方式

##  事件对象
给元素的事件行为绑定方法，当事件行为触发，方法会被执行，不仅被执行，而且还会把当前操作的相关信息传递给这个函数 =>“事件对象”
例如：  
如果是鼠标操作，获取的是MouseEvent类的实例 =>鼠标事件对象
鼠标事件对象 -> MouseEvent.prototype -> UIEvent.prototype -> Event.prototype -> Object.prototype  
如果是键盘操作，获取的是KeyboardEvent类的实例 =>键盘事件对象
```javaScript
box.onclick = function (ev) {
	//=>鼠标事件对象
	// clientX/clientY：当前鼠标触发点距离当前窗口左上角的X/Y轴坐标
	// pageX/pageY：触发点距离当前页面左上角的X/Y轴坐标
	// type：触发事件的类型
	// target：事件源（操作的是哪个元素，哪个元素就是事件源），在不兼容的浏览器中可以使用srcElement获取，也的是事件源
	// preventDefault()：用来阻止默认行为的方法，不兼容的浏览器中用ev.returnValue=false也可以阻止默认行为
	// stopPropagation()：阻止冒泡传播，不兼容的浏览器中用ev.cancelBubble=true也可以阻止默认行为
	// console.log(ev);
} 
```
事件对象和函数以及给谁绑定的事件没啥必然关系，它存储的是当前本次操作的相关信息，操作一次只能有一份信息，
所以在哪个方法中获取的信息都是一样的；第二次操作，存储的信息会把上一次操作存储的信息替换掉...；

每一次事件触发，浏览器都会这样处理一下
  1. 捕获到当前操作的行为（把操作信息获取到），通过创建MouseEvent等类的实例，得到事件对象EV
  2. 通知所有绑定的方法（符合执行条件的）开始执行，并且把EV当做实参传递给每个方法，所以在每个方法中得到的事件对象其实是一个
  3. 后面再重新触发这个事件行为，会重新获取本次操作的信息，用新的信息替换老的信息，然后继续之前的步骤...
```javaScript
box.onclick = function (ev) {
    let obj = null;
		box.addEventListener('click', function (ev) {
			console.log(ev);
			obj = ev;
		});
		box.addEventListener('click', function (ev) {
			console.log(ev === obj); //=>true
		});
		document.body.onclick = function (ev) {
			console.log(ev === obj); //=>true
		} 
} 
```

### IE和W3C的事件处理区别
绑定事件  
W3C： targetEl.addEventListener('event',handler,false)  
IE: targetEl.attachEvent('onEvent',handler)  

删除事件  
W3C： targetEl.removeEventListener('event',handler,false)  
IE: targetEl.detachEvent('onEvent',handler) 

事件对象  
W3C： ev  
IE: window.event

事件目标（事件源）  
W3C: ev.target   
IE: window.event.srcElement

阻止事件默认行为  
W3C： ev.preventDefault()  
IE: window.event.returnValue = 'false' 

阻止事件传播  
W3C： ev.stopPropagation()  
IE: window.event.cancelBubble = 'true'

## 常见事件行为
### [a标签默认行为](https://github.com/lancertea/javascript-/blob/master/Event/preventDefault.html)
### [mouseover和mouseenter的本质区别](https://github.com/lancertea/javascript-/blob/master/Event/mouseover_mouseenter.html)

## 事件传播
### [事件传播机制](https://github.com/lancertea/javascript-/blob/master/Event/event_model.html)


## 用例
### [推箱子](https://github.com/lancertea/javascript-/blob/master/Event/box.html)





