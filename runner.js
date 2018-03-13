var Server = require("./server.js");
var Client = require("./client.js");
var Splitter = require("./splitter.js");
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
                    data.forEach(slice => {
                        console.log(slice.Name);
                        console.log(slice.Content.toString("utf-8"));
                    });
                });
            } else if(answer == "get"){
                console.log("not supported");
            }
        });
    } else if(answer == "c"){
        rl.question("Write the host IP Address\n", address => {
            var client = new Client(address);
        });
    }
});