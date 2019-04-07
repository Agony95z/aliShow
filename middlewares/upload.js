const multer = require('multer')
const path = require('path')
// Multer将会重命名上传的文件，以免文件名的冲突。重命名的方法可以根据需要个性化编写
var storage = multer.diskStorage({
  // 上传文件所在的位置
  destination: function (req, file, cb) {
    cb(null, 'public/template')
  },
  // 给上传文件重命名
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extName}`)
  }
})
var upload = multer({
  storage: storage
})

module.exports = upload;