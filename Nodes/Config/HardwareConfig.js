module.exports = function(RED) {
    function HardwareConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.configur = n.configur;
        this.name = n.name;
    }
    RED.nodes.registerType("hardware-config",HardwareConfigNode);
}