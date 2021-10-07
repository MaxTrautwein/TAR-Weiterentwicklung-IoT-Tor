module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(4).fill(undefined);
        
        

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