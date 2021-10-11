var spawn = require("child_process").spawn;

browser = spawn('open', ['http://localhost:3000/']);

browser.on('close', function() {
    console.log("Ditutup");
})