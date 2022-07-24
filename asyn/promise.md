## promise基础语法
promise
优点：将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。Promise对象提供的接口，使得控制异步操作更加容易
缺点：
1. 无法取消Promise，一旦新建它就会立即执行，无法中途取消
2. 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
3. 当处于pending状态时，无法得知目前进展到哪一个阶段

```javascript
 let promiseExamp = new Promise(); //=>Uncaught TypeError: Promise resolver undefined is not a function
```
new Promise([executor]):第一个执行函数必须传递  
Promise是用来管理异步编程的，它本身不是异步的：new Promise的时候会立即把executor函数执行
（只不过我们一般会在executor函数中处理一个异步操作）
[executor 简称EXE]
1. new Promise的时候就会把EXE执行，创建Promise的一个实例（EXE是Promise类的一个回调函数，Promise内部会把它执行）
2. Promise不仅把EXE执行，而且还给EXE传递两个参数（两个参数也是函数类型）：
=>resolve函数：它执行代表Promise处理的异步事情是成功的，把Promise的状态改为fulfilled
=>reject函数：它执行代表Promise处理的异步事情是失败的，把Promise的状态改为rejected
3. EXE函数中可以放异步操作事情，用Promise管理异步操作可以在异步操作[结束]之前调用resolve或reject

PROMISE本身有三个状态  =>[[PromiseStatus]]
- pending 初始状态
- fulfilled 代表操作成功（resolved）
- rejected 代表当前操作失败
PROMISE本身有一个VALUE值，用来记录成功的结果（或者是失败的原因的） =>[[PromiseValue]]
```javascript
let p1 = new Promise((resolve, reject) => {
	setTimeout(_ => {
	// 一般会在异步操作结束后，执行resolve/reject函数，执行这两个函数中的一个，都可以修改Promise的[[PromiseStatus]]/[[PromiseValue]]
	// 一旦状态被改变，再执行resolve、reject就没有用了
		resolve('ok');
		reject('no');
	}, 1000);
}); 
```
```javascript
//调用resolve或reject并不会终结Promise的参数函数的执行
new Promise((resolve, reject) => {
	resolve(1);
	console.log(2);
}).then(r => {
	console.log(r);
});
/*
2
1
*/
```		
```javascript
// 2.3.1
let p1 = new Promise(() => {
	setTimeout(_ => {
		console.log(1);
	}, 1000);
		console.log(2);
	});
	console.log(3); 
```		

### 方法
Promise.prototype
- then:设置成功或者失败后执行的方法（成功或者失败都可以设置，也可以只设置一个）
    pro.then([success],[error])
	pro.then([success])
    pro.then(null,[error])
- catch:设置失败后执行的方法（不会阻塞程序继续执行）
- finally:设置不论成功还是失败都会执行的方法（一般不用）
```javascript
let promiseExamp = new Promise((resolve, reject) => {
	setTimeout(() => {
		let ran = Math.random();
		ran < 0.5 ? reject(ran) : resolve(ran);
	}, 1000);
});
promiseExamp.then(result => {
	console.log('成功: ' + result);
});
promiseExamp.catch(error => {
	console.log('失败: ' + error);
});
promiseExamp.finally(x => {
	console.log('哈哈');
});
```	

#### then
then(onResolve,onReject)  
then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。  
new Promise的时候执行executor函数，如果在这里开启了一个异步操作的任务，异步任务末尾放置resolve/reject(此时不等：把其放入到EventQuque任务队列中)，继续执行  
p1.then基于THEN方法，存储起来两个函数（此时这两个函数还没有执行）；
当executor函数中的异步操作结束了，基于resolve/reject控制Promise状态，从而决定执行then存储的函数中的某一个  
```javascript
let p1 = new Promise((resolve, reject) => {
	setTimeout(_ => {
		let ran = Math.random();
		console.log(ran);
		if (ran < 0.5) {
			reject('NO!');
			return;
		}
		resolve('OK!');
	}, 1000);
});

p1.then(result => {
	console.log(`成功：` + result);
}, reason => {
	console.log(`失败：` + reason);
});
```	

```javascript
let p1 = new Promise((resolve, reject) => {
	resolve(100);
});
p1.then(result => {
	console.log("成功" + result);
}, reason => {
	console.log("失败" + reason);
});
console.log(3);
//3 '成功100'
```	

##### then链
- promise对象的then方法会返回一个全新的Promise对象
- 后面的then方法就是在为上一个then返回的promise注册回调
- 前面then方法中回调函数的返回值会作为后面then方法回调的参数
- 如果回调中返回的是promise，那后面then方法的回调会等待它的结束

THEN方法结束都会返回一个新的Promise实例（THEN链）
  [[PromiseStatus]]:'pending'
  [[PromiseValue]]:undefined

以下面例子为例：
- p1这个new Promise出来的实例，成功或者失败，取决于executor函数执行的时候，执行的是resolve(成功)还是reject(失败)决定的，再或者executor函数执行发生异常错误，也是会把实例状态改为失败的

- p2/p3这种每一次执行then返回的新实例的状态，由p1的then中存储的方法执行的结果来决定最后的状态（上一个then中某个方法执行的结果，决定下一个then中哪一个方法会被执行）
=>不论是成功的方法执行，还是失败的方法执行（THEN中的两个方法），凡是执行抛出了异常，则都会把实例的状态改为失败
=>方法中如果返回一个新的PROMISE实例，返回这个实例的结果是成功还是失败，也决定了当前实例是成功还是失败
=>剩下的情况基本上都是让实例变为成功的状态 （方法返回的结果是当前实例的value值：上一个then中方法返回的结果会传递到下一个then的方法中）
```javascript
let p1 = new Promise((resolve, reject) => {
	resolve(100);
});
let p2 = p1.then(result => {
	console.log('成功：' + result);
	return result + 100;
}, reason => {
	console.log('失败：' + reason);
	return reason - 100;
});
let p3 = p2.then(result => {
	console.log('成功：' + result);
}, reason => {
	console.log('失败：' + reason);
}); 
/*
"成功：100"
"成功：200"
*/
```	

```javascript
Promise.resolve(10).then(result => {
		console.log(`成功：${result}`);
		return Promise.reject(result * 10);
	}, reason => {
		console.log(`失败：${reason}`);
	}).then(result => {
		console.log(`成功：${result}`);
	}, reason => {
		console.log(`失败：${reason}`);
	}); 
/*
"成功：10"
"失败：100"
*/
```	

```javascript
new Promise(resolve=>{
	resolve(a);
}).then(result=>{
	console.log(`成功：${result}`);
	return result*10;
	
},reason=>{
	console.log(`失败: ${reason}`);
}).then(result=>{
	console.log(`成功：${result}`);
},reason=>{
	console.log(`失败: ${reason}`);
});
/*
"失败: ReferenceError: a is not defined"
"成功：undefined"
*/
```	

then中也可以只写一个或者不写函数
.then(fn)
.then(null,fn)
遇到一个THEN，要执行成功或者失败的方法，如果此方法并没有在当前THEN中被定义，则顺延到下一个对应的函数
```javascript
Promise.reject(10).then(result => {
	console.log(`成功：${result}`);
	return result * 10;
}).then(null, reason => {
	console.log(`失败：${reason}`);//=>失败：10
}); 
```	

#### catch
```javascript
console.log(a); //=>Uncaught ReferenceError: a is not defined
let b = 10;
console.log(b); 
```	
在JS中当前行代码报错，会中断主线程的渲染（下面代码将不再执行）  
throw new Error('')：手动抛出一个异常错误，目的就是让后面代码不再执行  
如果上面代码报错，不想让期影响后面的代码，我们需要做异常捕获：try catch finally  
```javascript
try {
	console.log(a);
} catch (e) {
	//=>错误信息
	console.log(e.message);
}
let b = 10;
console.log(b); 
```	
Promise对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。  
catch()方法返回的还是一个Promise对象，因此后面还可以接着调用then()方法  
如果没有报错，则会跳过catch()方法
```javascript
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
});
};

    someAsyncThing()
    .catch(function(error) {
        console.log('oh no', error);
    })
    .then(function() {
        console.log('carry on');
    });
// oh no [ReferenceError: x is not defined]
// carry on 
```	
除此之外还可以全局注册unhandlerejection事件去捕获异常(不推荐)
```javascript
window.addEventListener('unhandlerejecttion',event=>{
	const { reason, promise } = event;
	console.log(reason,promise);
	// reason =>  Promise失败原因，一般是一个错误对象
	// promise => 出现异常的 Promise 对象
	event.preventDefault()
},false)
```		

#### all
Promise.all([promise1, promise2, ...])： ALL中存放的是多个PROMISE实例（ 每一个实例管理者一个异步操作），
执行ALL方法返回的结果是一个新的PROMISE实例 "PROA" *
- 当所有PROMISE实例的状态都为Fulfilled的时候(成功)， 让PROA的状态也变为Fulfilled, 并且把所有PROMISE成功获取的结果，存储为成为一个数组（ 顺序和最开始编写的顺序一致）“ result = [result1, result2, ...]”， 让PROA这个数组的VALUE值等于这个数组 *
- 都成功（ PROA状态是FUFILLED） 才会通知THEN中第一个方法执行， 只要有一个失败（ PROA状态是REJECTED），就会通知THEN中第二个方法或者CATCH中的方法执行

```javascript
Promise.all([ajax1(), ajax3(), ajax2()]).then(results => {
	//=>results:[result1,result3,result2]
});

Promise.race([ajax1(), ajax3(), ajax2()]).then(result => {
	//=>看哪一个PROMISE状态最先处理完（成功或者失败），以最先处理完的为主
});
```	
