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

            //TODO Should undefined count as true?
            if (config.lastval === true && trigger === false){
               config.trimer = setTimeout(function(){  config.trimer = undefined; node.send({ payload:trigger }); },this.time * this.timeUnit);
            }
            if (config.trimer !== undefined && ( trigger === true || reset == true)){
                clearTimeout(config.trimer)
                if (reset == true){
                    msg.payload = false;
                    node.send(msg);
                }
            }

            config.lastval = trigger

            if (msg.payload === true){
                node.send(msg);
            }
            

        });
    }
    //Register Node
    RED.nodes.registerType("tof",TofNode);
}