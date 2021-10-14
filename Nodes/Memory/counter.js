module.exports = function(RED) {
    //Node Functionality
    
    function AndNode(config) {
        RED.nodes.createNode(this,config);
        
        //TODO get size from inputs property
        //Array().fill may not work with IE
        config.data = Array(3).fill(undefined);
        config.cnt = 0;
        

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

        });
    }
    //Register Node
    RED.nodes.registerType("counter",AndNode);
}