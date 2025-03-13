const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return winners.init(sequelize, DataTypes);
}

class winners extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('winners', {
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
      unique: "UQ__tmp_ms_x__65A475E6B5C6877C",
      field: 'UUID'
    },
    codeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Codes',
        key: 'ID'
      },
      field: 'CodeId'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Phone'
    },
    designer: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Designer'
    },
    prizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Prizes',
        key: 'ID'
      },
      field: 'PrizeId'
    },
    isExchange: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: 'IsExchange'
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ExpiryDate'
    },
    urlId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PrizeUrl',
        key: 'ID'
      },
      field: 'URLId'
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Remark'
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
    tableName: 'Winners',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Winners",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__tmp_ms_x__65A475E6B5C6877C",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
