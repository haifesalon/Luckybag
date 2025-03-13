// 匯入套件和函式庫
const express = require("express");

const db = require("../model");
const { checkUserPermission } = require("../helper/permission");
const { ActionType } = require("../helper/actionType");
const { getItemId } = require("../helper/utils");

const winnersService = require("../service/winnersService");

// 路由
const router = express.Router();

// 資料庫參數
const Op = db.op;

// 頁面名稱
const page_name = "activity";

// 修改中獎人
router.patch(
  "/:uuid",
  checkUserPermission(page_name, ActionType.UPDATE),
  async (req, res) => {
    /* 
        #swagger.tags = ['Winners']
        #swagger.path = "/api/winners/{uuid}"
        #swagger.method = 'patch'
        #swagger.summary = '修改中獎人'
        #swagger.description = '根據中獎人編號，傳入中獎資訊並修改中獎人'
        #swagger.parameters['authorization'] = {
            in: 'header',
            required: true,
            description: '使用者權杖'
        }
        #swagger.parameters['uuid'] = {
            in: 'path',
            required: true,
            description: '中獎人編號'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            description: '中獎人修改資訊',
            schema: { $isExchange: '是否兌換', $remark: '備註' }
        }
    */
    try {
      // 修改活動
      await winnersService.update(
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

// 中獎人查詢
router.get(
  "/:activity_uuid",
  checkUserPermission(page_name, ActionType.READ),
  async (req, res) => {
    /* 
            #swagger.tags = ['Winners']
            #swagger.path = "/api/winners/{activity_uuid}"
            #swagger.method = 'get'
            #swagger.summary = '中獎人查詢 (含分頁與搜尋)'
            #swagger.description = '根據活動編號列出所有中獎人資訊 (含分頁與搜尋)'
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
            [Op.or]: [
              {
                name: { [Op.like]: `%${searchValue}%` },
              },
              {
                Phone: { [Op.like]: `%${searchValue}%` },
              },
              {
                Designer: { [Op.like]: `%${searchValue}%` },
              },
            ],
          },
        ],
      };

      // 根據分頁資訊進行查詢
      const winners = await winnersService.query({
        perPage,
        start,
        order,
        data: searchData,
        attributes: [
          "uuid",
          "name",
          "phone",
          "designer",
          "isExchange",
          "expiryDate",
        ],
        include: [
          {
            model: db.codes,
            as: "code",
            attributes: ["uuid"],
            where: {
              activityId: await getItemId(
                db.activity,
                req.params.activity_uuid
              ),
            },
          },
          {
            model: db.prizes,
            as: "prize",
            attributes: ["uuid", "name"],
          },
          {
            model: db.prizeUrl,
            as: "url",
            attributes: ["uuid", "url", "issued"],
          },
        ],
      });

      // #swagger.responses[200] = { description: '查詢成功' }
      return res.status(200).json({
        success: true,
        data: winners.data,
        recordsFiltered: winners.total,
      });
    } catch (e) {
      // #swagger.responses[400] = { description: '查詢失敗' }
      return res.status(400).json({ success: false, message: e.message });
    }
  }
);

// 導出路由
module.exports = router;
