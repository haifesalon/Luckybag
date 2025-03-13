const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return action.init(sequelize, DataTypes);
}

class action extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('action', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('newid'),
      unique: "UQ__Action__65A475E67D3EE53C",
      field: 'UUID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UQ__Action__737584F6D41F211D",
      field: 'Name'
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
    tableName: 'Action',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Action",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Action__65A475E67D3EE53C",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
      {
        name: "UQ__Action__737584F6D41F211D",
        unique: true,
        fields: [
          { name: "Name" },
        ]
      },
    ]
  });
  }
}
