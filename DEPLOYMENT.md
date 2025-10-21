# 🔄 Guarder - Setup Multi-Ambiente

## 📱 Como Rodar em Diferentes Máquinas e Contas

### 🎯 **Cenário 1: Nova Máquina (Primeira Vez)**

#### **Windows**
```powershell
# 1. Instalar Node.js
# Baixe em: https://nodejs.org/
# Escolha a versão LTS

# 2. Verificar instalação
node --version
npm --version

# 3. Instalar Git (se não tiver)
# Baixe em: https://git-scm.com/download/win

# 4. Clonar projeto
git clone https://github.com/4N4CL4RA/GUARDER.git
cd GUARDER

# 5. Instalar dependências e executar
npm install
npm run dev
```

#### **macOS**
```bash
# 1. Instalar Node.js via Homebrew (recomendado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Ou baixar diretamente: https://nodejs.org/

# 2. Verificar instalação
node --version
npm --version

# 3. Clonar projeto
git clone https://github.com/4N4CL4RA/GUARDER.git
cd GUARDER

# 4. Instalar e executar
npm install
npm run dev
```

#### **Linux (Ubuntu/Debian)**
```bash
# 1. Atualizar sistema
sudo apt update

# 2. Instalar Node.js via NodeSource (versão mais recente)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ou via snap
sudo snap install node --classic

# 3. Verificar instalação
node --version
npm --version

# 4. Instalar Git (se necessário)
sudo apt install git

# 5. Clonar projeto
git clone https://github.com/4N4CL4RA/GUARDER.git
cd GUARDER

# 6. Instalar e executar
npm install
npm run dev
```

---

### 🏢 **Cenário 2: Computador da Empresa/Escola**

#### **Sem Permissões de Admin**
```bash
# 1. Usar Node Version Manager (não precisa admin)
# Windows: usar nvm-windows
# macOS/Linux: usar nvm

# Instalar nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar Node.js via nvm
nvm install --lts
nvm use --lts

# 2. Continuar normalmente
git clone https://github.com/4N4CL4RA/GUARDER.git
cd GUARDER
npm install
npm run dev
```

#### **Proxy Corporativo**
```bash
# Configurar NPM para proxy
npm config set proxy http://proxy.empresa.com:8080
npm config set https-proxy http://proxy.empresa.com:8080

# Ou usar arquivo .npmrc na raiz do projeto
echo "proxy=http://proxy.empresa.com:8080" > .npmrc
echo "https-proxy=http://proxy.empresa.com:8080" >> .npmrc

# Continuar instalação
npm install
```

---

### 💻 **Cenário 3: Múltiplas Contas no Mesmo PC**

#### **Usando Pastas Diferentes**
```bash
# Usuário 1
cd /Users/usuario1/Projetos
git clone https://github.com/4N4CL4RA/GUARDER.git GUARDER-user1
cd GUARDER-user1
npm install
npm run dev # Porta 5173

# Usuário 2
cd /Users/usuario2/Projetos  
git clone https://github.com/4N4CL4RA/GUARDER.git GUARDER-user2
cd GUARDER-user2
npm install
npm run dev -- --port 3000 # Porta diferente
```

#### **Usando Diferentes Versões Node**
```bash
# Com nvm (recomendado)
nvm install 18.19.0
nvm use 18.19.0
npm install && npm run dev

# Outra versão
nvm install 20.11.0
nvm use 20.11.0
npm install && npm run dev
```

---

### 🌐 **Cenário 4: Desenvolvimento Remoto**

#### **VS Code + Dev Containers**
```dockerfile
# Criar .devcontainer/devcontainer.json
{
  "name": "Guarder Dev",
  "image": "node:18-alpine",
  "forwardPorts": [5173],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode"
      ]
    }
  }
}
```

#### **GitHub Codespaces**
```bash
# 1. Ir para o repositório no GitHub
# 2. Clicar em "Code" > "Codespaces" > "Create codespace"
# 3. Aguardar setup automático
# 4. Executar no terminal:
npm install
npm run dev
```

#### **Gitpod**
```yaml
# Criar .gitpod.yml na raiz
image: node:18

ports:
  - port: 5173
    onOpen: open-preview
    
tasks:
  - init: npm install
    command: npm run dev

vscode:
  extensions:
    - bradlc.vscode-tailwindcss
    - esbenp.prettier-vscode
```

---

### 📱 **Cenário 5: Acesso Mobile/Tablet**

#### **Testando em Dispositivos Móveis**
```bash
# 1. Descobrir seu IP local
# Windows
ipconfig | findstr "IPv4"

# macOS/Linux  
ifconfig | grep "inet "

# 2. Executar com host específico
npm run dev -- --host 0.0.0.0

# 3. Acessar de outros dispositivos
# http://[SEU_IP]:5173
# Exemplo: http://192.168.1.100:5173
```

#### **Usando Ngrok (Túnel Público)**
```bash
# 1. Instalar ngrok
npm install -g ngrok

# 2. Executar o projeto
npm run dev

# 3. Em outro terminal, criar túnel
ngrok http 5173

# 4. Usar a URL pública fornecida
# Exemplo: https://abc123.ngrok.io
```

---

### 🔧 **Configurações de Ambiente**

#### **Variáveis de Ambiente (.env)**
```env
# Opcional - se precisar configurar APIs
VITE_APP_TITLE=Guarder
VITE_APP_VERSION=1.0.0

# Para mapas (se implementar Google Maps)
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Para backend (se implementar Supabase)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### **Configurações de IDE**

**VS Code (Recomendado)**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

**Extensões Recomendadas**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

---

### 🚨 **Solução de Problemas Avançados**

#### **Limpeza Completa**
```bash
# Limpar tudo e recomeçar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### **Problemas de Rede**
```bash
# Usar registry alternativo
npm config set registry https://registry.npmmirror.com

# Voltar ao padrão
npm config set registry https://registry.npmjs.org
```

#### **Problemas de Permissão (NPM Global)**
```bash
# Configurar pasta global (Linux/macOS)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Adicionar ao PATH no ~/.bashrc ou ~/.zshrc
export PATH=~/.npm-global/bin:$PATH
```

---

### ✅ **Checklist de Verificação**

Após setup, verifique se:

- [ ] `node --version` retorna ≥18.0.0
- [ ] `npm --version` retorna ≥8.0.0  
- [ ] `npm run dev` executa sem erros
- [ ] `http://localhost:5173` carrega a aplicação
- [ ] Todas as páginas são navegáveis
- [ ] O mapa interativo funciona
- [ ] Não há erros no console do navegador

---

### 🆘 **Suporte**

Se encontrar problemas:

1. **Verificar versões**: Node.js e NPM atualizados
2. **Limpar cache**: `npm cache clean --force`
3. **Reinstalar**: `rm -rf node_modules && npm install`
4. **Verificar logs**: Erros detalhados no terminal
5. **Consultar Issues**: GitHub do projeto

---

**🎉 Agora você pode rodar o Guarder em qualquer lugar!**