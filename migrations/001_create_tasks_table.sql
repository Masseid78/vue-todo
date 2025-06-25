CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('baixa','média','alta') DEFAULT 'média',
  category ENUM('geral','trabalho','estudo','pessoal','saúde','lazer') DEFAULT 'geral',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 