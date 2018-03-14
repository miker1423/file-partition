var net = require("net");
var FileOperator = require("./fileOperator.js");
module.exports = class Client {
    constructor(host) {
        this.socket = new net.Socket();
        this.socket.connect(1113, host, () => {
            console.log("Connected");
        });
        var fileOperator = new FileOperator();

        this.buffer = ""

        this.socket.on("data", data => {
            try{
                var obj = JSON.parse(data);
                fileOperator.GetFile(obj.Filename, obj.Partition, file => {
                    this.Send(file);
                });
            }catch(ex){
                this.buffer += data.toString("utf-8");
            }
        });

        this.socket.on("end", data => {
            try{
                console.log(this.buffer);
                var obj = JSON.parse(this.buffer);
                if (Array.isArray(obj)) {
                    fileOperator.SaveFile(obj[0]);
                    fileOperator.SaveFile(obj[1]);
                } else {
                    fileOperator.GetFile(obj.Filename, obj.Partition, file => {
                        this.Send(file);
                    })
                }
            }catch(err){
                console.log(err)
            }

            this.buffer = "";
        });
    }

    Send(something) {
        var json = JSON.stringify(something);
        this.socket.write(json, "utf-8");
    }
}