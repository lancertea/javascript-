{
    function Cat(color, size) {
        this.color = color;
        this.size = size;

    }

    class Child {
        constructor(num, gender) {
            this.num = num;
            this.gender = gender;
        }

    }
    let c1 = new Cat('black', 'big');
    let joe = new Child(111, 'male');

    let obj = {
        age: 20,
        name: 'xxx',
        a: Symbol("foo"),
        reg: /\d+/,
        address: {
            city: 'beijing'
        },
        s: new Set([1, 2, 3]),
        m: new Map([
            ['num', 10],
            [12, 'jane']
        ]),
        arr: ['a', 'b', 'c'],
        c1,
        joe
    };
    let cloneObj = deepClone(obj);
    console.log(cloneObj);
    cloneObj.address.city = 'shanghai'
    cloneObj.arr[0] = 'a1'
    console.log(obj.address.city)
    console.log(obj.arr[0])


    /**
     * 深拷贝
     * @param {Object} obj 要拷贝的对象
     * 自封装深拷贝 思路：
     *1.判断属性值类型是基本类型和引用类型，还是null，基本类型或null直接赋值
     *2.引用类型判断是对象还是数组，创建对应的空对象或空数组，递归调用函数
     *3.使用for-in遍历对象，因为for-in会遍历原型链上的属性，所以需要判断属性是否在原型链上，不是原型链才拷贝
     * 
     */
    //这种方式不能识别自定义类
    function deepclone(obj = {}) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }
        if (obj instanceof Date) {
            return new Date(obj);
        }
        let res;
        if (obj instanceof Array) {
            res = [];
        } else {
            res = {};
        }

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key] = deepclone(obj[key]);
            }


        }
        return res;
    }


    function deepClone(obj = {}) {
        if (typeof obj !== 'object' || obj === null) {
            // obj 是 null ，或者不是对象和数组，直接返回
            return obj
        }
        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }
        if (obj instanceof Date) {
            return new Date(obj);
        }
        if (obj instanceof Set) {
            return new Set(obj);
        }
        if (obj instanceof Map) {
            return new Map(obj);
        }

        let res;
        if (obj instanceof Array) {
            res = [];
        } else {
            //不直接创建空对象目的：克隆的结果和之前保持相同的所属类
            res = new obj.constructor();
        }
        for (let key in obj) {
            // 保证 key 不是原型的属性
            if (obj.hasOwnProperty(key)) {
                // 递归调用！！！
                res[key] = deepClone(obj[key])
            }
        }
        return res;
    }
}