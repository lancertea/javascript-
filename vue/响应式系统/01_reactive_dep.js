class Dep {
    constructor(){
        this.subscribers = new Set();
    }
    addEffect(effect){
        this.subscribers.add(effect);
    }
    notify(){
        this.subscribers.forEach(effect=>{
            effect();
        })
    }
}

const info = {counter:100}
const dep = new Dep();


function doubleCounter(){
    console.log('doubleCounter', info.counter * 2);
}

function powerCounter(){
    console.log('powerCounter', info.counter * info.counter);
}

// 1.手动添加订阅者
// dep.addEffect(doubleCounter);
// dep.addEffect(powerCounter);

// 2.使用 watchEffect 自动添加订阅者
// 3. 想要实现在执行dep的某个方法时，不需要依赖effect，就可以将依赖收集到Set中，见02
function watchEffect(effect) {
    dep.addEffect(effect);
}

watchEffect(doubleCounter);
watchEffect(powerCounter);




info.counter++;
// 通知所有的订阅者
dep.notify();