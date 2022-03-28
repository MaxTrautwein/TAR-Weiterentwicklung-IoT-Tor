module.exports = function(RED) {
    //Node Functionality
    function TofNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(3).fill(undefined);

        this.time = config.time;
        this.timeUnit = config.timeUnit;
        
        var node = this;
        node.on('input', function(msg) {
            let changed = false;
            
            //cache Recived Value
            if (lib.IsBoolInput(this,msg.payload,msg.__port,[2])) {
                config.data[msg.__port] = msg.payload;
            }else{
                return; 
            }

            if (msg.__port === 2 ){
                lib.UpdateTimeParameter(this,msg,RED.comms.publish);
            }

            //Port 0 == Trigger
            var trigger = config.data[0];
            //Port 1 == Reset
            var reset = config.data[1];

            //Negative Flank on Input
            if ((config.lastval === true || config.lastval === undefined ) && trigger === false){
               config.trimer = setTimeout(function()
               {  
                   //No changed check needed. is per definition alway a change
                   config.sate = false;
                   config.trimer = undefined;
                   node.send({ payload:false });
                }
                ,this.time * this.timeUnit);
            }

            //Reset Timer if True is recived
            if (config.trimer !== undefined && ( trigger === true || reset === true)){
                clearTimeout(config.trimer)
            }

            //Reset
            if (reset === true){
                changed = config.sate != false;
                config.sate = false;
                msg.payload = false;

                if (changed) node.send(msg);
                return;
            }

            config.lastval = trigger

            //Turn On
            if (trigger === true){
                changed = config.sate != trigger;
                config.sate = trigger;
                msg.payload = trigger;
                if (changed) node.send(msg);
            }
            

        });
    }
    //Register Node
    RED.nodes.registerType("tof",TofNode);
}