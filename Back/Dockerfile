# Étape 1 : Utilisation d'une image officielle de Node.js (version 14)
FROM node:14

# Étape 2 : Définition du répertoire de travail à /app
WORKDIR /app

# Étape 3 : Copier package.json et package-lock.json pour l'installation des dépendances
COPY package.json ./*

# Étape 4 : Installation de nodemon globalement

RUN npm install -g nodemon

# Étape 5 : Copier tous les fichiers du projet dans le conteneur
COPY . .

# Étape 6 : Exposer le port 5000 pour l'application
EXPOSE 5000

# Étape 7 : Lancer l'application avec nodemon
CMD ["nodemon","--legacy-watch", "app.js"]
