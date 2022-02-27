
/**
 * Helper function for DebugMode_UpdateStatus, that converts `undefined` to "-"
 * @param {*} val 
 * @returns 
 */
function DebugMode_ValDisplay(val){
    if (val === undefined) return "-";
    return val;
}

/**
 * Update The Status of the Node to contain Debug Information
 * @param {bool} active Devmode active? 
 * @param {*} ref 
 * @param {Array} arr_descript 
 * @param {Array} arr_val 
 */
function DebugMode_UpdateStatus(active,ref,arr_descript,arr_val){
    if (active){
        let data = "";
        for(let i = 0 ; i< arr_descript.length;i++){
            data += arr_descript[i] + DebugMode_ValDisplay(arr_val[i]);
        }
        ref.status({fill:"yellow",shape:"dot",text:data });
    }else{
        ref.status({});
    }
}

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

/**
 * 
 * @param {*} tid Node ID
 * @param {*} red RED
 * @param {Array} arr Buffer Array to write to
 * @param {bool} val Value to set for connected ports on default (defaults to `false`)
 */
function InputDetection(tid,red,arr,val=false){    
    red.nodes.eachNode(function(n){
        if (n.wires === undefined) return;
        for(let i = 0 ; i<n.wires.length;i++){
            for (let t = 0;t<n.wires[i].length;t++){
                if (n.wires[i][t] == tid){
                    let tp = n.full_wires[i][t]["target_port"];
                    arr[tp] = val;
                }
            }
            
        }
    });
}

/**
 * Checks if the payload is a bool.
 * If not a error will be logged
 * @param {*} ref Node
 * @param {*} payload msg Payload
 * @param {number} port Input Port
 * @param {Array<number>} exclude Ports that should be excluded
 * @returns `True` or `False`
 */
function IsBoolInput(ref,payload,port,exclude){
    if (exclude.includes(port)) return true;
    if (payload === true || payload === false){
        return true;
    }else{
        ref.error("Error unexpected Input type for port: " + port + "\nValue will be ignored.");
        return false;
    }
}

/**
 * Attemps to Parse data as JSON
 * 
 * @param {string} data Data that is expected to be JSON
 * @returns Parsed JSON or null if it is not JSON
 */
function TryParseJson(data){
    let result;
    try{
        result = JSON.parse(data);
    }catch{
        return null;
    }
    return result;
}


module.exports = {DebugMode_UpdateStatus,DebugObject,InputDetection,IsBoolInput,TryParseJson};