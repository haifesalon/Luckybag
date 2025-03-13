// 自定義關聯
module.exports = (db) => {
  db.user.belongsToMany(db.role, {
    through: db.userRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "role",
  });

  db.role.belongsToMany(db.user, {
    through: db.userRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "user",
  });
};
