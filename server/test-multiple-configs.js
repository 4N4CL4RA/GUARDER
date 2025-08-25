import mysql from "mysql2/promise";

const configurations = [
  {
    name: "Configuração 1 (sem senha)",
    config: {
      host: "localhost",
      user: "root",
      password: "",
      database: "guarder",
    }
  },
  {
    name: "Configuração 2 (senha padrão)",
    config: {
      host: "localhost",
      user: "root", 
      password: "root",
      database: "guarder",
    }
  },
  {
    name: "Configuração 3 (sem database)",
    config: {
      host: "localhost",
      user: "root",
      password: "",
    }
  },
  {
    name: "Configuração 4 (senha admin)",
    config: {
      host: "localhost",
      user: "root",
      password: "admin",
      database: "guarder",
    }
  }
];

async function testMultipleConfigurations() {
  console.log("🔍 Testando múltiplas configurações de banco...\n");
  
  for (const { name, config } of configurations) {
    console.log(`📋 Testando: ${name}`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log("✅ Conexão estabelecida com sucesso!");
      
      // Se conectou sem database, tenta criar o database
      if (!config.database) {
        try {
          await connection.execute("CREATE DATABASE IF NOT EXISTS guarder");
          console.log("✅ Database 'guarder' criado/verificado!");
          
          await connection.execute("USE guarder");
          console.log("✅ Database 'guarder' selecionado!");
        } catch (dbError) {
          console.log("⚠️  Erro ao criar/usar database:", dbError.message);
        }
      }
      
      // Mostra databases disponíveis
      try {
        const [databases] = await connection.execute("SHOW DATABASES");
        console.log("📂 Databases disponíveis:", databases.map(db => db.Database).join(", "));
      } catch (err) {
        console.log("⚠️  Não foi possível listar databases");
      }
      
      await connection.end();
      console.log("🎯 Esta configuração funciona! Use ela no index.js\n");
      
      // Salva a configuração que funcionou
      console.log("📝 Configuração para usar no index.js:");
      console.log("```javascript");
      console.log("const db = await mysql.createPool({");
      console.log(`  host: "${config.host}",`);
      console.log(`  user: "${config.user}",`);
      console.log(`  password: "${config.password}",`);
      console.log(`  database: "guarder",`);
      console.log("});");
      console.log("```\n");
      
      return config;
      
    } catch (error) {
      console.log(`❌ Falhou: ${error.message}\n`);
    }
  }
  
  console.log("❌ Nenhuma configuração funcionou!");
  console.log("💡 Verifique se o MySQL está instalado e rodando:");
  console.log("   Windows: Abra 'Serviços' e procure por 'MySQL'");
  console.log("   Ou execute: net start mysql");
  console.log("   Ou instale via: https://dev.mysql.com/downloads/installer/");
}

testMultipleConfigurations();
