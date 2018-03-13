var net = require('net');

module.exports = class Server {
    constructor(){
        this.connections = new Array();
        var server = net.createServer();
        
        server.on("connection", socket => {
            socket.write("Hello user");
            socket.on("data", data => {
                var obj = JSON.parse(data);

            });

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

    Send(something) {
        var json = JSON.stringify(something);
        this.connections.forEach(socket => {
            socket.write(json);
        });
    }
}