## Iterator
遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）；遍历器对象本质上，就是一个指针对象

### 原生具备 Iterator 接口的数据结构
Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象

### 调用 Iterator 接口的场合
解构赋值
扩展运算符
yield*
数组作为参数的场合: for...of、Array.from()、Map()、Set()、WeakMap()、WeakSet()、Promise.all()、Promise.race() 