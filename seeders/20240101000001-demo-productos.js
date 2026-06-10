'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Producto', [
      { nombre: 'Martillo de acero 16 oz', descripcion: 'Martillo de acero forjado con mango de goma.', precio: 125.50, stock: 45, categoria: 'Herramientas', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Tornillo para madera 2" (50 piezas)', descripcion: 'Paquete de 50 tornillos, cabeza plana, zincado.', precio: 35.00, stock: 200, categoria: 'Tornilleria', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Pintura blanca vinilica 19 L', descripcion: 'Pintura vinilica blanca, cubrimiento 50 m².', precio: 650.00, stock: 15, categoria: 'Pinturas', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Cable electrico calibre 12 (rollo 100 m)', descripcion: 'Cable de cobre calibre 12, forro PVC.', precio: 430.00, stock: 25, categoria: 'Electricidad', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Tubo PVC sanitario 4" x 3 m', descripcion: 'Tubo PVC sanitario 4 pulgadas, para desague.', precio: 185.00, stock: 60, categoria: 'Plomeria', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Taladro inalambrico 18V', descripcion: 'Taladro inalambrico con bateria de litio y maletin.', precio: 1250.00, stock: 8, categoria: 'Herramientas', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Manguera para jardin 1/2" 15 m', descripcion: 'Manguera reforzada 15 metros con conectores.', precio: 195.00, stock: 30, categoria: 'Jardineria', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Casco de seguridad industrial', descripcion: 'Casco ajustable color amarillo, norma ANSI.', precio: 85.00, stock: 40, categoria: 'Seguridad', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Silicon sellador transparente 280 ml', descripcion: 'Silicon sellador multiusos resistente al agua.', precio: 75.00, stock: 100, categoria: 'Adhesivos', created_at: new Date(), updated_at: new Date() },
      { nombre: 'Pinzas de presion 10"', descripcion: 'Pinzas de presion 10 pulgadas, acero templado.', precio: 210.00, stock: 22, categoria: 'Herramientas', created_at: new Date(), updated_at: new Date() }
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Producto', null, {});
  }
};
