# TemperatureMonitor

The purpose of this project was to monitor temperatures in the rooms of my house.  It uses a Raspberry PI, temperature sensor and a computer with MySQL and a webservice on it.

For the server
==============

1. docker pull mysql
2. Run the mysql container: 
  * docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mysql
3. under containers/web folder there is a Dockerfile.
4. build the docker file by using: 
  * docker build --no-cache -t web .
  * docker run --link data -p 8080:3000 -d --name=web web

For the client (raspberry pi/sensor)
====================================

1. Download Wiring pi: 
  * https://github.com/WiringPi/WiringPi
2. Follow the instructions for installing wiring pi under the INSTALL file
3. Build the c executable under client folder using this command:
  * cc -o bin/temp temp.c -L/usr/local/lib -lwiringPi
4. Run the node.js index.js file under client folder:
  * tempUrl="http://192.168.10.106:8080/api/temperature" temperatureExecutable="./temp" deviceId="babys room" node index.js
  * tempUrl is temperature Url of the server above.
  * temperatureExecutable is the location of the executable that polls the temerature sensor
  * deviceId is for distinguishing between devices that are reporting the temperature data.  example, room1 and room2
  
To view the temperatures:  http://{server_address}:8080/temperature

2 API calls:

1. post
2. get

Check out the postman script for how to execute them. temp.postman_collection
