var express = require('express');//引入express框架
var path = require('path');//引入路径模块

var commonRouter = express.Router();//将路由服务给到commonRouter

//引入控制器
var commonCtrl = require(path.join(__dirname,"../controllers/commonController"))

//验证码方法
commonRouter.get('/imgcode',commonCtrl.imgcode);

module.exports = commonRouter;//输出验证码方法