
module.exports = function(RED) {
    //Node Functionality
    const lib  = require("../resources/library")
    
    function InjectToggle(config) {
        RED.nodes.createNode(this,config);
        //const lib  = require("../resources/library")
        this.oval = config.oval;

    }
    //Register Node
    RED.nodes.registerType("injecttoggle",InjectToggle);

    
    RED.httpAdmin.post("/injecttoggle/:id", RED.auth.needsPermission("inject.write"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);

        //Force a Redraw to update the lable
        node.status({fill:"red",shape:"ring",text:"-"});
        node.status({});

        if (node != null) {
            try {
                node.send({ payload:req.body.val})
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("inject.failed",{error:err.toString()}));
            }
        } else {
            res.sendStatus(404);
        }
    });
}


