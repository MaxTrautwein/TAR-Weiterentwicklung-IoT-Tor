module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")

        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(4).fill(undefined);
        
        lib.InputDetection(this.id,RED,config.data)

        lib.DebugMode_UpdateStatus(config.debugmode,this,["0: "," 1: "," 2: "," 3: "],[config.data[0],config.data[1],config.data[2],config.data[3]]);
         
        var node = this;
        node.on('input', function(msg) {
            let changed = false;
            if (msg.__port === undefined){
                console.log("FATAL AND " + this.id + " recived msg on undefined port!");
                lib.DebugObject(msg);
                console.log("------------------");
            }
            //cache Recived Value
            if (lib.IsBoolInput(this,msg.payload,msg.__port,[])) {
                config.data[msg.__port] = msg.payload;
            }else{
                return;
            }

            //And Logic
            var result = true;
            config.data.forEach(element => {
                if (element === false){
                    result = false; 
                }
            });

            //Check if Output has changed
            changed = config.sate != result;
            config.sate = result;

            if (changed) node.send({ payload:result });
            lib.DebugMode_UpdateStatus(config.debugmode,this,["0: "," 1: "," 2: "," 3: "," Out: "],[config.data[0],config.data[1],config.data[2],config.data[3],result]);
        });
    }
    //Register Node
    RED.nodes.registerType("and",AndNode);
}