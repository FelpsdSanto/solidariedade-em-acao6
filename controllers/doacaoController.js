const Doacao = require('../models/doacao');
const { Parser } = require('json2csv'); // Para gerar CSV na memória

// Criar nova doação
const criarDoacao = async (req, res) => {
  try {
    const doacao = new Doacao(req.body);
    await doacao.save();
    res.status(201).json({ message: 'Doação cadastrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar doação:', err);
    if (err.name === 'ValidationError') {
      const mensagensErro = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: mensagensErro.join('; ') });
    }
    res.status(500).json({ error: 'Erro ao cadastrar doação.' });
  }
};

// Listar todas as doações
const listarDoacoes = async (req, res) => {
  try {
    const doacoes = await Doacao.find();
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar doações' });
  }
};

// Excluir uma doação por ID
const excluirDoacao = async (req, res) => {
  try {
    await Doacao.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doação excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir doação' });
  }
};

// Exportar doações para CSV
const exportarCSV = async (req, res) => {
  try {
    const doacoes = await Doacao.find().lean();

    // Campos que queremos no CSV e transformação para formato legível
    const fields = ['dataDoacao', 'tipo', 'valor', 'descricaoObjeto', 'nomeDoador'];
    const opts = { 
      fields,
      delimiter: ';', // Aqui: ponto e vírgula como separador
      transforms: [(item) => ({
        dataDoacao: new Date(item.dataDoacao).toLocaleDateString('pt-BR'),
        tipo: item.tipo,
        valor: item.valor != null ? item.valor.toFixed(2) : '',
        descricaoObjeto: item.descricaoObjeto || '',
        nomeDoador: item.nomeDoador
      })]
    };

    const parser = new Parser(opts);
    const csv = parser.parse(doacoes);

    res.header('Content-Type', 'text/csv');
    res.attachment('doacoes.csv');
    res.send(csv);

  } catch (err) {
    console.error('Erro ao exportar CSV:', err);
    res.status(500).json({ error: 'Erro ao exportar doações' });
  }
};

module.exports = {
  criarDoacao,
  listarDoacoes,
  excluirDoacao,
  exportarCSV
};
