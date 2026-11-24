const express = require('express');
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const router = express.Router();

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/categoria/:cat', async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: new RegExp(`^${req.params.cat}$`, 'i') });
    res.json(productos);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.get('/', async (req, res) => {
  try { res.json(await Producto.find()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado', producto });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
