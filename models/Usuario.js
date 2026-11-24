const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
