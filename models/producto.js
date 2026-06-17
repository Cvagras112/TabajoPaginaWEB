const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.hasMany(models.DetalleCotizacion, { foreignKey: 'producto_id', as: 'detalles' });
    }
  }

  Producto.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    tipo: { type: DataTypes.STRING(80), allowNull: true },
    gtin: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00, validate: { min: 0 } },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    disponibilidad: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
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
