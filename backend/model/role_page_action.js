const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return rolePageAction.init(sequelize, DataTypes);
}

class rolePageAction extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('rolePageAction', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
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
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Page',
        key: 'ID'
      },
      field: 'PageId'
    },
    actionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Action',
        key: 'ID'
      },
      field: 'ActionId'
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
    tableName: 'Role_Page_Action',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Role_Page_Action",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
