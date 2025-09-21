import { setupReviewsTable, testReviewsTable, getReviewsStats } from './utils/setupDatabase'
import { ReviewService } from './services/reviewService'

// Script para configurar e testar o sistema de reviews
async function initializeReviewSystem() {
  console.log('🚀 Inicializando sistema de reviews...')
  console.log('=' .repeat(50))

  // 1. Configurar tabela
  console.log('\n📋 Passo 1: Configurando tabela reviews')
  const tableSetup = await setupReviewsTable()
  
  if (!tableSetup) {
    console.error('❌ Falha na configuração da tabela. Abortando.')
    return
  }

  // 2. Testar operações básicas
  console.log('\n🧪 Passo 2: Testando operações básicas')
  const testResult = await testReviewsTable()
  
  if (!testResult) {
    console.warn('⚠️ Alguns testes falharam, mas continuando...')
  }

  // 3. Inserir dados de exemplo usando o ReviewService
  console.log('\n📝 Passo 3: Inserindo dados de exemplo')
  
  const sampleReviews = [
    {
      rating: 5,
      comment: 'Área muito segura, bem iluminada e movimentada durante o dia',
      lat: 38.8951,
      lng: -77.0364 // Washington DC
    },
    {
      rating: 3,
      comment: 'Razoavelmente seguro durante o dia, evite à noite',
      lat: 38.9072,
      lng: -77.0369
    },
    {
      rating: 4,
      comment: 'Boa área para caminhar, presença policial regular',
      lat: 37.7749,
      lng: -122.4194 // San Francisco
    },
    {
      rating: 2,
      comment: 'Área com alguns problemas de segurança, cuidado extra necessário',
      lat: 37.7849,
      lng: -122.4094
    }
  ]

  let insertedCount = 0
  
  for (const review of sampleReviews) {
    const result = await ReviewService.createReview(review)
    if (result) {
      insertedCount++
      console.log(`✅ Review inserido: ${review.comment?.substring(0, 30)}...`)
    } else {
      console.warn(`⚠️ Falha ao inserir review: ${review.comment?.substring(0, 30)}...`)
    }
  }

  console.log(`\n📊 Total de reviews inseridos: ${insertedCount}/${sampleReviews.length}`)

  // 4. Obter estatísticas
  console.log('\n📈 Passo 4: Obtendo estatísticas')
  
  const stats = await getReviewsStats()
  if (stats) {
    console.log('Estatísticas da tabela reviews:')
    console.log(`  • Total de reviews: ${stats.total}`)
    console.log(`  • Rating médio: ${stats.averageRating}`)
    console.log('  • Distribuição de ratings:')
    console.log(`    - ⭐ (1): ${stats.ratingDistribution[1]} reviews`)
    console.log(`    - ⭐⭐ (2): ${stats.ratingDistribution[2]} reviews`)
    console.log(`    - ⭐⭐⭐ (3): ${stats.ratingDistribution[3]} reviews`)
    console.log(`    - ⭐⭐⭐⭐ (4): ${stats.ratingDistribution[4]} reviews`)
    console.log(`    - ⭐⭐⭐⭐⭐ (5): ${stats.ratingDistribution[5]} reviews`)
  }

  // 5. Testar busca por localização
  console.log('\n🗺️ Passo 5: Testando busca por localização')
  
  const dcReviews = await ReviewService.getReviewsByLocation(
    { lat: 38.8951, lng: -77.0364 }, 
    2 // 2km de raio
  )
  
  console.log(`✅ Reviews encontrados próximos a Washington DC: ${dcReviews.length}`)
  
  const sfReviews = await ReviewService.getReviewsByLocation(
    { lat: 37.7749, lng: -122.4194 }, 
    2 // 2km de raio
  )
  
  console.log(`✅ Reviews encontrados próximos a San Francisco: ${sfReviews.length}`)

  // 6. Testar rating médio por localização
  console.log('\n🎯 Passo 6: Testando rating médio por localização')
  
  const dcRating = await ReviewService.getLocationRating(
    { lat: 38.8951, lng: -77.0364 }, 
    1 // 1km de raio
  )
  
  console.log(`📍 Rating médio em Washington DC (1km): ${dcRating}/5`)

  console.log('\n' + '=' .repeat(50))
  console.log('🎉 Sistema de reviews inicializado com sucesso!')
  console.log('📌 Próximos passos:')
  console.log('   1. Integrar com o componente InteractiveMap')
  console.log('   2. Criar interface para adicionar reviews')
  console.log('   3. Implementar autenticação de usuários')
  console.log('   4. Adicionar validações extras')
}

// Executar apenas se chamado diretamente
if (import.meta.url.endsWith(process.argv[1])) {
  initializeReviewSystem().catch(console.error)
}

export { initializeReviewSystem }