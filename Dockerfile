FROM registry.k10.kaztoll.kz/node:14-alpine3.12 as build
WORKDIR /app
COPY ./ /app/
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm run build:prod

FROM registry.k10.kaztoll.kz/nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html 
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY ./nginx.conf /etc/nginx/
EXPOSE 80
