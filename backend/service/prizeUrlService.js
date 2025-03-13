// 匯入套件和函式庫
const db = require("../model");
const PrizeUrl = require("./baseService")(db.prizeUrl);

// 匯出 Service
module.exports = PrizeUrl;
