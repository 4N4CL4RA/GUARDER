import mysql from 'mysql2/promise';

const checkTables = async () => {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'guarder'
    });

    console.log('🔍 Verificando estrutura das tabelas...\n');

    // Verificar tabela cadastro
    console.log('📋 Estrutura da tabela "cadastro":');
    const [cadastroColumns] = await db.execute('DESCRIBE cadastro');
    cadastroColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? col.Key : ''}`);
    });

    // Verificar tabela login
    console.log('\n📋 Estrutura da tabela "login":');
    const [loginColumns] = await db.execute('DESCRIBE login');
    loginColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? col.Key : ''}`);
    });

    // Verificar todas as tabelas
    console.log('\n📊 Todas as tabelas no banco:');
    const [tables] = await db.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await db.end();

  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

checkTables();
