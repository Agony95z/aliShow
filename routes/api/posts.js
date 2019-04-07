const express = require('express');
const router = express.Router();
const db = require('../../utils/db');
const upload = require('../../middlewares/upload')
const moment = require('moment');
// 请求会先进入upload.single()中执行  里面的二进制文件会经过中间件解析
router.post('/api/posts/add', upload.single('article_file'), (req, res, next) => {
    // req.body 是通过body-parser解析出来的  body-parser 只能解析请求类型为 x-www-form-urlencoded类型
    // 带有文件的表单请求体 提交的Content-Type 为multipart/form-data类型
    const body = req.body
    const file = req.file
    console.log(body);
    console.log(file)
    // 将数据保存到数据库
    db.query('INSERT INTO `ali_article` SET ?',{
        article_title:body.article_title,
        article_body:body.article_body,
        article_slug:body.article_slug,
        article_cateid:body.article_cateid,
        article_addtime:body.article_addtime,
        article_status:body.article_status,
        article_adminid:req.session.user.admin_id,
        article_file:`/${file.destination}/${file.filename}`
    },(err,ret)=>{
        if(err) {
            return next(err)
        }
        res.send({
            success:true,
            ret
        })
    })
})
// 渲染主页面路由
router.get('/api/posts',(req,res,next)=>{
    let { _page = 1,_limit = 5 } = req.query;
    _page = parseInt(_page);
    _limit = parseInt(_limit);
    db.query('SELECT * FROM `ali_article` LIMIT ?,?',[(_page-1)*_limit,_limit],(err,listRet)=>{
        if(err) {
            return next(err)
        }
        db.query('SELECT COUNT(*) as `count` FROM `ali_article`',(err,retSum)=>{
            if(err) {
                return next(err)
            }
            res.send({
                success:true,
                data:{
                    listRet,
                    retSum:retSum[0].count
                }
            })

        })
    })
})
module.exports = router;