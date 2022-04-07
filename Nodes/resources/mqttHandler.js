
//var isUtf8 = require('is-utf8');

function matchTopic(ts,t) {
    if (ts == "#") {
        return true;
    }
    /* The following allows shared subscriptions (as in MQTT v5)
       http://docs.oasis-open.org/mqtt/mqtt/v5.0/cs02/mqtt-v5.0-cs02.html#_Toc514345522

       4.8.2 describes shares like:
       $share/{ShareName}/{filter}
       $share is a literal string that marks the Topic Filter as being a Shared Subscription Topic Filter.
       {ShareName} is a character string that does not include "/", "+" or "#"
       {filter} The remainder of the string has the same syntax and semantics as a Topic Filter in a non-shared subscription. Refer to section 4.7.
    */
    else if(ts.startsWith("$share")){
        ts = ts.replace(/^\$share\/[^#+/]+\/(.*)/g,"$1");

    }
    var re = new RegExp("^"+ts.replace(/([\[\]\?\(\)\\\\$\^\*\.|])/g,"\\$1").replace(/\+/g,"[^/]+").replace(/\/#$/,"(\/.*)?")+"$");
    return re.test(t);
}

/**
 * Helper function for setting integer property values in the MQTT V5 properties object
 * @param {object} src Source object containing properties
 * @param {object} dst Destination object to set/add properties
 * @param {string} propName The property name to set in the Destination object
 * @param {integer} [minVal] The minimum value. If the src value is less than minVal, it will NOT be set in the destination
 * @param {integer} [maxVal] The maximum value. If the src value is greater than maxVal, it will NOT be set in the destination
 * @param {integer} [def] An optional default to set in the destination object if prop is NOT present in the soruce object
 */
function setIntProp(src, dst, propName, minVal, maxVal, def) {
    if (src.hasOwnProperty(propName)) {
        var v = parseInt(src[propName]);
        if(isNaN(v)) return;
        if(minVal != null) {
            if(v < minVal) return;
        }
        if(maxVal != null) {
            if(v > maxVal) return;
        }
        dst[propName] = v;
    } else {
        if(def != undefined) dst[propName] = def;
    }
}

/**
 * Helper function for setting string property values in the MQTT V5 properties object
 * @param {object} src Source object containing properties
 * @param {object} dst Destination object to set/add properties
 * @param {string} propName The property name to set in the Destination object
 * @param {string} [def] An optional default to set in the destination object if prop is NOT present in the soruce object
 */
function setStrProp(src, dst, propName, def) {
    if (src[propName] && typeof src[propName] == "string") {
        dst[propName] = src[propName];
    } else {
        if(def != undefined) dst[propName] = def;
    }
}

/**
 * Helper function for setting boolean property values in the MQTT V5 properties object
 * @param {object} src Source object containing properties
 * @param {object} dst Destination object to set/add properties
 * @param {string} propName The property name to set in the Destination object
 * @param {boolean} [def] An optional default to set in the destination object if prop is NOT present in the soruce object
 */
function setBoolProp(src, dst, propName, def) {
    if (src[propName] != null) {
        if(src[propName] === "true" || src[propName] === true) {
            dst[propName] = true;
        } else if(src[propName] === "false" || src[propName] === false) {
            dst[propName] = true;
        }
    } else {
        if(def != undefined) dst[propName] = def;
    }
}

/**
 * Helper function for copying the MQTT v5 srcUserProperties object (parameter1) to the properties object (parameter2).
 * Any property in srcUserProperties that is NOT a key/string pair will be silently discarded.
 * NOTE: if no sutable properties are present, the userProperties object will NOT be added to the properties object
 * @param {object} srcUserProperties An object with key/value string pairs
 * @param {object} properties A properties object in which userProperties will be copied to
 */
function setUserProperties(srcUserProperties, properties) {
    if (srcUserProperties && typeof srcUserProperties == "object") {
        let _clone = {};
        let count = 0;
        let keys = Object.keys(srcUserProperties);
        if(!keys || !keys.length) return null;
        keys.forEach(key => {
            let val = srcUserProperties[key];
            if(typeof val == "string") {
                count++;
                _clone[key] = val;
            }
        });
        if(count) properties.userProperties = _clone;
    }
}

/**
 * Helper function for copying the MQTT v5 buffer type properties
 * NOTE: if src[propName] is not a buffer, dst[propName] will NOT be assigned a value (unless def is set)
 * @param {object} src Source object containing properties
 * @param {object} dst Destination object to set/add properties
 * @param {string} propName The property name to set in the Destination object
 * @param {boolean} [def] An optional default to set in the destination object if prop is NOT present in the Source object
 */
function setBufferProp(src, dst, propName, def) {
    if(!dst) return;
    if (src && dst) {
        var buf = src[propName];
        if (buf && typeof Buffer.isBuffer(buf)) {
            dst[propName] = Buffer.from(buf);
        }
    } else {
        if(def != undefined) dst[propName] = def;
    }
}

function SubscribeHandler(brokerConn ,node, _qos ,callback){
    
    let v5 = brokerConn.options && brokerConn.options.protocolVersion == 5;
    
    let options = { qos: _qos };
    if(v5) {
        setIntProp(node, options, "rh");
        //TODO MQTT 5 Suppot add settings
        options.nl = false;
        options.rap = true;
    }

    brokerConn.subscribe("#",options,function(topic,payload,packet) {
      
        //Auto Type
        /*if (isUtf8(payload)) {*/ payload = payload.toString();/* }*/
        
        var msg = {topic:topic, payload:payload, qos:packet.qos, retain:packet.retain};
        if(v5 && packet.properties) {
            setStrProp(packet.properties, msg, "responseTopic");
            setBufferProp(packet.properties, msg, "correlationData");
            setStrProp(packet.properties, msg, "contentType");
            setIntProp(packet.properties, msg, "messageExpiryInterval", 0);
            setBoolProp(packet.properties, msg, "payloadFormatIndicator");
            setStrProp(packet.properties, msg, "reasonString");
            setUserProperties(packet.properties.userProperties, msg);
        }
        if ((brokerConn.broker === "localhost")||(brokerConn.broker === "127.0.0.1")) {
            msg._topic = topic;
        }

        callback(msg);
    }, node.id);
   
}


function SendHandler(brokerConn,msg){
    brokerConn.publish(msg, function(err) {
        let args = arguments;
        let l = args.length;
        done(err);
    });
}


module.exports = {SubscribeHandler,SendHandler};