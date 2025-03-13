// 匯入套件
const swaggerAutogen = require("swagger-autogen")();

// 輸出檔案
const outputFile = "../swagger.json";
// 執行檔案
const endpointsFiles = ["../app.js"];

// 文件基本設定
const doc = {
  info: {
    title: "Haife API",
  },
  host: "localhost:3000",
  tags: [
    {
      name: "Public",
      description: "對外公開相關",
    },
    {
      name: "Draw",
      description: "對外抽獎相關",
    },
    {
      name: "Dashboard",
      description: "管理首頁統計資訊相關",
    },
    {
      name: "Activity",
      description: "活動相關",
    },
    {
      name: "Codes",
      description: "序號相關",
    },
    {
      name: "Prizes",
      description: "獎項相關",
    },
    {
      name: "Winners",
      description: "中獎相關",
    },
    {
      name: "User",
      description: "使用者相關",
    },
    {
      name: "Role",
      description: "角色相關",
    },
    {
      name: "Page",
      description: "頁面相關",
    },
    {
      name: "Role Page Action",
      description: "角色頁面權限相關",
    },
  ],
};

// 自動產生文件
swaggerAutogen(outputFile, endpointsFiles, doc);
