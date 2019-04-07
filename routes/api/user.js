const express = require('express');
const router = express.Router();
const db = require('../../utils/db');
// 导入密码加密模块
const md5 = require('../../utils/md5');
// 查询功能
router.get('/api/users',(req,res,next)=>{
    db.query('SELECT * FROM `ali_admin`',function(err,data){
        if(err) {
           return next(err);
        }
        res.send({
            success:true,
            data
        })
    })
})
// 删除功能
router.get('/api/users/delete',(req,res,next)=>{
    const { id } = req.query;
    // console.log(id);
    db.query('DELETE FROM `ali_admin` WHERE `admin_id`=?',[id],function(err,result){
        if(err) {
            return next(err);
        }
        res.send({
            success:true,
            result
        })
    })
})

// 添加功能
router.post('/api/users/add',(req,res,next)=>{
    const body = req.body;
    console.log(body)
    // 用postman进行接口验证的时候，如果是post请求，而且请求没有带文件，那么普通表单的post提交必须设置提交格式为 key=value&key1=value1  也就是格式为x-www-form-urlencoded
    body.admin_copypwd = body.admin_copypwd;
    // console.log(body);
    // 验证邮箱
    // console.log(body.admin_email)
    db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?',[body.admin_email],(err,result)=>{
      if(err) {
          console.log(111)
          return next(err);
      }
      if(result[0]) {
        return res.send({
            success:false,
            messages:'该邮箱已存在'
        })
      }
    //   验证别名
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?',[body.admin_slug],(err,result)=>{
        if(err) {
            return next(err)
        }
        if(result[0]) {
            return res.send({
                success:false,
                messages:'该别名已经存在'
            })
        }
    })
    // 验证昵称
    db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?',[body.admin_nickname],(err,result)=>{
        if(err) {
            return next(err)
        }
        if(result[0]) {
            return res.send({
                success:false,
                messages:'该昵称已存在'
            })
        }
    })
    // 代码执行到这里，意味着邮箱别名昵称都没有重复  那么执行添加操作
    db.query('INSERT INTO `ali_admin` SET ?',{
        admin_email: body.admin_email,
        admin_slug: body.admin_slug,
        admin_nickname: body.admin_nickname,
        admin_pwd: md5(md5(body.admin_pwd)),
        admin_copypwd: md5(md5(body.admin_copypwd))
    },function(err,result){
        if (err) {
            return next(err);
        }
        res.send({
            success:true,
            result
        })
    })
    })
})

// ajax异步验证邮箱
router.get('/api/users/add/email',(req,res,next)=>{
    const { admin_email } = req.query;
    console.log(admin_email);
    db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?',[admin_email],(err,result)=>{
        if(err) {
            return next(err)
        }
        if(result[0]) {
            return res.send(false)
        } else{
            return res.send(true)
        }
    })
})

// 异步验证别名
router.get('/api/users/add/slug',(req,res,next)=>{
    const { admin_slug } = req.query;
    db.query('SELECT * FROM `ali_admin` WHERE `admin_slug`=?',[admin_slug],(err,result)=>{
        if(err) {
            return next(err)
        }
        if(result[0]) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    })
})

// 异步验证昵称
router.get('/api/users/add/nickname',(req,res,next)=>{
    const { admin_nickname } = req.query;
    db.query('SELECT * FROM `ali_admin` WHERE `admin_nickname`=?',[admin_nickname],(err,result)=>{
        if(err) {
            return next(err)
        }
        if(result[0]) {
            return res.send(false)
        } else {
            return res.send(true)
        }
    })
 })

// ---------------------------------------
// 编辑功能
router.get('/api/users/edit',(req,res,next)=>{
    const { id } = req.query;
    console.log(id);
    db.query('SELECT * FROM `ali_admin` WHERE `admin_id`=?',[id],(err,result)=>{
        if(err) {
            return next(err);
        }
        res.send({
            success:true,
            result:result[0]
        })
    })
    
})

// 更新功能
router.post('/api/users/update',(req,res,next)=>{
    const body = req.body;
    console.log(body);
    db.query('UPDATE `ali_admin` SET `admin_email`=?,`admin_slug`=?,`admin_nickname`=?,`admin_state`=? WHERE `admin_id`=?',[body.admin_email,body.admin_slug,body.admin_nickname,body.admin_state,body.admin_id],function(err,result){
        if(err){
            return next(err);
        }
        res.send({
            success:true,
            result
        })
    })

})

// ----------------------------------------------
// login路由
router.post('/api/users/logintrue',(req,res,next)=>{
    const body = req.body;
    // console.log(body)
    // 验证邮箱是否存在
    db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?',[body.admin_email],(err,result)=>{
        if(err) {
            return next(err)
        } 
        const user = result[0];
        // console.log(user);
        if(!user) {
            return res.send({
                success:false,
                messages:'用户不存在'
            })
        }
        // 验证密码是否正确
        if(md5(md5(body.admin_pwd)) !== user.admin_pwd) {
            return res.send({
                success:false,
                messages:'密码错误,请重新输入'
            })
        }
        // 代码运行到这里意味着数据正确，可以给浏览器设置session来保存用户登录信息
        // saveUninitialized: false, app.use(session({}))中的这个如果设置为false 如果此时不设置存储session数据  那么浏览器端拿不到cookie
        req.session.user = user;
        // console.log(req.session);  //打印的内容中包括cookie和自己设置的user

        // console.log(req.session.user); //打印的内容不包括cookie
        
        res.send({
            success:true
        })

    })
})
// ajax异步验证登录界面邮箱
router.post('/api/users/login/email',(req,res,next)=>{
    const { admin_email } = req.body;
    // console.log(admin_email);
    db.query('SELECT * FROM `ali_admin` WHERE `admin_email`=?',[admin_email],(err,result)=>{
        if (err) {
            return next(err)
        }
        if(result[0]) {
            return res.send(true)
        } else {
            return res.send(false)
        }
    })
    
})

module.exports = router;
