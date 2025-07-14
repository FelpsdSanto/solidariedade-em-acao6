const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,   // Garante que não existam emails duplicados
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;