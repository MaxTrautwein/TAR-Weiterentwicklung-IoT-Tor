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
RUN wget https://github.com/MaxTrautwein/TAR-Weiterentwiklung-IoT-Tor/blob/master/Doc/Configs/mosquitto_dev.conf

#Get Git repositorys 
WORKDIR /home
#Clone the forked node-red repo
RUN git clone https://github.com/MaxTrautwein/node-red.git
#Clone the primary TAR repository
RUN git clone https://github.com/MaxTrautwein/TAR-Weiterentwiklung-IoT-Tor

#prepare the Multi Input Support
WORKDIR /home/node-red
RUN git checkout Multi_Input_Support


RUN npm install
CMD [ "grunt", "dev" ]