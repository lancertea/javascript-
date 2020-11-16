// 获取元素
const div1 = document.getElementById('div1')
console.log('div1', div1)

const divList = document.getElementsByTagName('div') // 集合
console.log('divList.length', divList.length)
console.log('divList[1]', divList[1])

const outerList = document.getElementsByClassName('outer') // 集合
console.log('outerList.length', outerList.length)
console.log('outerList[1]', outerList[1])

const pList = document.querySelectorAll('p')
console.log('pList', pList)


//获取属性
const p1 = pList[0]
console.log(window.getComputedStyle(p1));

// property 形式
p1.style.width = '100px'
console.log(p1.style.width)
p1.style.color='blue'
p1.className = 'red'
console.log(p1.classNameqi)
console.log(p1.nodeName)
console.log(p1.nodeType) // 1

console.log(div1.childNodes);//NodeList(7) [text, p#p1.red, text, p, text, p, text]
console.log(div1.children);//HTMLCollection(3) [p#p1.red, p, p, p1: p#p1.red]
console.log(div1.parentNode);//<body></body>
console.log(div1.firstChild);//#text
console.log(div1.firstElementChild);//p1
console.log(div1.lastChild);//#text
console.log(div1.lastElementChild);//p3


// attribute
// p1.setAttribute('data-name', 'im')
// console.log( p1.getAttribute('data-name') )
// p1.setAttribute('style', 'font-size: 50px;')
// console.log( p1.getAttribute('style') )
