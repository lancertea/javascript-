1. 写出下面代码输出的结果

```javascript
console.log(a);
var a = 12;
a = 13;
console.log(a);
```

```javascript
console.log(a);
let a = 12;
a = 13;
console.log(a);
```

```javascript
console.log(a);
a = 13;
console.log(a);
```

2. 写出下面代码输出的结果

```javascript
var a = 12;
var a = 13;
console.log(a);
```

```javascript
let a = 12;
let a = 13;
console.log(a);
```

3. 写出下面代码输出的结果

```javascript
console.log(a, b);
var a = 12,
    b = 12;
function fn() {
    console.log(a, b);
    var a = b = 13;
    console.log(a, b);
}
fn();
console.log(a, b);
```

4. 写出下面代码输出的结果

```javascript
console.log(a, b, c);
var a = 12,
    b = 13,
    c = 14;
function fn(a) {
    console.log(a, b, c);
    a = 100;
    c = 200;
    console.log(a, b, c);
}
b = fn(10);
console.log(a, b, c);
```

5. 写出下面代码输出的结果

```javascript
console.log(a);
if(!('a' in window)){
	var a = 13;
}
console.log(a);
```

6. 写出下面代码输出的结果

```javascript
fn();
function fn(){ console.log(1); }
fn();
function fn(){ console.log(2); }
fn();
var fn = function(){ console.log(3); }
fn();
function fn(){ console.log(4); }
fn();
function fn(){ console.log(5); }
fn();
```

7. 写出下面代码输出的结果

```javascript
f = function () {return true;}
g = function () {return false;}
~function () {
    if (g() && [] == ![]) {
        f = function () {return false;}
        function g() {return true;}
    }
}();
console.log(f());
console.log(g());
```

8. 写出下面代码输出的结果

```javascript
console.log(typeof a);
```

```javascript
console.log(typeof a);
let a;
```

9. 写出下面代码输出的结果

```javascript
var ary = [12, 23];
function fn(ary) {
    console.log(ary);
    ary[0] = 100;
    ary = [100];
    ary[0] = 0;
    console.log(ary);
}
fn(ary);
console.log(ary);
```

10. 写出下面代码输出的结果（如何查找上级作用域和堆栈内存释放问题）

```javascript
var n = 1;
function fn() {
    var n = 2;
    function f() {
        n--;
        console.log(n);
    }
    f();
    return f;
}
var x = fn();
x();
console.log(n);
```

```javascript
var i = 5;
function fn(i) {
    return function (n) {
        console.log(n + (++i));
    }
}
var f = fn(1);
f(2);
fn(3)(4);
fn(5)(6);
f(7);
console.log(i);
```

```javascript
var i = 20;
function fn() {
    i-=2;
    return function (n) {
        console.log((++i)-n);
    }
}
var f=fn();
f(1);
f(2);
fn()(3);
fn()(4);
f(5);
console.log(i);
```

