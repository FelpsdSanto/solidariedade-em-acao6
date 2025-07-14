const Familia = require('../models/familia');

const criarFamilia = async (req, res) => {
  try {
    const dados = req.body;

    dados.responsavel.nascimento = new Date(dados.responsavel.nascimento);

    if (dados.dependentes && Array.isArray(dados.dependentes)) {
      dados.dependentes = dados.dependentes.map(dep => ({
        ...dep,
        nascimento: new Date(dep.nascimento)
      }));
    } else {
      dados.dependentes = [];
    }

    const familia = new Familia(dados);
    await familia.save();

    res.status(201).json({ message: 'Família cadastrada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar família.' });
  }
};

const listarFamilias = async (req, res) => {
  try {
    const familias = await Familia.find();
    res.json(familias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar famílias.' });
  }
};

const excluirFamilia = async (req, res) => {
  try {
    const { id } = req.params;
    await Familia.findByIdAndDelete(id);
    res.json({ message: 'Família excluída com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir família.' });
  }
};

// Exportar famílias com separador ";"
const exportarCSV = async (req, res) => {
  try {
    const familias = await Familia.find();

    // Cabeçalho com separador ";"
    let csv = 'ID;Nome do Responsável;Telefone;Whatsapp;Cidade;Renda;Qtd Dependentes;Dependentes\n';

    const formatarCampo = (valor) => {
      if (typeof valor === 'string') {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return `"${valor}"`;
    };

    familias.forEach(fam => {
      const id = formatarCampo(fam._id);
      const nome = formatarCampo(fam.responsavel.nome || '');
      const telefone = formatarCampo(fam.responsavel.telefone || '');
      const whatsapp = formatarCampo(fam.responsavel.whatsapp ? 'Sim' : 'Não');
      const cidade = formatarCampo(fam.responsavel.endereco?.cidade || '');
      const renda = formatarCampo(fam.responsavel.renda?.toFixed(2) || '0.00');

      const dependentes = fam.dependentes || [];
      const qtdDep = formatarCampo(dependentes.length);
      const listaDep = formatarCampo(
        dependentes.map(dep => {
          const nome = dep.nome || 'Sem nome';
          const parentesco = dep.parentesco || 'Sem parentesco';
          const nasc = dep.nascimento ? new Date(dep.nascimento).toLocaleDateString('pt-BR') : 'Sem data';
          return `${nome} (${parentesco}) - ${nasc}`;
        }).join('; ')
      );

      // Use ponto e vírgula entre os campos
      csv += `${id};${nome};${telefone};${whatsapp};${cidade};${renda};${qtdDep};${listaDep}\n`;
    });

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('familias.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao exportar CSV.' });
  }
};

module.exports = {
  criarFamilia,
  listarFamilias,
  excluirFamilia,
  exportarCSV
};
