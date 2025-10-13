import { supabase } from './src/lib/supabaseClient.js';

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Testar conexão básica
    const { data: connection, error: connectionError } = await supabase
      .from('reviews')
      .select('count', { count: 'exact', head: true });
      
    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError);
      
      // Se a tabela não existe, vamos criar
      if (connectionError.code === '42P01') {
        console.log('📝 Tabela reviews não existe. Verificando se podemos criar...');
        
        // Testar se conseguimos acessar o banco
        const { data: tables, error: tablesError } = await supabase
          .rpc('get_schema_tables', { schema_name: 'public' });
          
        console.log('📋 Tabelas disponíveis:', tables);
        console.log('🔍 Erro ao listar tabelas:', tablesError);
      }
    } else {
      console.log('✅ Conexão com Supabase OK');
      console.log('📊 Total de reviews na tabela:', connection);
    }
    
    // Testar inserção de uma review de exemplo
    const testReview = {
      user: 'Teste User',
      avatar: 'TU',
      rating: 5,
      location: 'Local de Teste',
      title: 'Review de Teste',
      content: 'Esta é uma review de teste para verificar se o sistema está funcionando',
      category: 'security'
    };
    
    console.log('🧪 Testando inserção de review...');
    const { data: insertData, error: insertError } = await supabase
      .from('reviews')
      .insert([testReview])
      .select();
      
    if (insertError) {
      console.error('❌ Erro ao inserir review de teste:', insertError);
    } else {
      console.log('✅ Review de teste inserida com sucesso:', insertData);
      
      // Limpar o teste
      if (insertData && insertData[0]) {
        const { error: deleteError } = await supabase
          .from('reviews')
          .delete()
          .eq('id', insertData[0].id);
          
        if (deleteError) {
          console.warn('⚠️ Não foi possível limpar review de teste:', deleteError);
        } else {
          console.log('🧹 Review de teste removida');
        }
      }
    }
    
    // Buscar todas as reviews existentes
    console.log('🔍 Buscando reviews existentes...');
    const { data: allReviews, error: selectError } = await supabase
      .from('reviews')
      .select('*');
      
    if (selectError) {
      console.error('❌ Erro ao buscar reviews:', selectError);
    } else {
      console.log('📋 Reviews encontradas:', allReviews?.length || 0);
      console.log('📄 Primeiras 3 reviews:', allReviews?.slice(0, 3));
    }
    
  } catch (error) {
    console.error('💥 Erro geral no teste:', error);
  }
}

testSupabaseConnection();