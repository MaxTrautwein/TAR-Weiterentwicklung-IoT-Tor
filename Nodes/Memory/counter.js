module.exports = function(RED) {
    //Node Functionality
    
    /**
     * Helper function for Debug Mode
     * @param {bool} val 
     * @returns 
     */
    function mapDirLable(val){
        if (val === false || val === undefined){
            return "Hoch"
        }else if(val === true){
            return "Runter"
        }
        //This should never happen
        return "N/A"
    }

    function CountNode(config) {
        RED.nodes.createNode(this,config);
        const lib  = require("../resources/library")

        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(5).fill(undefined);
        config.cnt = 0;
        
        lib.InputDetection(this.id,RED,config.data);
        
        lib.DebugMode_UpdateStatus(config.debugmode,this,["Dir: "," Val: "," Target: "],[mapDirLable(config.data[2]),config.cnt,config.trigger]);

        var node = this;
        node.on('input', function(msg) {
            //TODO Check expected Logic & maybe add options
           
            var pflank = (msg.payload !== config.data[msg.__port] ) && msg.payload === true;
            
            if (lib.IsBoolInput(this,msg.payload,msg.__port,[3,4])) {
                config.data[msg.__port] = msg.payload;
            }else{
                return;
            }
            let didupdate = false;
            if (msg.__port === 3){
                let valupdate = lib.ValidateIntegerParameter(this,msg);
                if (valupdate !== null){
                    config.trigger = valupdate;
                    didupdate = true;
                }
            }else if (msg.__port === 4){
                let valupdate = lib.ValidateIntegerParameter(this,msg);
                if (valupdate !== null){
                    config.reset = valupdate;
                    didupdate = true;
                }
            }
            if ((msg.__port === 4 || msg.__port === 3) && didupdate){
                RED.comms.publish("confupdate/" + this.id,{reset:config.reset,trigger:config.trigger});
            }

            if (pflank == true && msg.__port == 1)
            {
                if(config.data[2] === false || config.data[2] === undefined){
                    config.cnt++;
                }
                else if (config.cnt > 0)
                {
                    config.cnt--;
                }
            }
            if(config.data[0] === true){
                config.cnt = config.reset;
            }

            var result = config.cnt >= config.trigger;

            var msg = { payload: result}
            node.send(msg);

            lib.DebugMode_UpdateStatus(config.debugmode,this,["Dir: "," Val: "," Target: "," Out: "],[mapDirLable(config.data[2]),config.cnt,config.trigger,result]);
        });
    }
    //Register Node
    RED.nodes.registerType("counter",CountNode);
}