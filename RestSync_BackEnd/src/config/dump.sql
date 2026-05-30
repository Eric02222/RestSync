SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA `restsync_db` ;
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
    REFERENCES `mydb`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `restsync_db`.`vinculo_usuario_paciente` (
  `paciente_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`paciente_id`, `usuario_id`),
  INDEX `fk_vinculo_usuario_paciente_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_vinculo_usuario_paciente_paciente`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `mydb`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vinculo_usuario_paciente_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `mydb`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
