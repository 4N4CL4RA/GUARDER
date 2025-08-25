import mysql from 'mysql2/promise';

const createTables = async () => {
  try {
    // Conexão com o banco
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'guarder'
    });

    console.log('Conectado ao banco de dados...');

    // Criar tabela cadastro
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cadastro (
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
    console.log('✅ Tabela "cadastro" criada com sucesso!');

    // Criar tabela login
    await db.execute(`
      CREATE TABLE IF NOT EXISTS login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('success', 'failed') DEFAULT 'success',
        FOREIGN KEY (user_id) REFERENCES cadastro(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabela "login" criada com sucesso!');

    // Criar índices
    await db.execute('CREATE INDEX IF NOT EXISTS idx_cadastro_email ON cadastro(email)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_login_user_id ON login(user_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_login_time ON login(login_time)');
    console.log('✅ Índices criados com sucesso!');

    // Verificar tabelas criadas
    const [tables] = await db.execute('SHOW TABLES');
    console.log('\\n📋 Tabelas no banco "guarder":');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await db.end();
    console.log('\\n🎉 Configuração do banco concluída!');

  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  }
};

createTables();
