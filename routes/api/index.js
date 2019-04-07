const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/upload')
// const path = require('path')
router.post('/api/upload',upload.single('file'),(req,res,next)=>{
    var file = req.file;
    // console.log(file)
    res.send({
        success:true,
        data:`/${file.destination}/${file.filename}`
    })
})
module.exports = router;