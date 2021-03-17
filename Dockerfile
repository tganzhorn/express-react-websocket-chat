FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set proxy %insert_proxy_here%
RUN npm config set https-proxy %insert_proxy_here%
RUN npm install --only=production
RUN rm package*.json

COPY . .

# install client dependencies and build it.
RUN cd client && npm install --only=production && npm run build

# remove unnecessary files and folders from the client folder.
RUN cd client && rm -v node_modules package*.json public src -r

RUN npm prune --production

EXPOSE 5000

CMD ["node", "index.js"]
