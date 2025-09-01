// Utilitário de teste para verificar autenticação
// Execute este código no console do navegador

console.log('🧪 [AUTH TEST] Iniciando testes de autenticação...');

// Função para simular login
window.testLogin = async () => {
  console.log('🔑 [AUTH TEST] Testando login...');
  
  // Simular dados de login
  const mockUser = {
    id: 1,
    nome: "Ana Clara",
    sobrenome: "Silva",
    email: "ana@example.com",
    telefone: "(11) 99999-9999",
    created_at: new Date().toISOString()
  };
  
  const mockToken = "mock-jwt-token-" + Date.now();
  
  // Salvar no localStorage
  localStorage.setItem('authToken', mockToken);
  localStorage.setItem('userData', JSON.stringify(mockUser));
  
  console.log('✅ [AUTH TEST] Dados salvos no localStorage:');
  console.log('Token:', localStorage.getItem('authToken'));
  console.log('UserData:', localStorage.getItem('userData'));
  
  // Disparar evento para atualizar componentes
  window.dispatchEvent(new Event('auth-state-changed'));
  
  console.log('🔄 [AUTH TEST] Evento auth-state-changed disparado');
};

// Função para simular logout
window.testLogout = () => {
  console.log('🚪 [AUTH TEST] Testando logout...');
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  console.log('🗑️ [AUTH TEST] Dados removidos do localStorage');
  
  // Disparar evento para atualizar componentes
  window.dispatchEvent(new Event('auth-state-changed'));
  
  console.log('🔄 [AUTH TEST] Evento auth-state-changed disparado');
};

// Função para verificar estado atual
window.checkAuthState = () => {
  console.log('📊 [AUTH TEST] Estado atual:');
  console.log('Token:', localStorage.getItem('authToken'));
  console.log('UserData:', localStorage.getItem('userData'));
};

console.log('🧪 [AUTH TEST] Funções disponíveis:');
console.log('- testLogin() - Simula login');
console.log('- testLogout() - Simula logout');
console.log('- checkAuthState() - Verifica estado atual');
