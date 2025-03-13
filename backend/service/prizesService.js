// 匯入套件和函式庫
const db = require("../model");
const Prizes = require("./baseService")(db.prizes);

// 匯出 Service
module.exports = Prizes;
