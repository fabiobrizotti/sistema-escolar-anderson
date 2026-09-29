import auditoriaService from '../services/auditoriaService.js';

async function listar(req, res) {
  const eventos = await auditoriaService.listar(req.query);
  res.status(200).json(eventos);
}

async function resumo(req, res) {
  const eventos = await auditoriaService.listar({});
  const porOperacao = {};
  for (const e of eventos) porOperacao[e.operacao] = (porOperacao[e.operacao] || 0) + 1;
  const ultimas24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recusados24h = eventos.filter(
    (e) => e.operacao === 'LOGIN_FALHA' && new Date(e.criado_em) >= ultimas24h,
  ).length;
  const ultimoAcesso = {};
  for (const e of eventos) {
    if (e.operacao === 'LOGIN_OK' && !ultimoAcesso[e.usuario_nome]) ultimoAcesso[e.usuario_nome] = e.criado_em;
  }
  res.status(200).json({ total: eventos.length, porOperacao, recusados24h, ultimoAcesso });
}

export default { listar, resumo };
