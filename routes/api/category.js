const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../../utils/db');
// 查询功能
router.get('/api/categories',(req,res)=>{
    db.query('SELECT * FROM `ali_cate`',function(err,data){
        if(err){
            return res.status(500).send( {
                statusCode:500,
                message:'Internal Server Error',
                error: err.message
            })
        }
        res.send({
            success:true,
            data
        })
    })
})
// 删除功能
router.get('/api/categories/delete',function(req,res,next){
    const { id } = req.query;
    console.log(req.query.id);
    db.query('DELETE FROM `ali_cate` WHERE `cate_id`=?',[id],(err,result)=>{
    if (err) {
        next(err);
    }
    res.send({
        success:true,
        result
    });
    });
})
// 添加功能
router.post('/api/categories/create',function(req,res,next){
    const body = req.body;
    body.cate_createdAt = moment().format('YYYY MM DD HH:mm:ss')
    console.log(req.body);
    // res.send('123') //send发送的为字符串或者对象
    db.query('INSERT INTO `ali_cate` SET ?',body,function(err,result){
        if (err) {
            next(err);
        }
        res.send({
            success:true,
            result
        })
    })
})

// 编辑功能
router.get('/api/categories/query',function(req,res,next){
    const { id } = req.query;
    console.log(id)
    db.query('SELECT * FROM `ali_cate` WHERE `cate_id`=?',[id],(err,result)=>{
    if (err) {
        next(err);
    }
    res.send({
        success:true,
        result:result[0]
    })
    });
})

// 修改功能
router.post('/api/categories/update',function(req,res,next){
    const body = req.body;
    console.log(body);
    // UPDATE users SET uname='zsxxx', uqq='111' WHERE uid=1
    // connection.query('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId]
    // -------------------------------------------------------------
    db.query('UPDATE `ali_cate` SET cate_name = ?, cate_slug = ? WHERE cate_id = ?',[body.cate_name,body.cate_slug,body.cate_id],(err,result)=>{
        if (err) {
            return res.status(500).send({
                statusCode:500,
                message:'Internal Server Error',
                error: err.message
            })
            // throw err;
        }
    })
    //为什么错误有时候返回给服务器有时候不返回?  //如果改传入的数据出错 通过点的方式  那么传的值为undefined sql语句并不会报错
    // alert()会阻止后续代码执行
    // --------------------------------------------------------------
    // db.query('UPDATE `ali_cate` SET cate_name = ?, cate1_slug = ? WHERE cate_id = ?',[body.cate_name,body.cate_slug,body.cate_id],(err,result)=>{
    //     if (err) {
    //         next(err);
    //         return  //return 在此处的作用是停止程序往下执行，但是此时服务器并没有结束进程，只是把错误交给中间件  中间件可以人为添加功能告诉攻城狮服务器出错了然后及时更改
    //         // return res.status(500).send( {
    //         //     statusCode:500,
    //         //     message:'Internal Server Error',
    //         //     error: err.message
    //         // })
    //         // throw err;
    //     }
    //     res.send({
    //         success:true,
    //         result
    //     })
    // })
})
module.exports = router;