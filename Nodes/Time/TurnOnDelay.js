module.exports = function(RED) {
    //Node Functionality
    function TonNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")
        
        this.time = config.time;
        this.timeUnit = config.timeUnit;
        config.lastval = false;

        var node = this;
        node.on('input', function(msg) {
            let changed = false;

            if (!lib.IsBoolInput(this,msg.payload,msg.__port,[1])) return;

            if (msg.__port === 1){
                lib.UpdateTimeParameter(this,msg,RED.comms.publish);
            }

            if (msg.__port != 0) return;

            let Input = msg.payload;
            var timeout = this.time * this.timeUnit;

            if (config.lastval === false && Input === true){
               config.trimer = setTimeout(function()
               {  
                   //No changed check needed. is per definition alway a change
                   config.sate = Input;
                   config.trimer = undefined;
                   node.send(msg);
                }
               ,timeout);
            }
            if (config.trimer !== undefined &&  Input === false){
                clearTimeout(config.trimer)
            }

            config.lastval = Input

            if (Input === false){
                changed = config.sate != Input;
                config.sate = Input;
                if (changed) node.send(msg);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("ton",TonNode);
}