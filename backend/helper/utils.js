// 取得資料 id
const getItemId = async (table, uuid) => {
  try {
    const data = await table.findOne({ where: { uuid } });
    return data.id;
  } catch (e) {
    return e;
  }
};

// 回傳函式
module.exports = { getItemId };
