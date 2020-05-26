/* 获取数组中的最大值和最小值 */
let ary = [12, 24, 13, 8, 35, 15];

/* 解决方案一：先排序，第一项和最后一项就是我们需要的 */
/* ary.sort(function (a, b) {
	return a - b;
});
let min = ary[0];
let max = ary[ary.length - 1];
console.log(min, max); */

/* 解决方案二： Math.max/Math.min */
//=>Math.max/min要求我们传递的数据是一项项传递进来，获取一堆数中的最大最小，而不是获取一个数组中的最大最小
// let min = Math.min([12, 24, 13, 8, 35, 15]);
// console.log(min);//=>NaN
// let min = Math.min(12, 24, 13, 8, 35, 15);
// console.log(min); //=>8

//1.基于ES6的展开运算符
// let min = Math.min(...ary);
// console.log(min);

//2.利用apply来实现即可（this无所谓，主要是利用apply给函数传参，需要写成一个数组的特征）
// let min = Math.min.apply(Math, ary);
// console.log(min);

/* 解决方案三：假设法（假设第一个是最大的，让数组中的每一项分别和当前假设的值比较，如果比假设的值大，则把最大的值设为新的假设值，继续向后比较即可） */
let max = ary[0];
/* for (let i = 1; i < ary.length; i++) {
	let item = ary[i];
	item > max ? max = item : null;
} */
ary.forEach(item => {
	item > max ? max = item : null;
});
console.log(max); //=>35