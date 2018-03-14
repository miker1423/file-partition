var Server = require("./server.js");
var Client = require("./client.js");
var Splitter = require("./splitter.js");
var FileOperator = require("./fileOperator.js");
var readline = require("readline");
var net = require("net")

var slices = new Array();
var stop =false;
var timer = {}
var rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Start (s)ever or (c)lient\n", answer => {
    if (answer == "s") {
        var server = new Server(files => {

            if(files != null){
                if(!slices.includes(files.Slice)){
                    slices.push(files.Slice);
                    var buffer = Buffer.from(files.Content);
                    console.log(buffer.toString("utf-8"))
                }
            }
            else{
                console.log("First null");
                stop = true;
                clearInterval(timer);
            }
        });

        rl.question("Write \"send\" to send file\nWrite \"get\" to retrieve a file", answer => {
            if (answer == "send") {
                rl.question("write the absolute path to file", answer =>{
                    var splitter = new Splitter();
                    splitter.Split(answer, server.connectionCount, (err, data) => {
                        server.Send(data);
                    });
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
                        server.Get(query);
                        if(stop){
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