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
- TODO Support Resize based on inputs
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
