// 匯入套件和函式庫
const db = require("../model");
const Activity = require("./baseService")(db.activity);

// 匯出 Service
module.exports = Activity;
