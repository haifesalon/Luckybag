// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");
const { getItemId } = require("../helper/utils");

const codesService = require("../service/codesService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "activity";

// 新增序號
router.post(
  "/",
  checkUserPermission(page_name, ActionType.CREATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Codes']
        #swagger.path = "/api/codes"
        #swagger.method = 'post'
        #swagger.summary = '新增序號'
        #swagger.description = '建立序號'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '序號新增資訊',
            schema: { $activity_uuid: '活動編號' }
        }
    */
    try {
      // 取得活動編號
      const activityId = await getItemId(db.activity, req.body.activity_uuid);
      // 新增序號
      await codesService.create({ activityId }, req.decoded.uuid);
      // #swagger.responses[201] = { description: '新增成功' }
      return res.status(201).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '新增失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除序號
router.delete(
  "/:uuid",
  checkUserPermission(page_name, ActionType.DELETE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Codes']
        #swagger.path = "/api/codes/{uuid}"
        #swagger.method = 'delete'
        #swagger.summary = '刪除序號'
        #swagger.description = '根據序號編號刪除序號'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '序號編號'
        }
    */
    try {
      // 刪除序號
      await codesService.destroy({ uuid: req.params.uuid });
      // #swagger.responses[200] = { description: '刪除成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '刪除失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 序號查詢
router.get(
  "/:activity_uuid",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
          #swagger.tags = ['Codes']
          #swagger.path = "/api/codes/{activity_uuid}"
          #swagger.method = 'get'
          #swagger.summary = '序號查詢 (含分頁與搜尋)'
          #swagger.description = '根據活動編號列出所有序號資訊 (含分頁與搜尋)'
          #swagger.parameters['activity_uuid'] = {
            in: 'path',
            required: true,
            description: '活動編號'
          }
          #swagger.parameters['authorization'] = {
              in: 'header',
              required: true,
              description: '使用者權杖'
          }
          #swagger.parameters['rowsPerPage'] = {
              in: 'query',
              required: false,
              description: '每頁筆數'
          }
          #swagger.parameters['page'] = {
              in: 'query',
              required: false,
              description: '目前頁數'
          }
          #swagger.parameters['sortBy'] = {
              in: 'query',
              required: false,
              description: '排序欄位'
          }
          #swagger.parameters['sortType'] = {
              in: 'query',
              required: false,
              description: '排序方式'
          }
          #swagger.parameters['search'] = {
              in: 'query',
              required: false,
              description: '搜尋資訊 (可空值)'
          }
      */
    try {
      // 分頁資訊
      const { rowsPerPage, page, sortBy, sortType, search = "" } = req.query;

      const perPage = rowsPerPage ? parseInt(rowsPerPage) : null;
      const currentPage = page ? parseInt(page) : null;
      const order = sortBy && sortType ? [sortBy, sortType] : null;
      const start = currentPage && perPage ? (currentPage - 1) * perPage : null;

      const searchValue = search.trim();
      const searchData = {
        [Op.and]: [
          {
            uuid: { [Op.like]: `%${searchValue}%` },
          },
          ,
          {
            activityId: await getItemId(db.activity, req.params.activity_uuid),
          },
        ],
      };

      // 根據分頁資訊進行查詢
      const codes = await codesService.query({
        perPage,
        start,
        order,
        data: searchData,
        attributes: ["uuid"],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: codes.data,
        recordsFiltered: codes.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
