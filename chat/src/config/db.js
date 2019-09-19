var Mysql = require('node-mysql-promise');//引入mysql注入包

//创建一个数据库连接
var db = Mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat',
    tablePrefix:"pre_",
    logSql:true
})

module.exports = db;//输出连接数据库