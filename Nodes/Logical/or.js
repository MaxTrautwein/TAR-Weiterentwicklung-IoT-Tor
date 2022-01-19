module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(4).fill(undefined);
        
        //Find All Used Inputs
        var tid = this.id;
        RED.nodes.eachNode(function(n){
            if (n.wires === undefined) return;
            for(let i = 0 ; i<n.wires.length;i++){
                if (n.wires[i][0] == tid){
                    let tp = n.full_wires[i][0]["target_port"];
                    config.data[tp] = false;
                }
            }
        });

        //Imidiatly reset Debug Mode
        if (!config.debugmode)  this.status({});

        var node = this;
        node.on('input', function(msg) {
            
            if (msg.__port === undefined){
                node.error("Error msg.__port is undefined");
            }
            
            //cache Recived Value
            config.data[msg.__port] = msg.payload;


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
            if (config.debugmode){
                this.status({fill:"yellow",shape:"dot",text:"0: " + config.data[0] +" 1: " + config.data[1] +" 2: " + config.data[2] +" 3: " + config.data[3] +" Out: " + result });
            }else{
                this.status({});
            }

        });
    }
    //Register Node
    RED.nodes.registerType("or",AndNode);
}