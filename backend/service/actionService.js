// 匯入套件和函式庫
const db = require("../model");
const Action = require("./baseService")(db.action);

// 匯出 Service
module.exports = Action;
