// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");

const roleService = require("../service/roleService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "role";

// 新增角色
router.post(
  "/",
  checkUserPermission(page_name, ActionType.CREATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role']
        #swagger.path = "/api/role"
        #swagger.method = 'post'
        #swagger.summary = '新增角色'
        #swagger.description = '傳入角色資訊並建立角色'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '角色新增資訊',
            schema: { $name: '角色名稱', $isEnabled: '是否啟用' }
        }
    */
    try {
      // 新增角色
      await roleService.create(req.body, req.decoded.uuid);
      // #swagger.responses[201] = { description: '新增成功' }
      return res.status(201).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '新增失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 角色查詢
router.get(
  "/",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role']
        #swagger.path = "/api/role"
        #swagger.method = 'get'
        #swagger.summary = '角色查詢 (含分頁與搜尋)'
        #swagger.description = '列出所有角色資訊 (含分頁與搜尋)'
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
        ],
      };

      // 根據分頁資訊進行查詢
      const roles = await roleService.query({
        perPage,
        start,
        order,
        data: searchData,
        attributes: ["uuid", "name", "isEnabled"],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: roles.data,
        recordsFiltered: roles.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改角色
router.patch(
  "/:uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role']
        #swagger.path = "/api/role/{uuid}"
        #swagger.method = 'patch'
        #swagger.summary = '修改角色'
        #swagger.description = '根據角色編號，傳入角色資訊並修改角色'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '角色編號'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '角色修改資訊',
            schema: { $name: '角色名稱', $isEnabled: '是否啟用' }
        }
    */
    try {
      // 修改角色
      await roleService.update(
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

// 刪除角色
router.delete(
  "/:uuid",
  checkUserPermission(page_name, ActionType.DELETE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role']
        #swagger.path = "/api/role/{uuid}"
        #swagger.method = 'delete'
        #swagger.summary = '刪除角色'
        #swagger.description = '根據角色編號刪除角色'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '角色編號'
        }
    */
    try {
      // 刪除角色
      await roleService.destroy({ uuid: req.params.uuid });
      // #swagger.responses[200] = { description: '刪除成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '刪除失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
