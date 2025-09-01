import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// Chave secreta para JWT
const JWT_SECRET = "guarder_secret_key_2025";

// conexão com banco
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "guarder",
});

// Testar conexão com o banco
try {
  const [result] = await db.execute("SELECT 1 as test");
  console.log("✅ Conexão com banco de dados estabelecida com sucesso!");
} catch (error) {
  console.error("❌ Erro na conexão com banco de dados:", error);
}

// Criar tabelas se não existirem
const createTables = async () => {
  try {
    // Tabela cadastro
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
    
    // Tabela login
    await db.execute(`
      CREATE TABLE IF NOT EXISTS login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('success', 'failed') DEFAULT 'success'
      )
    `);
    
    // Tabela mensagens (para formulário de contato)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        sobrenome VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        mensagem TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ Tabelas verificadas/criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  }
};

// Executar criação das tabelas
await createTables();

// rota para receber formulário
app.post("/contact", async (req, res) => {
  console.log("📧 Recebendo mensagem de contato:", req.body);
  try {
    const { nome, sobrenome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      console.log("❌ Campos obrigatórios não preenchidos");
      return res.status(400).json({ error: "Nome, email e mensagem são obrigatórios" });
    }

    const [result] = await db.execute(
      "INSERT INTO mensagens (nome, sobrenome, email, telefone, mensagem) VALUES (?, ?, ?, ?, ?)",
      [nome, sobrenome || '', email, telefone || '', mensagem]
    );

    console.log("✅ Mensagem salva com sucesso! ID:", result.insertId);
    res.status(200).json({ message: "Mensagem enviada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao salvar mensagem:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para cadastro de usuário
app.post("/auth/register", async (req, res) => {
  console.log("📝 Tentativa de cadastro:", req.body.email);
  try {
    const { nome, sobrenome, email, telefone, password, confirmPassword } = req.body;

    // Validações
    if (!nome || !sobrenome || !email || !telefone || !password) {
      console.log("❌ Campos obrigatórios não preenchidos");
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (password !== confirmPassword) {
      console.log("❌ Senhas não coincidem");
      return res.status(400).json({ error: "As senhas não coincidem" });
    }

    if (password.length < 6) {
      console.log("❌ Senha muito curta");
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres" });
    }

    // Verificar se email já existe
    const [existingUser] = await db.execute(
      "SELECT id FROM cadastro WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      console.log("❌ Email já cadastrado:", email);
      return res.status(400).json({ error: "Este email já está cadastrado" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário
    const [result] = await db.execute(
      "INSERT INTO cadastro (nome, sobrenome, email, telefone, password) VALUES (?, ?, ?, ?, ?)",
      [nome, sobrenome, email, telefone, hashedPassword]
    );

    console.log("✅ Usuário cadastrado com sucesso:", email, "ID:", result.insertId);
    res.status(201).json({ 
      message: "Usuário cadastrado com sucesso!",
      userId: result.insertId 
    });

  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para login
app.post("/auth/login", async (req, res) => {
  console.log("🔐 Tentativa de login:", req.body.email);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Email ou senha não fornecidos");
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
    const [users] = await db.execute(
      "SELECT * FROM cadastro WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      console.log("❌ Usuário não encontrado:", email);
      // Registrar tentativa de login falhada
      await db.execute(
        "INSERT INTO login (user_id, email, status, ip_address) VALUES (?, ?, ?, ?)",
        [0, email, 'failed', req.ip]
      );
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const user = users[0];
    console.log("👤 Usuário encontrado:", user.nome, user.email);

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Senha incorreta para:", email);
      // Registrar tentativa de login falhada
      await db.execute(
        "INSERT INTO login (user_id, email, status, ip_address) VALUES (?, ?, ?, ?)",
        [user.id, email, 'failed', req.ip]
      );
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Registrar login bem-sucedido
    await db.execute(
      "INSERT INTO login (user_id, email, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
      [user.id, email, 'success', req.ip, req.get('User-Agent')]
    );

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    console.log("✅ Login bem-sucedido:", email);
    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Rota para verificar token (opcional)
app.get("/auth/verify", verifyToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, nome, sobrenome, email, telefone, created_at FROM cadastro WHERE id = ?",
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
