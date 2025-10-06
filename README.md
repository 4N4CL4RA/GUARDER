# 🛡️ GUARDER - Plataforma de Hospedagens Seguras

![GUARDER Logo](public/logo.svg)

## 📋 Sobre o Projeto

GUARDER é uma plataforma inovadora que conecta viajantes a hospedagens seguras e verificadas. Com foco na segurança, oferecemos avaliações detalhadas, mapas interativos em tempo real e um sistema robusto de verificação.

## ✨ Principais Funcionalidades

### 🗺️ **Mapa Interativo em Tempo Real**
- Integração com Google Maps API oficial
- Marcadores coloridos por nível de segurança
- Informações detalhadas em InfoWindows
- Controles de navegação e geolocalização
- Atualização contínua baseada nas avaliações

### 📝 **Sistema de Avaliações Completo**
- Avaliações detalhadas com sistema de estrelas
- Likes/dislikes funcionais
- Sistema de respostas e comentários
- Filtros avançados por categoria e avaliação
- Estatísticas em tempo real

### 🔐 **Sistema de Autenticação Robusto**
- Proteção de rotas para usuários não logados
- Login e registro seguros
- Dashboard personalizado
- Controle de acesso baseado em autenticação

### 🏨 **Catálogo de Hospedagens**
- Hotéis, pousadas, resorts e campings
- Informações detalhadas de segurança
- Sistema de verificação
- Busca e filtros avançados

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca JavaScript moderna
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI elegantes e acessíveis

### APIs e Integrações
- **Google Maps JavaScript API** - Mapas interativos
- **Geolocalização** - Localização em tempo real
- **Sistema de coordenadas** - Posicionamento preciso

### Arquitetura
- **Hooks personalizados** - useAuth, useReviews
- **Gerenciamento de estado** - Context API + Hooks
- **Roteamento protegido** - React Router com guards
- **Componentes reutilizáveis** - Arquitetura modular

## 🚀 Como Executar

### Pré-requisitos
```bash
Node.js >= 18
npm ou yarn
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/4N4CL4RA/Guarder.git

# Entre no diretório
cd Guarder

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
Crie um arquivo `.env.local` com:
```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── GoogleMap.tsx   # Componente do Google Maps
│   ├── Navigation.tsx  # Barra de navegação
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── avaliacoes.tsx  # Sistema de avaliações
│   ├── mapa.tsx        # Mapa interativo
│   ├── dashboard.tsx   # Dashboard do usuário
│   └── ...
├── hooks/              # Hooks personalizados
│   ├── useAuth.ts      # Gerenciamento de autenticação
│   └── useReviews.ts   # Gerenciamento de avaliações
├── types/              # Definições TypeScript
│   ├── reviews.ts      # Tipos das avaliações
│   └── global.d.ts     # Tipos globais
└── lib/                # Utilitários
    └── utils.ts        # Funções auxiliares
```

## 🎯 Funcionalidades Detalhadas

### Sistema de Avaliações
- ✅ Criação de avaliações com título, conteúdo e classificação
- ✅ Sistema de útil/não útil
- ✅ Respostas e comentários aninhados
- ✅ Filtros por categoria e avaliação
- ✅ Ordenação por data, úteis e avaliação
- ✅ Estatísticas em tempo real
- ✅ Proteção por autenticação

### Mapa Interativo
- ✅ Google Maps com API oficial
- ✅ Marcadores coloridos por segurança (verde/amarelo/laranja/vermelho)
- ✅ InfoWindows com informações detalhadas
- ✅ Botões de direções integrados
- ✅ Controles de visualização (satélite/mapa)
- ✅ Geolocalização do usuário
- ✅ Agrupamento de avaliações por localização

### Autenticação e Segurança
- ✅ Sistema de login/registro
- ✅ Proteção de rotas sensíveis
- ✅ Redirecionamento automático
- ✅ Controle de acesso granular
- ✅ Interface adaptativa baseada no estado de autenticação

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🎨 Design e UX

### Paleta de Cores Iridescente
- Gradientes dinâmicos azul/roxo/verde
- Elementos flutuantes animados
- Efeitos de hover e transições suaves
- Design responsivo para todos os dispositivos

### Componentes Principais
- Cards com efeito iridescente
- Botões com gradientes
- Navegação responsiva
- Modais e diálogos acessíveis

## 📊 Estatísticas do Projeto

- **8 páginas principais** com funcionalidades completas
- **15+ componentes** reutilizáveis
- **Google Maps integrado** com API real
- **Sistema de autenticação** robusto
- **Proteção de rotas** implementada
- **Design responsivo** para todos os dispositivos

## 🔄 Atualizações Recentes

### Versão Atual (Agosto 2025)
- ✅ Sistema de avaliações totalmente funcional
- ✅ Google Maps em tempo real integrado
- ✅ Proteção de rotas implementada
- ✅ Interface moderna e responsiva
- ✅ Hooks personalizados para gerenciamento de estado

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Desenvolvedores

- **Ana Clara** - Desenvolvimento Full Stack - [@4N4CL4RA](https://github.com/4N4CL4RA)

## 📞 Contato

- Email: contato@guarder.com
- Website: [guarder.com](https://guarder.com)
- LinkedIn: [GUARDER](https://linkedin.com/company/guarder)

---

⭐ **Se este projeto foi útil, considere dar uma estrela!** ⭐

Desenvolvido com ❤️ para tornar as viagens mais seguras.

## 📱 Build Android (Capacitor)

Este projeto pode ser empacotado como um app Android usando Capacitor. Abaixo os passos rápidos:

1. Instale dependências (se ainda não fez):

```bash
npm install
```

2. Gere a build web e copie para o projeto nativo:

```bash
npm run cap:build
npm run cap:copy
npm run cap:sync
```

3. Adicione a plataforma Android (uma vez):

```bash
npm run cap:add:android
```

4. Abra o Android Studio e rode o app (ou use o script):

```bash
npm run cap:open:android
```

5. No Android Studio: escolha um emulador ou dispositivo, depois Run → app.

Observações:
- Configure as variáveis `VITE_...` no ambiente antes de `npm run cap:build` para embutir tokens no bundle.
- Se precisar de plugins nativos (Camera, Geolocation), instale e sincronize: `npm install @capacitor/geolocation && npx cap sync`.

