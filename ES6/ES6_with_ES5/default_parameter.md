## default parameter
ES6：
```javascript
function sum(x=1,y=2){
    return x+y;
}
console.log(sum());//3
console.log(sum(3,4));//7
```
ES5:
```javascript
function sum(x = 1, y = 2) {
    (x === undefined) && (x = 1);
    (y === undefined) && (y = 2);
    return x + y;
}
console.log(sum()); //3
console.log(sum(3, 4)); //7
```