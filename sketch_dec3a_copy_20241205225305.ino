#include <Adafruit_CircuitPlayground.h>

const int BASELINE = 60;

void setup() {
  Serial.begin(9600);
  CircuitPlayground.begin();
}

void loop() {
  float soundLevel = CircuitPlayground.mic.soundPressureLevel(50) - BASELINE;

  if (soundLevel < 0) {
    soundLevel = 0;
  }

  Serial.println(soundLevel);
  delay(50);
}

