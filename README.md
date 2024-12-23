# DIGITAL WORLD - Application Web de monitoring de variables

## Description

Ce projet est une application web permettant de gérer des variables. Elle permet de :  
- Récupérer des données.  
- Afficher les données dans une interface utilisateur.  
- Enregistrer les variables dans une base de données.  
L'application est idéale pour des systèmes de monitoring ou d'automatisation.

Cette application a été développée dans le cadre d'un projet de déploiement d'un site web en 5ᵉ année d'école d'ingénieur spécialisée dans la production automatisée et l'usine connectée. Ce projet a pour but de nous confronter à l'usine 4.0 et de rendre une installation industrielle plus connectée avec une amélioration du suivi de production mais aussi de la réactivité face aux pannes.

## Démonstration
[Vidéo de démonstration](https://youtu.be/Q1_-QNmRYKU)

## Table des matières

1. [Installation](#installation)  
2. [Utilisation](#utilisation)  
3. [Fonctionnalités](#fonctionnalités)  
4. [Technologies utilisées](#technologies-utilisées)  
5. [Développement futur](#développement-futur)

## Installation

### Prérequis
- **Docker** et **Docker Compose** installés sur votre machine.  
- **Git** pour cloner le dépôt.  

### Étapes
1. Clonez le dépôt :  
   ```bash
   git clone https://github.com/Val-HUB-DEC/D-ploiement_SI-.git
   cd TP_DEPLOIEMENT_SI

2. Construisez et lancez les services avec Docker Compose :
Docker Compose est utilisé pour configurer et lancer tous les services nécessaires à l'application. Utilisez la commande suivante :
    ```bash
    docker-compose up --build

3. Accédez à l'application :
Une fois les conteneurs démarrés, vous pouvez accéder à votre application à l'adresse suivante : http://localhost:8080

## Utilisation

### Frontend
L'interface utilisateur est accessible à l'adresse : http://localhost:8080


### Backend
L'API REST est accessible à l'adresse : http://localhost:5000


## Fonctionnalités

### Gestion des installations :
Permet de gérer (ajouter/supprimer) les différentes installations de l'usine (réseaux).

### Gestion des appareils :
Permet de gérer (ajouter/supprimer/PING) les divers automates de chaque installation.

### Gestion des variables :
Permet d'historiser et d'afficher l'état des variables stockées en temps réel et d'en ajouter de nouvelles.

## Technologies Utilisées

### Backend
- Node.js et Express.js : Gestion des endpoints REST.
- MySQL : Base de données relationnelle pour le stockage des variables.
### Autres outils
- Thunder Client : Test des endpoints API.

## Développement futur
Pour les prochaines versions de l'application, plusieurs fonctionnalités sont envisagées pour enrichir l'expérience utilisateur et améliorer les performances :

### Fonctionnalités à ajouté
- Notifications et alertes :
Implémentation d'un système d'alertes (e-mails, SMS, notifications push) pour informer les utilisateurs en cas d'anomalie ou de dépassement de seuils prédéfinis.

- Tableaux de bord avancés :
Création de graphiques interactifs pour visualiser les données en temps réel et analyser les tendances historiques.

- Rapports personnalisés :
Possibilité de générer des rapports exportables (PDF, CSV) avec des analyses détaillées des données.

- Support multi-utilisateur :
Gestion des rôles et permissions pour permettre un accès sécurisé et contrôlé à l'application.

### Optimisations techniques
- Amélioration des performances :
Intégration de solutions de mise en cache pour accélérer le traitement des données fréquemment demandées.

- Scalabilité :
Migration vers une architecture cloud-native pour supporter un grand nombre d'utilisateurs et de données.

- Sécurité :
Mise en place de mécanismes d'authentification OAuth2 et gestion renforcée des données sensibles.
