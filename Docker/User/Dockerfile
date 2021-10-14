FROM node:16-buster
#Expose Ports for Node-Red
EXPOSE 80
EXPOSE 1880
#Expose Port for Mosqitto
EXPOSE 1883

RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red

#Broker setup https://mosquitto.org/blog/2013/01/mosquitto-debian-repository/
WORKDIR /home
RUN wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key
RUN apt-key add mosquitto-repo.gpg.key
WORKDIR /etc/apt/sources.list.d/
RUN wget http://repo.mosquitto.org/debian/mosquitto-buster.list
RUN apt-get update
RUN apt-get -q -y install mosquitto
RUN apt-get -q -y install mosquitto-clients
#Setup mosquitto dev account
RUN mosquitto_passwd -c -b /etc/mosquitto/pwfile test test
WORKDIR /etc/mosquitto/conf.d
RUN wget https://raw.githubusercontent.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/master/Doc/Configs/mosquitto_dev.conf

#Get Git repositorys 
WORKDIR /home
RUN git clone https://github.com/node-red/node-red.git
WORKDIR /home/node-red
#https://stackoverflow.com/questions/17414104/git-checkout-latest-tag
RUN git checkout $(git describe --tags `git rev-list --tags --max-count=1`)


RUN npm install
CMD mosquitto -d -c /etc/mosquitto/conf.d/mosquitto_dev.conf ; grunt dev