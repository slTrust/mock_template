const express=require('express');
var server=express();
const mysql=require('mysql');
var Mock = require('mockjs')



//1.连接
//createConnection(哪台服务器, 用户名, 密码, 库)
var db=mysql.createConnection({host: 'localhost', user: 'root', password: '123456', database: 'learn'});

//2.查询
db.query("SELECT * FROM `mock_table`;", (err, data)=>{
  if(err)
    console.log('出错了', err);
  else{
    console.log('成功了');
    console.log(data);
    for(let i=0;i<data.length;i++){
        var mock_url = data[i].mock_url;
        var mock_rule = data[i].mock_rule;
       
        // console.log(JSON.parse(mock_rule))
        initRoute(mock_url,mock_rule)
    }
  }
   
});

function initRoute(url,response_rule){
    let routeUser = express.Router();
        routeUser.get('/',function(req,res){
            
            var flg = true;
            var str = response_rule.replace(/\'/g,'"');
            var jsonObj = JSON.parse(str);
            return;
           // var json ={'user|5-10':[{'name': '@cname','age|1-100': 100,'birthday': '@date('yyyy-MM-dd')', 'city': '@city(true)'}]}
           console.log(jsonObj);
            var data = Mock.mock(jsonObj)
           
            // 输出结果
            res.send(JSON.stringify(data, null, 4));
        });
        //把路由加入到express
        console.log(url)
        server.use(url,routeUser);
}



server.listen(2235);
