let isPlaying = false;
let stopRequested = false; // Flag to track stop request
let beatCount = 0; // Start with 0 to display '--' initially
let bpm = 120; // Default BPM
let avartanCount = 0; // Avartan counter
let maatra = 12; // Default number of beats in one Avartan
let beatInterval;

const toggleButton = document.getElementById("toggleButton");
const beatCountDisplay = document.getElementById("beatCount");
const avartanDisplay = document.getElementById("counter"); // Updated reference for avartan display
const tapButton = document.getElementById("tapButton");
const bubbleContainer = document.getElementById("bubbleContainer");
const maatraInput = document.getElementById("beats");
const bpmInput = document.getElementById("bpmSlider");
const bpmLabel = document.getElementById("bpmLabel"); // Reference to BPM label

// References to the + and - buttons
const increaseBPMButton = document.getElementById("increaseBPM");
const decreaseBPMButton = document.getElementById("decreaseBPM");

let tapTimes = [];

// Preload audio files
const beatSound1 = new Audio('metronome1.mp3'); // Replace with your sound file path
const beatSound2 = new Audio('metronome2.mp3'); // Replace with your sound file path
beatSound1.preload = 'auto';
beatSound2.preload = 'auto';

// Event listener for Maatra input change
maatraInput.addEventListener("change", (e) => {
    maatra = parseInt(e.target.value, 10) || 12; // Set Maatra from input or default to 12
    createBubbles(); // Create bubbles based on updated Maatra
});

// Event listener for toggle button
toggleButton.addEventListener("click", () => {
    if (isPlaying) {
        stopRequested = true; // Request to stop after the current loop
        toggleButton.textContent = "START"; // Update button text
        toggleButton.classList.remove('stop'); // Remove stop class
        toggleButton.classList.add('start'); // Add start class
    } else {
        isPlaying = true; // Start playing
        stopRequested = false; // Reset stop request
        toggleButton.textContent = "STOP"; // Update button text
        toggleButton.classList.remove('start'); // Remove start class
        toggleButton.classList.add('stop'); // Add stop class
        startBeat(); // Start the beat
    }
});

let soundOn = true; // Variable to track sound status

// Function to toggle sound
function toggleSound() {
    soundOn = !soundOn; // Toggle the sound status
    const soundButton = document.getElementById("soundToggle");
    soundButton.innerHTML = soundOn ? "<b>Sound ON</b>" : "<b>Sound OFF</b>"; // Change button text

    // Optionally, you can mute or unmute the audio elements here if needed
    if (soundOn) {
        document.getElementById("beatSound1").volume = 1; // Set volume to 1 (full volume)
        document.getElementById("beatSound2").volume = 1; // Set volume to 1 (full volume)
    } else {
        document.getElementById("beatSound1").volume = 0; // Mute sound
        document.getElementById("beatSound2").volume = 0; // Mute sound
    }
}

// Add event listener to sound toggle button
document.getElementById("soundToggle").addEventListener("click", toggleSound);

// Function to start the beat counter
function startBeat() {
    clearInterval(beatInterval);
    beatCount = 0; // Start with 0 to display '--'
    avartanCount = 0; // Reset avartan count
    avartanDisplay.textContent = avartanCount;

    // Create bubbles
    createBubbles();

    // Start the beat loop
    beatInterval = setInterval(() => {
        // Increment beat count
        beatCount++;

        // Play the appropriate sound based on the beat count
        if (beatCount % maatra === 1) { // Check if the beat count is 1
            if (soundOn) {
                beatSound1.currentTime = 0; // Reset sound time for the first beat
                beatSound1.play(); // Play first metronome sound
            }
        } else {
            if (soundOn) {
                beatSound2.currentTime = 0; // Reset sound time for the other beats
                beatSound2.play(); // Play second metronome sound
            }
        }

        // Update the beat count display and bubbles
        if (beatCount <= maatra) {
            beatCountDisplay.textContent = beatCount; // Display the beat count (starts from 1)
            updateBubbles(); // Update bubbles on each beat
        }

        // Check if we reached the number of beats in an avartan
        if (beatCount > maatra) {
            avartanCount++;
            avartanDisplay.textContent = avartanCount; // Update avartan display
            resetBeatCounter(); // Reset beat count for the next avartan
        }

        // Check if stop was requested and it's the last beat in the avartan
        if (stopRequested && beatCount === maatra) {
            avartanCount++; // Increment avartan count when completing the last cycle before stopping
            avartanDisplay.textContent = avartanCount; // Update the display

            clearInterval(beatInterval); // Stop after completing the current loop
            isPlaying = false; // Update the playing state
            stopRequested = false; // Reset the stop request flag
            beatCountDisplay.textContent = '--'; // Show '--' when stopped
        }
    }, (60000 / bpm)); // Interval based on BPM
}

// Function to reset the beat counter for the next avartan
function resetBeatCounter() {
    beatCount = 1; // Reset beat count to 1 for the next avartan
    beatCountDisplay.textContent = beatCount; // Display the reset value
    updateBubbles(); // Update bubbles for the new cycle
}

// Function to create bubbles based on the number of beats
function createBubbles() {
    bubbleContainer.innerHTML = ''; // Clear previous bubbles
    for (let i = 0; i < maatra; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble"; // Add bubble class
        bubbleContainer.appendChild(bubble);
    }
}

// Update the active state of the bubbles
function updateBubbles() {
    const bubbles = bubbleContainer.getElementsByClassName("bubble");
    if (bubbles.length > 0) {
        for (let i = 0; i < bubbles.length; i++) {
            if (i === (beatCount - 1)) { // Activate the current beat bubble
                if (beatCount % maatra === 1) {
                    bubbles[i].style.backgroundColor = 'green'; // Set the first bubble to green
                } else {
                    bubbles[i].style.backgroundColor = '#555'; // Set other bubbles to dark gray
                }
            } else {
                bubbles[i].style.backgroundColor = 'rgb(221, 221, 221)'; // Default light gray for inactive bubbles
            }
        }
    }
}

// Update BPM when the slider is changed
bpmInput.addEventListener("input", () => {
    bpm = parseInt(bpmInput.value, 10); // Get value from slider
    bpmLabel.textContent = `${bpm} BPM`; // Update BPM label
    if (isPlaying) {
        startBeat(); // Restart the beat to apply new BPM
    }
});

// Add event listener for the increase button
increaseBPMButton.addEventListener("click", () => {
    if (bpm < 1000) { // Ensure the BPM does not exceed 1000
        bpm += 1; // Increase BPM by 1
        bpmInput.value = bpm; // Update slider value
        bpmLabel.textContent = `${bpm} BPM`; // Update BPM label
        if (isPlaying) {
            startBeat(); // Restart the beat to apply new BPM
        }
    }
});

// Add event listener for the decrease button
decreaseBPMButton.addEventListener("click", () => {
    if (bpm > 30) { // Ensure the BPM does not go below 30
        bpm -= 1; // Decrease BPM by 1
        bpmInput.value = bpm; // Update slider value
        bpmLabel.textContent = `${bpm} BPM`; // Update BPM label
        if (isPlaying) {
            startBeat(); // Restart the beat to apply new BPM
        }
    }
});

// Event listener for tap tempo
tapButton.addEventListener("click", () => {
    const now = Date.now();
    tapTimes.push(now);

    if (tapTimes.length > 5) {
        tapTimes.shift(); // Keep only the last 5 taps
    }

    if (tapTimes.length >= 2) {
        const intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
            intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }
        beatSound2.currentTime = 0; // Reset sound to start
        if (soundOn) {
            beatSound2.play(); // Play sound 2
        }
        // Calculate average BPM
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        bpm = Math.round(60000 / avgInterval); // Convert to BPM
        bpmInput.value = bpm; // Update BPM slider
        bpmLabel.textContent = `${bpm} BPM`; // Update BPM label
        if (isPlaying) {
            startBeat(); // Restart the beat to apply new BPM
        }
    }
});

// Add click event listener to BPM label for editing
bpmLabel.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = bpm;

    // Copy the styles directly from the BPM label
    const computedStyle = getComputedStyle(bpmLabel);
    input.style.fontSize = computedStyle.fontSize; // Keep the same font size
    input.style.color = computedStyle.color; // Keep the same text color
    input.style.fontFamily = computedStyle.fontFamily; // Keep the same font family
    input.style.border = "none"; // Remove borders
    input.style.width = "60px"; // Set a width for the input
    input.style.textAlign = "center"; // Center align text
    input.style.outline = "none"; // Remove outline
    input.style.backgroundColor = "transparent"; // Make the background transparent

    // Replace the label with the input field
    bpmLabel.innerHTML = ''; // Clear the label content
    bpmLabel.appendChild(input); // Add the input to the label

    // Focus and select the input text
    input.focus();
    input.select();

    // On blur or enter, update the BPM and revert to the label
    input.addEventListener("blur", () => updateBPM(input.value));
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            updateBPM(input.value);
        }
    });
});

// Function to update BPM value and revert to label
function updateBPM(newValue) {
    bpm = Math.max(30, Math.min(1000, newValue)); // Ensure BPM is within bounds
    bpmLabel.textContent = `${bpm} BPM`; // Update BPM label
    bpmInput.value = bpm; // Sync slider value
    if (isPlaying) {
        startBeat(); // Restart the beat to apply new BPM
    }
}

// Initial display of BPM
bpmLabel.textContent = `${bpm} BPM`; // Set initial BPM label
