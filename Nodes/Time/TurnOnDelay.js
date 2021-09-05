module.exports = function(RED) {
    //Node Functionality


    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        
        this.time = config.time;
        

        var node = this;
        node.on('input', function(msg) {

            //TODO Should undefined count as false?
            if (config.lastval === false && msg.payload === true){
               config.trimer = setTimeout(function(){  config.trimer = undefined; node.send(msg); },this.time * 1000);
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