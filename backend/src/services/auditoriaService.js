import { Op } from 'sequelize';
import Auditoria from '../models/Auditoria.js';

// Nunca deixa a auditoria quebrar a operacao principal.
async function registrar(dados) {
  try {
    const { senha, senha_hash, token, ...seguro } = dados.detalhes || {};
    await Auditoria.create({ ...dados, detalhes: JSON.stringify(seguro) });
  } catch (erro) {
    console.error('[AUDITORIA]', erro.message);
  }
}

async function listar({ usuario, operacao, recurso, inicio, fim } = {}) {
  const where = {};
  if (usuario) where.usuario_nome = { [Op.like]: `%${usuario}%` };
  if (operacao) where.operacao = operacao;
  if (recurso) where.recurso = recurso;
  if (inicio || fim) {
    where.criado_em = {};
    if (inicio) where.criado_em[Op.gte] = new Date(inicio);
    if (fim) where.criado_em[Op.lte] = new Date(fim);
  }
  return Auditoria.findAll({ where, order: [['criado_em', 'DESC']], limit: 500 });
}

export default { registrar, listar };
