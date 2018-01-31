const sqlHost = '192.168.1.38';
const sqlUser = 'info';
const sqlPassword = 'if123456789';
const sqlDatabase = 'hjx_test';
const sqlTableName = 'mock_table'
const sqlTable_ID = '_id';
const sqlTable_Mock_url = 'mock_url';
const sqlTable_Mock_rule = 'mock_rule';

const sqlSelect = "SELECT * FROM `"+sqlTableName+"`";

var getDataByUrl = (url)=>{
    return sqlSelect +" WHERE `"+sqlTable_Mock_url+"` = '"+url+"';";
}

var add = (url,rule)=>{
    return "INSERT INTO mock_table("+sqlTable_Mock_url+","+sqlTable_Mock_rule+") values('"+url+"','"+rule+"')";
}

module.exports = {
    sqlHost,
    sqlUser,
    sqlPassword,
    sqlDatabase,
    sqlTableName,
    sqlTable_ID,
    sqlTable_Mock_url,
    sqlTable_Mock_rule,
    sqlSelect,
    getDataByUrl,
    add
};