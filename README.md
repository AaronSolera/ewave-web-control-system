# Welcome to the E-Wave Web Control System Project!

Due to the COVID-19 pandemic, unfortunately, the project could not be continued. Nevertheless, in the following lines, we will detail what we aimed to achieve and provide some suggestions for future developments.

## What is E-Wave?

E-Wave was a tidal energy generation project that involved a machine designed to harness wave energy. The E-Wave project was successfully presented at the Pan-American Marine Energy Conference (PAMEC) in Costa Rica, 2020.

## What is a SCADA System?

For more information about SCADA systems, you can visit this [Wikipedia link](https://en.wikipedia.org/wiki/SCADA).

## Motivation to Continue the Project

Continuing this project would contribute to the knowledge generated at the national level, with the potential to have an international impact. Potential benefits include an increase in job creation through the implementation of a tidal energy plant, a reduction in reliance on fossil fuel power plants, and an increase in the international prestige of Costa Rican scientific talent.

## Project Scope

The original idea behind E-Wave was to develop a general-purpose SCADA system that could be controlled from a web page. Initially, we planned to monitor variables such as temperature, pressure, and power generation, among others. To achieve this, we used an Atmega328 controller, which is the same controller used in Arduino projects. This controller communicated via WiFi with a REST API server created in Node.js. Microcontroller application is inside `microcontroller-app` repository directory. 

The web application can be run using a Raspberry Pi (as implemented during the PAMEC competition). However, the use of this development board led to connection issues. Therefore, it is advisable for future implementations to run the web application using a cloud service such as Google Cloud, Azure, or Heroku. The web application executed on the Raspberry Pi can be found within the directory named `web-app`.

In the future, we intended to expand the project to allow the capture of input signals and control of outputs for manipulating devices like relays. Unfortunately, this phase of the project could not be carried out. Continuing this work could achieve the creation of the first open-source PLC with a Costa Rican stamp, controlled through a web interface.

# Mechanism Diagram

![Project hardware diagrams-Initial arquitecture diagram drawio](https://github.com/AaronSolera/ewave-web-control-system/assets/22781012/1c4aa557-eb35-4e26-bd48-103443bf4513)

# Circuit Diagram

![Project hardware diagrams-Circuit Diagram (Proposal for an open source SCADA) drawio](https://github.com/AaronSolera/ewave-web-control-system/assets/22781012/9ec706bf-8dbb-4a88-bc4e-c215af35cf81)


## Technologies Used So Far

- [Arduino POST request](https://forum.arduino.cc/index.php?topic=466396.0) and [relevant discussion](https://github.com/bportaluri/WiFiEsp/issues/50)
- [Node.js](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)
- [Express](https://www.instructables.com/id/How-to-Build-a-Website-on-a-Raspberry-Pi-With-Node/)
- [Bootstrap](https://startbootstrap.com/themes)
- [DNS - No-IP](https://www.noip.com/)
- [PM2 and Dataplicity](https://medium.com/@andrew.nease.code/set-up-a-self-booting-node-js-eb56ebd05549)
- [Express tutorial (MongoDB)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website)
