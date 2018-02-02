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
            var mock_data = data[i][sqlModel.sqlTable_Mock_data];
            firstSetRoute(mock_url)
        }
      
    }
});


//只是生成路由  里面的逻辑根据该url对应的规则生成数据
function firstSetRoute(url){
    let routeUser = express.Router();
    routeUser.get('/',function(req,res){
        //根据url生成路由    
        console.log('有人来了'+url);
        // 这个url匹配的数据要自己单独查询
        db.query(sqlModel.getDataByUrl(url), (err, data)=>{
            if(err){
                console.log('该接口查询出错', err);
                res.send('{"res":"1","msg":"该接口查询失败无法匹配该url"}')
            }else{
               
                if(data&&data.length!=0){
                    var rule = data[0][sqlModel.sqlTable_Mock_rule];
                    var responseData = data[0][sqlModel.sqlTable_Mock_data];
                    //根据 规则 和 数据  生成数据  如果有数据返回数据  如果没数据字符串 返回对应规则的字符串
                    var result_Data = createResponseData(rule,responseData); 
                    res.send(result_Data);
                }else{
                    res.send('{"res":1,"msg":"该接口未找到"}');
                }
            }
        });
    });
    //把路由加入到express
    server.use(url,routeUser);
}

//数据库查询出来接口对应的"规则"和 "数据"    如果有数据返回数据字符串  反之以规则为准的随机数据
function createResponseData(rule,data){
    if(data&&data.length!==0){ //以数据为准
        return data;
    }else{
        //以规则为准
        //根据规则对象生成数据
        try {
            var ruleJson = JSON.parse(rule);
            var response_data = Mock.mock(ruleJson);
            return JSON.stringify(response_data, null, 4);
        } catch (error) {
            return '{"res":1,"msg":"规则有误"}';
        }
    }
 
}


    //CRUD mock_table里的数据
    let mock_admin = express.Router();
    mock_admin.post('/add',function(req,res){
        console.log('add')
        var url =  req.body[sqlModel.sqlTable_Mock_url];
        var name = req.body[sqlModel.sqlTable_Mock_name];
        var sql = sqlModel.getDataByUrl(url);
        db.query(sql, (err, data)=>{
            if(err){
                console.log('查询新增接口url失败', err);
                res.send('{"res":1,"msg":"add_err"}')
            }else{
                console.log('查询新增接口url成功！开始校验是否存在');
                var flg = true;
                for(var i=0;i<data.length;i++){
                    if(url === data[i][sqlModel.sqlTable_Mock_url])
                    flg = false;
                }
                if(flg){
                    // 添加数据 url name
                    db.query(sqlModel.add_url(url,name),(err,data)=>{
                        if(err){
                            res.send('{"res":1,"msg":"该接口不存在,但是insert失败"}')
                        }else{
                            firstSetRoute(url);
                            res.send('{"res":0,"msg":"insert成功"}')
                        }
                    })             
                }else{
                    res.send('{"res":1,"msg":"该接口已存在"}')
                }
            }
        });
    });

    mock_admin.post('/update',function(req,res){
        console.log('update');
        var id = req.body[sqlModel.sqlTable_ID];
        var rule = req.body[sqlModel.sqlTable_Mock_rule];
        var data =  req.body[sqlModel.sqlTable_Mock_data];
        var sql = sqlModel.update_url(id,rule,data);
        db.query(sql, (err, data)=>{
            if(err){
                res.send('{"res":1,"msg":"add_err"}')
            }else{
                res.send('{"res":0,"msg":"更改接口成功"}');
            }
        });
    });

    //把路由加入到express
    server.use('/mock_admin',mock_admin);


    //首页index首页
    server.use('/index.html',(reqeqst,response)=>{
        var string = fs.readFileSync('./index2.html','utf8');
        response.setHeader('Content-Type','text/html;charset=utf-8');
        response.write(string);
        response.end();
    })
    
    //获取路由的规则和url
    let routeGetUrl = express.Router();
    routeGetUrl.get('/',function(req,res){
        db.query(sqlModel.sqlSelect, (err, data)=>{
            if(err){
                console.log('出错了', err);
                res.send('[]');
            }else{
                res.send(JSON.stringify(data))
            }
        });
    });
    //把路由加入到express
    server.use('/getData',routeGetUrl);
















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

