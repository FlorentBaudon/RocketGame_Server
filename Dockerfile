FROM node:21-bullseye-slim

#Install mongodb
RUN apt-get update \
&& apt-get -y install gnupg curl \
&& curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor \
&& echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
&& apt-get update \
&& apt-get -y install mongodb-org --no-install-recommends \
&& rm -rf /var/lib/apt/lists/* 

WORKDIR /
COPY ./src /rocketgame/src
COPY ./package.json /rocketgame/
COPY ./package-lock.json /rocketgame/
COPY ./tsconfig.json /rocketgame/

RUN mkdir /rocketgame/datas \
&& mkdir /rocketgame/datas/games

WORKDIR /rocketgame

RUN echo 'nohup mongod --port 27017 --bind_ip_all --dbpath /rocketgame/databases/ &' >> start.sh \
&& echo 'node ./dist/server.js' >> start.sh \
&& chmod 775 ./start.sh \
&& npm install \
&& npm run build

EXPOSE 7070 
EXPOSE 27017

VOLUME /rocketgame/datas/games
VOLUME /rocketgame/databases
VOLUME /rocketgame/dist/config

CMD ./start.sh