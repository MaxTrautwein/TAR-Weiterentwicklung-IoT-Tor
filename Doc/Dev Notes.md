# Development Notes

### Creating nodes with more then one Input

The official Documentation states that each node can have a maximum of 1 Input

**TODO Add link / Screenshot**


## Simelar Case Output

Der Switch Block kann je nach nutzerbedürfnissen mehrere ausgännge haben.

https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/function/10-switch.js

https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/nodes/core/function/10-switch.html



<br/>Dies wird derzeit in einigen Offiziellen blöcken verwendet:
- Switch
- Trigger
- Fuction
- Exec



---

**Dev umgebung...**
https://nodered.org/docs/getting-started/development


---

Tests haben ergeben dass entweder
- Die Test umgabung nicht ganz funktionstüchtig ist
**oder**
- Die geglaubte implementirung rein garnichts macht da sie komplett auskomentirt werden kann ohne die funktionalität zu beinflussen

Ich tippe derzeit auf letzteres.



**Erkentnisse:**
- Alles ist eine sache des kontextes...
- in `.js` dateien funktioniren einige typischen "Web Javascript" befehle nicht wie z.b.: `alert(DATA)`, `console.log(DATA)` --> Stattdessen muss man `console.log(DATA)` verwenden um daten auf das Terminal zu loggen
- in den `.html` dateien in deren js segmenten funttioniren diese gänigen funktionen jedoch nicht die anderen.
-das format von `node-input-outputs` ist folgendermaßen: `{"0":1,"1":2,"2":3,"3":0}` `"ID":INDEX`
CHECK `red-ui-flow-port`
```
//Just some Test?
node-red/test/editor/pageobjects/nodes/node_page.js (2 hits)

//All kinds of GUI Stuff
//That could be very imprtant
//Huge File
node-red/packages/node_modules/@node-red/editor-client/src/js/ui/view.js (35 hits)
```
- Die `outputs` variable in der HTML bestimmt alleinig die anzahl and Outpust
kp was mich davon abgehalten hat das früher zu realisiren...

- Die iplemation für die darstellung von inputs und Outputs befindet sich in `node-red\packages\node_modules\@node-red\editor-client\src\js\ui\view.js`
<br/> dabei ist der input teil bei etwa `4068` ; der output bei `4123`
- send Messages over multible Outputs: https://nodered.org/docs/user-guide/writing-functions#multiple-messages
<br/> Format `["PORT 1","Port 2","Port 3" , ... "Port n"]`
- https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key Helpful for debugging
- `RED.nodes.addLink(link1);` is defined at `node-red\packages\node_modules\@node-red\editor-client\src\js\nodes.js` This could be helpful
- The `d` atrribute of `red-ui-flow-link` defines on how the link line looks. This needs to be Updated to support the Visuals but it *likely* has no effect on the function

- TODO Support Inputs removal
- TDOO Support Correct Input linking
- TODO Support Input selection / eVENTS IN sw
- TODO The rest


---
# Line GUI
Initial attempt at understanding it. 

```html
<path class="red-ui-flow-link-line red-ui-flow-link-path red-ui-flow-subflow-link" d="M 200 120 C 375 120 395 200 470 200"></path>
```
`d="M 200 120 C 375 120 395 200 470 200"`

`d="M -A- -B- C -C- -D- -E- -F- -G- -H-"`

`-A-` --> X Position
<br/>`-B-` --> Y Pos
<br/>`-C-` --> Mid point psition / abngle of line
<br/>`-D-` --> Mid point psition / abngle of line
<br/>`-E-` --> Mid point psition / abngle of line (Y ?)
<br/>`-F-` --> 
<br/>`-G-` --> 
<br/>`-H-` --> 

## erkentniss
bei diesem syntax handelt es sich um ein standard feature.

infos:
https://developer.mozilla.org/de/docs/Web/SVG/Element/path
https://www.w3schools.com/graphics/svg_path.asp

```html
<svg height="210" width="400">
  <path  d="M 200 120 C 375 120 395 200 470 200" fill="none" stroke="black" stroke-width="3"/>
</svg>
```

### Try out setup:
https://www.w3schools.com/graphics/tryit.asp?filename=trysvg_path
```HTML
<!DOCTYPE html>
<html>
<body>

<svg height="210" width="400">
  <path  d="M 200 120 C 375 120 395 200 470 200" fill="none" stroke="black" stroke-width="3"/>
</svg>

</body>
</html>
```

im falle von node-red kommen die style parameter `stroke`, `stroke-width` und `fill` von `.red-ui-flow-link-line`

Hilfreiches video:
https://www.youtube.com/watch?v=k6TWzfLGAKo

Das wichtigste für mich ist dass der 5. & 6. parameter für das `C` Kommando die endposition angibt. [Siehe Spezifikation](https://svgwg.org/specs/paths/#PathDataCubicBezierCommands)

---
node debug Test code
```js
   if (conifg.data[msg.__port] == undefined){
                msg.payload += "first message!! "
            }else{
                msg.payload += "last value: " + config.data[msg.__port] + " || "
            }

            msg.payload += "Recived msg on Port: " + msg.__port;
```

```js
    /**
     * This function is used to debug print Objects
     * 
     * @param {object} o The object in question
     * @param {string} str Use empty string when calling
     */
    function DebugObject(o,str=""){
        for(var key in o) {
            var value = o[key];
            var bstr = str + " o[" + key + "]  --> ";
            if (typeof value === 'object' && value !== null){
                DebugObject(value,bstr);
            }else{
                console.log(bstr + value);
            }    
        }
    }
```


---

# Tasmota install
Web: https://arendst.github.io/Tasmota-firmware/
Chrome / edge only

I can't get the web tool to work, its stick on inizializing...


## esp tool
https://tasmota.github.io/docs/Getting-Started/#esptoolpy

Note: the flash command stated online is invalid as the flash size is too small 1MB for 1.4MB binary. the ESP32 has 4MB.

Download binary here: http://ota.tasmota.com/tasmota32/release/

```
#Backup
esptool.exe --port COM3 read_flash 0x00000 0x100000 fwbackup.bin

#Erase
esptool.exe --port COM3 erase_flash

#Flash
esptool.exe  --port COM3 write_flash --flash_size detect -fm dout 0x0 tasmota32.bin
```

doing the above dose not work at all.

## The working setup

Some issues pont to: https://tasmota.github.io/docs/ESP32/
extra files needed from https://github.com/tasmota/install/tree/main/static
for me: https://github.com/tasmota/install/tree/main/static/esp32
```
esptool.py --chip esp32 --port COM3 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dout --flash_freq 40m --flash_size detect 0x1000 bootloader_dout_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 tasmota32.bin

```

after that the Wifi is visible & can be configured


--

## extended mqtt Broker setup Steps:

```
#Start server
#for some reason i have to manually specify the config file
#from my understanding that should happen automaticly
mosquitto -v -c /etc/mosquitto/conf.d/mosquitto_dev.conf 

#Subscribe to all Topics
mosquitto_sub -u test -P test -t '#'

#Send message
mosquitto_pub -u test -P test -t dev/test -m "Hey"

```


This seems to contain modbus stuff
https://tasmota.github.io/docs/Smart-Meter-Interface/

**Note:** the sw found on the NORVI is considured invalid by `esptool.exe --chip esp32 image_info fwbackup_Scalt_4M.bin` the `image magic` byte apperes to be invalide with `0xff`

---

# Combine Multible Git Commits to one
somthing like this should apperently work
```
#https://tasmota.github.io/docs/Sensor-API/#managing-a-forked-branch
git merge --squash <temp_branch>


```

---

# Tasmota Links
Für die Console
https://tasmota.github.io/docs/Commands/

---

# Tasmota Dev

`xnrg_18_sdm72.ino` Smat metre sample

`TasmotaModbus.h`

`C:\Users\Max\Desktop\TAR\Git\Tasmota\tasmota\xdrv_03_energy.ino` base code for all smart mtrers
... That one contains MQTT Publish Code 

The `TasmotaModbus::Send` is very spezialized in the lib.
It only support sending of 4 Data byte no more no less

The base serial lib seems to support all data lenghts

## Understanding the Base libs of Tasmota
For the most of the code i was unable to find any kind of documentation
The Names themselfs also aren't selfexplanetory at least not atm.

### TODO

- Find MQTT Recive Callbacks
- Find Modbus Recive Callbacks
- Find MQTT Send functions (What function should be used. what are the diffrences)
- How will my code be called
- UI / GUI Stuff in Tasmota

Tasmota appears to use this: https://pubsubclient.knolleary.net/api.html#state Libary
That one is mentioned once in the code as a btw we use those codes....
That Libary is a lot clrearer to me.

#### Callback path:
Used https://pubsubclient.knolleary.net/api.html#state `setCallback (callback)` to register the following callback:
```cpp
//https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/xdrv_02_9_mqtt.ino
void MqttDataHandler(char* mqtt_topic, uint8_t* mqtt_data, unsigned int data_len)
```
That one will then call the following:

```cpp
//https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/support_command.ino
void CommandHandler(char* topicBuf, char* dataBuf, uint32_t data_len)
```
in turn that one will call
```cpp
//https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/support.ino
DecodeCommand(const char* haystack, void (* const MyCommand[])(void), const uint8_t *synonyms)
```

`DecodeCommand` will then check if the supplied Command string can be located in
```cpp
//https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/support_command.ino
//The constants used in that list are defined in: https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/i18n.h
const char kTasmotaCommands[] PROGMEM
```
If that is the case then the position fo that match will be used to call the command located in the follwing list:

```cpp
//https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/support_command.ino
void (* const TasmotaCommand[])(void) PROGMEM
```
And the Defind command will be executed.
All commands contained in the list above must be defined in the same file.
They may use the `XdrvMailbox` to retrive deiails about the issued command.

The command refrended in the list must be defind in the following file: https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/support_command.ino



<details>
<summary><b>Further Speculations</b></summary>

- whats a "SetOption synonym"
  - may relate to "CmndSetoptionBase" 
- You need an entry in `bool (* const xdrv_func_ptr[])(uint8_t)` under https://github.com/MaxTrautwein/Tasmota/blob/development/tasmota/xdrv_interface.ino

</details>
<br/><br/><br/>



**MQTT Message Composition**

This section assumes that the MQTT Settings have been left at thair default as shown here:
![alt text](https://i.postimg.cc/y8LggXy1/mqtt-config2.png "Logo Title Text 1"
<br/>**Specificly:**
<br/>**Full Topic:** `%prefix%/%topic%/`

**Command Structur:**
```
cmnd/<Topic>/<Command>
```
`<Topic>` is the MQTT Topic that has been configured for this Tasmota device. _Defaut as shown above is `Tasmota`_
<br/>`<Command>` is the Command to execute. _a Compleate list of already implemented Commands can be found at: https://tasmota.github.io/docs/Commands/_

If the Payload is **empty** that the command will be seen as a status request
Otherwise Payload may be used to execute the command.

### Tasmota MQTT Subscribe

Subscribing to individual Topics for MQTT seems not nessesary for Tasmota as it automaticly subscribes to `#` eg: all topics.


## compiling
the reccomend palatformIO for compiling including a extension for VisualStudio.
I can't get that one working. there are always errors logged

https://github.com/tasmota/docker-tasmota should work i hope. but sadly I can't get it working.


https://github.com/Jason2866/Portable_VSC_PlatformIO **Appers to work**

### as of 03.01.22 When updating to the latest version
The compiler from above nolonger works...

but i got the docker container working.

open `entrypoint.sh` with **notepad++** and change the line ending to only `LF`, then save the file.

add the following line at the end befor the `COPY` instruction:
```
RUN platformio platform install https://github.com/tasmota/platform-espressif32/releases/download/v2.0.2/platform-tasmota-espressif32-2.0.2.zip --with-package framework-arduinoespressif32
```
this will install the platform on build so you dont have to do that on each compile

Compile with:
```
docker run -ti --rm -v <PATH/TO/GIT/REPO>:/tasmota docker-tasmota -e tasmota32
```





### .ino vs .cpp & .h
see: https://forum.arduino.cc/t/guidance-issues-with-using-defines-in-ino-for-use-in-libraries/530114/2
all .ino files are combined into one .cpp file at compile time.
Therefor refrences are not an issue. however .cpp files are compiled seperatly so extra stepps are needed

Simply defining the Method in any .h file resolves the issue.
TODO Create a seperate .h file for this purpos instead of including it with the other stuff

### Testing custom tasmota build
What causes the command error Response to be set for Tasmota?
<br/>`XdrvMailbox.data` seems to contain randm data !? Where is the sent payload?

### Understanding **XdrvMailbox**

```cpp
struct XDRVMAILBOX {
  bool          grpflg;
  bool          usridx;
  uint16_t      command_code;
  uint32_t      index;
  uint32_t      data_len;
  int32_t       payload;
  char         *topic;
  char         *data;
  char         *command;
} XdrvMailbox;
```

MQTT Command Sent:
```
Topic: "cmnd/dev/test/mqttbridge"
msg.payload : "Hello World"
```
_`""` are not acctually sent. they are there to indicate what data is acctually sent._ 


**Response / Data**
```
grpflg        => false ??
usridx        => false ??
command_code  => 93 (Index of command in array?)
index         => 1 ??
data_len      => 11 Length of the data in data
payload       => -99 ??
topic         => "MQTTBRIDGE" (Why all caps?)
data          => "Hello World"
command       => "mqttbridge"
```
## Tasmota MQTT - RS485 RTU Data format

```json
{
  "Address":"1 BYTE",
  "Function":"1 BYTE",
  "Data":"0 - 252 BYTE",
  "CRC":"(Optional) 2 BYTE Override / Info"
}
```


---

# Snippeds from Testing:

Testing MQTT RX
```cpp
char str[20];

std::string data = "command: ";
data.append(XdrvMailbox.command);
data.append(" data: ");
data.append(XdrvMailbox.data);
data.append(" topic: ");
data.append(XdrvMailbox.topic);
data.append(" payload: ");

sprintf(str,"%d", XdrvMailbox.payload);
data.append(str);
data.append(" data_len: ");
sprintf(str,"%d",XdrvMailbox.data_len);
data.append(str);
data.append(" index: ");
sprintf(str,"%d",XdrvMailbox.index);
data.append(str);
data.append(" command_code: ");
sprintf(str,"%d",XdrvMailbox.command_code);
data.append(str);
data.append(" usridx: ");
data.append(XdrvMailbox.usridx ? "true" : "false");
data.append(" grpflg: ");
data.append(XdrvMailbox.grpflg ? "true" : "false");

```

# addr2line
Get it here: 
https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-tools.html#xtensa-esp32-elf

```
xtensa-esp32-elf-addr2line.exe -a -e C:\Users\Max\Desktop\TAR\Git\Tasmota\.pio\build\tasmota32\firmware.elf -p -f <add1> <add_n>
```

## Sample Crash Response



```json
//No init / Currupt (see ESP Errors Link)
{"Info3":{"RestartReason":{"Exception":28,"Reason":"LoadProhibited","EPC":"401c78c9","EXCVADDR":"baad568c","CallChain":["401c78c6","401c78fd","400d3658","400d3751","40119de5","40119e24","40144fe9"]}}}

```

```json
//null ref  (see ESP Errors Link)
{"Info3":{"RestartReason":{"Exception":28,"Reason":"LoadProhibited","EPC":"401c78c9","EXCVADDR":"00000038","CallChain":["401c78c6","401c78fd","400d3658","400d3751","40119de5","40119e24","40144fe9"]}}}

```

### ESP Errors
https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/fatal-errors.html

https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/fatal-errors.html#loadprohibited-storeprohibited



# C# Client
https://github.com/chkr1011/MQTTnet

# Dashbord

--> Grafana
https://github.com/grafana/mqtt-datasource

--> Influx DB is causing issues. Maybe use somthing else instead

--> https://flows.nodered.org/node/node-red-dashboard ist au ne option. abder der code ist dann in node red --> kann ungünstig sein


# SVG Editor
Opem soure Editor used for Node Red Icons

https://inkscape.org/

https://gitlab.com/inkscape/inkscape



# js Dev
`istanbul` Test tool. maybe look into that


# influx alternetive
https://prometheus.io/
https://hub.docker.com/r/prom/prometheus
https://github.com/hikhvar/mqtt2prometheus

# node-red-dashboard
Add custom UI: https://github.com/node-red/node-red-dashboard/wiki/Creating-New-Dashboard-Widgets


# Node red
Checkout projects
