module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);

        this.I1 = config.I1;
        

        var node = this;
        node.on('input', function(msg) {
           
        });
    }
    //Register Node
    RED.nodes.registerType("and",AndNode);
}