var net = require('net');

module.exports = class Server {
    constructor(callback){
        this.receivedFile = new Array();
        this.files = new Object();
        this.connections = new Array();
        var server = net.createServer();

        server.on("error", err => {
            console.log(err);
        });
        
        server.on("connection", socket => {
            var buffer = "";

            socket.on("data", data => {
                console.log(data.toString("utf-8"));
                buffer += data.toString("utf-8")
            });

            socket.on("end", data => {
                if(buffer != ""){
                    var obj = JSON.parse(buffer);
                    if(obj != null || obj != undefined){
                        callback(obj);
                    }else{
                        console.log("null");
                        callback(null);
                    }
                }else{
                    callback(null);
                }
            });

            socket.on("error", err =>{
                console.log(err);
            })

            this.connections.push(socket);
        
            console.log("New client!")
        });
        
        server.listen(1113, "0.0.0.0", function(data){
            console.log("Ready, listening")
        });
    }

    get connectionCount() {
        return this.connections.length;
    }

    Send(partitions) {
        for(var i = 0; i < this.connectionCount; i++){
            var next =  i + 1;
            if(next == partitions.length){
                next = next % partitions.length;
            }

            var slices =[ partitions[i], partitions[next]];
            var json = JSON.stringify(slices);
            this.connections[i].write(json);
            this.connections[i].end();
        }
    }

    Get(fileName) {
        var stop = false;

        var json = JSON.stringify(fileName);
        for(var i = 0; i < this.connectionCount; i++){
            this.connections[i].write(json);
        }
    }
}