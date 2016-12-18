FROM node:7.2.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install git
RUN git clone https://github.com/supermitsuba/TemperatureMonitor
WORKDIR /usr/src/app/TemperatureMonitor
RUN npm install
RUN npm install typescript
RUN npm install -g typescript

EXPOSE 3000
CMD [ "npm", "start" ]