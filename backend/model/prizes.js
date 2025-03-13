const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return prizes.init(sequelize, DataTypes);
}

class prizes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('prizes', {
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
      unique: "UQ__Prizes__65A475E6E868517E",
      field: 'UUID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Price'
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Time'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Quantity'
    },
    remainingQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'RemainingQty'
    },
    isEnabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      field: 'IsEnabled'
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
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'Type'
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
    tableName: 'Prizes',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Prizes",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Prizes__65A475E6E868517E",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
