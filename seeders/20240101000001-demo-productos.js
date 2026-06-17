'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Producto', [
      { nombre: 'Martillo carpintero 16 oz', tipo: '16 oz', gtin: '7801234560001', precio: 5990, stock: 45, disponibilidad: true, categoria_id: 1, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Tornillo madera 2 pulgadas (50 piezas)', tipo: 'pulgada 2', gtin: '7801234560002', precio: 1490, stock: 200, disponibilidad: true, categoria_id: 3, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Pintura latex blanco 19L', tipo: '19 litros', gtin: '7801234560003', precio: 28990, stock: 15, disponibilidad: true, categoria_id: 4, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Cable electrico 2.5mm rollo 100m', tipo: '2.5 mm', gtin: '7801234560004', precio: 23490, stock: 25, disponibilidad: true, categoria_id: 6, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Tubo PVC sanitario 110mm x 3m', tipo: '110 mm', gtin: '7801234560005', precio: 8990, stock: 60, disponibilidad: true, categoria_id: 5, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Taladro percutor 850W', tipo: '850W', gtin: '7801234560006', precio: 79990, stock: 8, disponibilidad: true, categoria_id: 2, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Manguera jardin reforzada 15m', tipo: '1/2 pulgada', gtin: '7801234560007', precio: 9990, stock: 30, disponibilidad: true, categoria_id: 7, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Casco seguridad amarillo', tipo: 'estandar', gtin: '7801234560008', precio: 4990, stock: 40, disponibilidad: true, categoria_id: 8, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Silicona selladora transparente 280ml', tipo: '280 ml', gtin: '7801234560009', precio: 3490, stock: 100, disponibilidad: true, categoria_id: 5, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Cerrojo seguridad puerta 60mm', tipo: '60 mm', gtin: '7801234560010', precio: 12990, stock: 22, disponibilidad: true, categoria_id: 1, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Llave ajustable 12 pulgadas', tipo: 'pulgada 12', gtin: '7801234560011', precio: 15990, stock: 15, disponibilidad: true, categoria_id: 1, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Clavo acero 4 pulgadas (1kg)', tipo: 'pulgada 4', gtin: '7801234560012', precio: 2990, stock: 80, disponibilidad: true, categoria_id: 3, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Cinta metrica 5 metros', tipo: '5 metros', gtin: '7801234560013', precio: 3490, stock: 50, disponibilidad: true, categoria_id: 1, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Broca concreto 10mm', tipo: '10 mm', gtin: '7801234560014', precio: 1990, stock: 35, disponibilidad: true, categoria_id: 2, created_at: new Date(), updated_at: new Date() },
      { nombre: 'Guantes trabajo cuero', tipo: 'talla L', gtin: '7801234560015', precio: 7990, stock: 25, disponibilidad: false, categoria_id: 8, created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Producto', null, {});
  }
};
