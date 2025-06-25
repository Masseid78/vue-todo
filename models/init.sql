-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS taskmaster;
USE taskmaster;

-- Criação do usuário (opcional, remova se não quiser)
CREATE USER IF NOT EXISTS 'taskmaster'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON taskmaster.* TO 'taskmaster'@'localhost';
FLUSH PRIVILEGES;

-- Criação da tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('baixa','média','alta') DEFAULT 'média',
  category ENUM('geral','trabalho','estudo','pessoal','saúde','lazer') DEFAULT 'geral',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 