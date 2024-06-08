# Utiliser une image de base officielle de Node.js
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de package et package-lock et installer les dépendances
COPY package*.json ./

RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]