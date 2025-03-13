const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return userRole.init(sequelize, DataTypes);
}

class userRole extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('userRole', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID'
      },
      field: 'UserId'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'ID'
      },
      field: 'RoleId'
    },
    modifyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'ModifyId'
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'ModifyTime'
    },
    createId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'CreateId'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'CreateTime'
    }
  }, {
    tableName: 'User_Role',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_User_Role",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
