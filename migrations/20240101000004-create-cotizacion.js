'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cotizacion', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cliente_nombre: { type: Sequelize.STRING(150), allowNull: false },
      fecha: { type: Sequelize.DATEONLY, allowNull: false },
      total: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
      estado: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pendiente' },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('DetalleCotizacion', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cotizacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cotizacion', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Producto', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      cantidad: { type: Sequelize.INTEGER, allowNull: false },
      precio_unitario: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('DetalleCotizacion');
    await queryInterface.dropTable('Cotizacion');
  }
};
