### 异步编程
ES6 诞生以前，异步编程的方法，大概有下面四种。
回调函数
事件监听
发布/订阅
Promise 对象

同步
```javascript
f1()
f2()
```

#### 回调函数
```javascript
f1(
  ...
  f2()
)
```
回调函数本身并没有问题，它的问题出现在多个回调函数嵌套。
多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数，可能都要跟着修改。这种情况就称为"回调函数地狱"（callback hell）。
而且每个任务只能指定一个回调函数


#### 事件监听
```javascript
f1.on('done',f2);
```
采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。为f1（每个任务）绑定一个事件
这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"去耦合"（Decoupling），有利于实现模块化。
缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。

#### 发布/订阅
上面的"事件"，完全可以理解成"信号"。假定存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"发布/订阅模式"（publish-subscribe pattern），又称"观察者模式"（observer pattern）。
这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

#### promise
```javascript
f1().then(f2);
```
Promise 对象就是为了解决这个问题而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。
有了promise对象，可以将异步操作以同步的流程表达出来，避免了回调地狱（通过回调函数延迟绑定和返回值穿透）和多次错误处理（通过错误“冒泡”技术）。它实际上解决的是异步编程风格问题

缺点：
1. 无法取消Promise，一旦新建它就会立即执行，无法中途取消
2. 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
3. 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）
4. 代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚

#### generator
Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。
调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false } -1++=>0
```
```javascript
    function* helloWorldGenerator() {
      let a = yield 'hello';
      console.log(a);
      let b = yield 'world';
      console.log(b);
      let c = yield 'ending';
      console.log(c);
    }

    var hw = helloWorldGenerator();

    hw.next(1)
    // { value: 'hello', done: false }

    hw.next(2)
    // 2
    // { value: 'world', done: false }

    hw.next(3)
    // 3
    // { value: 'ending', done: false }

    hw.next(4)
    // 4
    // { value: undefined, done: true }
```

for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。
```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```
next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。
next()是将yield表达式替换成一个值。
throw()是将yield表达式替换成一个throw语句。
return()是将yield表达式替换成一个return语句。

虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。


## 生成器函数回顾
```javascript
function * foo(){
  console.log('start');
}

//调用生成器函数并不会立即执行这个函数，而是返回一个生成器对象
const generator = foo(); //

//直到手动调用next方法，才会执行
generator.next(); //start
```

```javascript
function * foo(){
  console.log('start');
  const res = yield 'foo'; //此时暂停到了这一句，等待一下次调用next（）方法
  console.log('test');
  console.log(res);
}

const generator = foo(); 

//可通过调用next()返回yield后面的返回值，及生成器是否遍历结束的状态
const res = generator.next(); //start
console.log(res); //{value: 'foo', done: false}

generator.next('bar') //给next传值可以被外面获取到
```

```javascript
function * foo(){
  console.log('start');
  try{
     const res = yield 'foo'; 
     console.log(res);
  }catch(e){
    console.log(e); //err
  }
}

const generator = foo(); 

const res = generator.next(); //start
console.log(res); //{value: 'foo', done: false}

generator.throw(new Error('err')); //外部向内部抛出异常
```

```javascript
function * foo(){
  console.log('start');
     const res = yield 'foo';
     console.log('test'); 
     console.log(res);
}

const generator = foo(); 

const res = generator.next(); //start
console.log(res); //{value: 'foo', done: false}

generator.return('123'); 
```

generator配合promise的异步解决方案
```javascript
function ajax(url){
  if(url.includes('users')){
    return [{name:'a',age:12}, {name:'b',age:13}]
  }
  return [{name:'c',age:12}, {name:'d',age:13}]
}
function * main(){
     const users = yield ajax('/api/users.json');
     console.log(users);

     const posts = yield ajax('/api/posts.json');
     console.log(posts);
}

const g = main(); 

const res = g.next();
//如果value返回的是一个promise对象
res.value.then(data=>{
  const res2 = g.next(data);
  if(res2.done) return;
  res2.value.then(data=>{
    g.next(data)
  })
})
```

上述更通用的实现
```javascript
function ajax(url){
  if(url.includes('users')){
    return [{name:'a',age:12}, {name:'b',age:13}]
  }
  return [{name:'c',age:12}, {name:'d',age:13}]
}
function * main(){
  try{
     const users = yield ajax('/api/users.json');
     console.log(users);

     const posts = yield ajax('/api/posts.json');
     console.log(posts);

     const urls = yield ajax('/api/urls.json');
     console.log(urls);
  }catch(e){
    console.log(e);
  }
}

function co(generator) {
  const g = generator();
  function handleResult(res) {
    if (res.done) return Promise.resolve(res.value);
    if (!(res.value instanceof Promise)) {
      res.value = Promise.resolve(res.value);
    }
    return res.value.then(data => {
      handleResult(g.next(data))
    }, err => g.throw(err))
  
  return handleResult(g.next())
}

co(main)
```
async await
```javascript
function ajax(url){
  if(url.includes('users')){
    return [{name:'a',age:12}, {name:'b',age:13}]
  }
  return [{name:'c',age:12}, {name:'d',age:13}]
}
async function main(){
  try{
     const users = await ajax('/api/users.json');
     console.log(users);

     const posts = await ajax('/api/posts.json');
     console.log(posts);

     const urls = await ajax('/api/urls.json');
     console.log(urls);
  }catch(e){
    console.log(e);
  }
}

//不需要配合上述类似co的执行器，可以直接调用
//且返回的是一个promise对象
const p = main();
p.then(()=>{
  console.log('end');
})
```
async/await 本质上还是基于 Promise 的一些封装，而 Promise 是属于微任务的一种，所以 await 关键字与Promise.then 效果类似。async 函数在 await 之前的代码都是同步执行的，可以理解成 await 之前的代码属于 new Promsie 时传入的代码，await 之后的所有代码都是在 Promise.then 中的回调
