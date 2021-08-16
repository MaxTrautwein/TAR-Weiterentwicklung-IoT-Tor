# Docker Development Setup
Dieser Guide zeigt ihnen wie sie eine Docker Development umgebung für Node Red Einrichten können.

## Download Docker
Bitte folgen sie den Offizeillen anweisungen unter:
https://docs.docker.com/desktop/windows/install/



### Dockerfile

Erstellen sie eine neue Datei mit dem namen `Dockerfile` und keiner endung.
Fügen sie anschlißend bitte folgenden inhalt ein.

```dockerfile
FROM node:16-buster
EXPOSE 80
EXPOSE 1880
RUN npm install -g grunt-cli
RUN mkdir ~/../home/node-red
COPY node-red ~/../home/node-red
WORKDIR /home/node-red
RUN npm install
#RUN grunt dev
CMD [ "grunt", "dev" ]

# Some issues with the Mounting
#docker run -p 1880:1880 -v C:\Users\Max\Desktop\TAR\Docker_Dev\NodeRed_Dev\node-red:/home/node-red nodereddev
```

Build from the _Dockerfile_ using:
`docker build -t nodereddev .`

<br/> Run the Container using `docker run -p 1880:1880 nodereddev`