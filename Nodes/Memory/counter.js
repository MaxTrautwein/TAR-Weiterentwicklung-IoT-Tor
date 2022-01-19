module.exports = function(RED) {
    //Node Functionality
    
    /**
     * Helper function for Debug Mode
     * @param {bool} val 
     * @returns 
     */
    function mapDirLable(val){
        if (val === false){
            return "Runter"
        }else if(val === true){
            return "Hoch"
        }
        //This should never happen
        return "N/A"
    }

    function AndNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")

        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(3).fill(undefined);
        config.cnt = 0;
        
        lib.DebugMode_UpdateStatus(config.debugmode,this,["Dir: "," Val: "," Target: "],[mapDirLable(config.data[2]),config.cnt,config.trigger]);

        var node = this;
        node.on('input', function(msg) {
            //TODO Check expected Logic & maybe add options
           
            var pflank = (msg.payload !== config.data[msg.__port] ) && msg.payload === true;
            config.data[msg.__port] = msg.payload;

            if (pflank == true && msg.__port == 1)
            {
                if(config.data[2] === true){
                    config.cnt++;
                }
                else
                {
                    config.cnt--;
                }
            }
            if(config.data[0] === true){
                config.cnt = config.reset;
            }

            var result = config.cnt == config.trigger;

            var msg = { payload: result}
            node.send(msg);

            lib.DebugMode_UpdateStatus(config.debugmode,this,["Dir: "," Val: "," Target: "," Out: "],[mapDirLable(config.data[2]),config.cnt,config.trigger,result]);
        });
    }
    //Register Node
    RED.nodes.registerType("counter",AndNode);
}