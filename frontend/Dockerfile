FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install Angular CLI
RUN npm install -g @angular/cli

COPY . .

# Create assets directory if it doesn't exist
RUN mkdir -p /app/src/assets

# Create empty favicon if it doesn't exist
RUN touch /app/src/favicon.ico

EXPOSE 4200

CMD ["npm", "start"]
