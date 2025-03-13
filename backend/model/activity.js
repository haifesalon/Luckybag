const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return activity.init(sequelize, DataTypes);
}

class activity extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('activity', {
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
      unique: "UQ__Activity__65A475E66CAF9D05",
      field: 'UUID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'StartTime'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'EndTime'
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
    tableName: 'Activity',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Activity",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Activity__65A475E66CAF9D05",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
    ]
  });
  }
}
