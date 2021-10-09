module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(2).fill(undefined);
        
        

        var node = this;
        node.on('input', function(msg) {
            //cache Recived Value
            config.data[msg.__port] = msg.payload;

            
            if (config.data[0] === true) {
                config.state = true;
            }
            if (config.data[1] === true) {
                config.state = false;
            }
            
            var msg = { payload:config.state }
            node.send(msg);

        });
    }
    //Register Node
    RED.nodes.registerType("rs",AndNode);
}