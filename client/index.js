// tempUrl='http://192.168.10.106:8080/api/temperature' temperatureExecutable='../../temp' deviceId='babys room' node index.js
var request = require('request');
var moment = require('moment');
var spawn = require('child_process').spawn;

var baseUrl  = process.env.tempUrl || 'http://192.168.10.106:8080/api/temperature';
var path     = process.env.temperatureExecutable || '../c/bin/temp';
var deviceId = process.env.deviceId || 'raspberryPi';

var child = spawn(path, []);
console.log('Starting at ... ', moment().format())

child.stdout.on('data', function(chunk) {
    console.log('Received event! ', moment().format())
    var lines = chunk.toString().split('\n')

    var sumTemp = 0, sumHumdity = 0, count = 0;
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var data = jsonString(line)
        console.log('Before: ', line, ' After: ',data)
        if(data){
            sumTemp += data.Temp;
            sumHumdity += data.Humidity;
            count++;
        }
    }   
    
    postData(sumTemp/count, sumHumdity/count);
});

child.on('close', function(code) {
    console.log('Exited with code: ${code}')
});

child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

function postData(temp, humidity){
    request.post(baseUrl)
           .form({
               'temp': temp,
               'humidity': humidity,
               'dateOfOccurance': moment().format(),
               'deviceId': deviceId
            })
           .on('error', function(err) {
                console.log(err)
           })
}

function jsonString(str) {
    try {
        return JSON.parse(str)
    } catch (e) {
        return null
    }
}