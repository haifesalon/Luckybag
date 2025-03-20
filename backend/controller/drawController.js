// 匯入套件和函式庫
const moment = require("moment");
const express = require("express");

const db = require("../model");
const config = require("../config");
const crypto = require("../helper/crypto");
const shuffle = require("../helper/shuffle");
const { getItemId } = require("../helper/utils");

const codesService = require("../service/codesService");
const prizesService = require("../service/prizesService");
const winnersService = require("../service/winnersService");
const prizeUrlService = require("../service/prizeUrlService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 抽獎
router.post("/", async (req, res) => {
  /* 
      #swagger.tags = ['Draw']
      #swagger.path = "/api/draw"
      #swagger.method = 'post'
      #swagger.summary = '抽獎'
      #swagger.description = '進行抽獎'
      #swagger.parameters['code'] = {
          in: 'query',
          required: true,
          description: '抽獎序號'
      }
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          description: '抽獎者資訊',
          schema: { $userName: '抽獎者姓名', $phone: '聯絡電話', $designer: '設計師' }
      }
  */
  try {
    // 取得抽獎序號
    const { code } = req.query;
    // 取得抽獎者資訊
    const { userName, phone, designer } = req.body;
    // 檢驗是否傳入抽獎序號與抽獎者資訊
    if (code && userName && phone && designer) {
      // 查詢抽獎序號是否存在
      const codes = await codesService.query({
        data: { uuid: code },
      });
      // 抽獎序號存在
      if (codes.total) {
        // 取得抽獎序號相關資訊
        const codes_data = codes.data[0];
        // 利用序號查詢抽獎者資訊
        const winners = await winnersService.query({
          data: { codeId: codes_data.id },
        });
        // 無資料表示尚未抽獎，即進行抽獎
        if (!winners.total) {
          // 獎項必須要開放、剩餘數量必須大於 0
          const prizes = await prizesService.query({
            data: {
              [Op.and]: [
                { isEnabled: true },
                { remainingQty: { [Op.gt]: 0 } },
                { activityId: codes_data.activityId },
              ],
            },
            attributes: [
              "uuid",
              "name",
              "time",
              "price",
              "remainingQty",
              "type",
            ],
          });
          // 取出剩餘獎項
          if (prizes.total) {
            // 取出獎項 uuid 並打亂放入陣列
            const prize_uuid_array = shuffle.shuffleArray(
              prizes.data
                .flatMap((item) => Array(item.remainingQty).fill(item.uuid))
                .sort()
            );
            // 隨機抽出一個獎項
            const draw =
              prize_uuid_array[
                Math.floor(Math.random() * prize_uuid_array.length)
              ];
            // 取得獎項資訊
            const prize_data = prizes.data.find((item) => item.uuid === draw);
            // 更新獎項剩餘數量
            await prizesService.update(
              { remainingQty: prize_data.remainingQty - 1 },
              { uuid: draw },
              config.webConfig.DEFAULT_USER_UUID
            );
            // 判斷是否為票券，並取得票券URL
            let prizeUrlUuid = null;
            if (prize_data.type === 1) {
              const prizeUrl_Data = (
                await prizeUrlService.query({
                  data: {
                    [Op.and]: [
                      { issued: false },
                      { prizeId: await getItemId(db.prizes, draw) },
                    ],
                  },
                  perPage: 1,
                })
              ).data[0];
              await prizeUrlService.update(
                { issued: true },
                { uuid: prizeUrl_Data.uuid },
                config.webConfig.DEFAULT_USER_UUID
              );
              prizeUrlUuid = prizeUrl_Data.uuid;
            }
            // 新增 winner
            await winnersService.create(
              {
                codeId: codes_data.id,
                name: userName,
                phone,
                designer,
                prizeId: await getItemId(db.prizes, draw),
                urlId: prizeUrlUuid
                  ? await getItemId(db.prizeUrl, prizeUrlUuid)
                  : null,
                expiryDate: moment("2025-10-01T08:00:00"),
                isExchange: prize_data.type === 1 ? true : false,
              },
              config.webConfig.DEFAULT_USER_UUID
            );
            // #swagger.responses[200] = { description: '抽獎成功' }
            return res.status(200).json({ success: true, data: { uuid: prize_data.uuid, name: prize_data.name } });
          }
        }
      }
    }
    // #swagger.responses[400] = { description: '抽獎失敗' }
    return res.status(400).json({ success: false });
  } catch (e) {
    // #swagger.responses[400] = { description: '抽獎失敗' }
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 查核抽獎序號
router.post("/verify", async (req, res) => {
  /* 
      #swagger.tags = ['Draw']
      #swagger.path = "/api/draw/verify"
      #swagger.method = 'post'
      #swagger.summary = '查核抽獎序號'
      #swagger.description = '查核抽獎序號'
      #swagger.parameters['code'] = {
          in: 'body',
          required: true,
          description: '抽獎序號'
      }
  */
  try {
    // 取得抽獎序號
    const { code } = req.body;
    // 查詢抽獎序號資訊
    const codes_data = await codesService.query({
      data: { uuid: code },
    });
    // 判斷抽獎序號是否存在
    if (codes_data.total) {
      // 查詢中獎者資訊
      const winners_data = await winnersService.query({
        data: { codeId: await getItemId(db.codes, code) },
      });
      // 判斷是否有抽過獎，有資料表示抽過，無資料表示未抽過
      if (winners_data.total) {
        // #swagger.responses[200] = { description: '查詢成功' }
        return res.status(200).json({
          success: true,
          isValid: true,
          isDraw: true,
        });
      } else {
        // #swagger.responses[200] = { description: '查詢成功' }
        return res.status(200).json({
          success: true,
          isValid: true,
          isDraw: false,
        });
      }
    }
    // #swagger.responses[200] = { description: '查詢成功' }
    return res.status(200).json({
      success: true,
      isValid: false,
      isDraw: false,
    });
  } catch (e) {
    // #swagger.responses[400] = { description: '查詢失敗' }
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 店內核銷
router.post("/exchange", async (req, res) => {
  /* 
      #swagger.tags = ['Draw']
      #swagger.path = "/api/draw/exchange"
      #swagger.method = 'post'
      #swagger.summary = '店內核銷'
      #swagger.description = '店內核銷'
      #swagger.parameters['code'] = {
          in: 'query',
          required: true,
          description: '抽獎序號'
      }
      #swagger.parameters['checkCode'] = {
          in: 'body',
          required: true,
          description: '核銷驗證碼'
      }
  */
  try {
    // 取得抽獎序號
    const codes_data = await codesService.query({
      data: { uuid: req.query.code },
    });
    // 驗證
    if (
      codes_data.total &&
      req.body.checkCode ===
        crypto.decrypt(
          config.webConfig.CHECK_CODE,
          config.webConfig.CHECK_CODE_KEY
        )
    ) {
      // 更新中獎資訊
      await winnersService.update(
        { isExchange: true },
        { codeId: await getItemId(db.codes, req.query.code) },
        config.webConfig.DEFAULT_USER_UUID
      );
      // #swagger.responses[200] = { description: '核銷成功' }
      return res.status(200).json({ success: true, isValid: true });
    }
    // #swagger.responses[200] = { description: '核銷成功' }
    return res.status(200).json({ success: true, isValid: false });
  } catch (e) {
    // #swagger.responses[400] = { description: '核銷失敗' }
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 取得所有獎項
router.get("/prizes", async (req, res) => {
  /* 
      #swagger.tags = ['Draw']
      #swagger.path = "/api/draw/prizes"
      #swagger.method = 'get'
      #swagger.summary = '取得所有獎項'
      #swagger.description = '列出所有獎項'
      #swagger.parameters['code'] = {
          in: 'query',
          required: true,
          description: '抽獎序號'
      }
  */
  try {
    // 取得抽獎序號
    const { code } = req.query;
    // 取出所有獎項
    const result = await codesService.query({
      data: { uuid: code },
      include: [
        {
          model: db.activity,
          as: "activity",
          include: [
            {
              model: db.prizes,
              as: "prizes",
              where: { isEnabled: true },
              attributes: ["uuid", "name"],
            },
          ],
        },
      ],
    });
    // 將獎項轉換為轉盤所需格式
    const prizeArray = [];
    result.data[0].activity.prizes.forEach((element, index) => {
      prizeArray.push({
        id: element.uuid,
        fonts: [
          {
            text: element.name,
            top: "10%",
            fontSize: "12px",
            fontWeight: "600",
          },
        ],
        background: index % 2 ? "#e9e8fe" : "#b8c5f2",
      });
    });
    // #swagger.responses[200] = { description: '查詢成功' }
    return res.status(200).json({ success: true, data: prizeArray });
  } catch (e) {
    // #swagger.responses[400] = { description: '查詢失敗' }
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 取得中獎獎項
router.get("/winner", async (req, res) => {
  /* 
      #swagger.tags = ['Draw']
      #swagger.path = "/api/draw/winner"
      #swagger.method = 'get'
      #swagger.summary = '取得中獎獎項'
      #swagger.description = '取得中獎獎項'
      #swagger.parameters['code'] = {
          in: 'query',
          required: true,
          description: '抽獎序號'
      }
  */
  try {
    // 取得抽獎序號
    const { code } = req.query;
    // 取得中獎獎項資訊
    const data = (
      await winnersService.query({
        data: { codeId: await getItemId(db.codes, code) },
        include: [
          {
            model: db.prizes,
            as: "prize",
            attributes: ["uuid", "name", "price", "time", "type"],
          },
          {
            model: db.prizeUrl,
            as: "url",
            attributes: ["uuid", "url"],
          },
        ],
        attributes: ["uuid", "name", "phone", "designer", "isExchange"],
      })
    ).data[0];
    // #swagger.responses[200] = { description: '查詢成功' }
    return res.status(200).json({ success: true, data });
  } catch (e) {
    // #swagger.responses[400] = { description: '查詢失敗' }
    return res.status(400).json({ success: false, message: e.message });
  }
});

// 導出路由
module.exports = router;
