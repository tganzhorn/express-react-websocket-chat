FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN cd client && npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]