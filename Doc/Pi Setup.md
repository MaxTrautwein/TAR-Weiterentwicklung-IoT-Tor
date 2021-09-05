# Raspberry Pi Setup
 
Dieser Guide soll Ihnen zeigen wie Sie einen Raspberry Pi für Node Red mit eigenem Broker aufsetzen.
 
## 0. Pi Auswählen
 
Bevor mit dem Setup begonnen werden kann gilt es einen Raspberry Pi auszuwählen.
Ich empfehle mindestens einen PI 3 zu wählen, jedoch ist es denkbar das dieses Setup auch mit älteren modellen möglich ist.
 
 
## 1. Pi flashen
 
### 1.1 Pi Imager
Zum Programmieren des Pi's empfiehlt es sich den offiziellen Imager zu verwenden.<br/>
Dieser kann hier: https://www.raspberrypi.org/software/ heruntergeladen werden.
 
### 1.2 Image auswählen und programmieren
Mithilfe des GUI kann nun eine Version ausgewählt werden.
Für **Production** oder **erfahrene Nutzer** empfiehlt sich eine `Headless Image`.
 
Für **Anfänger** oder einige **Entwicklungszwecke** kann eine vollständige Desktopinstallation von Nutzen sein.
 
### 1.3 Headless Installation konfigurieren
Im Falle einer Desktopinstallation ist dieser Schritt nicht unbedingt notwendig, da diese Konfiguration auch in UI vorgenommen werden kann.
 
_Als Referenz für diesen Schritt gilt: https://www.raspberrypi.org/documentation/configuration/wireless/headless.md_
 
---
**WIFI Config**
 
Auf der SD Karte auf welcher das image gebrannt wurde, wird nun eine Datei mit dem Namen `wpa_supplicant.conf` erstellt.
_Wichtig ist, es handelt sich um eine `.conf` und **nicht** um eine `.conf.txt` Datei._
 
Folgender Inhalt ist einzufügen:
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
country=<Insert 2 letter ISO 3166-1 country code here>
update_config=1
 
network={
 ssid="<Name of your wireless LAN>"
 psk="<Password for your wireless LAN>"
}
```
Hier sind noch einige individuelle Anpassungen nötig.<br/>
Für `<Insert 2 letter ISO 3166-1 country code here>` ist innerhalb Deutschlands `DE` einzusetzen. <br/>_Sollten Sie sich außerhalb von Deutschland befinden, so prüfen Sie bitte die **ISO 3166-1** nch dem korrektem Code_
<br/>Für `<Name of your wireless LAN>` den Namen Ihres WLAN Netzwerkes
<br/>Für `<Password for your wireless LAN>` das dazugehörige Passwort
 
---
**SSH freischalten**
 
SSH ist aus Sicherheitsgründen standardmäßig deaktiviert.
Um SSH verfügbar zu machen, erstellen Sie eine Datei mit dem Namen `ssh`.<Br/>
**Note:** die Datei hat keine Endung und keinen Inhalt
 
## 2. Pi Setup
 
Für die ssh Verbindung sind folgende Daten zu beachten:
<br/>Benutzername: `pi`
<br/>Passwort: `raspberry`
 
_Im Falle einer Desktopinstallation ohne ssh jetzt bitte das Terminal öffnen_
 
### 2.1 Update
 
Der erste Schritt nach dem Flashen sollte immer ein Update sein. Damit wird die Software auf den aktuellsten Stand gebracht.<br/>
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```
 
### 2.2 Den Broker installieren
 
_Basieren auf: https://mosquitto.org/blog/2013/01/mosquitto-debian-repository/_
 
Um den Broker in diesem Fall `mosquitto` zu installieren, bitte folgende Befehle ausführen:<br/>
```
# Den Verschlüsselungs Key laden
wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key
 
# Den Key lokal hinzufügen
sudo apt-key add mosquitto-repo.gpg.key
 
#Verzeichnis wechseln
cd /etc/apt/sources.list.d/
```
 
Nun muss die richtige Datei für die Installation heruntergeladen werden. Dies ist abhängig vom Betriebssystem. Folgende Optionen stehen derzeit zur Wahl:
```
sudo wget http://repo.mosquitto.org/debian/mosquitto-jessie.list
sudo wget http://repo.mosquitto.org/debian/mosquitto-stretch.list
sudo wget http://repo.mosquitto.org/debian/mosquitto-buster.list
```
Um die Version zu prüfen empfehle ich: https://linuxconfig.org/check-what-debian-version-you-are-running-on-your-linux-system/ <br/>
 
Vermutlich wird es für Sie `Buster` sein.
```
# Sollte es nicht um Buster handeln, so ersetzen Sie den folgenden Link
sudo wget http://repo.mosquitto.org/debian/mosquitto-buster.list
 
# Paketliste aktualisieren
apt-get update
 
# mosquitto Installieren
apt-get install mosquitto
```
Die Dokumentation für mosquitto finden sie unter: https://mosquitto.org/documentation/
 
### 2.3 Node Red installieren
 
**NOTE:** Sollte eine Entwicklungsumgebung für Node Red benötigt werden, so folgen Sie bitte den Anweisungen unter: https://nodered.org/docs/getting-started/development
 
 
```
bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)
 
# Um Node Red manuell zu starten kann "Node-red-start" verwendet werden.
 
# Auto start von Node Red einrichten
sudo systemctl enable nodered.service
 
# Einmal neu starten
node-red-restart
 
```
 
### 2.4 Broker konfigurieren und testen
 
Die primäre Konfigurationsdatei von Mosquitto befindet sich standardmäßig unter `/etc/mosquitto/mosquitto.conf`
<br/>Diese sollte jedoch bei ihrem Ursprung beibehalten werden.
Platzieren Sie Ihre Configuration(en) unter `/etc/mosquitto/conf.d/<SOME_NAME>.conf`
Ich habe in diesen Fall `/etc/mosquitto/conf.d/00_IoT_TorModell.conf` gewählt.
Diese Datei enthält folgenden Inhalt:
```
#Port Auswahl
listener 1883
#Passwort Datei
password_file /etc/mosquitto/pwfile
```
 
Nun müssen Sie einen Benutzer konfigurieren. Dies ist mit folgendem Befehl möglich.
```
sudo mosquitto_passwd -c /etc/mosquitto/pwfile <UserName>
```
_Für weitere Details können Sie in der Dokumentation nachlesen: https://mosquitto.org/man/mosquitto_passwd-1.html_
 
Es wird nach einem Passwort gefragt. Diese Benutzername und Passwortkombination wird dann in der angegebene Datei gespeichert. Dabei ist das Passwort als `sha512-pbkdf2` hash und der Benutzername als clear text gespeichert.
 
_Beispiel Inhalt. user: `test` passwort: `test`_
```
pi@raspberrypi:~ $ cat /etc/mosquitto/pwfile
test:$7$101$Hvvd6ck7zBB37A5o$j5K5OVlIXwYL1K5d0nYbpZNArflshvS+lglcm04ubOgK7YvKkMTOmj8ERiuMuKm/iYQUoDO9f2qzRt+ST0aeQw==
```
 
 
**Erste Tests mit dem Broker**
 
Um die ersten Tests möglichst einfach durchzuführen wird ein weiteres Paket benötigt.
Dieses kann mit `sudo apt-get install mosquitto-clients` installiert werden.
 
_Für diesen Teil ist es erforderlich zwei separate Terminalinstanzen offen zu haben._
 
**Subscribe to a Topic**
```
mosquitto_sub -u <User> -P <Password> -t <Topic>
```
<br/>`<User>` The Username --> example: `test`
<br/>`<Password>`The Password for the Username --> example: `test`
<br/>`<Topic>`The Topic --> example: `dev/test`
 
**Publish a message to a Topic**
```
mosquitto_pub -u <User> -P <Password> -t <Topic>  -m <Message>
```
<br/>`<User>` The Username --> example: `test`
<br/>`<Password>`The Password for the Username --> example: `test`
<br/>`<Topic>`The Topic --> example: `dev/test`
<br/>`<Message>`The Message --> example: `Hello World`
 
 
### 2.5 Samba Setup
 
Samba kann verwendet werden um Festplatteninhalte auf dem Netzwerk zu teilen. So dass diese beispielsweise auch mit dem Windows Explorers einfach erreicht werden können.
 
Dies kann in vielerlei Hinsicht während der Entwicklung von Nutzen sein.
Für die Verwendung in dem Production environment würde ich jedoch abraten.
 
Installation mit: `sudo apt-get install samba`
 
**Configuration**
 
Konfiguration öffnen mit `sudo nano /etc/samba/smb.conf`
 
Am Ende der Datei folgende Konfiguration einfügen:
```
[NodeRedDev]
comment = Dev Folder for NodeRed Nodes
#Pfad zum Ordner welcher freigegeben werden soll
path = /home/pi/NodeRed
read only = no
guest ok = yes
```
 
**Den Ordner vorbereiten**
```
#für den Fall dass der Ordner noch nicht existiert
mkdir NodeRed
 
#Schreib rechte anpassen
sudo chmod 0777 NodeRed/
```
 
**Samba Neustarten**
```
Restart samba
/etc/init.d/smbd restart
```
 