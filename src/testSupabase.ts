import { supabase } from './lib/supabaseClient'

// Teste de conexão com Supabase
async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('reviews')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error)
      console.log('🔧 Verifique:')
      console.log('   1. Se a tabela "reviews" existe no Supabase')
      console.log('   2. Se as variáveis de ambiente estão corretas')
      console.log('   3. Se executou o SQL de configuração')
      return false
    }

    console.log('✅ Conexão com Supabase OK!')
    console.log(`📊 Total de reviews na base: ${data || 0}`)
    return true

  } catch (error) {
    console.error('❌ Erro crítico:', error)
    return false
  }
}

// Teste de inserção
async function testReviewInsertion() {
  console.log('\n📝 Testando inserção de review...')
  
  try {
    const testReview = {
      rating: 4,
      comment: 'Teste de inserção - local seguro',
      lat: -23.5505,
      lng: -46.6333
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(testReview)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao inserir review:', error)
      return false
    }

    console.log('✅ Review inserido com sucesso:', data)
    
    // Limpar teste
    if (data?.id) {
      await supabase
        .from('reviews')
        .delete()
        .eq('id', data.id)
      console.log('🧹 Review de teste removido')
    }
    
    return true

  } catch (error) {
    console.error('❌ Erro no teste de inserção:', error)
    return false
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes do sistema de reviews...')
  console.log('=' .repeat(50))

  const connectionOK = await testSupabaseConnection()
  if (!connectionOK) {
    console.log('\n❌ Falha na conexão. Verifique a configuração antes de continuar.')
    return
  }

  const insertionOK = await testReviewInsertion()
  if (!insertionOK) {
    console.log('\n❌ Falha na inserção. Verifique as permissões da tabela.')
    return
  }

  console.log('\n🎉 Todos os testes passaram!')
  console.log('📍 O sistema está funcionando corretamente')
  console.log('\n💡 Se ainda não estiver salvando no mapa:')
  console.log('   1. Abra o DevTools (F12)')
  console.log('   2. Verifique a aba Console por erros')
  console.log('   3. Recarregue a página após as correções')
}

// Executar se chamado diretamente
if (import.meta.url.endsWith(process.argv[1])) {
  runTests().catch(console.error)
}

export { runTests, testSupabaseConnection, testReviewInsertion }