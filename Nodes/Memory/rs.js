module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(2).fill(undefined);
        
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
            if (config.debugmode){
                this.status({fill:"yellow",shape:"dot",text:"set: " + set +" reset: " + reset +" Out: " + config.state });
            }else{
                this.status({});
            }
        });
    }
    //Register Node
    RED.nodes.registerType("rs",AndNode);
}