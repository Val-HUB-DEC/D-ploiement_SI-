-- Active: 1733157311690@@127.0.0.1@3306@DB_DIGITAL_WORLD
-- Création de la base de données et des tables
CREATE DATABASE IF NOT EXISTS DB_DIGITAL_WORLD;
USE DB_DIGITAL_WORLD;

-- Table 1 : Installation
CREATE TABLE IF NOT EXISTS installation (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Nom CHAR(255) NOT NULL,
  Nb_Appareil INT NOT NULL,
  Status INT NOT NULL
);

-- Table 2 : Appareil
CREATE TABLE IF NOT EXISTS appareil (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Nom CHAR(255) NOT NULL,
  Status BOOL NOT NULL,
  ip CHAR(15) NOT NULL,
  ID_of_installation INT,
  FOREIGN KEY (ID_of_installation) REFERENCES installation(ID)
);

-- Table 3 : Variable
CREATE TABLE IF NOT EXISTS variable (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Nom CHAR(255) NOT NULL,
  I_Bool BOOL NOT NULL,
  I_int BOOL NOT NULL,
  taux CHAR(50) NOT NULL,
  unité CHAR(50) NOT NULL,
  adresse CHAR(255) NOT NULL,
  Port_API CHAR(255) NOT NULL,
  I_MAE_MIN INT NOT NULL,
  I_MAE_MAX INT NOT NULL,  -- Ajout de la colonne I_MAE_MAX
  O_MAE_MIN INT NOT NULL,  -- Ajout de la colonne O_MAE_MIN
  O_MAE_MAX INT NOT NULL,  -- Ajout de la colonne O_MAE_MAX
  ID_of_appareil INT,      -- Ajout de la colonne pour lier avec l'appareil
  FOREIGN KEY (ID_of_appareil) REFERENCES appareil(ID)
);

-- Table 4 : Valeurs
CREATE TABLE IF NOT EXISTS valeurs (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  ID_of_variable INT,
  value INT NOT NULL,
  dates DATETIME,
  FOREIGN KEY (ID_of_variable) REFERENCES variable(ID)
);
