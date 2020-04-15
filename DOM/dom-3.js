// // DOM查询做缓存
//不缓存DOM查询结果
for(let i=0;i<document.getElementsByTagName('p').length;i++){
    //每次循环，都会计算length，频繁进行DOM查询
}

//缓存DOM查询结果
const pList =document.getElementsByTagName('p')
const length =pList.length
for(let i=0;i<length;i++){
    //缓存length,只进行一次DOM查询
}


//将频繁操作改为一次性操作
const list = document.getElementById('list')

// 创建一个文档片段（这个片段在JS内存中），此时还没有插入到 DOM 结构中
const frag = document.createDocumentFragment()

for (let i  = 0; i < 20; i++) {
    const li = document.createElement('li')
    li.innerHTML = `List item ${i}`

    // 先插入文档片段中
    frag.appendChild(li)
}

// 都完成之后，再统一插入到 DOM 结构中
list.appendChild(frag)

console.log(list)
