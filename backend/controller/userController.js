// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const config = require("../config");
const crypto = require("../helper/crypto");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");
const { getItemId } = require("../helper/utils");

const userService = require("../service/userService");
const userRoleService = require("../service/userRoleService");

// 路由
const router = express.Router();

// 系統設定
const webConfig = config.webConfig;

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "user";

// 新增使用者
router.post(
  "/",
  checkUserPermission(page_name, ActionType.CREATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['User']
        #swagger.path = "/api/user"
        #swagger.method = 'post'
        #swagger.summary = '新增使用者'
        #swagger.description = '傳入使用者資訊並建立使用者'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '使用者新增資訊',
            schema: { $role: '使用者角色', $realName: '真實姓名', $nickName: '暱稱', $account: '帳號', $password: '密碼', $isEnabled: '是否啟用' }
        }
    */
    try {
      // 密碼加密
      req.body.password = crypto.getHash(
        crypto.HashType.SHA512,
        req.body.password + webConfig.PWD_SALT
      );
      // 同時新增使用者資料並將使用者加入角色
      const { role, ...other } = req.body;
      const user = await userService.create(other, req.decoded.uuid);
      await userRoleService.create(
        {
          userId: user.id,
          roleId: await getItemId(db.role, role),
        },
        req.decoded.uuid
      );
      // #swagger.responses[201] = { description: '新增成功' }
      return res.status(201).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '新增失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 使用者查詢
router.get(
  "/",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
        #swagger.tags = ['User']
        #swagger.path = "/api/user"
        #swagger.method = 'get'
        #swagger.summary = '使用者查詢 (含分頁與搜尋)'
        #swagger.description = '列出所有使用者資訊 (含分頁與搜尋)'
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
            realName: { [Op.like]: `%${searchValue}%` },
          },
          {
            nickName: { [Op.like]: `%${searchValue}%` },
          },
          {
            account: { [Op.like]: `%${searchValue}%` },
          },
        ],
      };

      // 根據分頁資訊進行查詢
      const user = await userService.query({
        perPage,
        start,
        order,
        data: searchData,
        include: [
          {
            model: db.role,
            as: "role",
            attributes: ["uuid", "name", "isEnabled"],
          },
        ],
        attributes: [
          "uuid",
          "realName",
          "nickName",
          "account",
          "password",
          "isEnabled",
        ],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: user.data.map((item) => ({
          uuid: item.uuid,
          realName: item.realName,
          nickName: item.nickName,
          account: item.account,
          password: item.password,
          isEnabled: item.isEnabled,
          role: item.role[0]
            ? {
                uuid: item.role[0].uuid,
                name: item.role[0].name,
                isEnabled: item.role[0].isEnabled,
              }
            : null,
        })),
        recordsFiltered: user.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改使用者
router.patch(
  "/:uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['User']
        #swagger.path = "/api/user/{uuid}"
        #swagger.method = 'patch'
        #swagger.summary = '修改使用者'
        #swagger.description = '根據使用者編號，傳入使用者資訊並修改使用者'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '使用者編號'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '使用者修改資訊',
            schema: { $role: '使用者角色', $realName: '真實姓名', $nickName: '暱稱', $account: '帳號', $password: '密碼', $isEnabled: '是否啟用' }
        }
    */
    try {
      // 取得使用者資料
      const user = await userService.query({
        data: { uuid: req.params.uuid },
        include: [
          {
            model: db.role,
            as: "role",
          },
        ],
      });
      // 判斷是否要更新密碼
      const userData = user.data[0];
      if (req.body.password != userData.password) {
        req.body.password = crypto.getHash(
          crypto.HashType.SHA512,
          req.body.password + webConfig.PWD_SALT
        );
      }
      // 判斷是否要更新角色
      const { role, ...other } = req.body;
      const userRoleData = user.data[0].role[0];
      if (role != userRoleData.uuid) {
        await userRoleService.destroy({
          userId: userData.id,
          roleId: userRoleData.id,
        });
        await userRoleService.create(
          {
            userId: userData.id,
            roleId: await getItemId(db.role, role),
          },
          req.decoded.uuid
        );
      }
      // 更新使用者
      await userService.update(
        other,
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

// 刪除使用者
router.delete(
  "/:uuid",
  checkUserPermission(page_name, ActionType.DELETE),
  async (req, res) => {
    /* 
        #swagger.tags = ['User']
        #swagger.path = "/api/user/{uuid}"
        #swagger.method = 'delete'
        #swagger.summary = '刪除使用者'
        #swagger.description = '根據使用者編號刪除使用者'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '使用者編號'
        }
    */
    try {
      // 刪除使用者
      await userService.destroy({ uuid: req.params.uuid });
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
