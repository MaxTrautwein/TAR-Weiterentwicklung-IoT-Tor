# Docker Development Setup
Dieser Guide zeigt ihnen wie sie eine Docker Development umgebung für Node Red Einrichten können.

## Download Docker
Bitte folgen sie den Offizeillen anweisungen unter:
https://docs.docker.com/desktop/windows/install/



### Dockerfile

Erstellen sie eine neue Datei mit dem namen `Dockerfile` und keiner endung.
Fügen sie anschlißend bitte folgenden inhalt ein.

**1. Für default Setup**
```dockerfile
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

#Usage
#docker build -t nodereddev .
#docker run -p 1880:1880 nodereddev
#The -v option would allow to mount a local dir but this will break the detection of "grunt dev" making it pointless
```

**2. Für Setup mit den live änderungen für Multi Input Nods**
```dockerfile
FROM node:16-buster
EXPOSE 80
EXPOSE 1880
RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red
WORKDIR /home
RUN git clone https://github.com/MaxTrautwein/node-red.git
WORKDIR /home/node-red
RUN git checkout Multi_Input_Support

RUN npm install
CMD [ "grunt", "dev" ]

#Usage
#docker build -t nodereddev .
#docker run -p 1880:1880 nodereddev
#The -v option would allow to mount a local dir but this will break the detection of "grunt dev" making it pointless
```

Build from the _Dockerfile_ using:
`docker build -t nodereddev .`

<br/> Run the Container using `docker run -p 1880:1880 nodereddev`