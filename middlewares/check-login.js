module.exports = function (option) {
    return (req, res, next) => {
        const url = req.originalUrl
        // console.log(url);
        // 1.如果当前请求路径是/admin/login ，则说明不用处理，允许通过

        if (url === '/admin/login') {
            // 调用next 会往后找与当前请求匹配的路由处理函数
            // 例如当前请求的是 /admin/login 那么这里的next会找到后面的一个路径是 /admin/login的路由去处理
            return next()
        }
        // 2.如果是非 /admin/login 请求路径  则校验登录状态
        const sessionUser = req.session.user;
        // 如果没有登录  则让用户跳转到登录页
        if (!sessionUser) {
            return res.redirect('/admin/login');
        }
        // app.locals 对象中的数据可以在res.render 渲染的任何页面中直接使用
        option.app.locals.sessionUser = sessionUser;
        // 代码执行到这里意味着用户已经登录了，调用next()放行，自行查找自己对应的路径
        next();
    }
}