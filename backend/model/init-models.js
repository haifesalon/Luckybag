const DataTypes = require("sequelize").DataTypes;
const _action = require("./action");
const _activity = require("./activity");
const _codes = require("./codes");
const _page = require("./page");
const _prizeUrl = require("./prize_url");
const _prizes = require("./prizes");
const _role = require("./role");
const _rolePageAction = require("./role_page_action");
const _user = require("./user");
const _userRole = require("./user_role");
const _winners = require("./winners");

function initModels(sequelize) {
  const action = _action(sequelize, DataTypes);
  const activity = _activity(sequelize, DataTypes);
  const codes = _codes(sequelize, DataTypes);
  const page = _page(sequelize, DataTypes);
  const prizeUrl = _prizeUrl(sequelize, DataTypes);
  const prizes = _prizes(sequelize, DataTypes);
  const role = _role(sequelize, DataTypes);
  const rolePageAction = _rolePageAction(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const userRole = _userRole(sequelize, DataTypes);
  const winners = _winners(sequelize, DataTypes);

  rolePageAction.belongsTo(action, { as: "action", foreignKey: "actionId"});
  action.hasMany(rolePageAction, { as: "rolePageActions", foreignKey: "actionId"});
  codes.belongsTo(activity, { as: "activity", foreignKey: "activityId"});
  activity.hasMany(codes, { as: "codes", foreignKey: "activityId"});
  prizes.belongsTo(activity, { as: "activity", foreignKey: "activityId"});
  activity.hasMany(prizes, { as: "prizes", foreignKey: "activityId"});
  winners.belongsTo(codes, { as: "code", foreignKey: "codeId"});
  codes.hasMany(winners, { as: "winners", foreignKey: "codeId"});
  rolePageAction.belongsTo(page, { as: "page", foreignKey: "pageId"});
  page.hasMany(rolePageAction, { as: "rolePageActions", foreignKey: "pageId"});
  winners.belongsTo(prizeUrl, { as: "url", foreignKey: "urlId"});
  prizeUrl.hasMany(winners, { as: "winners", foreignKey: "urlId"});
  prizeUrl.belongsTo(prizes, { as: "prize", foreignKey: "prizeId"});
  prizes.hasMany(prizeUrl, { as: "prizeUrls", foreignKey: "prizeId"});
  winners.belongsTo(prizes, { as: "prize", foreignKey: "prizeId"});
  prizes.hasMany(winners, { as: "winners", foreignKey: "prizeId"});
  rolePageAction.belongsTo(role, { as: "role", foreignKey: "roleId"});
  role.hasMany(rolePageAction, { as: "rolePageActions", foreignKey: "roleId"});
  userRole.belongsTo(role, { as: "role", foreignKey: "roleId"});
  role.hasMany(userRole, { as: "userRoles", foreignKey: "roleId"});
  userRole.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(userRole, { as: "userRoles", foreignKey: "userId"});

  return {
    action,
    activity,
    codes,
    page,
    prizeUrl,
    prizes,
    role,
    rolePageAction,
    user,
    userRole,
    winners,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
