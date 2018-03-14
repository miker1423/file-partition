var net = require('net');

module.exports = class Server {
    constructor(){
        this.receivedFile = new Array();
        this.files = new Object();
        this.connections = new Array();
        var server = net.createServer();
        
        server.on("connection", socket => {
            socket.write("Hello user");
            socket.on("data", data => {
                var obj = JSON.parse(data);
                if(obj != null || obj != undefined){
                    files[socket] = file;

                    var hasbeensaved = false;
                    for(var savedfile in this.receivedFile){
                        if(savedfile == file){
                            hasbeensaved = true;
                            break;
                        }
                    }

                    if(!hasbeensaved){
                        this.receivedFile.push(file);
                    }
                }

                files[socket] = null; 
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

    Send(partitions) {
        for(i = 0; i < this.connectionCount();i++){
            var slices =[ partitions[i], partitions[i+1%this.connectionCount]];
            var json = JSON.stringify(slices);
            this.connections[i].write(json);
        }
    }

    Get(fileName) {
        var stop = false;
        var query = {
            "Partition": 0,
            "Filename": fileName
        };

        while(!stop){
            
            var json = JSON.stringify(query);
            this.connections.forEach(socket => {
                socket.write(json);
            });
            query.Partition++;

            for(var key in files){
                if(files[key] != null || files[key] != undefined){
                    stop = false;
                    break;
                } else {
                    stop = true;
                }
            }
        }

        return this.receivedFile;
    }
}