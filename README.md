# DIGITAL WORLD - Application Web de monitoring de variable

## Description

Ce projet est une application web permettant de gérer des variables. Elle permet de :
- Récupérer des données via une API REST.
- Afficher les données dans une interface utilisateur.
- Enregistrer les variables dans une base de données.
L'application est idéale pour des systèmes de monitoring ou d'automatisation.

Cette application a été développé dans le cadre d'un projet de déploiment d'un site web en 5 ème années d'école d'ingénieur spécialisé dans la production automatisé et l'usine conecté. Ce projet ayant pour but de nous confronté à l'usine 4.0 et de rendre une installation industrielle plus connecté avec une amilioration du suivi de production mais aussi de la réactivité face au panne.

## Démonstration
[Vidéo de démonstration](https://youtu.be/Q1_-QNmRYKU)

## Table des matières

1. [Installation](#installation)
2. [Utilisation](#utilisation)
3. [Fonctionnalités](#fonctionnalités)
4. [Technologies utilisées](#technologies-utilisées)


## Installation

### Prérequis
- **Docker** et **Docker Compose** installés sur votre machine.
- **Git** pour cloner le dépôt.

### Étapes
1. Clonez le dépôt :
   git clone https://github.com/Val-HUB-DEC/D-ploiement_SI-.git
   cd TP_DEPLOIMENT_SI

2.Construisez et lancez les services avec Docker Compose : Docker Compose est utilisé pour configurer et lancer tous les services nécessaires à l'application. Utilisez la commande suivante :
   docker-compose up --build

Cette commande :
    Construit les images Docker pour les services définis dans le fichier docker-compose.yml.
    Démarre les conteneurs pour ces services.

Accédez à l'application : Une fois les conteneurs démarrés, vous pouvez accéder à votre application à l'adresse suivante : 
    http://localhost:8080.

## Utilisation

### Frontend
L'interface utilisateur est accessible à l'adresse
    http://localhost:8080. 
### Backend
L'API REST est accessible à l'adresse 
    http://localhost:5000.

## Fonctionnalités

### Gestion des installations :
permet de gérer (Ajouter/Suprimer) les différentes installations de l'usine (réseaux).

### Gestion des appareils :
permet de gérer (Ajouter/Supprimer/PING) les divers automates de chaque installations.

### Gestion des variables :
permet  gérer d'historiser et d'afficher l'état des variables stockées en temps réel et d'en ajouter de nouvelles.


## Technologies Utilisées

### Backend
Node.js et Express.js : Gestion des endpoints REST.
MySQL : Base de données relationnelle pour le stockage des variables.
### Autres outils
Thunder Client : Test des endpoints API.


