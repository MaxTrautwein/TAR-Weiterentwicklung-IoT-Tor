FROM node:16-buster
EXPOSE 80
EXPOSE 1880
RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red
WORKDIR /home
RUN git clone https://github.com/MaxTrautwein/node-red.git
#COPY /../../Git/node-red /home/node-red
WORKDIR /home/node-red
RUN git checkout Multi_Input_Support

RUN npm install
CMD [ "grunt", "dev" ]