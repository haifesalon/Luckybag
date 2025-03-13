const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return role.init(sequelize, DataTypes);
}

class role extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('role', {
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
      unique: "UQ__Role__65A475E67DE80EF3",
      field: 'UUID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "UQ__Role__737584F655B50AAC",
      field: 'Name'
    },
    isEnabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      field: 'IsEnabled'
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
    tableName: 'Role',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__tmp_ms_x__3214EC275193433D",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__Role__65A475E67DE80EF3",
        unique: true,
        fields: [
          { name: "UUID" },
        ]
      },
      {
        name: "UQ__Role__737584F655B50AAC",
        unique: true,
        fields: [
          { name: "Name" },
        ]
      },
    ]
  });
  }
}
