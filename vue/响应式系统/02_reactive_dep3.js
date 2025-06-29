class Dep {
  constructor() {
    this.subscribers = new Set();
  }
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

let activeEffect = null;
function watchEffect(effect) {
    activeEffect = effect;
    dep.depend();
    // 首次执行
    effect();
    activeEffect = null;
}

const info = { counter: 100 };
//3的问题是不管什么值发生变化，watchEffect都会执行
// 想要在只有watchEffect依赖的值发生变化时，才执行对应的effect:03
// const info = reactive({counter: 100, name: "why"});
const dep = new Dep();

function doubleCounter() {
  console.log("doubleCounter", info.counter * 2);
}

function powerCounter() {
  console.log("powerCounter", info.counter * info.counter);
}

watchEffect(doubleCounter);
watchEffect(powerCounter);

info.counter++;
// 通知所有的订阅者
dep.notify();
