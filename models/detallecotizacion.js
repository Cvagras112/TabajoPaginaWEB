const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleCotizacion extends Model {
    static associate(models) {
      DetalleCotizacion.belongsTo(models.Cotizacion, { foreignKey: 'cotizacion_id', as: 'cotizacion' });
      DetalleCotizacion.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
    }
  }

  DetalleCotizacion.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cotizacion_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    sequelize,
    modelName: 'DetalleCotizacion',
    tableName: 'DetalleCotizacion',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return DetalleCotizacion;
};
