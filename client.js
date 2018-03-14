var net = require("net");
var FileOperator = require("./fileOperator.js");
module.exports = class Client {
    constructor(host) {
        this.socket = new net.Socket();
        this.socket.connect(1113, host, () => {
            console.log("Connected");
        });
        var fileOperator = new FileOperator();

        this.socket.on("data", data => {
            console.log(data.toString("utf-8"));
            var obj = JSON.parse(data.toString("utf-8"));
            if (Array.isArray(obj)) {
                fileOperator.SaveFile(obj[0]);
                fileOperator.SaveFile(obj[1]);
            } else {
                fileOperator.GetFile(fileName, partition, data => {
                    this.socket.write(data, "utf-8");
                })
            }

        });
    }

    Send(something) {
        var json = JSON.stringify(something);
        this.socket.write(json, "utf-8");
    }
}