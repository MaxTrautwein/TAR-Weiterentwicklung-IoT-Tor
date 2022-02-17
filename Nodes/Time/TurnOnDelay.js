module.exports = function(RED) {
    //Node Functionality
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        this.time = config.time;
        this.timeUnit = config.timeUnit;

        var node = this;
        node.on('input', function(msg) {

            //TODO Should undefined count as false?
            if (config.lastval === false && msg.payload === true){
               config.trimer = setTimeout(function(){  config.trimer = undefined; node.send(msg); },this.time * this.timeUnit);
            }
            if (config.trimer !== undefined &&  msg.payload === false){
                clearTimeout(config.trimer)
            }

            config.lastval = msg.payload

            if (msg.payload === false){
                node.send(msg);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("ton",AndNode);
}