// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");
const { getItemId } = require("../helper/utils");

const prizesService = require("../service/prizesService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "activity";

// 新增獎項
router.post(
  "/",
  checkUserPermission(page_name, ActionType.CREATE),
  async (req, res) => {
    /* 
          #swagger.tags = ['Prizes']
          #swagger.path = "/api/prizes"
          #swagger.method = 'post'
          #swagger.summary = '新增獎項'
          #swagger.description = '傳入獎項資訊並建立獎項'
          #swagger.parameters['authorization'] = {
              in: 'header',
              required: true,
              description: '使用者權杖'
          }
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              description: '獎項新增資訊',
              schema: { $name: '獎項名稱', $price: '價格', $time: '個數', $quantity: '獎項數量', $remainingQty: '剩餘數量', $type: '獎項類型', $isEnabled: '是否啟用', $activity_uuid: '活動編號' }
          }
      */
    try {
      // 取得活動編號
      const activityId = await getItemId(db.activity, req.body.activity_uuid);
      // 新增獎項
      await prizesService.create({ ...req.body, activityId }, req.decoded.uuid);
      // #swagger.responses[201] = { description: '新增成功' }
      return res.status(201).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '新增失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改獎項
router.patch(
  "/:uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
          #swagger.tags = ['Prizes']
          #swagger.path = "/api/prizes/{uuid}"
          #swagger.method = 'patch'
          #swagger.summary = '修改獎項'
          #swagger.description = '根據獎項編號，傳入獎項資訊並修改獎項'
          #swagger.parameters['authorization'] = {
              in: 'header',
              required: true,
              description: '使用者權杖'
          }
          #swagger.parameters['uuid'] = {
              in: 'path',
              required: true,
              description: '獎項編號'
          }
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              description: '獎項修改資訊',
              schema: { $name: '獎項名稱', $price: '價格', $time: '個數', $quantity: '獎項數量', $remainingQty: '剩餘數量', $type: '獎項類型', $isEnabled: '是否啟用' }
          }
      */
    try {
      // 修改獎項
      await prizesService.update(
        req.body,
        { uuid: req.params.uuid },
        req.decoded.uuid
      );
      // #swagger.responses[200] = { description: '修改成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '修改失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 刪除獎項
router.delete(
  "/:uuid",
  checkUserPermission(page_name, ActionType.DELETE),
  async (req, res) => {
    /* 
          #swagger.tags = ['Prizes']
          #swagger.path = "/api/prizes/{uuid}"
          #swagger.method = 'delete'
          #swagger.summary = '刪除獎項'
          #swagger.description = '根據獎項編號刪除獎項'
          #swagger.parameters['authorization'] = {
              in: 'header',
              required: true,
              description: '使用者權杖'
          }
          #swagger.parameters['uuid'] = {
              in: 'path',
              required: true,
              description: '獎項編號'
          }
      */
    try {
      // 刪除獎項
      await prizesService.destroy({ uuid: req.params.uuid });
      // #swagger.responses[200] = { description: '刪除成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '刪除失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 獎項查詢
router.get(
  "/:activity_uuid",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
            #swagger.tags = ['Prizes']
            #swagger.path = "/api/prizes/{activity_uuid}"
            #swagger.method = 'get'
            #swagger.summary = '獎項查詢 (含分頁與搜尋)'
            #swagger.description = '根據活動編號列出所有獎項資訊 (含分頁與搜尋)'
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
            name: { [Op.like]: `%${searchValue}%` },
          },
          ,
          {
            activityId: await getItemId(db.activity, req.params.activity_uuid),
          },
        ],
      };

      // 根據分頁資訊進行查詢
      const prizes = await prizesService.query({
        perPage,
        start,
        order,
        data: searchData,
        attributes: [
          "uuid",
          "name",
          "price",
          "time",
          "quantity",
          "remainingQty",
          "type",
          "isEnabled",
        ],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: prizes.data,
        recordsFiltered: prizes.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
