FROM node:16
LABEL org.opencontainers.image.source https://github.com/unal-swarch-2022i-1A/firma_keys_ms

# Create app directory
WORKDIR /usr/src/app

# Archivo de variables de entorno
COPY .env.production ./.env

# Install app dependencies
COPY package*.json ./
RUN npm install
ENTRYPOINT [ "nodejs", "src/keysRpcServer.js"] 
