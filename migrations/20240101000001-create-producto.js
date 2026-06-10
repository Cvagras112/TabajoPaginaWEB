'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Producto', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      precio: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      categoria: { type: Sequelize.STRING(60), allowNull: false, defaultValue: 'General' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Producto');
  }
};
