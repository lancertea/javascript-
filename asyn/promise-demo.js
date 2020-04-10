function loadImg(src) {
    const p = new Promise(
        (resolve, reject) => {
            const img = document.createElement('img')
            // let img=new Image();
            img.src = src
            img.onload = () => {
                resolve(img)
            }
            img.onerror = () => {
                const err = new Error(`图片加载失败 ${src}`)
                reject(err)
            }

        }
    )
    return p
}

// const url = 'https://img.mukewang.com/5a9fc8070001a82402060220-140-140.jpg'
// loadImg(url).then(img => {
//     console.log(img.width)
//     return img
// }).then(img => {
//     console.log(img.height)
// }).catch(ex => console.error(ex))

const url1 = 'https://img.mukewang.com/5a9fc8070001a82402060220-140-140.jpg'
const url2 = 'https://img3.mukewang.com/5a9fc8070001a82402060220-100-100.jpg'

loadImg(url1).then(img1 => {
    console.log(img1.width)
    return img1 // 普通对象
}).then(img1 => {
    console.log(img1.height)
    return loadImg(url2) // promise 实例
}).then(img2 => {
    console.log(img2.width)
    return img2
}).then(img2 => {
    console.log(img2.height)
}).catch(ex => console.error(ex))

let arr = [
    'http://img1.imgtn.bdimg.com/it/u=3044494920,2934017033&fm=26&gp=0.jpg',
    'http://bos.pgzs.com/rbpiczy/Wallpaper/2013/5/7/0afeab8c217144718bedbd0ea76535db-2.jpg',
    'http://img5.imgtn.bdimg.com/it/u=3006726477,1115289650&fm=26&gp=0.jpg',
    'http://img5.imgtn.bdimg.com/it/u=2134729523,2869252912&fm=26&gp=0.jpg']


// for (let i = 0; i < arr.length; i++)   
for(let i in arr)
{
    loadImg(arr[i]).then(img => {
        img.title="图片"+i;
        document.body.appendChild(img);
    },err=>{
        console.log(err);
        
    })
}