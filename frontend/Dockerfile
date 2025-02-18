FROM node:18-alpine

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install -g @angular/cli
RUN npm install

RUN ng build --configuration=production

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--configuration=production"]
