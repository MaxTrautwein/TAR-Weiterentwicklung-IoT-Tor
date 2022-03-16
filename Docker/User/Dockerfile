FROM node:bullseye
#Expose Ports for Node-Red
EXPOSE 80
EXPOSE 1880
#Expose Ports for NTP
EXPOSE 123
#Expose Port for Mosqitto
EXPOSE 1883

RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red

#Broker setup https://mosquitto.org/blog/2013/01/mosquitto-debian-repository/
WORKDIR /home
RUN wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key
RUN apt-key add mosquitto-repo.gpg.key
#Get chronyd start script
RUN wget https://raw.githubusercontent.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/master/Doc/Configs/Setup/chronyd.sh
RUN chmod a+x chronyd.sh

WORKDIR /etc/apt/sources.list.d/
RUN wget http://repo.mosquitto.org/debian/mosquitto-bullseye.list
RUN apt-get update
RUN apt-get -q -y install mosquitto
RUN apt-get -q -y install mosquitto-clients
#Setup mosquitto dev account
RUN mosquitto_passwd -c -b /etc/mosquitto/pwfile nodered nodered_pw
RUN mosquitto_passwd -b /etc/mosquitto/pwfile tasmota tasmota_pw

WORKDIR /etc/mosquitto/conf.d
RUN wget https://raw.githubusercontent.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/master/Doc/Configs/mosquitto_dev.conf

#Setup NTP Server
RUN apt-get -q -y install chrony
WORKDIR /etc/chrony/
#Allow access to NTP Server
RUN echo "allow all" >> chrony.conf

#Get Git repositorys 
WORKDIR /home
RUN git clone https://github.com/node-red/node-red.git
WORKDIR /home/node-red
#https://stackoverflow.com/questions/17414104/git-checkout-latest-tag
RUN git checkout $(git describe --tags `git rev-list --tags --max-count=1`)


RUN npm install
CMD mosquitto -d -c /etc/mosquitto/conf.d/mosquitto_dev.conf ; ../chronyd.sh ; grunt dev