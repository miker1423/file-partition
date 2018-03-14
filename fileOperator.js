var fs = require("fs")
var dir = require("mkdirp")

module.exports = class FileOperator{
    constructor() {
        this.basePath = "./Files/";
    }

    SaveFile(fileDescriptor){
        if(fileDescriptor != null){
            dir(this.basePath + fileDescriptor.Name, err => {
                if(err){
                    console.log(err)
                    return;
                }
    
                fs.writeFile(this.basePath+fileDescriptor.Name+"/"+fileDescriptor.Name+"-"+fileDescriptor.Slice+".json", JSON.stringify(fileDescriptor));
            });
        }
    }

    GetFile(fileName, chunk, callback){
        var path = this.basePath+fileName;
        fs.readdir(path, (err, files)=>{
            if(err){
                callback(null);
                return;
            }
            var hasFound = false;
            files.forEach(file => {
                console.log(file);
                if(file == fileName+"-"+chunk+".json"){
                    hasFound = true;
                    fs.readFile(path+"/"+file, (err, data) => {
                        if(err)
                            return;

                        callback(data);
                    })
                }

                if(!hasFound){
                    callback(null);
                }
            });
        });
    }
}