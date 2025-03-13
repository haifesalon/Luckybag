// 匯入套件和函式庫
const db = require("../model");
const RolePageAction = require("./baseService")(db.rolePageAction);

// 匯出 Service
module.exports = RolePageAction;
