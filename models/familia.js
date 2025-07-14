const mongoose = require('mongoose');

const dependenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nascimento: { type: Date, required: true },
  parentesco: { type: String, required: true }
});

const enderecoSchema = new mongoose.Schema({
  rua: { type: String, required: true },
  bairro: { type: String, required: true },
  numero: { type: String, required: true },
  cidade: { type: String, required: true }
});

const familiaSchema = new mongoose.Schema({
  responsavel: {
    nome: { type: String, required: true },
    nascimento: { type: Date, required: true },
    endereco: { type: enderecoSchema, required: true },
    renda: { type: Number, required: true },
    telefone: { type: String, required: true },
    whatsapp: { type: Boolean, default: false }
  },
  dependentes: [dependenteSchema]
});

const Familia = mongoose.model('Familia', familiaSchema);

module.exports = Familia;

