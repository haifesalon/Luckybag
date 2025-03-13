// 匯入套件和函式庫
const db = require("../model");
const Role = require("./baseService")(db.role);

// 匯出 Service
module.exports = Role;
