// 匯入套件和函式庫
const { Op } = require("sequelize");

const config = require("../config");
const DataTypes = require("sequelize");
const crypto = require("../helper/crypto");
const initModels = require("./init-models");
const associate = require("./associate");
const { isDev } = require("../../config.js");

const dbConfig = config.dbConfig;
const debug = config.debug;

// 建立 Sequelize 實例
const sequelize = new DataTypes(
  crypto.decrypt(dbConfig.DB, config.webConfig.DB_CRYPTO_KEY),
  crypto.decrypt(dbConfig.USER, config.webConfig.DB_CRYPTO_KEY),
  crypto.decrypt(dbConfig.CODE, config.webConfig.DB_CRYPTO_KEY),
  {
    host: crypto.decrypt(
      isDev ? dbConfig.DEV_HOST : dbConfig.HOST,
      config.webConfig.DB_CRYPTO_KEY
    ),
    port: crypto.decrypt(dbConfig.PORT, config.webConfig.DB_CRYPTO_KEY),
    dialect: crypto.decrypt(dbConfig.dialect, config.webConfig.DB_CRYPTO_KEY),
    logging: debug,
  }
);

// 初始化模型
const db = initModels(sequelize);

// 設置自定義關聯
associate(db);

db.op = Op; // 導出 Op 物件，用於進行 Sequelize 的操作符比較
db.sequelize = sequelize; // 導出 sequelize 實例，用於執行資料庫操作
module.exports = db; // 導出 db 物件，供其他程式模組使用
