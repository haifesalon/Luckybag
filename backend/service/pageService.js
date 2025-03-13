// 匯入套件和函式庫
const db = require("../model");
const Page = require("./baseService")(db.page);

// 匯出 Service
module.exports = Page;
