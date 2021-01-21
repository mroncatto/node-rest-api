FROM node:alpine

LABEL Marcelo Roncatto Ficagna "roncattomarcelo@gmail.com"

# Crea el directorio
RUN mkdir /server

# VOLUME
WORKDIR /server

RUN npm set strict-ssl false

RUN npm install -gq nodemon

COPY ./ /server

RUN npm install

CMD npm start