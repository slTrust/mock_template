const express=require('express');
var fs = require('fs')
var bodyParser = require('body-parser');
var server=express();

//自己的常量数据
var sqlModel = require('./const_value');
const mysql=require('mysql');
var Mock = require('mockjs')
//post使用bodyParser转换
server.use(bodyParser.urlencoded({extended:false}));
//监听
server.listen(2236);
//1.连接
//createConnection(哪台服务器, 用户名, 密码, 库)
// var db=mysql.createConnection({host: 'localhost', user: 'root', password: '123456', database: 'learn'});
var db=mysql.createConnection({host:sqlModel.sqlHost, user: sqlModel.sqlUser, password: sqlModel.sqlPassword, database:sqlModel.sqlDatabase});

//2.查询
db.query(sqlModel.sqlSelect, (err, data)=>{
    if(err)
        console.log('出错了', err);
    else{
        console.log('mock表有接口正在查询并监听');
        for(let i=0;i<data.length;i++){
            var mock_url = data[i][sqlModel.sqlTable_Mock_url];
            var mock_rule = data[i][sqlModel.sqlTable_Mock_rule];
            // var a = '{"user|5-10":[{"name": "@cname","age|1-100": 100,"birthday": "@date()", "city": "@city(true)"}]}';
            initRoute(mock_url,JSON.parse(mock_rule))
        }
      
    }
});
//数据库查询出来的自定义接口
function initRoute(url,response_rule){
    let routeUser = express.Router();
    routeUser.get('/',function(req,res){
        //根据规则对象生成数据
        var data = Mock.mock(response_rule)
        // 输出结果
        res.send(JSON.stringify(data, null, 4));
    });
    //把路由加入到express
    server.use(url,routeUser);
}


    //CRUD mock_table里的数据
    let mock_admin = express.Router();
    mock_admin.post('/add',function(req,res){
        console.log('add')
        var url =  req.body[sqlModel.sqlTable_Mock_url];
        var rule = req.body[sqlModel.sqlTable_Mock_rule];
        var sql = sqlModel.getDataByUrl(url);
        db.query(sql, (err, data)=>{
            if(err){
                console.log('查询新增接口url失败', err);
                res.send('{"res":1,"msg":"add_err"}')
            }else{
                console.log('查询新增接口url成功！开始校验是否存在');
                var flg = true;
                for(var i=0;i<data.length;i++){
                    if(url === data[i]['mock_url'])
                    flg = false;
                }
                if(flg){
                    // 添加数据
                    db.query(sqlModel.add(url,rule),(err,data)=>{
                        if(err){
                            res.send('{"res":1,"msg":"该接口不存在,但是insert失败"}')
                        }else{
                            //同时设置新的路由
                            console.log('动态添加路由'+url)
                            initRoute(url,JSON.parse(rule));
                            res.send('{"res":0,"msg":"insert成功"}')
                            
                        }
                    })             
                }else{
                    res.send('{"res":1,"msg":"该接口已存在"}')
                }
            }
        });
    
    });
    //把路由加入到express
    server.use('/mock_admin',mock_admin);


    //监听 /返回首页
    server.use('/index.html',(reqeqst,response)=>{
        var string = fs.readFileSync('./index.html','utf8');
        response.setHeader('Content-Type','text/html;charset=utf-8');
        response.write(string);
        response.end();
    })
    server.use('/js/jquery-3.1.1.js',(reqeqst,response)=>{
        var string = fs.readFileSync('./js/jquery-3.1.1.js','utf8');
        response.setHeader('Content-Type','text/javascript');
        response.write(string);
        response.end();
    })
    

    server.use('/js/mock.js',(reqeqst,response)=>{
        var string = fs.readFileSync('./js/mock.js','utf8');
        response.setHeader('Content-Type','text/javascript');
        response.write(string);
        response.end();
    })

    server.use('/js/def_mock.js',(reqeqst,response)=>{
        var string = fs.readFileSync('./js/def_mock.js','utf8');
        response.setHeader('Content-Type','text/javascript');
        response.write(string);
        response.end();
    })

    server.use('/js/user_mock.js',(reqeqst,response)=>{
        var string = fs.readFileSync('./js/user_mock.js','utf8');
        response.setHeader('Content-Type','text/javascript');
        response.write(string);
        response.end();
    })
   
    let routeGetUrl = express.Router();
    routeGetUrl.get('/',function(req,res){
        db.query(sqlModel.sqlSelect, (err, data)=>{
            if(err){
                console.log('出错了', err);
                res.send('[]');
            }else{
                var jsonArr = [];
                for(let i=0;i<data.length;i++){
                    var mock_url = data[i][sqlModel.sqlTable_Mock_url];
                    var mock_rule = data[i][sqlModel.sqlTable_Mock_rule];
                    jsonArr.push({
                        [sqlModel.sqlTable_Mock_url]:mock_url,
                        [sqlModel.sqlTable_Mock_rule]:mock_rule
                    })
                }
                res.send(JSON.stringify(jsonArr))
              
            }
        });
    });
    //把路由加入到express
    server.use('/getData',routeGetUrl);

