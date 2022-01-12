module.exports = function(RED) {
    //General

    function getOnOff_to_TrueFalse(obj,name,act){
       try{
            let val = obj[name][act];
            switch(val){
                case "ON":
                    return true;
                    break;
                case "OFF":
                    return false;
                    break;
                default:
                    console.log("Error unexpected Value for getOnOff_to_TrueFalse");
                    console.log(val);
                    return null;
            }
        }catch (e){
            return null;
        }
    }


    //----------------------------------------------------------------------------------------------------------------------------------------
    // MQTT -> Node Red
    // (May have more then one Output Port depending on User Settings)
    //----------------------------------------------------------------------------------------------------------------------------------------
    function PulseTrue(t,payload,ref,port){
        var sendarr =  Array(ref.outputs).fill(null);
        sendarr[port] = {payload:true};
        if (ref.outputs === 1){
            ref.send(sendarr[port]);
        }else{
            ref.send(sendarr);
        }
        sendarr[port] = {payload:false};
        if (ref.outputs === 1){
            ref.send(sendarr[port]);
        }else{
            ref.send(sendarr);
        }

    }
    function SwitchModeOnOFF(conf,payload,ref,port){
        let sendarr =  Array(ref.outputs).fill(null);
        let switchN = "Switch" + conf["arg"];
        let val = getOnOff_to_TrueFalse(JSON.parse(payload),switchN,"Action");
        if (val === null){
            return;
        }
        sendarr[port] = {payload:val};
        if (ref.outputs === 1){
            ref.send(sendarr[port]);
        }else{
            ref.send(sendarr);
        }
    }




    //----------------------------------------------------------------------------------------------------------------------------------------
    // Node Red -> MQTT
    //----------------------------------------------------------------------------------------------------------------------------------------
 
    
    function DoubleOnTrue(t,payload,ref){
        var msg = { payload:payload, topic:t };
        ref.send(msg);
        ref.send(msg);
    }
    function SingleOnTrue(t,payload,ref){
        var msg = { payload:payload, topic:t };
        ref.send(msg);
    }
    function TrueFalseMessage(conf,ref,msg){
        var topic2 = conf["Topic"];
        if (conf["Topic_alt"] !== undefined){
            topic2 = conf["Topic_alt"];
        }
        switch (msg.payload) {
            case true:
                ref.send({ payload:conf["payload"], topic:conf["Topic"] });
                break;
            case false:
                ref.send({ payload:conf["payload_alt"], topic:conf["Topic"] });
                break;
            default:
                console.log(msg.payload);
                //Should not happen
                break;
        }
    }


    //----------------------------------------------------------------------------------------------------------------------------------------
    // Handler
    //----------------------------------------------------------------------------------------------------------------------------------------
    function HandleOI(conf,msg,ref,port = 0){
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
                PulseTrue(conf["Topic"],msg.payload,ref,port);
                break;
            case "SwitchModeOnOFF":
                if(msg.topic !== conf["Topic"]) break;
                SwitchModeOnOFF(conf,msg.payload,ref,port);
                break;
            case "TrueFalseMessage":
                TrueFalseMessage(conf,ref,msg);
        }
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------
    // Node Red Logic --> MQTT
    // (May have more then one Input depending on User Setting)
    //-------------------------------------------------------------------------------------------------------------------------------------------
    function OutputNode(config) {
        RED.nodes.createNode(this,config);


        this.configuration = RED.nodes.getNode(config.configuration);
        this.AusgangName = config.AusgangName;
        this.allports = config.allports;


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
    // MQTT -> Node Red Logic
    //-------------------------------------------------------------------------------------------------------------------------------------------
    function InputNode(config) {
        RED.nodes.createNode(this,config);


        this.configuration = RED.nodes.getNode(config.configuration);
        this.EingangName = config.EingangName;
        this.allportsi = config.allportsi;
        this.outputs = config.outputs;
        //this.AusgangName = config.AusgangName;


       this.jsonC = JSON.parse( this.configuration.configur);
        var node = this;
        node.on('input', function(msg) {
            //this.log("this.AusgangName: " + this.AusgangName);
            if (this.allportsi){
                //Handle allports
                for(let i = 0; i< this.jsonC["Input"].length;i++){
                    HandleOI(this.jsonC["Input"][i],msg,this,i);
                }
                //let outputConfig = this.jsonC["Input"][msg.__port];
                
            }else{
                //Handle Single
                let outputConfig = this.jsonC["Input"][parseInt(this.EingangName)];
                HandleOI(outputConfig,msg,this);
            }
        });
    }
    //Register Node
    RED.nodes.registerType("Input",InputNode);


}