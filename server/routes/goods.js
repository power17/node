var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//链接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

//连接成功操作
mongoose.connection.on('connected',function () {
    console.log('MongoDB connected success');
});
//连接失败操作
mongoose.connection.on('error',function () {
  console.log('MongoDb connected fail');
});

//断开连接操作
mongoose.connection.on('disconnected',function () {
  console.log('MongoDb connected disconnected');
});


 //查询商品
router.get('/list',function (req,res,next) {
  let page = parseInt(req.query.page);//第几页
  let pageSize = parseInt(req.query.pageSize);//一页多少条
  let priceLevel = req.query.priceLevel || 'all';//价格范围
  let sort = req.query.sort;
  let skip = (page -1) *pageSize;
  let params = { };
  var priceGt = '',priceLte = '';
  //价格分类
  if(priceLevel !='all') {
    switch (priceLevel) {
      case '0' : priceGt =0;priceLte = 100;break;
      case '1' : priceGt =100;priceLte = 500;break;
      case '2' : priceGt = 500;priceLte =1000;break;
      case '3' : priceGt =1000; priceLte =5000;break;
    }
    params = {
      salePrice: {
        $gte:priceGt,
        $lte: priceLte
      }
    }
  }




  //显示特定页码的数据
  let goodsMondel = Goods.find(params).skip(skip).limit(pageSize);
  //升序
  goodsMondel.sort({'salePrice': sort});

  //查找所有符合条件的good数据
  goodsMondel.exec(function (err,doc) {
    if(err) {
      res.json({
        status: '1',
        msg: err
      })
    }else{
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.json({
        status:'0',
        msg:'',
        result: {
          count: doc.length,
          list:doc
        }
      }) ;
    }


  })

});

//购物车功能(先找到用户，在找到商品列表，把商品列表放在对应的用户上面)12121221223111

router.post("/addCart",function (req,res,next) {
    var userId = '100000077',productId = req.body.productId;
    var User = require('../models/user');
    //找到当前用户
    User.findOne({userId:userId}, function (err,userDoc) {
       if(err) {
         res.json({
           status: "1",
           msg: err.message
         })
       } else{
         console.log("userDoc" + userDoc);
         if(userDoc) {
           //如果有这个商品了，就累加
           let goodItem = '';
           userDoc.cartList.forEach(function (item) {
             if(item.productId == productId) {
               goodItem = item;
               item.productNum ++;
             }

           });
           //这个用户已经选中这个商品了
           if(goodItem) {
             userDoc.save(function (err2,doc2) {
               if(err2) {
                 res.json({
                   status:'1',
                   msg:err2.msg
                 })
               } else{
                 res.json({
                   status: '0',
                   msg: '',
                   result: 'success'
                 })
               }

             })
           } else {
             Goods.findOne({productId:productId}, function (err,doc) {
               if(err) {
                 res.json({
                   status:'1',
                   msg:err.msg
                 })
               }else{
                 if(doc) {
                   console.log(doc);
                   doc.productNum = 1;
                   doc.checked = 1;
                   userDoc.cartList.push(doc);
                   userDoc.save(function (err2,doc2) {
                     if(err2) {
                       res.json({
                         status:'1',
                         msg:err2.msg
                       })
                     } else{
                       res.json({
                         status: '0',
                         msg: '',
                         result: 'success'
                       })
                     }

                   })

                 }
               }

             })
           }

         }

       }
    });


});

module.exports = router;


