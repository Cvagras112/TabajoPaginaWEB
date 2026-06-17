'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Producto', 'categoria_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Categoria', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Producto', 'categoria_id');
  }
};
