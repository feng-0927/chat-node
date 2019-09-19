var path = require('path');
var userRouter = require('./user');//引入user路由
var commonRouter = require('./common');//引入common路由

function main(app)
{
    //user/xxxxx;使用app.set 设置express内部的一些参数（options）;使用app.use 来注册函数,在express内部，有一个函数的数组,对其进行push操作
    app.use('/',commonRouter);

    //用户路由
    app.use('/user',userRouter);
}

module.exports = main;