const mongoose = require('mongoose');

const DoacaoSchema = new mongoose.Schema({
  dataDoacao: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['dinheiro', 'objeto'],
    required: true
  },
  valor: {
    type: Number,
    required: function() {
      return this.tipo === 'dinheiro';
    },
    min: [0, 'O valor deve ser positivo'],
  },
  descricaoObjeto: {
    type: String,
    trim: true,
    required: function() {
      return this.tipo === 'objeto';
    }
  },
  nomeDoador: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Doacao', DoacaoSchema);
