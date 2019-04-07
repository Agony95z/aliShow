// 提供后台管理系统相关视图渲染路由
const express = require('express');
const router = express.Router();
const db = require('../utils/db')

router.get('/admin',(req,res)=>{
    res.render('admin/index.html');
})
router.get('/admin/login',(req,res)=>{
    res.render('admin/login.html');
})
router.get('/admin/categories',(req,res)=>{
    res.render('admin/categories.html');
})
router.get('/admin/users',(req,res)=>{
    res.render('admin/users.html');
})

router.get('/admin/posts',(req,res)=>{
    res.render('admin/posts.html')
})
router.get('/admin/post/new',(req,res,next)=>{
    db.query('SELECT * FROM `ali_cate`',(err,ret)=>{
        if(err) {
            return next(err)
        }
        res.render('admin/posts-new.html',{
            ret:ret
        })
    })
})

module.exports = router;