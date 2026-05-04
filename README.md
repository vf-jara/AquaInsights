# AquaInsights 🐟💧

**AquaInsights** é um aplicativo mobile de apoio à tomada de decisão na piscicultura. Ele foi idealizado para facilitar a gestão de propriedades aquícolas, fornecendo ferramentas simplificadas de monitoramento da qualidade da água e sugestões de manejo contínuo para os produtores e técnicos responsáveis.

---

## 🚀 Funcionalidades Principais

- **Autenticação Segura:** Cadastro, login e confirmação de senhas utilizando Firebase Authentication.
- **Gerenciamento de Tanques/Lotes:** Criação, visualização, edição e exclusão de diferentes lotes de criação.
- **Catálogo Dinâmico de Espécies:** Suporte arquitetural configurado para adicionar rapidamente regras de qualidade da água para diferentes espécies. A Tilápia-do-nilo (*Oreochromis niloticus*) é a espécie padrão.
- **Modo Offline com Sincronização Automática:** Permite a realização e o registro de leituras no campo (sem acesso à internet). Os dados ficam salvos de forma segura no aparelho do produtor e são sincronizados silenciosamente quando a conexão é restabelecida.
- **Registro de Leituras Diárias:** Coleta de dados cruciais para a saúde dos peixes, incluindo:
  - Temperatura
  - pH
  - Oxigênio Dissolvido (OD)
  - Amônia
  - Nitrito
  - Nitrato
  - Alcalinidade
- **Orientações Inteligentes de Manejo:** Ao submeter uma leitura (mesmo offline), o aplicativo gera automaticamente orientações emergenciais ou preditivas com base em regras de negócio predefinidas.
- **Histórico e Acompanhamento:** Um painel de histórico salva todas as avaliações passadas e os parâmetros para a análise de tendências de um tanque específico ao longo do tempo (mesclando leituras em nuvem e leituras offline pendentes).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um conjunto tecnológico moderno para garantir acessibilidade cruzada (Android e iOS) e alta performance:

- **Frontend / Mobile Framework:** [React Native](https://reactnative.dev/) com o ecossistema [Expo](https://expo.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização e UI:** [Styled Components](https://styled-components.com/) e Material Icons
- **Banco de Dados & BaaS:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Autenticação:** [Firebase Auth](https://firebase.google.com/docs/auth)
- **Persistência Offline:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Monitoramento de Rede:** [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo)

---

## 💻 Como Rodar o Projeto (Desenvolvimento Local)

### Pré-requisitos
Certifique-se de que a sua máquina atenda aos seguintes requisitos:
1. Algum emulador configurado (Android Studio ou Xcode) ou o aplicativo **Expo Go** instalado em seu celular físico.
2. [Node.JS](https://nodejs.org/en) (junto com o NPM) instalados na máquina.

### Execução

1. **Clone o Repositório:**
```bash
git clone https://github.com/vf-jara/AquaInsights.git
cd AquaInsights
```

2. **Instalação das Dependências:**
```bash
npm install
```

3. **Configuração de Variáveis de Ambiente:**
Crie um arquivo chamado `.env` na raiz do seu projeto. Dentro dele, preencha as variáveis de acesso de seu projeto no Firebase (encontradas nas configurações do seu Console do Firebase):
```env
EXPO_PUBLIC_FIREBASE_API_KEY="sua_api_key_aqui"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="seu_auth_domain_aqui"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="seu_project_id_aqui"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="seu_storage_bucket_aqui"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="seu_messaging_sender_id_aqui"
EXPO_PUBLIC_FIREBASE_APP_ID="seu_app_id_aqui"
```

4. **Inicie o Servidor do Expo:**
```bash
npx expo start --clear
```

5. O Expo abrirá um menu no terminal onde você pode apertar `a` (para abrir no emulador Android), `i` (abrir no emulador iOS) ou ainda scannear o **QR Code** exibido utilizando o aplicativo **Expo Go** disponível na loja de apps do seu smartphone.

---

## 📚 Trabalho de Conclusão de Curso (TCC)

Este projeto integra parte do **Trabalho de Conclusão de Curso de Engenharia de Software**.
**Título:** AQUAINSIGHT: APP DE APOIO NA TOMADA DE DECISÃO NA PISCICULTURA
**Autor:** Vinicius Franco Jara
**Instituição:** Centro Universitário da Grande Dourados / MS
