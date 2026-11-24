const express = require('express');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const router = express.Router();

router.get('/estadisticas', async (req, res) => {
  try {
    const [totalProductos, totalUsuarios, porCategoria, resumen] = await Promise.all([
      Producto.countDocuments(),
      Usuario.countDocuments(),
      Producto.aggregate([
        { $group: { _id: '$categoria', cantidad: { $sum: 1 }, precioPromedio: { $avg: '$precio' } } },
        { $sort: { cantidad: -1 } }
      ]),
      Producto.aggregate([
        { $group: { _id: null, stockTotal: { $sum: '$stock' }, valorInventario: { $sum: { $multiply: ['$precio', '$stock'] } } } }
      ])
    ]);
    res.json({ totalProductos, totalUsuarios, porCategoria, resumen: resumen[0] || { stockTotal: 0, valorInventario: 0 } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
