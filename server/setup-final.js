import mysql from 'mysql2/promise';

const setupDatabase = async () => {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'guarder'
    });

    console.log('🔗 Conectado ao banco guarder...');

    // Dropar tabelas se existirem (para recriar)
    try {
      await db.execute('DROP TABLE IF EXISTS login');
      await db.execute('DROP TABLE IF EXISTS cadastro');
      console.log('🗑️ Tabelas anteriores removidas');
    } catch (err) {
      console.log('ℹ️ Nenhuma tabela anterior para remover');
    }

    // Criar tabela cadastro
    await db.execute(`
      CREATE TABLE cadastro (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        sobrenome VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela "cadastro" criada!');

    // Criar tabela login
    await db.execute(`
      CREATE TABLE login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('success', 'failed') DEFAULT 'success'
      )
    `);
    console.log('✅ Tabela "login" criada!');

    // Verificar criação
    const [tables] = await db.execute('SHOW TABLES');
    console.log('\n📋 Tabelas disponíveis:');
    tables.forEach(table => {
      console.log(`  ✓ ${Object.values(table)[0]}`);
    });

    // Inserir usuário de teste
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await db.execute(`
      INSERT INTO cadastro (nome, sobrenome, email, telefone, password) 
      VALUES (?, ?, ?, ?, ?)
    `, ['João', 'Silva', 'joao@teste.com', '(11) 99999-9999', hashedPassword]);
    
    console.log('👤 Usuário de teste criado: joao@teste.com / 123456');

    await db.end();
    console.log('\n🎉 Banco configurado com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

setupDatabase();
