unsigned long up_duration, down_duration;
float sensibility = 0.066; // Volts/Ampers sensibility for current sensor

float getFrequency(int pin){
  up_duration = pulseIn(pin, HIGH, 1000000);
  down_duration = pulseIn(pin, LOW, 1000000);
  return ((1000000.0 / (up_duration + down_duration)) / 4.0) * 60.0;
}

float getCurrent(int n_samples, int pin){
  float voltage_sensor;
  float current=0;
  for(int i=0;i<n_samples;i++)
  {
    voltage_sensor = analogRead(pin) * (5.0 / 1023.0);////lectura del sensor
    current = current+(voltage_sensor-2.5)/sensibility; //Ecuación  para obtener la corriente
  }
  return current/n_samples;
}

float getVoltage(int pin){
  return analogRead(pin) * (5.0 / 1023.0); //* ((82.0 + 2000.0) / 82.0);
}

float getPressure(int pin){
  return analogRead(pin) * (5.0 / 1023.0) * ((5000.0 + 20000.0) / 5000.0);
}
