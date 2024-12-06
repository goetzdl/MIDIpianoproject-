let serial; // Serial port object
let soundLevel = 0; // sound level
let notes = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']; // Note names
let sounds = {}; // Object to store sound files
let keys = []; // Array for piano keys

function preload() {
  // Load sound files for each note from the 'sounds' folder
  notes.forEach(note => {
    console.log(`Loading: sounds/note_${note}.wav`);
    sounds[note] = loadSound(`sounds/note_${note}.wav`); // Adjust path if needed
  });
}

function setup() {
  createCanvas(800, 300);
  userStartAudio(); // Ensure audio works

  // Create piano keys
  for (let i = 0; i < notes.length; i++) {
    keys.push({
      x: i * (width / notes.length),
      y: height / 2,
      w: width / notes.length,
      h: 150,
      note: notes[i],
      isActive: false,
    });
  }

  // Setup serial communication
  serial = new p5.SerialPort();
  serial.open('COM4'); // my port
  serial.on('data', gotData);
  serial.on('error', gotError);
  console.log("Setup complete: Waiting for serial data...");
}

function draw() {
  background(30);

  // Draw piano keys
  for (let key of keys) {
    fill(key.isActive ? color(200, 100, 255) : 255); // Active keys light up
    rect(key.x, key.y, key.w, key.h);

    // Label the keys
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(key.note, key.x + key.w / 2, key.y + key.h / 2);
  }

  // Display the sound level for debugging
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(`Sound Level: ${soundLevel}`, 10, 10);
}

function gotData() {
  let currentString = serial.readLine(); // Read data
  if (currentString) {
    soundLevel = parseFloat(currentString.trim()); // Parse numeric sound level
    console.log("Parsed Sound Level:", soundLevel); // Debug log for parsed sound level

    // Map sound level to a note index
    let noteIndex = floor(map(soundLevel, 0, 60, 0, notes.length)); // range
    console.log("Mapped Note Index:", noteIndex); // Debug log

    if (noteIndex >= 0 && noteIndex < notes.length) {
      playNote(noteIndex);
    } else {
      resetKeys(); // Reset keys if the sound level doesn't map to a valid note
    }
  }
}

function playNote(index) {
  // Reset all keys before activating the new one
  resetKeys();

  // Highlight the active key
  keys[index].isActive = true;

  // Play the corresponding sound
  let note = notes[index];
  if (sounds[note]) {
    if (sounds[note].isPlaying()) {
      sounds[note].stop(); // Stop the sound if it's already playing
    }
    sounds[note].play();
    console.log(`Playing Note: ${note}`); // Debug log for playing note
  }
}

function resetKeys() {
  // Deactivate all keys
  for (let key of keys) {
    key.isActive = false;
  }
}

function gotError(err) {
  console.error("Serial Error:", err); // Debug log for serial errors
}

  
