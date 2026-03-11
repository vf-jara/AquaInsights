import {
  avaliarTemperatura,
  avaliarOxigenio,
  avaliarPh,
  avaliarAmonia,
  avaliarNitrito,
  avaliarDureza,
  avaliarLeitura,
  NivelQualidade,
  DadosLeitura,
  ParametroAvaliacao,
} from '../utils/waterQualityRules';

// ─────────────────── Temperatura ───────────────────

describe('avaliarTemperatura', () => {
  it('retorna Crítico abaixo de 16°C', () => {
    const result = avaliarTemperatura(10);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Atenção entre 16-24°C', () => {
    const result = avaliarTemperatura(20);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Ótimo entre 25-31°C', () => {
    const result = avaliarTemperatura(28);
    expect(result.nivel).toBe('Ótimo');
    expect(result.direcao).toBeNull();
  });

  it('retorna Atenção entre 32-35°C', () => {
    const result = avaliarTemperatura(33);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('acima');
  });

  it('retorna Crítico acima de 35°C', () => {
    const result = avaliarTemperatura(38);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('acima');
  });

  it('limites: 25°C é Ótimo', () => {
    expect(avaliarTemperatura(25).nivel).toBe('Ótimo');
  });

  it('limites: 31°C é Ótimo', () => {
    expect(avaliarTemperatura(31).nivel).toBe('Ótimo');
  });

  it('limites: 16°C é Atenção', () => {
    expect(avaliarTemperatura(16).nivel).toBe('Atenção');
  });
});

// ─────────────────── Oxigênio ───────────────────

describe('avaliarOxigenio', () => {
  it('retorna Crítico abaixo de 2 mg/L', () => {
    const result = avaliarOxigenio(1.5);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Atenção entre 2-3.9 mg/L', () => {
    const result = avaliarOxigenio(3);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Ótimo acima de 4 mg/L', () => {
    const result = avaliarOxigenio(6);
    expect(result.nivel).toBe('Ótimo');
    expect(result.direcao).toBeNull();
  });

  it('limites: 4 mg/L é Ótimo', () => {
    expect(avaliarOxigenio(4).nivel).toBe('Ótimo');
  });

  it('limites: 2 mg/L é Atenção', () => {
    expect(avaliarOxigenio(2).nivel).toBe('Atenção');
  });
});

// ─────────────────── pH ───────────────────

describe('avaliarPh', () => {
  it('retorna Crítico abaixo de 5', () => {
    const result = avaliarPh(4);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Atenção entre 5-6.4', () => {
    const result = avaliarPh(5.5);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('abaixo');
  });

  it('retorna Ótimo entre 6.5-7.9', () => {
    const result = avaliarPh(7.0);
    expect(result.nivel).toBe('Ótimo');
    expect(result.direcao).toBeNull();
  });

  it('retorna Atenção entre 7.9-8.1 (exclusive-inclusive)', () => {
    const result = avaliarPh(8.0);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('acima');
  });

  it('retorna Crítico acima de 8.1', () => {
    const result = avaliarPh(9);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('acima');
  });
});

// ─────────────────── Amônia ───────────────────

describe('avaliarAmonia', () => {
  it('retorna Ótimo até 0.5 ppm', () => {
    expect(avaliarAmonia(0.3).nivel).toBe('Ótimo');
  });

  it('retorna Atenção entre 0.5-1 ppm', () => {
    const result = avaliarAmonia(0.7);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('acima');
  });

  it('retorna Crítico acima de 1 ppm', () => {
    const result = avaliarAmonia(2);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('acima');
  });

  it('limites: 0.5 ppm é Ótimo', () => {
    expect(avaliarAmonia(0.5).nivel).toBe('Ótimo');
  });
});

// ─────────────────── Nitrito ───────────────────

describe('avaliarNitrito', () => {
  it('retorna Ótimo até 0.25 ppm', () => {
    expect(avaliarNitrito(0).nivel).toBe('Ótimo');
    expect(avaliarNitrito(0.25).nivel).toBe('Ótimo');
  });

  it('retorna Atenção entre 0.25-0.5 ppm', () => {
    const result = avaliarNitrito(0.4);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('acima');
  });

  it('retorna Crítico acima de 0.5 ppm', () => {
    const result = avaliarNitrito(1);
    expect(result.nivel).toBe('Crítico');
    expect(result.direcao).toBe('acima');
  });
});

// ─────────────────── Dureza ───────────────────

describe('avaliarDureza', () => {
  it('retorna Ótimo acima de 30 mg/L', () => {
    const result = avaliarDureza(50);
    expect(result.nivel).toBe('Ótimo');
    expect(result.direcao).toBeNull();
  });

  it('retorna Atenção abaixo de 30 mg/L', () => {
    const result = avaliarDureza(20);
    expect(result.nivel).toBe('Atenção');
    expect(result.direcao).toBe('abaixo');
  });

  it('limites: 30 mg/L é Ótimo', () => {
    expect(avaliarDureza(30).nivel).toBe('Ótimo');
  });
});

// ─────────────────── Avaliação Geral ───────────────────

describe('avaliarLeitura', () => {
  const dadosOtimos: DadosLeitura = {
    temperatura: 28,
    oxigenio: 6,
    ph: 7,
    amonia: 0,
    nitrito: 0,
    nitrato: 5,
    dureza: 50,
  };

  it('retorna nível Ótimo com valores ideais', () => {
    const result = avaliarLeitura(dadosOtimos);
    expect(result.nivelGeral).toBe('Ótimo');
    expect(result.avaliacoes.every((a: ParametroAvaliacao) => a.nivel === 'Ótimo')).toBe(true);
  });

  it('inclui instruções positivas quando tudo está Ótimo', () => {
    const result = avaliarLeitura(dadosOtimos);
    expect(result.instrucoes.length).toBeGreaterThan(0);
    expect(result.instrucoes.some((i: string) => i.includes('Alimentação total'))).toBe(true);
  });

  it('retorna nível Atenção se algum parâmetro estiver em atenção', () => {
    const result = avaliarLeitura({ ...dadosOtimos, temperatura: 33 });
    expect(result.nivelGeral).toBe('Atenção');
  });

  it('retorna nível Crítico se algum parâmetro estiver crítico', () => {
    const result = avaliarLeitura({ ...dadosOtimos, oxigenio: 1.5 });
    expect(result.nivelGeral).toBe('Crítico');
  });

  it('Crítico prevalece sobre Atenção', () => {
    const result = avaliarLeitura({ ...dadosOtimos, temperatura: 33, amonia: 2 });
    expect(result.nivelGeral).toBe('Crítico');
  });

  it('inclui instruções de emergência para valores críticos', () => {
    const result = avaliarLeitura({ ...dadosOtimos, amonia: 2 });
    expect(result.instrucoes.some((i: string) => i.includes('Suspender totalmente'))).toBe(true);
  });

  it('inclui instruções de temperatura baixa para Crítico abaixo', () => {
    const result = avaliarLeitura({ ...dadosOtimos, temperatura: 10 });
    expect(result.instrucoes.some((i: string) => i.includes('aquecedor'))).toBe(true);
  });

  it('avalia todos os 6 parâmetros', () => {
    const result = avaliarLeitura(dadosOtimos);
    expect(result.avaliacoes.length).toBe(6);
  });

  it('não inclui nitrato na avaliação individual (não há regra)', () => {
    const result = avaliarLeitura(dadosOtimos);
    const nomes = result.avaliacoes.map((a: ParametroAvaliacao) => a.parametro);
    expect(nomes).not.toContain('Nitrato');
    expect(nomes).toContain('Dureza');
  });
});
