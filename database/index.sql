--CREATE DATABASE iot;
use iot;

CREATE TABLE temperature (
    id              BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    temp            DECIMAL, 
    humidity        DECIMAL,
    dateOfOccurance TIMESTAMP, 
    deviceId        varchar(36),
    createdDate     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);