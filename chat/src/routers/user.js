var express = require('express');
var path = require('path');

var userRouter = express.Router();//可使用 express.Router 类创建模块化、可挂载的路由句柄

//引入数据库
var db = require(path.join(__dirname,"../config/db"));

//引入user控制器
var userCtrl = require(path.join(__dirname,"../controllers/userController"))

//req请求 res响应 next下一层
var checkUser = function(req,res,next)
{
    //请求cookies中的user数据
    var user = req.cookies.user;
    //JSON.parse()是从一字符串数据解析出json对象
    //JSON.stringify()是把一对象中解析出字符串
    if(!user || JSON.stringify(user) == "{}")
    {
        //与location()相比，redirect()除了要设置path外，还可以指定一个状态码。而path参数则与location()完全相同。
        res.redirect("/user/login");
    }
    //判断user数据中有没有userid
    var userid = user.userid ? user.userid : 0;
    //通过条件id等于userid查询一条user表的数据
    db.table("user").where({id:userid}).find().then(function(user){
        //如果为空就不存在
        if(JSON.stringify(user) == "{}")
        {
            //时间为0自动过期
            res.cookie("user",null,{maxAge:0});
            res.redirect("/user/login");
        }else{
            next();
        }
    })
}

//设置路由 /user/index
userRouter.get("/index",checkUser,userCtrl.index);

//user/info 个人中心
userRouter.get('/info',checkUser,userCtrl.info);

//post请求 路径指向userController.js中定义好的info.html
userRouter.post('/info',checkUser,userCtrl.infoData);

//发送邮箱验证的邮件
userRouter.get('/email',checkUser,userCtrl.email);

userRouter.get('/userCheck',userCtrl.userCheck);

//用户分组
userRouter.get('/groupAdd', checkUser,userCtrl.groupAdd);

userRouter.post('/groupAdd', checkUser,userCtrl.groupAddData);

//添加好友
userRouter.get('/friendAdd',checkUser,userCtrl.friendAdd);

userRouter.post('/friendAdd',checkUser,userCtrl.friendAddData);

//新好友
userRouter.get('/friendnew',checkUser,userCtrl.friendNew);

//同意或拒绝加好友
userRouter.get('/friendAgree',checkUser,userCtrl.friendAgree);
userRouter.get('/friendRefuse',checkUser,userCtrl.friendRefuse);

//显示分组
userRouter.get('/groupList',checkUser,userCtrl.groupList);
//用户分组结束

//空间上拉刷新  下拉加载
userRouter.get("/spaceReset", checkUser, userCtrl.spaceReset);
userRouter.get("/spaceNext", checkUser, userCtrl.spaceNext);

//空间 评论 点赞 转发
userRouter.get("/space", checkUser, userCtrl.space);
userRouter.post("/spaceData", checkUser, userCtrl.spaceData);
userRouter.get("/thumbup", checkUser, userCtrl.thumbup);
userRouter.get("/forward", checkUser, userCtrl.forward);

//说说
userRouter.get("/say", checkUser, userCtrl.say);
userRouter.post("/say", checkUser, userCtrl.sayData);

//登录
userRouter.get('/login',userCtrl.login);

//登录提交
userRouter.post('/login',userCtrl.loginData);

//找回密码
userRouter.get('/password',userCtrl.password);

//注册
userRouter.get('/register',userCtrl.register);

//退出登录
userRouter.get('/logout', userCtrl.logout);

//注册post方法
userRouter.post("/register",userCtrl.registerData);

module.exports = userRouter;
