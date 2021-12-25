module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);


        this.configuration = RED.nodes.getNode(config.configuration);
        this.AusgangName = config.AusgangName;
        //this.AusgangName = config.AusgangName;


       // config.settings.conf = JSON.parse( this.configuration.configur):
        var node = this;
        node.on('input', function(msg) {
            this.log("this.AusgangName: " + this.AusgangName);
        });
    }
    //Register Node
    RED.nodes.registerType("Output",AndNode);
}