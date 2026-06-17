'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Producto', 'descripcion');
    await queryInterface.removeColumn('Producto', 'categoria');
    await queryInterface.addColumn('Producto', 'tipo', { type: Sequelize.STRING(80), allowNull: true, comment: 'Tipo/medida del producto (ej: pulgada 1/2, mm 10, metro)' });
    await queryInterface.addColumn('Producto', 'gtin', { type: Sequelize.STRING(50), allowNull: true, unique: true, comment: 'Codigo GTIN/EAN del producto' });
    await queryInterface.addColumn('Producto', 'disponibilidad', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, comment: 'Producto disponible para venta' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Producto', 'disponibilidad');
    await queryInterface.removeColumn('Producto', 'gtin');
    await queryInterface.removeColumn('Producto', 'tipo');
    await queryInterface.addColumn('Producto', 'categoria', { type: Sequelize.STRING(60), allowNull: false, defaultValue: 'General' });
    await queryInterface.addColumn('Producto', 'descripcion', { type: Sequelize.TEXT, allowNull: true });
  }
};
