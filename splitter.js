var fs = require("fs")
var path = require("path")

module.exports = class Splitter {
    Split(Path, chunks, callback){
        fs.stat(Path, (err, stats) =>{
            var info = path.basename(Path).split(".");
            if(stats.isFile()){
                this.SplitFile(Path, chunks, info[0], info[1], callback);
            }
        });
    }

    SplitFile(path, chunks, filename, fileExtension,callback){
        fs.readFile(path, (err, data) =>{
            if(err)
                callback(err, data);
            
            var slices = new Array(chunks);
            var maxSize = Math.ceil(data.length / chunks);
            var k = 0;

            for (let index = 0; index < slices.length; index++) {
                var tempArray = new Array();
                for (let j = k; j < k + maxSize; j++) {
                    if(j >= data.length)
                    {
                        break;
                    }

                    tempArray.push(data[j]);
                }

                slices[index] = {
                    "Slice": index,
                    "Name": filename,
                    "Extension": fileExtension,
                    "Content": new Buffer(tempArray),
                };

                k += maxSize;
            }

            callback(err, slices);
        });
    }
}