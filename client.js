var net = require("net");

module.exports = class Client {
    constructor(host){
        this.socket = new net.Socket();
        this.socket.connect(1113, host, () => {
            console.log("Connected");
        });

        this.socket.on("data", data =>{
            var obj = JSON.parse(data.toString("utf-8"));
            
        });
    }

    Send(something){
        var json = JSON.stringify(something);
        this.socket.write(json, "utf-8");
    }
}