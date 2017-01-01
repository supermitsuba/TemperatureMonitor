// tempUrl='http://192.168.10.106:8080/api/temperature' temperatureExecutable='../../temp' deviceId='babys room' node index.js
var request = require('request');
var moment = require('moment');
var unirest = require('unirest');
var spawn = require('child_process').spawn;

var baseUrl  = process.env.tempUrl || 'http://192.168.10.106:8080/api/temperature';
var path     = process.env.temperatureExecutable || '../c/bin/temp';
var deviceId = process.env.deviceId || 'raspberryPi';

var child = spawn(path, []);
console.log('Starting at ... ', moment().format('YYYY-MM-DD hh:mm:ss'))

child.stdout.on('data', function(chunk) {
    console.log('Received event! ', moment().format('YYYY-MM-DD hh:mm:ss'))
    var lines = chunk.toString().split('\n')

    var sumTemp = 0, sumHumdity = 0, count = 0;
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var data = jsonString(line)

        if(data){
            sumTemp += data.Temp;
            sumHumdity += data.Humidity;
            count++;
        }
    }   
    
    postData(sumTemp/count, sumHumdity/count, 0, 0);
});

child.on('close', function(code) {
    console.log('Exited with code: ${code}')
});

child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

function postData(temp, humidity, count, timeout){
    var obj = {}
    obj.temp = temp
    obj.humidity = humidity
    obj.dateOfOccurance = moment().format('YYYY-MM-DD hh:mm:ss')
    obj.deviceId = deviceId
    
    console.log('posting this: ', JSON.stringify(obj))
    unirest.post(baseUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(obj)
        .end(function (response) {
            console.log('Response: %s', JSON.stringify(response))
            if(response && response.statusCode === 200){
                console.log("Response: ok");
            }
            else{
                if(count < 5){
                    setTimeout(function(){
                        postData(temp, humidity, count++, count * 1000)
                    }, timeout)
                }
            }
        });
}

function jsonString(str) {
    try {
        return JSON.parse(str)
    } catch (e) {
        return null
    }
}