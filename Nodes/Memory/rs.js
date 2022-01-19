module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(2).fill(undefined);
        
        //Find All Used Inputs
        lib.InputDetection(this.id,RED,config.data)
        
        lib.DebugMode_UpdateStatus(config.debugmode,this,["Set: "," Reset: "," Out: "],[config.data[0],config.data[1],config.state]);

        var node = this;
        node.on('input', function(msg) {
            //cache Recived Value
            config.data[msg.__port] = msg.payload;
            
            //Use local variables for better readability
            let set = config.data[0];
            let reset = config.data[1];
            let changed = false;
            
            if (set === true && reset === false){
                if (config.state != true) changed = true;
                config.state = true;
            }else if (reset === true){
                if (config.state != false) changed = true;
                config.state = false;
            }

            var msg = { payload:config.state }
            if(changed) node.send(msg);

            //Debug Mode Handeling
            lib.DebugMode_UpdateStatus(config.debugmode,this,["Set: "," Reset: "," Out: "],[config.data[0],config.data[1],config.state]);
        });
    }
    //Register Node
    RED.nodes.registerType("rs",AndNode);
}