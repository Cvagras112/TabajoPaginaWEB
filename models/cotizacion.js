const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cotizacion extends Model {
    static associate(models) {
      Cotizacion.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
      Cotizacion.hasMany(models.DetalleCotizacion, { foreignKey: 'cotizacion_id', as: 'detalles' });
    }
  }

  Cotizacion.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    fecha: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
    estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pendiente' },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Cotizacion',
    tableName: 'Cotizacion',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Cotizacion;
};
