FROM node:16-buster
EXPOSE 80
EXPOSE 1880
RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red
WORKDIR /home
RUN git clone https://github.com/node-red/node-red.git
WORKDIR /home/node-red
#https://stackoverflow.com/questions/17414104/git-checkout-latest-tag
RUN git checkout $(git describe --tags `git rev-list --tags --max-count=1`)


RUN npm install
CMD [ "grunt", "dev" ]