// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");
const { getItemId } = require("../helper/utils");

const pageService = require("../service/pageService");
const actionService = require("../service/actionService");
const rolePageActionService = require("../service/rolePageActionService");

// 路由
const router = express.Router();

// 頁面名稱
const page_name = "role";

// 取得角色頁面權限
router.get(
  "/:role_uuid",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role Page Action']
        #swagger.path = "/api/rolePageAction/{role_uuid}"
        #swagger.method = 'get'
        #swagger.summary = '取得角色頁面權限'
        #swagger.description = '根據角色編號進行頁面權限查詢'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['role_uuid'] = {
            in: 'path',
            required: true,
            description: '角色編號'
        }
    */
    try {
      // 取得角色 ID
      const roleId = await getItemId(db.role, req.params.role_uuid);

      // 查詢所有所需資料
      const [pagesData, actionsData, rolePageActionsData] = await Promise.all([
        pageService.query({}),
        actionService.query({}),
        rolePageActionService.query({ data: { roleId } }),
      ]);

      // 產生 action ID 與名稱對應表
      const actionMap = actionsData.data.reduce((map, action) => {
        map[action.id] = { name: action.name, uuid: action.uuid };
        return map;
      }, {});

      // 產生頁面與權限對應表
      const pageActionMap = rolePageActionsData.data.reduce((map, item) => {
        const pageId = item.pageId;
        const actionId = item.actionId;
        (map[pageId] ||= []).push(actionId);
        return map;
      }, {});

      // 透過兩對應表取得角色頁面權限
      const permission = pagesData.data.map((page) => ({
        page: page.displayName,
        page_uuid: page.uuid,
        ...Object.values(actionMap).reduce((result, action) => {
          const actionId = +Object.keys(actionMap).find(
            (id) => actionMap[id].uuid === action.uuid
          );
          result[action.name] = (pageActionMap[page.id] || []).includes(
            actionId
          );
          return result;
        }, {}),
      }));

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: { actions: Object.values(actionMap), permission },
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 修改角色頁面權限
router.patch(
  "/:role_uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Role Page Action']
        #swagger.path = "/api/rolePageAction/{role_uuid}"
        #swagger.method = 'patch'
        #swagger.summary = '修改角色頁面權限'
        #swagger.description = '根據角色編號進行頁面權限修改'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['role_uuid'] = {
            in: 'path',
            required: true,
            description: '角色編號'
        },
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '頁面權限修改資訊',
            schema: { $page_uuid: '頁面編號', $action_uuid: '操作編號', $isCheck: '狀態' }
        }
    */
    try {
      // 頁面權限修改資訊
      const { page_uuid, action_uuid, isCheck } = req.body;
      // 分別取得各自 ID
      const [roleId, pageId, actionId] = await Promise.all([
        getItemId(db.role, req.params.role_uuid),
        getItemId(db.page, page_uuid),
        getItemId(db.action, action_uuid),
      ]);
      // 判斷狀態
      if (isCheck) {
        // 若勾選表示新增頁面權限
        await rolePageActionService.create(
          { roleId, pageId, actionId },
          req.decoded.uuid
        );
      } else {
        // 若取消勾選表示表示刪除頁面權限
        await rolePageActionService.destroy({ roleId, pageId, actionId });
      }
      // #swagger.responses[200] = { description: '修改成功' }
      return res.status(200).json({ success: true });
    } catch (e) {
      // #swagger.responses[400] = { description: '修改失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
