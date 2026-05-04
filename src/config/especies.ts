export interface Especie {
  id: string;
  nome: string;
}

export const ESPECIES_SUPORTADAS: Especie[] = [
  { id: 'tilapia-do-nilo', nome: 'Tilápia-do-nilo' }
  // Adicione novas espécies aqui no futuro e mapeie-as no waterQualityRules.ts
];
