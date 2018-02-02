const sqlHost = '192.168.1.38';
const sqlUser = 'info';
const sqlPassword = 'if123456789';
const sqlDatabase = 'hjx_test';
const sqlTableName = 'mock_table'
const sqlTable_ID = '_id';
const sqlTable_Mock_name = 'mock_name';
const sqlTable_Mock_url = 'mock_url';
const sqlTable_Mock_rule = 'mock_rule';
const sqlTable_Mock_data = 'mock_data';

const sqlSelect = "SELECT * FROM `"+sqlTableName+"`";

var getDataByUrl = (url)=>{
    return sqlSelect +" WHERE `"+sqlTable_Mock_url+"` = '"+url+"';";
}

var add_url = (url,name)=>{
    var url = url.replace(/\'/g,"\\\'");
    var name = name.replace(/\'/g,"\\\'");
    return "INSERT INTO "+sqlTableName+"("+sqlTable_Mock_url+","+sqlTable_Mock_name+") values('"+url+"','"+name+"')";
}

var update_url = (id,rule,data)=>{
    var rule = rule.replace(/\'/g,"\\\'");
    var data = data.replace(/\'/g,"\\\'");
    return "UPDATE "+sqlTableName+" SET "+sqlTable_Mock_rule+"='"+rule+"',"+sqlTable_Mock_data+"='"+data+"' WHERE "+sqlTable_ID+"='"+id+"'";
}

module.exports = {
    sqlHost,
    sqlUser,
    sqlPassword,
    sqlDatabase,
    sqlTableName,
    sqlTable_ID,
    sqlTable_Mock_url,
    sqlTable_Mock_name,
    sqlTable_Mock_rule,
    sqlTable_Mock_data,
    sqlSelect,
    getDataByUrl,
    add_url, //新增接口的返回sql语句
    update_url //编辑接口   规则和数据的sql语句
};