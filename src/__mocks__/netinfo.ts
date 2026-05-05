// Mock do NetInfo — controla o estado de rede nos testes
let _isConnected = true;

const NetInfo = {
  fetch: jest.fn(async () => ({ isConnected: _isConnected })),
  addEventListener: jest.fn(() => jest.fn()), // retorna unsubscribe
  // Helpers para controle nos testes
  __setConnected: (val: boolean) => { _isConnected = val; },
  __reset: () => { _isConnected = true; },
};

export default NetInfo;
