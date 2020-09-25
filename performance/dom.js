// 减少 DOM 操作次数的良方是 DocumentFragment；
//缩短循环时间需要考虑使用分治的思想把 30000 个 <li> 分批次插入到页面中，
//每次插入的时机是在页面重新渲染之前，采用 requestAnimationFrame 
(() => {
    const ndContainer = document.getElementById('js-list');
    if (!ndContainer) {
        return;
    }

    const total = 30000;
    const batchSize = 4; // 每批插入的节点次数，越大越卡
    const batchCount = total / batchSize; // 需要批量处理多少次
    let batchDone = 0;  // 已经完成的批处理个数

    function appendItems() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < batchSize; i++) {
            const ndItem = document.createElement('li');
            ndItem.innerText = (batchDone * batchSize) + i + 1;
            fragment.appendChild(ndItem);
        }

        // 每次批处理只修改 1 次 DOM
        ndContainer.appendChild(fragment);

        batchDone += 1;
        doBatchAppend();
    }

    function doBatchAppend() {
        if (batchDone < batchCount) {
            window.requestAnimationFrame(appendItems);
        }
    }

    // 执行
    doBatchAppend();

    ndContainer.addEventListener('click', function (e) {
        const target = e.target;
        if (target.tagName === 'LI') {
            alert(target.innerHTML);
        }
    });
})();