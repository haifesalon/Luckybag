// 匯入套件和函式庫
const db = require("../model");
const config = require("../config");
const crypto = require("../helper/crypto");
const permission = require("../helper/permission");

const userService = require("./userService");

// 系統設定
const webConfig = config.webConfig;

// 驗證帳密
exports.auth = async (obj) => {
  // 取出帳號、密碼
  const { account, password } = obj;
  // 根據帳號查詢使用者與該使用者的角色資料
  const user = await userService.query({
    data: { account },
    attributes: ["uuid", "nickName", "password", "isEnabled", "authError"],
    include: [
      {
        model: db.role,
        as: "role",
        attributes: ["uuid", "isEnabled"],
      },
    ],
  });
  // 判斷帳號是否存在
  if (user.total) {
    // 取出使用者資料與其角色資料
    const userData = user.data[0];
    const userRoleData = userData.role[0];
    // 驗證密碼
    const isPasswordCorrect =
      userData.password ===
      crypto.getHash(crypto.HashType.SHA512, password + webConfig.PWD_SALT);
    // 判斷角色可用、帳號可用、密碼錯誤次數、密碼正確與否
    if (
      userRoleData.isEnabled &&
      userData.isEnabled &&
      userData.authError < 3 &&
      isPasswordCorrect
    ) {
      // 取得角色選單
      const menu = await permission.getRoleMenuPermission(userRoleData.uuid);
      // 將錯誤次數歸零並紀錄登入時間
      await userService.update(
        { authError: 0, lastLogin: new Date().getTime() },
        { uuid: userData.uuid },
        userData.uuid
      );
      // todo log: 驗證成功
      return {
        isAuth: true,
        user: {
          uuid: userData.uuid,
          name: userData.nickName,
        },
        menu,
      };
    }
    // 帳號或角色不可用
    if (!userRoleData.isEnabled || !userData.isEnabled) {
      // todo log: 帳號或角色不可用
      return { isAuth: false };
    }
    // 密碼錯誤超過三次，封鎖帳號
    if (userData.authError >= 3) {
      await userService.update(
        { authError: 0, isEnabled: false },
        { uuid: userData.uuid },
        userData.uuid
      );
      // todo log: 封鎖帳號
      return { isAuth: false };
    }
    // 密碼輸入錯誤 (錯誤次數增加一次)
    if (!isPasswordCorrect) {
      await userService.update(
        { authError: userData.authError + 1 },
        { uuid: userData.uuid },
        userData.uuid
      );
      // todo log: 密碼錯誤
      return { isAuth: false };
    }
  } else {
    // 帳號不存在
    return { isAuth: false };
  }
};
