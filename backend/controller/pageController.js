// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const pageService = require("../service/pageService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "page";

// 新增頁面
router.post(
  "/",
  checkUserPermission(page_name, ActionType.CREATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Page']
        #swagger.path = "/api/page"
        #swagger.method = 'post'
        #swagger.summary = '新增頁面'
        #swagger.description = '傳入頁面資訊並建立頁面'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '頁面新增資訊',
            schema: { $name: '頁面名稱', $displayName: '頁面顯示名稱', $path: '路徑', $parentId: '父頁面編號', $sort: '排序', $icon: '圖標' }
        }
    */
    try {
      // 新增頁面
      await pageService.create(req.body, req.decoded.uuid);
      // #swagger.responses[201] = { description: '新增成功' }
      return res.status(201).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '新增失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 頁面查詢
router.get(
  "/",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
        #swagger.tags = ['Page']
        #swagger.path = "/api/page"
        #swagger.method = 'get'
        #swagger.summary = '頁面查詢 (含分頁與搜尋)'
        #swagger.description = '列出所有頁面資訊 (含分頁與搜尋)'
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
        [Op.or]: [
          {
            name: { [Op.like]: `%${searchValue}%` },
          },
          {
            path: { [Op.like]: `%${searchValue}%` },
          },
        ],
      };

      // 根據分頁資訊進行查詢
      const pages = await pageService.query({
        perPage,
        start,
        order,
        data: searchData,
        attributes: [
          "uuid",
          "name",
          "displayName",
          "path",
          "parentId",
          "sort",
          "icon",
        ],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: pages.data,
        recordsFiltered: pages.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改頁面
router.patch(
  "/:uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Page']
        #swagger.path = "/api/page/{uuid}"
        #swagger.method = 'patch'
        #swagger.summary = '修改頁面'
        #swagger.description = '根據頁面編號，傳入頁面資訊並修改頁面'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '頁面編號'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '頁面修改資訊',
            schema: { $name: '頁面名稱', $displayName: '頁面顯示名稱', $path: '路徑', $parentId: '父頁面編號', $sort: '排序', $icon: '圖標' }
        }
    */
    try {
      // 修改頁面
      await pageService.update(
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

// 刪除頁面
router.delete(
  "/:uuid",
  checkUserPermission(page_name, ActionType.DELETE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Page']
        #swagger.path = "/api/page/{uuid}"
        #swagger.method = 'delete'
        #swagger.summary = '刪除頁面'
        #swagger.description = '根據頁面編號刪除頁面'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '頁面編號'
        }
    */
    try {
      // 刪除頁面
      await pageService.destroy({ uuid: req.params.uuid });
      // #swagger.responses[200] = { description: '刪除成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '刪除失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 查詢所有父頁面
router.get(
  "/parent",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
      #swagger.tags = ['Page']
      #swagger.path = "/api/page/parent"
      #swagger.method = 'get'
      #swagger.summary = '查詢所有父頁面'
      #swagger.description = '列出所有父頁面資訊'
      #swagger.parameters['authorization'] = {
          in: 'header',
          required: true,
          description: '使用者權杖'
      }
    */
    try {
      // 進行父頁面 (即 parentId 為 null 的資料) 查詢
      const page = await pageService.query({
        data: { parentId: null },
        attributes: ["uuid", "name"],
      });
      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({ success: true, data: page.data });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
