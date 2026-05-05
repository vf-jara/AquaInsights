import { leiturasService } from '../services/leiturasService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { addDoc } from 'firebase/firestore';

const MockAsyncStorage = AsyncStorage as any;
const MockNetInfo = NetInfo as any;
const mockAddDoc = addDoc as jest.Mock;

const OFFLINE_KEY = '@AquaInsights:offline_leituras';

// Dados de uma leitura ideal de tilápia para reutilizar nos testes
const leituraIdeal = {
  loteId: 'lote-teste-001',
  ph: 7.0,
  oxigenio: 6.0,
  temperatura: 28.0,
  amonia: 0.1,
  nitrito: 0.1,
  nitrato: 5.0,
  alcalinidade: 50.0,
};


beforeEach(() => {
  jest.clearAllMocks();
  MockAsyncStorage.__reset();
  MockNetInfo.__reset();
});


describe('leiturasService.registerLeitura', () => {
  it('quando online: deve chamar addDoc do Firebase', async () => {
    MockNetInfo.__setConnected(true);
    mockAddDoc.mockResolvedValueOnce({ id: 'firebase-id-xpto' });

    const result = await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('firebase-id-xpto');
  });

  it('quando online: NÃO deve salvar nada no AsyncStorage', async () => {
    MockNetInfo.__setConnected(true);
    mockAddDoc.mockResolvedValueOnce({ id: 'firebase-id-xpto' });

    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('quando offline: deve salvar a leitura no AsyncStorage', async () => {
    MockNetInfo.__setConnected(false);

    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      OFFLINE_KEY,
      expect.any(String)
    );
  });

  it('quando offline: NÃO deve chamar o Firebase', async () => {
    MockNetInfo.__setConnected(false);

    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    expect(addDoc).not.toHaveBeenCalled();
  });

  it('quando offline: o id retornado começa com "offline_"', async () => {
    MockNetInfo.__setConnected(false);

    const result = await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    expect(result.id).toMatch(/^offline_/);
  });

  it('espécie inválida: a avaliação retorna nível Crítico com mensagem de bloqueio', async () => {
    MockNetInfo.__setConnected(true);
    mockAddDoc.mockResolvedValueOnce({ id: 'any-id' });

    const result = await leiturasService.registerLeitura(leituraIdeal, 'especie-inexistente');

    expect(result.avaliacao.nivelGeral).toBe('Crítico');
    expect(result.avaliacao.instrucoes[0]).toContain('ATENÇÃO');
    expect(result.avaliacao.instrucoes[0]).toContain('especie-inexistente');
  });

  it('acumula múltiplas leituras offline sem sobrescrever as anteriores', async () => {
    MockNetInfo.__setConnected(false);

    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    const count = await leiturasService.getLeiturasOfflineCount();
    expect(count).toBe(2);
  });
});


describe('leiturasService.getLeiturasOfflineCount', () => {
  it('retorna 0 quando não há leituras offline', async () => {
    const count = await leiturasService.getLeiturasOfflineCount();
    expect(count).toBe(0);
  });

  it('retorna a contagem correta após salvar offline', async () => {
    MockNetInfo.__setConnected(false);

    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    const count = await leiturasService.getLeiturasOfflineCount();
    expect(count).toBe(3);
  });
});


describe('leiturasService.syncOfflineLeituras', () => {
  it('retorna 0 quando não há leituras offline para sincronizar', async () => {
    const synced = await leiturasService.syncOfflineLeituras();
    expect(synced).toBe(0);
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('retorna 0 quando está offline, mesmo com dados pendentes', async () => {
    // Salva 1 leitura offline
    MockNetInfo.__setConnected(false);
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    // Tenta sincronizar ainda offline
    const synced = await leiturasService.syncOfflineLeituras();
    expect(synced).toBe(0);
    expect(addDoc).not.toHaveBeenCalled();
  });

  it('quando online: envia as leituras pendentes para o Firebase', async () => {
    // Salva 2 leituras offline
    MockNetInfo.__setConnected(false);
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    // Sincroniza com internet
    MockNetInfo.__setConnected(true);
    mockAddDoc.mockResolvedValue({ id: 'synced-id' });
    const synced = await leiturasService.syncOfflineLeituras();

    expect(synced).toBe(2);
    expect(addDoc).toHaveBeenCalledTimes(2);
  });

  it('após sincronização com sucesso: libera a memória do AsyncStorage', async () => {
    // Salva 1 leitura offline
    MockNetInfo.__setConnected(false);
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    // Confirma que há 1 leitura pendente
    expect(await leiturasService.getLeiturasOfflineCount()).toBe(1);

    // Sincroniza
    MockNetInfo.__setConnected(true);
    mockAddDoc.mockResolvedValueOnce({ id: 'synced-id' });
    await leiturasService.syncOfflineLeituras();

    // Confirma que a memória foi liberada
    const countDepois = await leiturasService.getLeiturasOfflineCount();
    expect(countDepois).toBe(0);
  });

  it('leituras que falharam permanecem no AsyncStorage para nova tentativa', async () => {
    // Salva 2 leituras offline
    MockNetInfo.__setConnected(false);
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');
    await leiturasService.registerLeitura(leituraIdeal, 'tilapia-do-nilo');

    // 1ª chamada sucesso, 2ª falha
    MockNetInfo.__setConnected(true);
    mockAddDoc
      .mockResolvedValueOnce({ id: 'ok' })
      .mockRejectedValueOnce(new Error('Timeout Firebase'));

    const synced = await leiturasService.syncOfflineLeituras();

    expect(synced).toBe(1);
    // A que falhou permanece no storage
    expect(await leiturasService.getLeiturasOfflineCount()).toBe(1);
  });
});
