# Verwende ein offizielles Node.js-Image als Basis
FROM node:19

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json in den Container
COPY package.json package-lock.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest der Anwendung in den Container
COPY . .

# Exponiere den Port 3000 für den Zugriff
EXPOSE 3000

# Definiere den Startbefehl für die App
CMD ["npm", "start"]
