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

            //And Logic
            var result = true;
            config.data.forEach(element => {
                if (element == true){
                    result = false; 
                }
            });

            var msg = { payload:result }
            node.send(msg);

        });
    }
    //Register Node
    RED.nodes.registerType("nand",AndNode);
}