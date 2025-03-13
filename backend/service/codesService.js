// 匯入套件和函式庫
const db = require("../model");
const Codes = require("./baseService")(db.codes);

// 匯出 Service
module.exports = Codes;
