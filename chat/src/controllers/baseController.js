const xtpl = require('xtpl');
const path = require('path');


//渲染模板的方法
module.exports.render = function(obj)
{
  var res = obj.res ? obj.res : false;
  var req = obj.req ? obj.req : false;
  var file = obj.file ? obj.file : false;
  var data = obj.data ? obj.data : [];

  if(!res)
  {
    console.log("未传递相应对象");
    return false;
  }

  if (!req) 
  {
    console.log("未传递请求对象");
    return false;
  }

  if(!file)
  {
    console.log('模板文件不存在');
    return false;
  }

  //判断是否有用户登录传递cookie
  var user = req.cookies.user;

  if(user && JSON.stringify(user) != "{}")
  {
    data['user'] = user;
  }

  //renderFile(模板路径，数据，回调)
  xtpl.renderFile(
    path.join(__dirname,`../views/${file}`),
    data,
    function(err,content)
    {
      if(err)
      {
        console.log(err);
        return false;
      }

      res.setHeader("Content-Type","text/html;charset=utf-8");
      res.end(content);
    }
  );
}


//弹框提醒
module.exports.alert = function(obj)
{
  var res = obj.res ? obj.res : false;
  var msg = obj.msg ? obj.msg : '未知消息';
  var url = obj.url ? obj.url : false;
  if(!res)
  {
    console.log('无响应对象');
    return false;
  }

  if(url)
  {
    var content = `<script>alert('${msg}');location.href='${url}';</script>`;
  }else{
    var content = `<script>alert('${msg}');history.go(-1)</script>`;
  }
  
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(content);
}

//生成随机字符串的方法
module.exports.randomStr = function (len = 20) 
{
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) 
  {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}