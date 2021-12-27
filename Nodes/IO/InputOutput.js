module.exports = function(RED) {
    //Node Functionality

    function DoubleOnTrue(t,payload,ref){
        var msg = { payload:payload, topic:t };
        ref.send(msg);
        ref.send(msg);
      //  setTimeout(ref.send(msg),dely *1000);
    }
    function SingleOnTrue(t,payload,ref){
        var msg = { payload:payload, topic:t };
        ref.send(msg);
    }
    function PulseTrue(t,payload,ref,port){
        var sendarr =  Array(ref.outputs).fill(null);
        sendarr[port] = {payload:true};
        ref.send(sendarr);
        sendarr[port] = {payload:false};
        ref.send(sendarr);

    }

    function HandleOI(conf,msg,ref){
        switch(conf["Interpreter"]){
            case "DoubleOnTrueDelay":
                //Back Compat
                if (msg.payload !== true) break;
                DoubleOnTrue(conf["Topic"],conf["payload"],ref);
                break;
            case "DoubleOnTrue":
                if (msg.payload !== true) break;
                DoubleOnTrue(conf["Topic"],conf["payload"],ref);
                break;
            case "SingleOnTrue":
                if (msg.payload !== true) break;
                SingleOnTrue(conf["Topic"],conf["payload"],ref);
                break;
            case "PulseTrue":
                if(msg.topic !== conf["Topic"]) break;
                PulseTrue(conf["Topic"],conf["payload"],ref,msg.__port);
                break;
        }
    }


    function OutputNode(config) {
        RED.nodes.createNode(this,config);


        this.configuration = RED.nodes.getNode(config.configuration);
        this.AusgangName = config.AusgangName;
        this.allports = config.allports;
        //this.AusgangName = config.AusgangName;


       this.jsonC = JSON.parse( this.configuration.configur);
        var node = this;
        node.on('input', function(msg) {
            //this.log("this.AusgangName: " + this.AusgangName);
            if (this.allports){
                //Handle allports
                let outputConfig = this.jsonC["Output"][msg.__port];
                HandleOI(outputConfig,msg,this);
            }else{
                //Handle Single
                let outputConfig = this.jsonC["Output"][parseInt(this.AusgangName)];
                HandleOI(outputConfig,msg,this);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("Output",OutputNode);

    //-------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------------------

    function InputNode(config) {
        RED.nodes.createNode(this,config);


        this.configuration = RED.nodes.getNode(config.configuration);
        this.EingangName = config.AusgangName;
        this.allportsi = config.allportsi;
        //this.AusgangName = config.AusgangName;


       this.jsonC = JSON.parse( this.configuration.configur);
        var node = this;
        node.on('input', function(msg) {
            //this.log("this.AusgangName: " + this.AusgangName);
            if (this.allportsi){
                //Handle allports
                let outputConfig = this.jsonC["Input"][msg.__port];
                HandleOI(outputConfig,msg,this);
            }else{
                //Handle Single
                let outputConfig = this.jsonC["Input"][parseInt(this.AusgangName)];
                HandleOI(outputConfig,msg,this);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("Input",InputNode);


}