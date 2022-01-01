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

        var node = this;
        node.on('input', function(msg) {
            //cache Recived Value
            config.data[msg.__port] = msg.payload;
            
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

        });
    }
    //Register Node
    RED.nodes.registerType("xor",AndNode);
}