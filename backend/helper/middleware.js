// 匯入套件
const jwt = require("jsonwebtoken");

const crypto = require("./crypto");
const config = require("../config");

// 前後端中介函式
const middleware = async (req, res, next) => {
  // #swagger.ignore = true
  try {
    // 取得目前呼叫的 URL
    const url = req.originalUrl;
    // 若呼叫為非公開 API 皆須驗證 token
    if (
      url.includes("/api/") &&
      !url.includes("/public/") &&
      !url.includes("/api/draw")
    ) {
      // 取得 token
      const token = req.headers.authorization || "";
      // 解密並驗證 token，並回傳內容
      req.decoded = await jwt.verify(
        crypto.decrypt(token, config.webConfig.TOKEN_CRYPTO_KEY),
        config.webConfig.JWT_SIGN_SECRET
      );
    }
    // 繼續執行
    next();
  } catch (e) {
    // 驗證 token 錯誤
    return res.status(400).json({ success: false, message: e.message });
  }
};

// 回傳中介函式
module.exports = middleware;
