'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Categoria', [
      { nombre: 'Herramientas Manuales', descripcion: 'Martillos, destornilladores, llaves, alicates y mas', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Herramientas Electricas', descripcion: 'Taladros, sierras, amoladoras y herramientas a bateria', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Tornilleria', descripcion: 'Tornillos, tuercas, clavos, pernos y anclajes', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Pinturas', descripcion: 'Latex, esmalte, barnices, brochas y accesorios', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Plomeria', descripcion: 'Tuberias PVC, conexiones, llaves de paso y selladores', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Electricidad', descripcion: 'Cables, enchufes, interruptores, cajas y protecciones', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Jardineria', descripcion: 'Mangueras, regadores, tierra de hoja y herramientas de jardin', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Seguridad Industrial', descripcion: 'Cascos, guantes, lentes y proteccion personal', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Categoria', null, {});
  }
};
