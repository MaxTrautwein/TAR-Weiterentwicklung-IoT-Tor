module.exports = function(RED) {
    //Node Functionality
    
    function XorNode(config) {
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
            //cache Recived Value
            if (lib.IsBoolInput(this,msg.payload,msg.__port,[])) {
                config.data[msg.__port] = msg.payload;
            }else{
                return;
            }
            
            //XOR Logic
            var result = false;
            var cntTrue = 0;
            config.data.forEach(element => {
                if (element == true){
                    cntTrue++; 
                }
            });
            if (cntTrue === 1){
                result = true;
            }
            var msg = { payload:result }
            node.send(msg);
            
            //Debug Mode Handeling
            lib.DebugMode_UpdateStatus(config.debugmode,this,["0: "," 1: "," 2: "," 3: "," Out: "],[config.data[0],config.data[1],config.data[2],config.data[3],result]);

        });
    }
    //Register Node
    RED.nodes.registerType("xor",XorNode);
}