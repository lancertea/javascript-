## 作用域
### let
ES6：
```javascript
if (false) {
    let value = 'a';
}
console.log(value); // value is not defined
```
ES5:
```javascript
if (false) {
    var _value = 'a';
}
console.log(value); // value is not defined
```

ES6：
```javascript
var f = [];
for (let i = 0; i < 3; i++) {
    f[i] = function () {
        console.log(i);
    };
}
f[0](); // 0
```
ES5:
```javascript
var f = [];
var loop = function(i) {
    f[i] = function () {
        console.log(i);
    };
};
for (var i = 0; i < 3; i++) {
    loop(i);
}
f[0](); // 0
```

ES6：
```javascript
var a = 5;
var b = 10;

if (a === 5) {
  let a = 4; 
  var b = 1; 

  console.log(a);  // 4
  console.log(b);  // 1
}

console.log(a); // 5
console.log(b); // 1
```
ES5:
```javascript
var a = 5;
var b = 10;
if (a === 5) {
    (function () {
        var a = 4;
        b = 1;
        console.log(a); // 4
        console.log(b); // 1
    })();
}
console.log(a); // 5
console.log(b); // 1
```

### const
ES6：
```javascript
const favorite = 7;
try {
  favorite = 15;
} catch (err) {
  console.log('my favorite number is still: ' + favorite);
  // my favorite number is still:7
}
```
ES5:
```javascript
Object.defineProperty(window, 'favorite', {
        value: 7,
        enumerable: true
    });
    window.favorite = 15;
    console.log(window.favorite);
```
