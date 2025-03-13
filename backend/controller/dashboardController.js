// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const activityService = require("../service/activityService");

// 路由
const router = express.Router();

// 頁面名稱
const page_name = "home";

// 數據查詢
router.get(
  "/",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
        #swagger.tags = ['Dashboard']
        #swagger.path = "/api/dashboard"
        #swagger.method = 'get'
        #swagger.summary = '數據查詢'
        #swagger.description = '列出所有數據資訊'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['activity_uuid'] = {
            in: 'query',
            required: true,
            description: '活動編號'
        }
    */
    try {
      // 取得活動編號
      const { activity_uuid } = req.query;
      // 查詢數據
      const result = await activityService.query({
        data: { uuid: activity_uuid },
        include: [
          {
            model: db.prizes,
            as: "prizes",
            where: { isEnabled: true },
            include: [
              {
                model: db.winners,
                as: "winners",
                attributes: ["uuid", "isExchange"],
              },
            ],
            attributes: ["uuid", "name", "quantity", "remainingQty", "type"],
          },
        ],
        attributes: ["uuid", "name", "startTime", "endTime"],
      });
      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({ success: true, data: result.data[0] });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
