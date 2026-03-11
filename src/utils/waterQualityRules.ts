/**
 * Módulo de regras de qualidade da água – APPeixe
 *
 * Baseado nos documentos:
 *   - Intervencao.APPeixe (tabela de intervenção)
 *   - valoresPadraoAPPEIXE (valores de referência e desvios)
 *
 * Este módulo é puro (sem dependências externas) para facilitar testes automatizados.
 */

// ────────────────────────────── Tipos ──────────────────────────────

export type NivelQualidade = 'Ótimo' | 'Atenção' | 'Crítico';
export type Direcao = 'acima' | 'abaixo' | null;

export interface ParametroAvaliacao {
  parametro: string;
  valor: number;
  unidade: string;
  nivel: NivelQualidade;
  direcao: Direcao;
  mensagem: string;
}

export interface AvaliacaoGeral {
  nivelGeral: NivelQualidade;
  avaliacoes: ParametroAvaliacao[];
  instrucoes: string[];
}

export interface DadosLeitura {
  temperatura: number;
  oxigenio: number;
  ph: number;
  amonia: number;
  nitrito: number;
  nitrato: number;
  dureza: number;
}

// ────────────────────────── Classificadores ──────────────────────────

export function avaliarTemperatura(valor: number): ParametroAvaliacao {
  const base = { parametro: 'Temperatura', valor, unidade: '°C' };

  if (valor < 16) {
    return { ...base, nivel: 'Crítico', direcao: 'abaixo', mensagem: 'Temperatura crítica baixa. Risco de mortalidade.' };
  }
  if (valor >= 16 && valor <= 24) {
    return { ...base, nivel: 'Atenção', direcao: 'abaixo', mensagem: 'Temperatura abaixo do ideal. Queda de imunidade e redução no consumo de ração.' };
  }
  if (valor >= 25 && valor <= 31) {
    return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'Temperatura na faixa ideal.' };
  }
  if (valor >= 32 && valor <= 35) {
    return { ...base, nivel: 'Atenção', direcao: 'acima', mensagem: 'Temperatura elevada. Zona de estresse por calor.' };
  }
  // > 35
  return { ...base, nivel: 'Crítico', direcao: 'acima', mensagem: 'Temperatura crítica alta. Risco de mortalidade.' };
}

export function avaliarOxigenio(valor: number): ParametroAvaliacao {
  const base = { parametro: 'Oxigênio Dissolvido', valor, unidade: 'mg/L' };

  if (valor < 2) {
    return { ...base, nivel: 'Crítico', direcao: 'abaixo', mensagem: 'Oxigênio crítico. Hipóxia iminente – aeração urgente.' };
  }
  if (valor >= 2 && valor < 4) {
    return { ...base, nivel: 'Atenção', direcao: 'abaixo', mensagem: 'Oxigênio abaixo do ideal. Monitorar frequentemente.' };
  }
  // >= 4
  return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'Oxigênio na faixa ideal.' };
}

export function avaliarPh(valor: number): ParametroAvaliacao {
  const base = { parametro: 'pH', valor, unidade: '' };

  if (valor < 5) {
    return { ...base, nivel: 'Crítico', direcao: 'abaixo', mensagem: 'pH muito ácido. Zona de risco.' };
  }
  if (valor >= 5 && valor < 6.5) {
    return { ...base, nivel: 'Atenção', direcao: 'abaixo', mensagem: 'pH abaixo do ideal. Considerar adicionar bicarbonato.' };
  }
  if (valor >= 6.5 && valor <= 7.9) {
    return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'pH na faixa ideal.' };
  }
  if (valor > 7.9 && valor <= 8.1) {
    return { ...base, nivel: 'Atenção', direcao: 'acima', mensagem: 'pH levemente elevado. Monitorar.' };
  }
  // > 8.1
  return { ...base, nivel: 'Crítico', direcao: 'acima', mensagem: 'pH muito alcalino. Zona de risco.' };
}

export function avaliarAmonia(valor: number): ParametroAvaliacao {
  const base = { parametro: 'Amônia Total', valor, unidade: 'ppm' };

  if (valor <= 0.5) {
    return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'Amônia na faixa segura.' };
  }
  if (valor > 0.5 && valor <= 1) {
    return { ...base, nivel: 'Atenção', direcao: 'acima', mensagem: 'Amônia elevada. Reduzir alimentação e monitorar.' };
  }
  // > 1
  return { ...base, nivel: 'Crítico', direcao: 'acima', mensagem: 'Amônia crítica. Suspender alimentação e trocar água.' };
}

export function avaliarNitrito(valor: number): ParametroAvaliacao {
  const base = { parametro: 'Nitrito', valor, unidade: 'ppm' };

  if (valor <= 0.25) {
    return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'Nitrito na faixa ideal.' };
  }
  if (valor > 0.25 && valor <= 0.5) {
    return { ...base, nivel: 'Atenção', direcao: 'acima', mensagem: 'Nitrito elevado. Adicionar sal não iodado e reduzir alimentação.' };
  }
  // > 0.5
  return { ...base, nivel: 'Crítico', direcao: 'acima', mensagem: 'Nitrito crítico. Suspender alimentação, trocar água e adicionar sal.' };
}

export function avaliarDureza(valor: number): ParametroAvaliacao {
  const base = { parametro: 'Dureza', valor, unidade: 'mg/L' };

  if (valor >= 30) {
    return { ...base, nivel: 'Ótimo', direcao: null, mensagem: 'Dureza/alcalinidade adequada.' };
  }
  // < 30
  return { ...base, nivel: 'Atenção', direcao: 'abaixo', mensagem: 'Dureza abaixo do recomendado (mín. 30 mg/L). Considerar correção.' };
}

// ────────────────────── Instruções de Manejo ──────────────────────

const INSTRUCOES_OTIMO: string[] = [
  'Alimentação total, seguindo o cronograma de refeições.',
  'Dia adequado para coletar animais para biometria (verificar peso, saúde, comprimento).',
];

const INSTRUCOES_ATENCAO_ACIMA: string[] = [
  'Reduzir alimentação em 20%; ofertar refeições nas horas mais amenas (manhã e pôr do sol).',
  'Troca de 10% a 15% da água do viveiro.',
  'Evitar manusear os peixes, exceto quando necessário.',
  'Observar se há excesso de material orgânico no fundo do tanque.',
  'Adicionar 2 g de sal por litro de água e repetir testes de amônia e nitrito após 3 dias.',
];

const INSTRUCOES_ATENCAO_ABAIXO: string[] = [
  'Suspender alimentação parcialmente e observar se há sobras entre refeições.',
  'Não manusear os peixes.',
  'Adicionar bicarbonato de sódio na água.',
];

const INSTRUCOES_CRITICO_ACIMA: string[] = [
  'Suspender totalmente a alimentação.',
  'Trocar de 30% a 50% da água, aos poucos, por água fresca.',
  'Adicionar até 4 g/L de sal na água.',
  'Não manusear os animais.',
  'Observar: excesso de matéria orgânica e presença de animais mortos (retirada imediata).',
  'Adicionar bicarbonato de sódio na água.',
  'Refazer os testes de amônia e nitrito diariamente até o pH estabilizar.',
];

const INSTRUCOES_CRITICO_ABAIXO: string[] = [
  'Temperatura baixa: utilizar um aquecedor; se possível, transferir os animais ou preparar lote de reposição.',
  'Oxigênio baixo: usar aerador/soprador urgente; trocar água com vazão intensa. Observar se peixes captam oxigênio da superfície.',
];

function selecionarInstrucoes(avaliacoes: ParametroAvaliacao[]): string[] {
  const instrucoes = new Set<string>();
  let temCriticoAcima = false;
  let temCriticoAbaixo = false;
  let temAtencaoAcima = false;
  let temAtencaoAbaixo = false;

  for (const a of avaliacoes) {
    if (a.nivel === 'Crítico' && a.direcao === 'acima') temCriticoAcima = true;
    if (a.nivel === 'Crítico' && a.direcao === 'abaixo') temCriticoAbaixo = true;
    if (a.nivel === 'Atenção' && a.direcao === 'acima') temAtencaoAcima = true;
    if (a.nivel === 'Atenção' && a.direcao === 'abaixo') temAtencaoAbaixo = true;
  }

  if (temCriticoAcima) {
    INSTRUCOES_CRITICO_ACIMA.forEach(i => instrucoes.add(i));
  }
  if (temCriticoAbaixo) {
    INSTRUCOES_CRITICO_ABAIXO.forEach(i => instrucoes.add(i));
  }
  if (temAtencaoAcima && !temCriticoAcima) {
    INSTRUCOES_ATENCAO_ACIMA.forEach(i => instrucoes.add(i));
  }
  if (temAtencaoAbaixo && !temCriticoAbaixo) {
    INSTRUCOES_ATENCAO_ABAIXO.forEach(i => instrucoes.add(i));
  }

  if (instrucoes.size === 0) {
    INSTRUCOES_OTIMO.forEach(i => instrucoes.add(i));
  }

  return Array.from(instrucoes);
}

// ─────────────────────── Avaliação Principal ───────────────────────

export function avaliarLeitura(dados: DadosLeitura): AvaliacaoGeral {
  const avaliacoes: ParametroAvaliacao[] = [
    avaliarTemperatura(dados.temperatura),
    avaliarOxigenio(dados.oxigenio),
    avaliarPh(dados.ph),
    avaliarAmonia(dados.amonia),
    avaliarNitrito(dados.nitrito),
    avaliarDureza(dados.dureza),
  ];

  // Nível geral = o mais grave encontrado
  let nivelGeral: NivelQualidade = 'Ótimo';
  for (const a of avaliacoes) {
    if (a.nivel === 'Crítico') {
      nivelGeral = 'Crítico';
      break;
    }
    if (a.nivel === 'Atenção') {
      nivelGeral = 'Atenção';
    }
  }

  const instrucoes = selecionarInstrucoes(avaliacoes);

  return { nivelGeral, avaliacoes, instrucoes };
}
