module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")

        var node = this;
        node.on('input', function(msg) {
            
            var msg = { payload:!msg.payload }
            node.send(msg);

        });
    }
    //Register Node
    RED.nodes.registerType("not",AndNode);
}