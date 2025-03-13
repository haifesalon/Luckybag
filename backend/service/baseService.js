// 匯入資料庫 model 和套件
const db = require("../model");
const { getItemId } = require("../helper/utils");

const sequelize = db.sequelize;

module.exports = (table) => {
  /**
   * 查詢資料
   *
   * 如果條件為空 -> 查詢全部
   * 如果有條件 -> 根據條件查詢資料
   */
  const query = async (condition) => {
    const data = await table.findAndCountAll({
      where: condition.data ?? {},
      order: [condition.order ?? ["id", "asc"]],
      limit: condition.perPage ?? null,
      offset: condition.start ?? null,
      include: condition.include ?? null,
      attributes: condition.attributes ?? null,
    });
    return { data: data.rows, total: data.count };
  };

  // 新增資料
  const create = async (obj, uuid) => {
    const t = await sequelize.transaction();
    try {
      const userId = await getItemId(db.user, uuid);
      const data = await table.create(
        { ...obj, createId: userId, modifyId: userId },
        { transaction: t }
      );
      await t.commit();
      return data;
    } catch (e) {
      console.log(e);
      await t.rollback();
    }
  };

  // 更新資料
  const update = async (obj, condition, uuid) => {
    const t = await sequelize.transaction();
    try {
      const userId = await getItemId(db.user, uuid);
      const data = await table.update(
        { ...obj, modifyId: userId, modifyTime: new Date().getTime() },
        { where: condition },
        { transaction: t }
      );
      await t.commit();
      return data;
    } catch (e) {
      await t.rollback();
    }
  };

  // 刪除資料
  const destroy = async (condition) => {
    const t = await sequelize.transaction();
    try {
      const data = await table.destroy(
        { where: condition },
        { transaction: t }
      );
      await t.commit();
      return data;
    } catch (e) {
      await t.rollback();
    }
  };

  return { query, create, update, destroy };
};
