/* eslint-disable */
//ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效。

{
  // ES5\ES3 默认参数的写法
  function f(x, y, z) {
    if (y === undefined) {
      y = 7;
    }
    if (z === undefined) {
      z = 42
    }
    return x + y + z
  }
console.log(f(1));//50
console.log(f(1, 3));//46
} 

{
function a(x,y){
  x=x||1;
  y=y||2;
  return x*y;
  }
console.log(a(2));//4

}



{
  // ES6 默认参数
  function f(x, y = 7, z = 42) {
    return x + y + z
  }
  console.log(f(1, 3));//46
}

// 必填参数的检查
{
  function checkParameter() {
    throw new Error('can\'t be empty')
  }
  function f(x = checkParameter(), y = 7, z = 42) {
    return x + y + z
  }
  console.log(f(1));//50
  try {
    f()
  } catch (e) {
    console.log(e);
  } finally {}
} 
//可选参数
{
function sum(x,y,{m,n}={}){
  console.log(x,y,m,n); 
}
sum(1,2);//1 2 undefined undefined
}

{
// 不确定参数有几个，但是要对他们求和  
  // ES3,ES5 可变参数
  function f() {
    var a = Array.prototype.slice.call(arguments);
    var sum = 0;
    a.forEach(function(item) {
      sum += item * 1;
    })
    return sum
  }
  console.log(f(1, 2, 3, 6));//12
}

{
  // ES6 可变参数
  function f(...a) {
    var sum = 0;
    a.forEach(item => {
      sum += item * 1
    });
    return sum
  }
  console.log(f(1, 2, 3, 6));//12
} 

{
  // ES5 合并数组
  var params = ['hello', true, 7];
  var other = [1, 2].concat(params);
  console.log(other);//[ 1, 2, "hello", true, 7 ]
} 

{
  // ES6 利用扩展运算符合并数组
  var params = ['hello', true, 7];
  var other = [
    1, 2, ...params
  ];
  console.log(other);//[ 1, 2, "hello", true, 7 ]
}
