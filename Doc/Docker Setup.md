# Docker Development Setup
Dieser Guide zeigt ihnen wie sie eine Docker Development umgebung für Node Red Einrichten können.
<br/>Docker ist 
 
## Download Docker
Bitte folgen sie den Offiziellen anweisungen unter:
https://docs.docker.com/desktop/windows/install/
 
 
 
## Dockerfile
 
 Das dockerfile ist eine datei welche spezifiziert wie ein Container aufgebaut seien soll.
 Dies ermöglicht das teilen eines spezillen setups mit nur sehr wenig daten.


Es stehen zwei optionen zur wahl. 
<br/>(1) Im falle dass ein reguläres setup zum testen benötigt wird
<br/>(2) Im falle dass Setup für die erweiterungen dieser Technikerarbeit benötigt wird. 
 
1. **Für default Setup:** https://github.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/blob/master/Docker/User/Dockerfile
 
2. **Für Setup mit den live änderungen für Multi Input Nods:** https://github.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/blob/master/Docker/Development/Dockerfile
 

Bitte laden sie eine der beiden dateien herunter.

Anschließend können sie den Container nach dessen spezifikation konstituieren.
Öffnen sie hierzu eine kommandozeile in dem Ordner indem sich das `dokerfile` befindet.
Mit `docker build -t nodereddev .` wird der Container konstruiert. 

Um den soeben konstruierten Container zu starten können sie folgenden Befehl verwenden: `docker run -p 1880:1880 -p 1883:1883 nodereddev`
 
der parameter `-p` bindet den container internen port 1880 auf den lokalen port 1880.
Dies ermöglicht im folgenden den Zugriff auf das Node Red interface unter [localhost:1880](http://localhost:1880).
Der zweite aufruf gibt den port für den Broker frei.

_Der run befehl unterstützt auch noch weitereass parameter. Erwähnenswert ist hir der parameter `-v`, dieser erlaubt es einen lokalen pfad für den Container freizugeben. unglücklicherwiese ist dies mit einer funktionalität welche in diesem setup benötigt wird inkompatible, weshalb es hir nicht werendet wird._

## Datenaustausch & Zugriff
Das Webinterface von Node-Red ist unter  [localhost:1880](localhost:1880) verfügbar.
<br/>Um direkten zugriff auf die Daten in dem container zu erhalten empfehle ich das [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) sowie das [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Addon für Visual Studio Code.

Um Weitereintwicklungen zu sichern empfiehlt es sich diese direkt mit git zu commiten und auf ein remote repository zu laden.