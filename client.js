var net = require("net");
var fileOperator = require("./fileOperator.js");
module.exports = class Client {
    constructor(host) {
        this.socket = new net.Socket();
        this.socket.connect(1113, host, () => {
            console.log("Connected");
        });
        var fileOperator = new fileOperator();

        this.socket.on("data", data => {
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