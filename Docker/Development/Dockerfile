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
RUN mosquitto_passwd -c -b /etc/mosquitto/pwfile nodered nodered_pw
RUN mosquitto_passwd -b /etc/mosquitto/pwfile tasmota tasmota_pw

WORKDIR /etc/mosquitto/conf.d
RUN wget https://raw.githubusercontent.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/master/Doc/Configs/mosquitto_dev.conf

#Get Git repositorys 
WORKDIR /home
#Clone the forked node-red repo
RUN git clone https://github.com/MaxTrautwein/node-red.git
#Clone the primary TAR repository
RUN git clone https://github.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor

#Setup Node Link
WORKDIR /home/TAR-Weiterentwicklung-IoT-Tor/Nodes
RUN npm link
WORKDIR /root/.node-red
RUN npm link tar-nodes

#prepare the Multi Input Support
WORKDIR /home/node-red
RUN git checkout Multi_Input_Support


RUN npm install

#Install Official Dashboard Nodes
RUN npm install node-red-dashboard

CMD mosquitto -d -c /etc/mosquitto/conf.d/mosquitto_dev.conf ; grunt dev