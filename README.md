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

## 🚀 Como Executar em Outra Máquina

### 📋 Pré-requisitos
1. **Node.js** versão 18 ou superior ([Download aqui](https://nodejs.org/))
2. **Git** para clonar o repositório ([Download aqui](https://git-scm.com/))
3. **Conta GitHub** (opcional, para contribuições)

### 🔧 Instalação Passo a Passo

#### **1. Clone o Repositório**
```bash
# Via HTTPS (recomendado)
git clone https://github.com/4N4CL4RA/GUARDER.git

# Ou via SSH (se tiver chave configurada)
git clone git@github.com:4N4CL4RA/GUARDER.git

# Entre no diretório
cd GUARDER
```

#### **2. Instale as Dependências**
```bash
# Usando NPM (padrão)
npm install

# Ou usando Yarn (alternativo)
yarn install
```

#### **3. Configure o Ambiente (Opcional)**
```bash
# Copie o arquivo de exemplo (se existir)
cp .env.example .env

# Ou crie um novo arquivo .env
touch .env
```

#### **4. Execute o Projeto**
```bash
# Modo desenvolvimento
npm run dev

# O projeto estará disponível em:
# http://localhost:5173
```

### 🌐 URLs de Acesso
- **Desenvolvimento**: `http://localhost:5173`
- **Modo Preview**: `http://localhost:4173` (após `npm run preview`)

### 🗂️ Comandos Disponíveis
```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Preview da versão de produção
npm run preview

# Verificar código (linting)
npm run lint

# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update
```

### 🔧 Solução de Problemas Comuns

#### ❌ **Erro: "Cannot find module"**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

#### ❌ **Porta 5173 em uso**
```bash
# Use uma porta diferente
npm run dev -- --port 3000
```

#### ❌ **Problemas de permissão (Windows)**
```bash
# Execute como administrador ou:
npm install --no-optional
```

#### ❌ **Node.js muito antigo**
```bash
# Verifique a versão
node --version

# Se for menor que 18, atualize em:
# https://nodejs.org/
```

### 💡 Dicas para Diferentes Sistemas

#### **Windows**
- Use **PowerShell** ou **Git Bash**
- Considere usar **WSL2** para melhor performance

#### **macOS**
- Use **Terminal** nativo
- Considere instalar via **Homebrew**: `brew install node`

#### **Linux (Ubuntu/Debian)**
```bash
# Instalar Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ou via snap
sudo snap install node --classic
```

### 🎯 Verificação da Instalação

Após seguir os passos, você deve conseguir:

1. ✅ Executar `npm run dev` sem erros
2. ✅ Acessar `http://localhost:5173` no navegador  
3. ✅ Ver a página inicial do Guarder
4. ✅ Navegar entre as diferentes páginas
5. ✅ Ver o mapa interativo funcionando

### 📱 Acesso Mobile
O projeto é **totalmente responsivo**:
- Acesse `http://[SEU_IP]:5173` de outros dispositivos na mesma rede
- Exemplo: `http://192.168.1.100:5173`

---

## 🛠️ Stack Tecnológico Completo

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
