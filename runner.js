var Server = require("./server.js");
var Client = require("./client.js");
var Splitter = require("./splitter.js");
var FileOperator = require("./fileOperator.js");
var readline = require("readline");
var net = require("net")


var stop =false;
var timer = {}
var rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Start (s)ever or (c)lient\n", answer => {
    if (answer == "s") {
        var server = new Server(files => {
            stop = true;
            clearInterval(timer);
            var text = "";
            files
            .sort((a, b) => a.Partition - b.Partition)
            .forEach(file => {
                var buffer = Buffer.from(file.Content);
                text += buffer.toString("utf-8")
            });

            console.log(text);
        });

        rl.question("Write \"send\" to send file\nWrite \"get\" to retrieve a file", answer => {
            if (answer == "send") {
                var splitter = new Splitter();
                splitter.Split(__dirname + "/text.txt", server.connectionCount, (err, data) => {
                    server.Send(data);
                });
            } else if (answer == "get") {
                rl.question("Write the file name to retrieve\n", answer => {
                    var partitionCounter = 0;
                    timer = setInterval(() => {
                        var query ={
                            "Partition": partitionCounter,
                            "Filename": answer
                        };
                        partitionCounter++;
                        if(!stop){
                            server.Get(query);
                            partitionCounter = 0;
                        }
                    }, 1000);
                });
            }
        });
    } else if (answer == "c") {
        rl.question("Write the host IP Address\n", address => {
            var client = new Client(address);
        });
    }
});