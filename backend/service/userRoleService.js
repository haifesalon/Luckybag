// 匯入套件和函式庫
const db = require("../model");
const UserRole = require("./baseService")(db.userRole);

// 匯出 Service
module.exports = UserRole;
