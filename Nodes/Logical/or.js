module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")

        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(4).fill(undefined);
        
        //Find All Used Inputs
        lib.InputDetection(this.id,RED,config.data)

        lib.DebugMode_UpdateStatus(config.debugmode,this,["0: "," 1: "," 2: "," 3: "],[config.data[0],config.data[1],config.data[2],config.data[3]]);

        var node = this;
        node.on('input', function(msg) {
            
            if (msg.__port === undefined){
                node.error("Error msg.__port is undefined");
            }
            
            //cache Recived Value
            if (lib.IsBoolInput(this,msg.payload,msg.__port,[])) {
                config.data[msg.__port] = msg.payload;
            }else{
                return;
            }


            //Or Logic
            var result = false;
            config.data.forEach(element => {
                if (element == true){
                    result = true; 
                }
            });

            var msg = { payload:result }
            node.send(msg);

            //Debug Mode Handeling
            lib.DebugMode_UpdateStatus(config.debugmode,this,["0: "," 1: "," 2: "," 3: "," Out: "],[config.data[0],config.data[1],config.data[2],config.data[3],result]);
            
        });
    }
    //Register Node
    RED.nodes.registerType("or",AndNode);
}