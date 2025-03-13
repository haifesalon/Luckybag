const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return page.init(sequelize, DataTypes);
}

class page extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('page', {
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
      unique: "UQ__Page__65A475E6600A0A7C",
      field: 'UUID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'DisplayName'
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "UQ__Page__A15FA6CB8CE5D725",
      field: 'Path'
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'ParentId'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'Sort'
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Icon'
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
    tableName: 'Page',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Page",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Page__65A475E6600A0A7C",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
      {
        name: "UQ__Page__A15FA6CB8CE5D725",
        unique: true,
        fields: [
          { name: "Path" },
        ]
      },
    ]
  });
  }
}
