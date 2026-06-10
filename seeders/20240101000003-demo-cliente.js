const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('cliente123', 10);

    await queryInterface.bulkInsert('Usuario', [
      {
        nombre: 'Cliente Demo',
        email: 'cliente@ferreteria.com',
        password: passwordHash,
        rol: 'cliente',
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuario', { email: 'cliente@ferreteria.com' }, {});
  }
};
