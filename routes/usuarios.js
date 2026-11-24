const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const router = express.Router();

router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
    if (await Usuario.findOne({ email }))
      return res.status(409).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash });
    res.status(201).json({ _id: usuario._id, nombre: usuario.nombre, email: usuario.email });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await bcrypt.compare(password, usuario.password)))
      return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ mensaje: 'Login exitoso', usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', async (req, res) => {
  try { res.json(await Usuario.find().select('-password')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
