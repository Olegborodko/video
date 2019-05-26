FROM nikolaik/python-nodejs:latest

RUN mkdir -p /app

WORKDIR /app

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]