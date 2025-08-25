import mysql from "mysql2/promise";

async function testDatabaseConnection() {
  console.log("🔍 Testando conexão com o banco de dados...");
  
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // Senha vazia funcionou
      database: "guarder",
    });

    console.log("✅ Conexão com o banco estabelecida com sucesso!");
    
    // Teste se a tabela existe
    try {
      const [rows] = await connection.execute("SHOW TABLES LIKE 'mensagens'");
      if (rows.length > 0) {
        console.log("✅ Tabela 'mensagens' encontrada!");
        
        // Mostra a estrutura da tabela
        const [columns] = await connection.execute("DESCRIBE mensagens");
        console.log("📋 Estrutura da tabela 'mensagens':");
        columns.forEach(col => {
          console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''}`);
        });
      } else {
        console.log("⚠️  Tabela 'mensagens' não encontrada!");
        console.log("📝 Criando tabela 'mensagens'...");
        
        await connection.execute(`
          CREATE TABLE mensagens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            sobrenome VARCHAR(100),
            email VARCHAR(150) NOT NULL,
            telefone VARCHAR(20),
            mensagem TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        console.log("✅ Tabela 'mensagens' criada com sucesso!");
      }
    } catch (tableError) {
      console.log("❌ Erro ao verificar/criar tabela:", tableError.message);
    }
    
    await connection.end();
    console.log("🏁 Teste de conexão concluído!");
    
  } catch (error) {
    console.log("❌ Erro ao conectar com o banco:");
    console.log("   Erro:", error.message);
    console.log("   Código:", error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log("💡 Dicas para resolver:");
      console.log("   1. Verifique se o MySQL está instalado e rodando");
      console.log("   2. Execute: net start mysql (Windows) ou sudo service mysql start (Linux)");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("💡 Dicas para resolver:");
      console.log("   1. Verifique o usuário e senha no arquivo index.js");
      console.log("   2. Verifique as permissões do usuário MySQL");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log("💡 Dicas para resolver:");
      console.log("   1. Crie o banco 'guarder': CREATE DATABASE guarder;");
    }
  }
}

testDatabaseConnection();
