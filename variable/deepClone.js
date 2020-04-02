/**
 * 深拷贝
 */

const obj1 = {
    age: 20,
    name: 'xxx',
    address: {
        city: 'beijing'
    },
    arr: ['a', 'b', 'c']
}

// 浅拷贝
// const obj2 = obj1
// obj2.address.city = 'shanghai'
// console.log(obj1.address.city)//shanghai

const obj2 = deepClone(obj1)
obj2.address.city = 'shanghai'
obj2.arr[0] = 'a1'
console.log(obj1.address.city)
console.log(obj1.arr[0])


/**
 * 深拷贝
 * @param {Object} obj 要拷贝的对象
 * 自封装深拷贝 思路：
 *1.判断属性值类型是基本类型和引用类型，还是null，基本类型或null直接赋值
 *2.引用类型判断是对象还是数组，创建对应的空对象或空数组，递归调用函数
 *3.使用for-in遍历对象，因为for-in会遍历原型链上的属性，所以需要判断属性是否在原型链上，不是原型链才拷贝
 * 
 */
function deepClone(obj ={}) {
    if (typeof obj !== 'object' || obj == null) {
        // obj 是 null ，或者不是对象和数组，直接返回
        return obj
    }

    // 初始化返回结果
    let result

    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        // 保证 key 不是原型的属性
        if (obj.hasOwnProperty(key)) {
            // 递归调用！！！
            result[key] = deepClone(obj[key])
        }
    }

    // 返回结果
    return result
}