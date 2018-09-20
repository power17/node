var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var fs = require("fs");
var sd = require("silly-datetime");
var path = require("path");
var unzip = require('unzip');
var zlib = require('zlib');


router.get('/sendFile',function (req,res,next) {
    res.sendfile('./guide/index.html');
});

/* 上传*/
router.post('/uploading', function(req, res, next){
  var form = new formidable.IncomingForm();
  //存放地址localhost:80/uploads
  form.uploadDir =  './uploads';
//压缩文件
  //执行里面的回调函数的时候，表单已经全部接收完毕了。
  form.parse(req, function(err, fields, files) {

    //改名字
    //使用第三方模块silly-datetime
    var t = sd.format(new Date(),'YYYYMMDDHHmmss');

      //生成随机数
      var ran = parseInt(Math.random() * 8999 +10000);
      //files.fileDetail.nam为传入文件名abc.zip ,extname为.zip
      var extname = path.extname(files.fileDetail.name);
      //__dirname为localhost:80/server/router
      var oldpath = path.resolve(__dirname, '../../') +'/' + files.fileDetail.path;
      var newpath = path.resolve(__dirname, '../../')+ '/uploads/'+t+files.fileDetail.name;
    //如果是压缩包
    if(extname == '.zip'){
        //解压缩
        fs.createReadStream(oldpath).pipe(unzip.Extract({ path: path.resolve(__dirname, '../../')+ '/uploads/' }));
        //删除文件
        fs.unlink(oldpath,function () {
        });
        //回应
        res.json({
            status:'0',
            result:'上传成功，为压缩文件'
        });

    }else {
        fs.rename(oldpath,newpath,function (err) {
            if(err){
                throw  Error("改名失败");
            }
            //回应
            res.json({
                status:'1',
                result:'上传成功'
            });


        });
    }



  });


  });


module.exports = router;
