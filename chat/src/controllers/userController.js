const xtpl = require('xtpl');//引入模板引擎
const path = require('path');
const md5 = require('md5');//引入md5加密模块
const moment = require('moment');//引入时间处理工具

//引入baseController控制器
const base = require("./baseController.js");

//数据库的连接文件
const db = require(path.join(__dirname,"../config/db"));

//配置邮件发送
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var wellknown = require("nodemailer-wellknown");

var config = wellknown("163");//所选择的第三方服务

config.auth = {
    user:'feng1780675@163.com',//邮箱账号
    pass: 'feng1234'//这里密码不是163密码，是你设置的smtp授权密码
}

//让第三方服务生效
var transporter = nodemailer.createTransport(smtpTransport(config));

//会员首页
module.exports.index = function(req,res)
{
    var fromid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var sql = `SELECT chat.*,user.avatar,user.username FROM pre_chat AS chat LEFT JOIN pre_user AS user ON chat.toid = user.id WHERE chat.fromid = ${fromid} AND chat.status = 0 GROUP BY chat.toid`;
    db.query(sql).then(function(chatlist){
        for(var k in chatlist)
        {
            //将时间戳转换为时间形式
            chatlist[k].createtime = moment(chatlist[k].createtime*1000).format('YYYY-MM-DD HH:mm')
        }

        //renderFile(模板路径，数据，回调)
        var render = {
            res:res,
            req:req,
            file:"index.html",
            data:{chatlist: chatlist}
        };
        base.render(render);//读取
    })
}

//会员信息
module.exports.info = function(req,res)
{
    var userid = req.cookies.user.userid;//请求cookis数据中的user.userid
    db.table("user").where({id:userid}).find().then(function(user){
        
        //renderFile(模板路径，数据，回调)
        var render = {
            res:res,
            req:req,
            file: "info.html",
            data:{info:user}
        };
        base.render(render);
    })
}

//提交会员信息
module.exports.infoData = function(req,res)
{
    //先获取到用户id
    var userid = req.cookies.user.userid;
    db.table("user").where({id:userid}).find().then(function(user){
        var data = {};
        //当输入的邮箱与原来的邮箱不一样就要重新验证
        if(user.email != req.body.email)
        {
            data.email = req.body.email;
            data.status = 0;
        }

        if(req.body.password != "")
        {
            //获取密码盐
            var salt = base.randomStr();
            var repass = req.body.password;
            var password = md5(repass + salt);
            data.password = password;
            data.salt = salt;
        }

        //判断是否有图片上传
        if(JSON.stringify(req.files) != "{}" && JSON.stringify(req.files.avatar.size) > 0)
        {
            var filename = path.basename(req.files.avatar.path);
            var avatar = path.join("/uploads/",filename);
            data.avatar = avatar;
        }

        db.table("user").where({id:userid}).update(data).then(function(affect){
            if(data.avatar)
            {
                //更新完用户信息之后要更新一下cooki缓存
                res.cookie("user",{userid: userid,username:user.username,avatar:data.avatar},{maxAge:3600 * 24 * 1000});
            }
            res.redirect("/user/info");
        }).catch(function(err){
            base.alert({res:res,msg:"更新用户资料失败"});
        })
    })
}

module.exports.email = function(req,res)
{
    var userid = req.cookies.user.userid;
    db.table("user").where({id:userid}).find().then(function(user){
        if(!user.email)
        {
            return false;
        }

        var content = `<a href="http://localhost:3000/user/userCheck?userid=${user.id}">点击链接完成认证</a>`;

        var mailOptions = {
            from: "feng1780675@163.com",//发送方的邮件地址
            to: user.email,//收件人的邮件地址
            subject: "问答社区 - 邮箱验证",//邮件主题
            text: "text plain",//邮件文档类型
            html: `<div>${content}</div>`//邮件正文内容
        };

        //发送邮件
        transporter.sendMail(mailOptions,function(error,info){
            if(error)
            {
                base.alert({res:res,msg:"邮件发送失败，请稍后再试"});
                return false;
            }else{
                base.alert({res:res,msg:"邮件发送成功，请注意查收"});
            }
        });
    });
}

module.exports.userCheck = function(req,res)
{
    var userid = req.query.userid ? req.query.userid : 0;
    db.table("user").where({id:userid}).find().then(function(user){
        if(JSON.stringify(user) == "{}")
        {
            base.alert({res:res,msg:"该用户不存在"});
        }else{
            var data = {
                status:1
            };

            db.table("user").where({id:userid}).update(data).then(function(affect){
                //更新状态成功
                base.alert({res:res,msg:"邮箱验证成功",url:"/user/info"});
            }).catch(function(ree){
                //更新失败
                base.alert({res:res,msg:"邮箱验证失败",url:"/user/info"});
            });
        }
    })
}

//注册
module.exports.register = function(req,res)
{
    var render = {
        res:res,
        req:req,
        file:"register.html"
    };
    base.render(render);
}

//注册的post方法
module.exports.registerData = function(req,res)
{
    //验证码
    if(req.body.imgcode != req.session.imgcode)
    {
        base.alert({res:res,msg:"验证码错误，请重新输入"});
        return false;
    }
    //判断用户名是否存在
    var username = req.body.username;
    db.table('user').where({username:username}).find().then(function(check){
        if(JSON.stringify(check) != "{}")
        {
            base.alert({res:res,msg:"该用户已存在"});
            return false;
        }

        //获取密码盐
        var salt = base.randomStr();
        var repass = req.body.password;
        var password = md5(repass+salt);

        //添加到数据库里面
        var data = {
            username:username,
            password:password,
            salt:salt,
            createtime:moment().unix()
        };

        db.table("user").add(data).then(function(userid){
            //注册成功
            res.redirect('/user/login');
        }).catch(function(ree){
            base.alert({res:res,msg:err});
            return false;
        });
    });
}

//登录
module.exports.login = function(req,res)
{
    var render = {
        res:res,
        req:req,
        file:"login.html"
    };
    base.render(render);
}

//登录提交
module.exports.loginData = function(req,res)
{
    //验证码
    if(req.body.imgcode != req.session.imgcode)
    {
        base.alert({res:res,msg:"验证码错误，请重新输入"});
        return false;
    }

    //先查找用户
    db.table('user').where({username:req.body.username}).find().then(function(user){
        if(JSON.stringify(user) == "{}")
        {
            base.alert({res:res,msg:"该用户不存在"});
        }

        //验证密码
        var salt = user.salt;//qwertqwert
        var repass = req.body.password;//12345
        var password = md5(repass+salt);
        if(user.password != password)
        {
            base.alert({res:res,msg:"您输入的密码有误"});
        }

        //设置cookie
        res.cookie("user",{userid:user.id,username:user.username,avatar:user.avatar},{maxAge:3600*24*1000});

        res.redirect("/user/index");
    });
}

//找回密码
module.exports.password = function(req,res)
{
    var render = {
        res:res,
        req:req,
        file:"password.html"
    };
    base.render(render);
}

//分组
module.exports.groupAdd = function(req,res)
{
  var render = {
    res: res,
    req: req,
    file: "groupAdd.html"
  };
  base.render(render);
}

module.exports.groupAddData = function(req,res)
{
  var userid = req.cookies.user.userid;
  var name = req.body.name;
  db.table("user_group").where({userid:userid,name:name}).find().then(function(group){

    if(JSON.stringify(group) != "{}")
    {
      base.alert({res:res,msg:"该分组已经存在，请重新填写"});
    }else{

      var data = {
        name:name,
        userid:userid,
      }

      //不存在就追加
      db.table('user_group').add(data).then(function(affect){
        base.alert({ res: res, msg: "添加成功", url:"/user/groupList"});
      }).catch(function(err){
        base.alert({res:res,msg:"添加失败,请重新在试"});
      });
    }
  })
}

//加好友
module.exports.friendAdd = function(req,res)
{
    var userid = req.cookies.user.userid;
    var username = req.cookies.user.username;

    db.table("user_group").where({userid: userid}).order("id ASC").select().then(function(group){
        if(JSON.stringify(group) == "{}")
        {
            group = null;
        }
        var render = {
            res: res,
            req: req,
            file: "friendAdd.html",
            data: {group: group}
        };
        base.render(render);
    })
}

module.exports.friendAddData = function(req,res)
{
    var userid = req.cookies.user.userid;
    var friendname = req.body.friendname;
    var groupid = req.body.groupid;
    var content = req.body.content;
    
    var sql = `SELECT * from pre_user WHERE username = "${friendname}"`;
    db.table("user").where({username:friendname}).find().then(function(userlist){
        db.table("user_friends").where({friend:userlist.id,userid:userid}).find().then(function(friendlist){
            if(JSON.stringify(friendlist) != "{}")
            {
            base.alert({res: res,msg: "请不要重复添加该好友"});
            return false;
            }
        })
        if(JSON.stringify(userlist) != "{}")
        {
            var data = {
                content:content,
                fromids:userlist.id,
                toids:userid,
                createtime:moment().unix(),
                status:0,
                groupid:groupid
            }

            db.table("addfriend").add(data).then(function(addfriend){
                base.alert({res:res,msg:"发送成功"})
            })

        }else{
            base.alert({res: res,msg: "该好友不存在，请重新添加"});
        }
    })
}

//新好友
module.exports.friendNew = function(req,res)
{
    var fromid = req.cookies.user.userid;

    var sql = `SELECT addfriend.*,user.avatar,user.username FROM pre_addfriend AS addfriend LEFT JOIN pre_user AS user ON addfriend.toids = user.id WHERE addfriend.fromids = ${fromid} AND addfriend.status = 0 GROUP BY addfriend.toids`
    db.query(sql).then(function(chatlist){
        for(var k in chatlist)
        {
            //将时间戳转换为时间形式
            chatlist[k].createtime = moment(chatlist[k].createtime*1000).format('YYYY-MM-DD HH:mm')
        }
        var render = {
            res:res,
            req:req,
            file:"friendnew.html",
            data:{chatlist:chatlist}
        }
        base.render(render);
    })

}

//接受
module.exports.friendAgree = function(req,res)
{
    var toids = req.query.toids ? req.query.toids : 0;
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    //如果有分组才会添加好友
    db.table("user_group").where(`userid = ${userid}`).find().then(group => {
        if(JSON.stringify(group) == "{}") {
            res.end("0");
            return false;
        }
        //如果有分组才会添加好友
        db.table("user_group").where(`userid = ${toids}`).find().then(groups => {
            if(JSON.stringify(groups) == "{}") {
                res.end("0");
                return false;
            }
            var data = {
                friend:toids,
                userid:userid,
                groupid:group.id,
                createtime:moment().unix(),
                status: 1
            }
            var obj = {
                friend:userid,
                userid:toids,
                groupid:groups.id,
                createtime:moment().unix(),
                status: 1
            }
            //插入关系
            db.table('user_friends').add(data).then(insertId => {
                db.table('user_friends').add(obj).then(affectRows => {
                    db.table("addfriend").where(`toids=${toids} AND fromids=${userid}`).update({status: 1}).then(affectRows => {
                        res.end("1");
                    })
                });
            });
        })

    })
}

//拒绝
module.exports.friendRefuse = function(req,res)
{
    var toids = req.query.toids ? req.query.toids : 0;
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    db.table("addfriend").where(`toids=${toids} AND fromids=${userid}`).update({status: 1}).then(affectRows => {
        if(affectRows > 0)
        {
            res.end("1");
        }
        res.end("0");
    })
}

//显示分组
module.exports.groupList = function(req,res)
{
  var userid = req.cookies.user.userid;

  db.table("user_group").where({ userid: userid }).order("id ASC").select().then(function(group){
    if(JSON.stringify(group) == "{}")
    {
      group = null;
    }

    var sql = `SELECT friends.*,friend.username,friend.avatar FROM pre_user_friends AS friends LEFT JOIN pre_user AS user ON friends.userid = user.id LEFT JOIN pre_user AS friend ON friends.friend = friend.id WHERE friends.userid = ${userid} AND friends.status = 1 ORDER BY friends.id ASC`;
    db.query(sql).then(function(userlist){
      if (JSON.stringify(userlist) != "{}")
      {
        for(var i=0;i<userlist.length;i++)
        {
          for(var s=0;s<group.length;s++)
          {
            if(userlist[i].groupid == group[s].id)
            {
              if (!Array.isArray(group[s].userlist))
              {
                group[s].userlist = [];
              }
              group[s].userlist.push(userlist[i]);
            }
          }
        }
      }

      //渲染模板
      var render = {
        res: res,
        req: req,
        file: "groupList.html",
        data: { group: group}
      };
      base.render(render);
      
    })


  })

}

//聊天
module.exports.groupChat = function(req,res)
{
    //query查询
    var friendid = req.query.friend ? req.query.friend : 0;

    //自己的id
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    //先查询朋友
    db.table("user").where({id: friendid}).find().then(function(friend){
        if(JSON.stringify(friend) == "{}")
        {
            res.redirect("/user/groupList");
        }

        //既可以作为发送方 又可以作为接受方
        var sql = `SELECT * FROM pre_chat WHERE (toid = ${userid} AND fromid = ${friendid}) OR (fromid = ${userid} AND toid = ${friendid})`;
        db.query(sql).then(function(chatlist){
            if(chatlist)
            {
                for(var k in chatlist)
                {
                    chatlist[k].createtime = moment(chatlist[k].createtime * 1000).format('YYYY-MM-DD HH:mm')
                }
            }

            var render = {
                res: res,
                req: req,
                file: "chat.html",
                data: {friend: friend, chatlist: chatlist}
            };
            base.render(render);
        })
    })
}

//说说
module.exports.say = function(req, res) {
    var config = {
        res,
        req,
        file: "say.html"
    }

    base.render(config);
}

module.exports.sayData = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var content = req.body.content ? req.body.content : "";
    var files = req.files.pic;

    var data = {
        userid,
        create_time: moment().unix(),
        content,
        thumbup: 0,
        count: 0,
        pics: ""
    }

    //单文件上传
    if(files.size) {
        var path = files.path.replace(/\\/g, "/");
        path = path.replace(/\w+(.*)/, (match, $1) => {
            return $1;
        });
       
        data['pics'] = path;
    }else if(files.length > 0) {
        //多文件上传
        for(var i = 0; i < files.length; i++) {
            if(files[i].size > 0) {
                var path = files[i].path.replace(/\\/g, "/");
                path = path.replace(/\w+(.*)/, (match, $1) => {
                    return $1;
                })
                
                data['pics'] += path + ",";
            }
        }

        //去除最后的逗号
        data['pics'] = data['pics'].substring(0, data['pics'].length -1);
    }

    db.table("post").add(data).then(insertId => {
        base.alert({res, msg: "发表成功", url: "/user/say"}); 
    }).catch(err => {
       base.alert({res, msg: "发表失败，请稍后再试", url: "/user/say"});
    });
}

//空间
function callback(req, res, spacelist, thumbupUsers) {
    //评论数据： 评论表 + 用户表
    var sql = "SELECT comment.*,user.username FROM pre_comment AS comment LEFT JOIN pre_user AS USER ON user.id = comment.userid";
    db.query(sql).then(commentlist => {
        //无限级循环
        for(var k in commentlist) {
            commentlist[k].deepStr = "";
            if(commentlist[k].deep != 0) {
                commentlist[k].deepStr = "--".repeat(commentlist[k].deep);
            }
        }

        for(var i = 0, count = thumbupUsers.length; i < count; i++) {
            //数字类型转换字符串类型
            thumbupUsers[i].id = thumbupUsers[i].id + ""; 

            //点赞用户名
            thumbupUsers[i].username = thumbupUsers[i].username;
        }

        var config = {
            res,
            req,
            data: { spacelist, commentlist, thumbupUsers },
            file: "space.html"
        }
    
        base.render(config);
    });
}

//空间
module.exports.space = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;

    //朋友表： 查询自己的好友
    var sql = `SELECT friend FROM pre_user_friends WHERE userid = ${userid}`;
    db.query(sql).then(function(friends) {
        //所有的好友     组装好友id
        var ids = [userid];
        for(var j = 0; j < friends.length; j++) {
            ids.push(friends[j].friend);
        }
        var friendids = ids.join(",");

        //帖子数据： 帖子表 + 用户表
        var sql = `SELECT post.*,user.username,user.avatar FROM pre_post as post LEFT JOIN pre_user as user ON user.id = post.userid WHERE userid in(${friendids}) ORDER BY post.create_time DESC`;
        db.query(sql).then(spacelist => {
            //点赞ids
            var thumbupIds = [];

            for(var k in spacelist) {
                spacelist[k].create_time = moment(spacelist[k].create_time * 1000).format('YYYY-MM-DD HH:mm');
                
                //处理图片
                if(spacelist[k].pics != "") {
                    spacelist[k].pics = spacelist[k].pics.split(",");
                }

                //增加浏览次数
                db.table("post").where(`id = ${spacelist[k].id}`).update({count: spacelist[k].count+1});

                //处理点赞    
                if(spacelist[k].thumbup == "0") {
                    spacelist[k].thumbup = [];
                }else {
                    //查询点赞用户
                    var ids = spacelist[k].thumbup = spacelist[k].thumbup.split(",");

                    for(var i = 0; i < ids.length; i++) {
                        //本用户已点赞
                        if(ids[i] == userid) {
                            spacelist[k].isThumbup = true;
                        }
                        thumbupIds.push(ids[i]);
                    }
                }
            }

            var ids = thumbupIds.join(",");

            //查询点赞用户名
            var sql = `SELECT id,username FROM pre_user WHERE id in(${ids})`;
            db.query(sql).then(thumbupUsers => {
                callback(req, res, spacelist, thumbupUsers);
            });
        });
    })
}

//更新点赞
module.exports.thumbup = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var id = req.query.id ? req.query.id : 0;

    db.table("post").where(`id = ${id}`).find().then(post => {
        var thumbup = "";

        //是否已点赞  true未点赞  false已点赞
        var flag = true;

         //点赞默认值是0
        if(post.thumbup == "0") {
            thumbup = userid;
        }else {
            var thumbups = post.thumbup.split(",");

            //遍历查询点赞
            for(var i = 0; i < thumbups.length; i++) {
                if(thumbups[i] == userid) {
                    //重复点赞则取消
                    thumbups.splice(i, 1);
                    flag = false;
                    break;
                }
            }
            
            thumbup = thumbups.join(",");
            //处理 取消点赞为空
            if(thumbup == "") {
                thumbup = "0";
            }

            //点赞
            if(flag) {
                thumbup = post.thumbup + "," + userid;
            }
        }

        db.table("post").where(`id = ${id}`).update({thumbup}).then(affectedRow => {
            if(flag) {
                //点赞
                res.end("1");
            }else {
                //取消点赞
                res.end("2");
            }
        }).catch(err => {
            res.end("0");
        });
    }).catch(err => {
        res.end("0");
    });
}

//转发
module.exports.forward = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var id = req.query.id ? req.query.id : 0;

    db.table("post").where(`id = ${id}`).find().then(post => {
        var data = {
            userid,
            create_time: moment().unix(),
            content: post.content,
            thumbup: "0",
            pics: post.pics,
            count: post.count
        }

        db.table("post").add(data).then(insertId => {
            res.end("1");
        }).catch(err => {
            res.end("0");
        });
    }).catch(err => {
        res.end("0");
    });
}

//评论
module.exports.spaceData = function(req, res) {
    var userid = req.cookies.user.userid ? req.cookies.user.userid : 0;
    var postid = req.body.postid ? req.body.postid : 0;
    var deep = req.body.deep ? req.body.deep : 0;
    var parentid = req.body.parentid ? req.body.parentid : 0;
    var content = req.body.content ? req.body.content : "";

    //组装数据
    var data = {
        postid,
        content,
        deep,
        parentid,
        userid,
        create_time: moment().unix()
    }

    db.table("comment").where(`postid = ${postid}`).add(data).then(insertId => {
        res.end(`${insertId}`);
    }).catch(err => {
        res.end("0");
    });
}

//上拉刷新
module.exports.spaceReset = function(req, res) {
    res.end("space reset");
}

//下拉加载
module.exports.spaceNext = function(req, res) {
    res.end("space next");
}

//分组结束

module.exports.logout = function(req,res)
{
    res.cookie('user',null,{maxAge: 0 });
    res.redirect("/user/login");
}