// 引用套件
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const rateLimit = require("express-rate-limit");

// 初始化
const app = express();

const rate_limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 每個 IP 請求分鐘數
  max: 1000, // 最大請求數量
});

// 基礎設定
app.use(rate_limiter);
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 引用 API
require("./controller")(app);

// 監聽連線
app.listen(process.env.PORT || 3000);
