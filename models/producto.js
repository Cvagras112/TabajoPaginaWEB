const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
    }
  }

  Producto.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoria: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'General' }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'Producto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Producto;
};
