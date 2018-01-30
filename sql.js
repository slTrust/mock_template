const mysql=require('mysql');

//1.连接
//createConnection(哪台服务器, 用户名, 密码, 库)
var db=mysql.createConnection({host: '192.168.1.38', user: 'info', password: 'if123456789', database: 'hjx_test'});

//2.查询
//query(干啥, 回调)
db.query("SELECT * FROM `mock_info`;", (err, data)=>{
  if(err)
    console.log('出错了', err);
  else
    console.log('成功了');
    console.log(JSON.stringify(data));
});