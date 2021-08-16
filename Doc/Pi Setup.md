# Raspberry Pi Setup

Dieser Guide sollte ihnen zeigen wie sie einen Raspberry Pi für Node Red mit eigenem Broker aufsetzen.

## 0. Pi Auswählen

Bevor mit dem Setup begonnen werden kann gilt es einen Raspberry Pi auszuwählen.
Ich emplehle mindestens einen PI 3 Zu wählen jedoch ist es denkbar das dießes setup auch mit älteren modelen möglich ist.


## 1. Pi flashen

### 1.1 Pi Imager
Zu programmiren des Pi's empfielt es sich den offiziellen Imager zu verwenden.<br/>
dieser kann hier: https://www.raspberrypi.org/software/ heruntergeladen werden.

### 1.2 Image Auswählen und Programiren
Mithilfe des GUI kann nun eine Version ausgewählt werden.
Für **Production** oder **erfahrene Nutzer** empfielt sich eine `Headless Image`.

Für **Anfänger** oder einige **entwiklungs** zwecke kann eine folständige Destktop Installation von nutzen sein.

### 1.3 Headless Instalation Konfiguriren
Im falle einer Desktop installation ist dießer schrit nicht umbedingt notwendig da diese konfiguration auch in UI Vorgenommen werden kann.

_Als rferenz für diesen schritt gilt: https://www.raspberrypi.org/documentation/configuration/wireless/headless.md_

---
**WIFI Config**

Auf der SD auf welcher das image gebrannt wurde wird nun eine datei mit dem namen `wpa_supplicant.conf` erstellt.
_Wichtig es ist eine .conf und **nicht** eine .conf.txt_

Folgender inhalt is einzufügen:
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
country=<Insert 2 letter ISO 3166-1 country code here>
update_config=1

network={
 ssid="<Name of your wireless LAN>"
 psk="<Password for your wireless LAN>"
}
```
Hier sind noch einige anpassungen nötig welch individuell angepasst werden müssen.<br/>
Für `<Insert 2 letter ISO 3166-1 country code here>` ist inerhalb Deutschlands `DE` einzusetzen. <br/>_Sollten sie sich auserhalb von deutschland befinden so prüfen sie bitte die **ISO 3166-1** nch dem korektem code_
<br/>Für `<Name of your wireless LAN>` Den namen deines WIFI Netzwerkes
<br/>Für `<Password for your wireless LAN>` Das dazugehörige Passwort

---
**SSH Freischalten**

SSH ist aus sicherheits gründen standardmäßig deaktiviert.
um SSH verfügbar zu machen ersetellen sie eine datei mit dem namen `ssh`.<Br/>
**Note:** die datei hat keine endung und keinen inhalt

## 2. Pi Setup

für die ssh verbindung sind folgende daten zu beachetn:
<br/>Benutzername: `pi`
<br/>Passwort: `raspberry`

_im falles eine desktop installation ohne ssh jetzt bitte das Terminal öffnen_

### 2.1 Update

Der erste schritt nach dem Flashen sollte immer ein Update sein. damit wird die software auf den aktusellsten stand gebracht.<br/>
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get distupgrade #TODO Check syntax
```

### 2.2 Den Broker installiren

_Basiren auf: https://mosquitto.org/blog/2013/01/mosquitto-debian-repository/_

Um den Broker in diesem fall `mosquitto` zu installiren bitte folgene befehle ausführen:<br/>
```
# Den Verschlüsselungs Key laden
wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key

# Den Key lokal hinzufügen
cd /etc/apt/sources.list.d/

#Verzeichnis wechseln
cd /etc/apt/sources.list.d/
```

Nun muss die richtige Datei für die installation heruntergeladen werden. Dies ist abhänig vom betribsystem. folgene Optionen stehen derzeit zur wahl:
```
sudo wget http://repo.mosquitto.org/debian/mosquitto-jessie.list
sudo wget http://repo.mosquitto.org/debian/mosquitto-stretch.list
sudo wget http://repo.mosquitto.org/debian/mosquitto-buster.list
```
Um die Version zu prüfen empfehle ich: https://linuxconfig.org/check-what-debian-version-you-are-running-on-your-linux-system/ <br/>

Vermutlich wird es für sie Buster sein.
```
# Eventuell mit link zur passenden version ersetzen
sudo wget http://repo.mosquitto.org/debian/mosquitto-buster.list

# Paket liste aktuallisiren
apt-get update

# mosquitto Installiren
apt-get install mosquitto
```
Die Dokumentation für mosquitto finden sie unter: https://mosquitto.org/documentation/

### 2.3 Node Red Installiren

**NOTE:** Sollte eine entwiklungs Umgebung für Node Red Benötigt werden so folgen sie bitte den anweißungen unter: https://nodered.org/docs/getting-started/development


```
bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)

# Um Node Red manuell zu starten kann "Node-red-start" verwendet werden.

# Auto start von Node Red eirichten
sudo systemctl enable nodered.service

# Einmal neu starten
node-red-restart

```

### 2.4 Broker Konfiguriren und Testen

Die primäre konfigurations datei von Mosquitto befindet sich standardmäßig unter `/etc/mosquitto/mosquitto.conf`
<br/>Diese sollte jedoch bei ihrem unrsprung beibehlaten werden.
Wir platzieren unsere configuration(en) unter `/etc/mosquitto/conf.d/<SOME_NAME>.conf`
Ich habe in dießem fall `/etc/mosquitto/conf.d/00_IoT_TorModell.conf` gewählt.
Dieße datei enthät folgenden inhalt:
```
#Port Auswahl
listener 1883
#Passwort Datei
password_file /etc/mosquitto/pwfile
```

Nun müssem wir einen benutzer konfiguriren. Dieß ist mit folgendem befehl möglich.
```
sudo mosquitto_passwd -c /etc/mosquitto/pwfile <UserName>
```
_für weitere details können sie in der dokumentation nachlesen: https://mosquitto.org/man/mosquitto_passwd-1.html_

Nach dem bestätigen wird nach einem passwort gefraget. Dieße Benutzername und Passwort kombination wird dann in dier angegebene Datei gespeichert. Dabei ist das Passwort als `sha512-pbkdf2` hash und der benutzername als clear text gespeichert.

_Beispiel Inhalt. user: `test` passwort: `test`_
```
pi@raspberrypi:~ $ cat /etc/mosquitto/pwfile
test:$7$101$Hvvd6ck7zBB37A5o$j5K5OVlIXwYL1K5d0nYbpZNArflshvS+lglcm04ubOgK7YvKkMTOmj8ERiuMuKm/iYQUoDO9f2qzRt+ST0aeQw==
```


**Erste Tests mit dem Broker**

Um die ersten Tests möglichst einfach durchzuführen wird ein weiteres package benötigt.
Dieses kann mitt `sudo apt-get install mosquitto-clients` installirt werden.

_für dießen teil ist es erforderlich zwei seperate terminal instanzen offen zu haben._

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

Samba kann verwendet werden um Festplatten inhalte auf dem netzwerk zu teilen. Sodass dieße beispielsweise auch mit dem Windows Explorere einfach erreicht werden können.

Dies kann in vielerlei hinsichen werend der entwiklung von nutzen seine.
Für die verwendung in dem Production enviorment würde ich jedoch abreaten.

Installation mit: `sudo apt-get install samba`

**Configuration**

Configuration öffenen mit `sudo nano /etc/samba/smb.conf`

Am ende der datei folgene configuration einfügen:
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
#für den fall dass der Ordner noch nicht existiert
mkdir NodeRed

#Schreib rechte anpassen
sudo chmod 0777 NodeRed/
```

**Samba Neustarten**
```
Restart samba
/etc/init.d/smbd restart
```


