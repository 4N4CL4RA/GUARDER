import { initializeReviewSystem } from './initReviews'

// Executar o script de inicialização
console.log('🚀 Iniciando configuração do sistema de reviews...')

initializeReviewSystem()
  .then(() => {
    console.log('✅ Sistema configurado com sucesso!')
    console.log('📌 Acesse o mapa em /mapa para testar as funcionalidades')
  })
  .catch((error) => {
    console.error('❌ Erro na inicialização:', error)
    process.exit(1)
  })