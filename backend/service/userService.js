// 匯入套件和函式庫
const db = require("../model");
const User = require("./baseService")(db.user);

// 匯出 Service
module.exports = User;
