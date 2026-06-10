const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Usuario', [
      {
        nombre: 'Administrador',
        email: 'admin@ferreteria.com',
        password: passwordHash,
        rol: 'admin',
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuario', { email: 'admin@ferreteria.com' }, {});
  }
};
