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

            //nOr Logic
            var result = false;
            config.data.forEach(element => {
                if (element == false){
                    result = true; 
                }
            });

            var msg = { payload:result }
            node.send(msg);

        });
    }
    //Register Node
    RED.nodes.registerType("nor",AndNode);
}