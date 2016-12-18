var request = require('request');
var moment = require('moment');
var spawn = require('child_process').spawn;

var baseUrl  = process.env.tempUrl || 'http://192.168.10.106:8080/api/temperature';
var path     = process.env.temperatureExecutable || '../c/bin/temp';
var deviceId = process.env.deviceId || 'raspberryPi';

var child = spawn(path, []);

child.stdout.on('data', function(chunk) {
    var lines = chunk.toString().split('\n')
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var data = jsonString(line)
        if(data) {
            postData(data)
        }
    }    
});

function postData(data){
    request.post(baseUrl)
           .form({
               temp: data.Temp,
               humidity: data.Humidity,
               dateOfOccurance: moment.format(),
               deviceId: deviceId
            })
           .on('error', function(err) {
                console.log(err)
           })
}

child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

child.on('close', function(code) {
    console.log('Exited with code: ${code}')
});

function jsonString(str) {
    try {
        return JSON.parse(str)
    } catch (e) {
        return null
    }
}