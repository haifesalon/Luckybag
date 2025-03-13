const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return prizeUrl.init(sequelize, DataTypes);
}

class prizeUrl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('prizeUrl', {
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
      unique: "UQ__PrizeUrl__65A475E614E142AA",
      field: 'UUID'
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
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'URL'
    },
    issued: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: 'Issued'
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
    tableName: 'PrizeUrl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PrizeUrl",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__PrizeUrl__65A475E614E142AA",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
