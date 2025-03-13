const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return codes.init(sequelize, DataTypes);
}

class codes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('codes', {
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
      unique: "UQ__Codes__65A475E6A4673711",
      field: 'UUID'
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Activity',
        key: 'ID'
      },
      field: 'ActivityId'
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
    tableName: 'Codes',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Codes",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Codes__65A475E6A4673711",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
