SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `restsync_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `restsync_db`;

CREATE TABLE IF NOT EXISTS `restsync_db`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `senha` VARCHAR(255) NULL,
  `cpf` BIGINT(11) NULL,
  `tipo_usuario` ENUM("medico", "admin", "familiar") NULL,
  `crm` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  UNIQUE INDEX `crm_UNIQUE` (`crm` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `restsync_db`.`paciente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `cpf` BIGINT(11) NULL,
  `endereco` VARCHAR(100) NULL,
  `telefone` VARCHAR(45) NULL,
  `dados_vitais` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `restsync_db`.`historico_dados_vitais` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `frequencia_cardiaca` INT NULL,
  `pressao_arterial` VARCHAR(45) NULL,
  `temperatura` DECIMAL(8,2) NULL,
  `data` DATE NULL,
  `hora` TIME NULL,
  `paciente_id` INT NOT NULL,
  PRIMARY KEY (`id`, `paciente_id`),
  INDEX `fk_historico_dados_vitais_paciente1_idx` (`paciente_id` ASC) VISIBLE,
  CONSTRAINT `fk_historico_dados_vitais_paciente1`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `restsync_db`.`paciente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `restsync_db`.`auditoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NULL,
  `usuario_email` VARCHAR(100) NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `descricao` TEXT NOT NULL,
  `ip` VARCHAR(45) NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `restsync_db`.`vinculo_usuario_paciente` (
  `paciente_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`paciente_id`, `usuario_id`),
  INDEX `fk_vinculo_usuario_paciente_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_vinculo_usuario_paciente_paciente`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `restsync_db`.`paciente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_vinculo_usuario_paciente_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `restsync_db`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- Seed default test accounts
INSERT IGNORE INTO `usuario` (`id`, `nome`, `email`, `senha`, `cpf`, `tipo_usuario`, `crm`) VALUES
(1, 'Administrador RestSync', 'admin@restsync.com', '$2b$10$1g8J8PQfa051RhMV3Av6IedKCjfTQOWfiBdfNY8jF5yvvN4sLozr2', 11122233344, 'admin', NULL),
(2, 'Dr. Henrique Cavalcanti', 'medico@restsync.com', '$2b$10$I1NGyhaBTLLARaYJpzpmPu2QpHmeGLxELaXPQQtZzW3IWJ0AhL7f2', 22233344455, 'medico', 123456),
(3, 'Mariana Souza (Familiar)', 'familiar@restsync.com', '$2b$10$dyNveqU6/Ol8hgT1aucb1.PggVL8aVMo7fH1Zzm.Qk2pEaSRXI0De', 33344455566, 'familiar', NULL);

-- Seed a default patient/resident
INSERT IGNORE INTO `paciente` (`id`, `nome`, `cpf`, `endereco`, `telefone`, `dados_vitais`) VALUES
(1, 'Geraldo Magela de Souza', 55566677788, 'Av. Getúlio Vargas, 1420 - Funcionários', '(31) 98765-4321', '{}');

-- Seed initial vitals history for default patient
INSERT IGNORE INTO `historico_dados_vitais` (`id`, `frequencia_cardiaca`, `pressao_arterial`, `temperatura`, `data`, `hora`, `paciente_id`) VALUES
(1, 74, '120/80', 36.5, CURDATE(), '08:00:00', 1),
(2, 78, '122/82', 36.6, CURDATE(), '09:00:00', 1),
(3, 85, '125/84', 36.8, CURDATE(), '10:00:00', 1),
(4, 98, '130/85', 37.3, CURDATE(), '11:00:00', 1),
(5, 76, '120/80', 36.5, CURDATE(), '12:00:00', 1);

-- Vínculo demo: familiar Mariana (id 3) ↔ residente Geraldo (id 1)
INSERT IGNORE INTO `vinculo_usuario_paciente` (`paciente_id`, `usuario_id`) VALUES (1, 3);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
