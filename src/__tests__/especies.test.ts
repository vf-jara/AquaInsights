import { ESPECIES_SUPORTADAS, Especie } from '../config/especies';

describe('Catálogo de Espécies (ESPECIES_SUPORTADAS)', () => {
  it('não deve estar vazio', () => {
    expect(ESPECIES_SUPORTADAS.length).toBeGreaterThan(0);
  });

  it('deve conter a Tilápia-do-nilo como espécie padrão', () => {
    const tilapia = ESPECIES_SUPORTADAS.find((e: Especie) => e.id === 'tilapia-do-nilo');
    expect(tilapia).toBeDefined();
    expect(tilapia?.nome).toBe('Tilápia-do-nilo');
  });

  it('todos os itens devem ter id e nome preenchidos', () => {
    ESPECIES_SUPORTADAS.forEach((especie: Especie) => {
      expect(especie.id).toBeTruthy();
      expect(especie.nome).toBeTruthy();
    });
  });

  it('nenhum id deve conter espaços (para garantir compatibilidade com o banco)', () => {
    ESPECIES_SUPORTADAS.forEach((especie: Especie) => {
      expect(especie.id).not.toContain(' ');
    });
  });

  it('os ids devem ser únicos no catálogo', () => {
    const ids = ESPECIES_SUPORTADAS.map((e: Especie) => e.id);
    const idsUnicos = new Set(ids);
    expect(idsUnicos.size).toBe(ids.length);
  });
});
