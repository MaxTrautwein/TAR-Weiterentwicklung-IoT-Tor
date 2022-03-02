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
            if (!lib.IsBoolInput(this,msg.payload,msg.__port,[1])) return;

            if (msg.__port === 1 && !isNaN(msg.payload) && msg.payload != ""){
                let timeout = parseFloat(msg.payload);
                
                //Update the Editor
                let combo = lib.FindTimeAndUnitCombo(timeout);
                node.time = combo[0];
                node.timeUnit = combo[1];
                RED.comms.publish("confupdate/" + this.id,{time:node.time,timeUnit:node.timeUnit});
            }

            if (msg.__port != 0) return;

            let Input = msg.payload;
            var timeout = this.time * this.timeUnit;

            if (config.lastval === false && Input === true){
               config.trimer = setTimeout(function(){  config.trimer = undefined; node.send(msg); },timeout);
            }
            if (config.trimer !== undefined &&  Input === false){
                clearTimeout(config.trimer)
            }

            config.lastval = Input

            if (Input === false){
                node.send(msg);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("ton",TonNode);
}