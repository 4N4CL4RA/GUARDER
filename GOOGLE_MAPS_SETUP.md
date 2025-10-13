# 🗺️ GUIA COMPLETO: Google Maps API Key para o Guarder

## 🚀 Passo a Passo para Configurar

### 1. Acessar Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Criar/Selecionar Projeto
- Clique em "Select a project" no topo
- Clique em "NEW PROJECT"
- Nome do projeto: "Guarder-Maps" (ou qualquer nome)
- Clique em "CREATE"

### 3. Ativar APIs Necessárias
Vá para "APIs & Services" > "Library" e ative:

✅ **Maps JavaScript API**
- Essencial para exibir o mapa base

✅ **Places API** 
- Para busca de locais e endereços

✅ **Directions API**
- Para cálculo de rotas seguras

✅ **Geocoding API**
- Para converter coordenadas em endereços

### 4. Criar API Key
- Vá para "APIs & Services" > "Credentials"
- Clique em "+ CREATE CREDENTIALS"
- Selecione "API Key"
- Copie a chave gerada

### 5. Configurar Restrições (Recomendado)
- Clique na API Key criada
- Em "Application restrictions":
  - Selecione "HTTP referrers (web sites)"
  - Adicione: `http://localhost:*/*` (para desenvolvimento)
  - Adicione: `https://seudominio.com/*` (para produção)

### 6. Configurar no Projeto
Abra o arquivo `.env.local` e substitua:
```
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
```

### 7. Reiniciar Servidor
```bash
npm run dev
```

## 💰 Custos (Preços de 2024)

### Cota Gratuita Mensal:
- **Maps JavaScript API**: 28,000 carregamentos
- **Places API**: $200 em créditos
- **Directions API**: $200 em créditos  
- **Geocoding API**: $200 em créditos

### Para Desenvolvimento:
✅ **TOTALMENTE GRATUITO** durante desenvolvimento
✅ Cota generosa para projetos pequenos/médios

## 🛡️ Funcionalidades do Guarder que Funcionam:

✅ **Mapa base interativo**
✅ **Círculos de risco coloridos**  
✅ **Marcadores de avaliações**
✅ **InfoWindows com detalhes**
✅ **Busca de locais**
✅ **Cálculo de rotas**
✅ **Geolocalização do usuário**
✅ **Geocoding reverso**

## 🎯 Vantagens para o Guarder:

1. **Precisão**: Dados atualizados do Google
2. **Performance**: Carregamento rápido
3. **Recursos**: APIs robustas
4. **Escalabilidade**: Suporta muitos usuários
5. **Personalização**: Estilos customizados
6. **Mobile**: Responsivo nativamente

## 🔗 Links Úteis:
- Console: https://console.cloud.google.com/
- Documentação: https://developers.google.com/maps
- Preços: https://cloud.google.com/maps-platform/pricing