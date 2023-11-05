/*
 WiFiEsp example: WebClient
 This sketch connects to google website using an ESP8266 module to
 perform a simple web search.
 For more details see: http://yaab-arduino.blogspot.com/p/wifiesp-example-client.html
*/

#include "WiFiEsp.h"

// Emulate Serial1 on pins 6/7 if not present
#ifndef HAVE_HWSERIAL1
#include "SoftwareSerial.h"
SoftwareSerial Serial1(2, 3); // RX, TX
#endif

char ssid[] = "Ewave";            // your network SSID (name)
char pass[] = "ewave1234";        // your network password
int status = WL_IDLE_STATUS;     // the Wifi radio's status
String JSON_DATA = " ";

char server[] = "http://ewave-aaronsmar.pitunnel.com";
const int pin[] = {7, A5, A4, A3, A2, A1};

// Initialize the Ethernet client object
WiFiEspClient client;

void setup()
{
  // initialize serial for debugging
  Serial.begin(115200);
  // initialize serial for ESP module
  Serial1.begin(9600);
  pinMode(pin[0], INPUT);
  // initialize ESP module
  WiFi.init(&Serial1);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }

  // attempt to connect to WiFi network
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
  }

  // you're connected now, so print out the data
  Serial.println("You're connected to the network");
  printWifiStatus();
  Serial.println();
  Serial.println("Starting connection to server...");
}

void loop()
{
  JSON_DATA = "{\"Pressure 1\":" + String(getPressure(pin[4])) +
              ",\"Pressure 2\":" + String(getPressure(pin[3])) +
              ",\"Turbine frequency\":" + String(getFrequency(pin[0])) +
              ",\"Current\":" + String(getCurrent(100, pin[2])) + 
              ",\"Voltage\":" + String(getVoltage(pin[1])) + 
              "}";
              
  // If disconnected, try to reconnect to WiFi network
  if ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
  }
              
  POST("/api/create/measure/url?data={}", JSON_DATA);
}

void POST(String PATH, String JSON){
  //Connecting to host and executing the http POST request
  if (client.connect(server, 80)) {
    Serial.println("Connected to server");
    client.println("POST "+ PATH +" HTTP/1.1");
    client.println("Host: ewave-aaronsmar.pitunnel.com");
    client.println("Cache-Control: no-cache");
    client.println("Content-Type: application/json; charset=utf-8");
    client.print("Content-Length: ");
    client.println(String(JSON.length()));
    client.println();
    client.println(JSON);
    client.stop();
  }
  
  // if there are incoming bytes available
  // from the server, read them and print them
  /*
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }*/
  
  delay(2000);
}


void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
