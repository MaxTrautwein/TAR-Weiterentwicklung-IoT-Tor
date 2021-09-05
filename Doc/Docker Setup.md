# Docker Development Setup
Dieser Guide zeigt Ihnen wie Sie eine Docker Developmentumgebung für Node Red einrichten können.
 
## Download Docker
Bitte folgen Sie den offiziellen Anweisungen unter:
https://docs.docker.com/desktop/windows/install/
 
 
 
## Dockerfile
 
 Das Dockerfile ist eine Datei welche spezifiziert wie ein Container aufgebaut sein soll.
 Dies ermöglicht das Teilen eines speziellen Setups mit nur sehr wenig Daten.


Es stehen zwei Optionen zur Wahl: 
<br/>(1) Im Falle, dass ein reguläres Setup zum Testen benötigt wird https://github.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/blob/master/Docker/User/Dockerfile
<br/>(2) Im Falle, dass ein Setup für die Erweiterungen dieser Technikerarbeit benötigt wird https://github.com/MaxTrautwein/TAR-Weiterentwicklung-IoT-Tor/blob/master/Docker/Development/Dockerfile
 
<br/>

Bitte laden Sie eine der beiden Dateien herunter.

Anschließend können Sie den Container nach dessen Spezifikation konstruieren.
Öffnen Sie hierzu eine Kommandozeile in dem Ordner, indem sich das `dokerfile` befindet.
Mit `docker build -t nodereddev .` wird der Container konstruiert. 

Um den konstruierten Container zu starten führen Sie folgenden Befehl aus: `docker run -p 1880:1880 -p 1883:1883 nodereddev`
 
Der Parameter `-p` bindet den Containerinternenport 1880 auf den lokalen Port 1880.
Dies ermöglicht im folgenden den Zugriff auf das Node Red interface unter [localhost:1880](http://localhost:1880).
Der zweite Aufruf gibt den Port für den Broker frei.

_Der run Befehl unterstützt auch noch weitere Parameter. Erwähnenswert ist hier der Parameter `-v`, dieser erlaubt es einen lokalen Pfad für den Container freizugeben. Unglücklicherwiese ist dies mit einer Funktionalität, welche in diesem Setup benötigt wird inkompatible, weshalb es hier nicht verwendet wird._

## Datenaustausch & Zugriff
Das Webinterface von Node-Red ist unter  [localhost:1880](localhost:1880) verfügbar.
<br/>Um direkten Zugriff auf die Daten in dem Container zu erhalten, empfehle ich das [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) sowie das [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Addon für Visual Studio Code.

Um Weitereintwicklungen zu sichern, empfiehlt es sich, diese direkt mit git zu commiten und auf ein remote repository zu laden.

## Problembehandlung

### (Windows) Error response from daemon: Ports are not available
Vollständige Fehlermeldung:
```
docker: Error response from daemon: Ports are not available: listen tcp 0.0.0.0:1880: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

Sollte dieser Fehler auftreten, so öffnen Sie ein Terminal mit Administratorrechten und führen Sie folgenden Befehl aus:
```
net stop winnat
```
Nun sollten Sie den Container starten können. Anschließend können Sie `winnat` wieder starten.
```
net start winnat
```
_Quelle: https://github.com/docker/for-win/issues/3171#issuecomment-739740248_