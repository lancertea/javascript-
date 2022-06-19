## import 用法及注意事项
1.不同于commonJS, 需要写完整名称
```javascript
// import { name } from './module'
import { name } from './module.js'
console.log(name)
```
```javascript
// import { lowercase } from './utils'
import { lowercase } from './utils/index.js'
console.log(lowercase('HHH'))
```
2.相对路径不能省略./，会被视作加载第三方模块
3.可以使用绝对路径（CDN上的模块可直接通过这种方式引用）
```javascript
// import { name } from 'module.js'
import { name } from './module.js'
import { name } from '/04-import/module.js'
import { name } from 'http://localhost:3000/04-import/module.js'
console.log(name)
```
4.加载这个模块，但不提取它
```javascript
import {} from './module.js'
import './module.js'
```

5.导入所有成员
```javascript
import * as mod from './module.js'
console.log(mod)
```

6.地址是一个变量或者当需要满足特定条件的情况下再引入某个模块时，可使用import()动态导入模块
```javascript
//import只能出现在最顶层
var modulePath = './module.js'
import { name } from modulePath
console.log(name)

if (true) {
  import { name } from './module.js'
}

//import（）返回一个promise
import('./module.js').then(function (module) {
  console.log(module)
})
```

7.同时导入具名成员和默认成员
```javascript
import { name, age, default as title } from './module.js'
import abc, { name, age } from './module.js'
console.log(name, age, abc)
```