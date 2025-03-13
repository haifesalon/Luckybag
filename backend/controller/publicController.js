// 匯入套件和函式庫
const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../config");
const crypto = require("../helper/crypto");

const publicService = require("../service/publicService");

// 路由
const router = express.Router();

// 系統登入
router.post("/login", async (req, res) => {
  /* 
    #swagger.tags = ['Public']
    #swagger.path = "/api/public/login"
    #swagger.method = 'post'
    #swagger.summary = '系統登入'
    #swagger.description = '傳入帳號密碼並進行驗證登入'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $account: '帳號', $password: '密碼' }
    }
  */
  try {
    // 將帳號密碼進行驗證，回傳驗證是否合格、使用者資料、頁面選單
    const { isAuth, user, menu } = await publicService.auth(req.body);
    // 判斷驗證是否合格
    if (isAuth) {
      // 產生 JWT Token 並加密
      const token = crypto.encrypt(
        jwt.sign(
          { name: user.name, uuid: user.uuid },
          config.webConfig.JWT_SIGN_SECRET,
          { expiresIn: config.webConfig.JWT_EXPIRES }
        ),
        config.webConfig.TOKEN_CRYPTO_KEY
      );
      // #swagger.responses[200] = { description: '登入成功' }
      return res
        .status(200)
        .json({ success: isAuth, user: user.name, menu, token });
    } else {
      // #swagger.responses[403] = { description: '無法通過帳密驗證' }
      return res.status(403).json({ success: false });
    }
  } catch (error) {
    // #swagger.responses[400] = { description: '登入失敗' }
    return res.status(400).json({ success: false, message: error.message });
  }
});

// 導出路由
module.exports = router;
