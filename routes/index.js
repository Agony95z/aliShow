/**
 *  提供门户端相关路由
 */

const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index.html');
})
router.get('/index',(req,res)=>{
    res.render('index.html');
})
router.get('/detail',(req,res)=>{
    res.render('detail.html');
})
router.get('/list',(req,res)=>{
    res.render('list.html');
})
module.exports = router;