const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
    }
  }

  Usuario.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'vendedor' },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Usuario;
};
