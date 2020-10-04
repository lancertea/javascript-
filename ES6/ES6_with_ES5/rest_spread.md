## ...
### rest parameters
ES6：
```javascript
function f(x, ...y) {
  // y is an Array
  return x * y.length;
}
console.log(f(3, 'hello', true) === 6);//true
```
ES5:
```javascript
function f(x) {
    var y = [];
    y.push.apply(y, arguments) && y.shift();
    return x * y.length;
}
console.log(f(3, 'hello', true) === 6); //true
```

### spread operator
ES6：
```javascript
function add(a, b) {
  return a + b;
}

let nums = [5, 4];

console.log(add(...nums));
```
ES5:
```javascript
var _toArray = function (arr) {
    return Array.isArray(arr) ? arr : [].slice.call(arr);
};
function add(a, b) {
    return a + b;
}
var nums = [5, 4];
console.log(add.apply(null, _toArray(nums)));
```

