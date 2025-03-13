// 匯入套件和函式庫
const db = require("../model");
const Winners = require("./baseService")(db.winners);

// 匯出 Service
module.exports = Winners;
