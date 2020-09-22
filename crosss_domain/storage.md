## 存储
本地存储 VS 服务器存储
> 本地存储：把信息存储在客户端本地
> 谷歌控制台Application中都可以查看到
- cookie
- H5中WebStorage：localStorage / sessionStorage
- 本地数据库存储：IndexDB
- 本地缓存存储：manifest
- ...

> 服务器存储：把数据存储在服务器端
- 数据库存储：SQLSERVER / MYSQL / ORACLE / MONGODB ...
- REDIS
- SESSION
- ...

### 本地存储
什么时候会用到本地存储？本地存储的作用？ 
1. 记住用户名和密码（或者自动登录）
2. 未登录状态下，加入购物车的信息一般也先存储在本地，当登录后，把信息存储到服务器上（目的是多平台数据共享）
3. 对于非实时刷新数据，我们可以在从服务器把数据获取到后，临时存储在本地（设置有效时间），在有效时间内页面刷新，不再重新从服务器获取数据，而是读取本地数据；超过有效时间重新从服务器拉取...  “前端性能优化的一点”
4. 实现同一个网站不同页面之间的信息共享和通信
......
        
本地存储到底存储在哪了？
1. 本地存储是受浏览器限制的，例如：在谷歌中存储的数据，在IE中获取不到
2. 受源(域)的限制，例如：都是用谷歌浏览器，我在京东下存储的数据，在百度中是获取不到的
        
本地存储的信息在控制台中可以查看到（而且是明文存储），所以敏感的数据尽可能不要存储在本地，非要存储也要做安全处理（例如：加密）

#### cookie localStorage 和sessionStorage
[向本地存储的信息都是string字符串格式]
cookie本身用于浏览器和server通讯，2010年HTML5刚出来，后两个不普及，被“借用”到本地存储来，可用document.cookie='...'来修改———键值对赋值方式 （同个key会覆盖）  
localStorage 和sessionStorage是HTML5专门为存储而设计的
共同点：三者都存在客户端 （浏览器）而且同源：同协议 同域名 同端口
不同点：
1. cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密），cookie数据始终在同源的http请求中携带（即使不需要），会在服务器和客户端间传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。
2. 存储大小：cookie不能超过4k，而且存在在设定的path下。sessionStorage和localStorage可以达到5M或更大。
3. 数据有限期：cookie若未设置过期时间，则保存在内存中，浏览器关闭后销毁。若设置了过期时间，则保存在系统硬盘中，直到过期时间结束后才消失，即使窗口关闭或浏览器关闭。 但是一般不等到时间可能就没了（例如：清除浏览器的缓存或者历史信息、安全卫士在清理电脑垃圾等操作时，都有可能会把存储的cookie给清除掉），但是这些操作对sessionStorage、localStorage没有影响
sessionStorage：仅在当前浏览器窗口关闭前有效(当前页面刷新，存储信息还在)    
localStorage：始终有效，无过期时间，窗口或浏览器关闭也一直保存除非主动删除数据或浏览器卸载，因此用作持久数据
4. 作用域不同：sessionStorage是仅在当前的会话窗口有效，不是所有窗口都可以共享数据的。其它两个是整个浏览器（同源窗口）都可以数据共享，localStorage在同源文档之间共享，cookie在同源且符合path规则的文档之间共享
5. 本地存储的易用性：cookie只能用document.cookie=‘...’来修改，太过简陋，需要前端开发者自己封装setCookie，getCookie。sessionStorage和localStorage的API简单易用。setItem，getItem，removeItem，clear等方法 
```javaScript
/*
 * 设置cookie  =>jquery.cookie.js
 *    document.cookie="[key]=[value];..." 
 */
$.cookie('username', 'JANE');
console.log($.cookie('username'));
$.removeCookie('username');
$.cookie('username', 'JACK', {
	expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
});

setItem([key],[value]) 存储信息  
getItem([key]) 获取信息  
removeItem([key]) 移除某一项信息  
clear() 清除所有存储的信息  
```

    