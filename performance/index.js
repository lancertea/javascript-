//1
const img1 = document.getElementById('img1')
img1.onload = function () {
    console.log('img loaded')
}

//2
window.addEventListener('load', function () {
    console.log('window loaded')
})


//3
document.addEventListener('DOMContentLoaded', function () {
    console.log('dom content loaded')
})

//3最快，1等图片加载完显示，2等全部图片加载完显示