var Server = require("./server.js");
var Client = require("./client.js");
var Splitter = require("./splitter.js");
var FileOperator = require("./fileOperator.js");
var readline = require("readline");
var net = require("net")

var rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Start (s)ever or (c)lient\n", answer => {
    if(answer == "s"){
        var server = new Server();

        rl.question("Write \"send\" to send file\nWrite \"get\" to retrieve a file", answer =>{
            if(answer == "send"){
                var splitter = new Splitter();
                splitter.Split(__dirname+"/text.txt", 3, (err, data)=>{
                    var operator = new FileOperator();
                    data.forEach(slice => {
                        operator.SaveFile(slice);
                    });
                });
            } else if(answer == "get"){
                rl.question("Write the file name to retrieve\n", answer => {
                    var operator = new FileOperator();
                    operator.GetFile(answer, 1, data => {
                        if(data != null){
                            var obj = JSON.parse(data);
                            var buffer = new Buffer(obj.Content);
                            console.log(buffer.toString("utf-8"));
                        }
                    });
                });
            }
        });
    } else if(answer == "c"){
        rl.question("Write the host IP Address\n", address => {
            var client = new Client(address);
        });
    }
});