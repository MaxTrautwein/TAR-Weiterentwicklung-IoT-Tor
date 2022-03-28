module.exports = function(RED) {
    //Node Functionality
    
    function NotNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")
        var node = this;
        node.on('input', function(msg) {
            let changed = false;
            //Do nothing if input is invalid
            if (!lib.IsBoolInput(this,msg.payload,msg.__port,[]))  return;

            changed = config.sate != !msg.payload;
            config.sate = !msg.payload
            var msg = { payload:config.sate }
            if (changed) node.send(msg);
        });
    }
    //Register Node
    RED.nodes.registerType("not",NotNode);
}