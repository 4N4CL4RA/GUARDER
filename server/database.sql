-- Script para criar as tabelas do sistema de autenticação Guarder

-- Tabela para cadastro de usuários
CREATE TABLE IF NOT EXISTS cadastro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para controle de login/sessões
CREATE TABLE IF NOT EXISTS login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('success', 'failed') DEFAULT 'success',
  FOREIGN KEY (user_id) REFERENCES cadastro(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_cadastro_email ON cadastro(email);
CREATE INDEX idx_login_user_id ON login(user_id);
CREATE INDEX idx_login_time ON login(login_time);
