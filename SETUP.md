# 🛡️ Guarder - Guia de Instalação

## 📋 Pré-requisitos

### 1. **Node.js & NPM**
- **Node.js**: versão `≥18.0.0` (recomendado: `v22.18.0` ou superior)
- **NPM**: versão `≥8.0.0` (recomendado: `v10.9.3` ou superior)

**Verificar versões instaladas:**
```bash
node --version
npm --version
```

**Download Node.js:**
- 🔗 [https://nodejs.org/](https://nodejs.org/)
- Baixe a versão **LTS** (Long Term Support)

### 2. **Git**
- **Git**: Para clonar o repositório
- 🔗 [https://git-scm.com/downloads](https://git-scm.com/downloads)

---

## 🚀 Instalação do Projeto

### **Passo 1: Clonar o repositório**
```bash
git clone https://github.com/4N4CL4RA/GUARDER.git
cd GUARDER
```

### **Passo 2: Instalar dependências**
```bash
npm install
```

### **Passo 3: Configurar variáveis de ambiente (opcional)**
```bash
# Copiar exemplo do arquivo de ambiente
cp .env.example .env

# Editar o arquivo .env com suas configurações
# (Supabase, APIs, etc.)
```

### **Passo 4: Executar o projeto**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint
```

---

## 📦 Dependências Principais

### **🎯 Core Framework**
- `react` ^18.3.1 - Biblioteca JavaScript para UI
- `react-dom` ^18.3.1 - React DOM renderer
- `vite` ^5.4.19 - Build tool e dev server

### **🎨 UI & Styling**
- `tailwindcss` ^3.4.17 - Framework CSS utility-first
- `@radix-ui/*` - Componentes UI primitivos acessíveis
- `lucide-react` ^0.462.0 - Ícones SVG
- `framer-motion` ^12.23.12 - Animações

### **🗺️ Mapas & Localização**
- `leaflet` ^1.9.4 - Biblioteca de mapas interativos
- `react-leaflet` ^4.2.1 - Integração React + Leaflet
- `@types/leaflet` ^1.9.21 - Tipos TypeScript para Leaflet

### **🔐 Autenticação & Dados**
- `@supabase/supabase-js` ^2.56.0 - Cliente Supabase
- `@tanstack/react-query` ^5.83.0 - Gerenciamento de estado servidor
- `bcryptjs` ^3.0.2 - Hash de senhas

### **📝 Formulários & Validação**
- `react-hook-form` ^7.61.1 - Formulários performáticos
- `@hookform/resolvers` ^3.10.0 - Resolvers para validação
- `zod` ^3.25.76 - Schema validation

### **🧭 Roteamento**
- `react-router-dom` ^6.30.1 - Roteamento client-side

### **⚙️ Utilitários**
- `date-fns` ^3.6.0 - Manipulação de datas
- `clsx` ^2.1.1 - Utility para className
- `tailwind-merge` ^2.6.0 - Merge de classes Tailwind

---

## 🔧 Dependências de Desenvolvimento

### **📝 TypeScript & Tipos**
- `typescript` ^5.8.3
- `@types/react` ^18.3.23
- `@types/react-dom` ^18.3.7
- `@types/node` ^22.17.2

### **🧹 Linting & Formatting**
- `eslint` ^9.32.0
- `typescript-eslint` ^8.38.0
- `eslint-plugin-react-hooks` ^5.2.0

### **⚡ Build & Dev Tools**
- `@vitejs/plugin-react-swc` ^3.11.0
- `autoprefixer` ^10.4.21
- `postcss` ^8.5.6

---

## 🌐 URLs e Serviços Externos

### **🗺️ Mapas (Gratuitos)**
- **OpenStreetMap**: Tiles de mapas gratuitos
- **Nominatim**: Geocoding gratuito
- **OSRM**: Cálculo de rotas gratuito

### **☁️ Backend (Opcional)**
- **Supabase**: Database, Auth, Storage
- Configurar no arquivo `.env`

---

## 🚨 Solução de Problemas

### **❌ Erro: "Cannot find module 'react'"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **❌ Erro: "Port 5173 already in use"**
```bash
# Usar porta diferente
npm run dev -- --port 3000
```

### **❌ Erro de permissões no Windows**
```bash
# Executar como administrador ou usar:
npm install --no-optional
```

### **❌ Problemas com Leaflet/Mapas**
```bash
# Instalar tipos específicos
npm install --save-dev @types/leaflet
```

---

## 📱 Comandos Úteis

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Limpar cache NPM
npm cache clean --force
```

---

## 🎯 Stack Completa

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Frontend** | React | 18.3.1 |
| **Build** | Vite | 5.4.19 |
| **Linguagem** | TypeScript | 5.8.3 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **UI Components** | Radix UI | Várias |
| **Mapas** | Leaflet | 1.9.4 |
| **Backend** | Supabase | 2.56.0 |
| **Roteamento** | React Router | 6.30.1 |
| **Formulários** | React Hook Form | 7.61.1 |

---

## ✅ Verificação da Instalação

Após seguir todos os passos, você deve conseguir:

1. ✅ Executar `npm run dev` sem erros
2. ✅ Acessar `http://localhost:5173` no navegador
3. ✅ Ver a aplicação Guarder funcionando
4. ✅ Navegar entre as páginas
5. ✅ Ver o mapa interativo funcionando

---

## 🆘 Suporte

Se encontrar problemas:

1. **Verificar versões**: Node.js ≥18, NPM ≥8
2. **Limpar cache**: `npm cache clean --force`
3. **Reinstalar**: `rm -rf node_modules && npm install`
4. **Verificar logs**: Erros detalhados no console

---

**🎉 Pronto! Agora você tem o Guarder rodando localmente!**