FROM node:12

WORKDIR /app

COPY . .

RUN npm install
RUN npm install pm2 -g

CMD ["pm2-runtime", "app.js"]