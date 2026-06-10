const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
    }
  }

  Categoria.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true, validate: { notEmpty: true } },
    descripcion: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categoria',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Categoria;
};
