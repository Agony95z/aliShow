const express = require('express');
const path = require('path');
const glob = require('glob');
const session = require('express-session');
const app = express();
const checkLogin = require('./middlewares/check-login')
// 配置session数据持久化
// 参考文档：https://github.com/chill117/express-mysql-session
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'alishow'
});

// ----------------------------
// 配置session
// 配置好之后，这个插件会给req对象添加一个session
// 往session中写入数据：req.session.xxx = xxx;
// 读取session数据： req.session.xxx
// 默认情况下，服务端session数据是保存在内存中，一旦服务器重启，session数据会丢失
app.use(session({
  secret: 'keyboard cat' + (new Date()), //服务端加密小票信息的又一个算法，这里用来设置加密私钥，可以提高加密数据的安全性
  store: sessionStore,
  resave: false,
  saveUninitialized: false,//如果为true，无论你是否存储session数据，都给客户端发一个小票;  如果为false，只有在第一次(登录成功)存储session数据的时候，才会下发小票
  cookie: { maxAge: 60*60*1000*24 } //存储10s 
}))

// 第一个参数用来指定模板文件的后缀名
app.engine('html',require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.use('/public',express.static(path.join(__dirname,'public')));
app.listen(3000,()=>{
    console.log('running is ok http://127.0.0.1:3000');
})
// 解析请求体
// express 已经内置了body-parser
// express通过express.urlencoded()方法包装了body-parser
app.use(express.urlencoded());
// ----------------------------------------------
// 挂载路由接口之前先设置统一校验管理系统的访问权限
// 这里就相当于是所有进入 /admin/xxx 之前的一道关卡
// 说白了就是校验所有以 /admin 开头的这些页面的请求路径 不包含 /admin/login
app.use('/admin',checkLogin({
    app:app
}))

// ----------------------------------------
// 引入路由接口
// app.use(router);
// 路由分类以后  上面的方法已经不再合适  需要引入第三方包 glob来管理
// 自动挂载路由模块  获得routes文件夹中的所有.js文件
const files = glob.sync(path.join(__dirname,'./routes/**/*.js'))
// console.log(files);  //返回一个数组
files.forEach((pathData)=>{
    app.use(require(pathData));
})

// 全局错误处理  设置中间件
// 这个中间件在最后设置，因为不加限制前缀，所有内容过来都会先经过中间件 而这个中间件是为了处理全局错误 ，所以放在最后  返回的next(err) 查找规则  以路由挂载的位置为准  往后查找
// 四个参数一个都不能少
app.use((err,req,res,next)=>{
    res.status(500).send({
        statusCode:500,
        message:'Internal Server Error',
        error:err.message
    })
})