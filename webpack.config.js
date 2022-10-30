const path = require("path");

module.exports = {
    
    mode: "development",
    entry: {
        filename: "./src/index.js",
        path: path.resolve(__dirname , "./src/index.js")
    },
    output: {
        
        filename:"main.js",
        path: path.resolve(__dirname ,"dist" )

    }
}