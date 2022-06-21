FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Archivo de variables de entorno
COPY .env.production ./.env

# Install app dependencies
COPY package*.json ./
RUN npm install
ENTRYPOINT [ "nodejs", "src/keysRpcServer.js"] 
