// 匯入資料庫 model 和檔案
const db = require("../model");

const userService = require("../service/userService");
const roleService = require("../service/roleService");

// 使用者頁面權限檢查
exports.checkUserPermission = (page, action) => {
  return async (req, res, next) => {
    try {
      // 透過使用者 uuid 查詢頁面權限
      const permission = await userService.query({
        data: { uuid: req.decoded.uuid },
        include: [
          {
            model: db.role,
            as: "role",
            include: {
              model: db.rolePageAction,
              as: "rolePageActions",
              include: [
                {
                  model: db.page,
                  as: "page",
                  where: { path: page },
                  attributes: ["uuid", "name"],
                },
                {
                  model: db.action,
                  as: "action",
                  where: { name: action },
                  attributes: ["uuid", "name"],
                },
              ],
            },
          },
        ],
      });

      // 檢查該使用者是否存在角色頁面權限
      if (permission.data[0].role[0].rolePageActions.length) {
        // 若驗證成功則通過驗證繼續執行後續動作
        return next();
      } else {
        // #swagger.responses[403] = { description: '使用者沒有角色頁面權限' }
        return res.status(403).json({ success: false });
      }
    } catch (e) {
      // #swagger.responses[400] = { description: '驗證失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  };
};

// 取得角色選單權限
exports.getRoleMenuPermission = async (role_uuid) => {
  try {
    // 根據角色 uuid 列出有權限的頁面
    const roleMenuPermissions = await roleService.query({
      data: { uuid: role_uuid },
      include: {
        model: db.rolePageAction,
        as: "rolePageActions",
        include: [
          {
            model: db.page,
            as: "page",
            attributes: [
              "uuid",
              "displayName",
              "path",
              "parentId",
              "sort",
              "icon",
            ],
          },
        ],
      },
    });
    // 取出所有頁面
    const pages = Array.from(
      new Map(
        roleMenuPermissions.data[0].rolePageActions.map((rpa) => [
          rpa.page.uuid,
          rpa.page,
        ])
      ).values()
    );
    // 取出父頁面
    const menu = pages
      .filter((page) => page.parentId === null)
      .map((page) => ({
        uuid: page.uuid,
        name: page.path,
        displayName: page.displayName,
        meta: { icon: page.icon },
      }));
    // 取出子頁面合併進父頁面
    pages
      .filter((page) => page.parentId !== null)
      .map((page) => {
        const parentPage = menu.find((parent) => parent.uuid === page.parentId);
        if (parentPage.children) {
          // 若已經有子頁面則插入
          parentPage.children.push({
            uuid: page.uuid,
            name: page.path,
            displayName: page.displayName,
            meta: { icon: page.icon },
          });
        } else {
          // 若沒有子頁面則建立新陣列
          parentPage.children = [
            {
              uuid: page.uuid,
              name: page.path,
              displayName: page.displayName,
              meta: { icon: page.icon },
            },
          ];
        }
      });
    // 回傳選單
    return menu;
  } catch (e) {
    // 回傳錯誤資訊
    return e.message;
  }
};
