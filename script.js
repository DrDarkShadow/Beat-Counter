let isPlaying = false;
let stopRequested = false;
let beatCount = 0;
let bpm = 120;
let avartanCount = 0;
let maatra = 6;
let beatInterval;

const toggleButton = document.getElementById("toggleButton");
const isMobile = window.matchMedia("(max-width: 768px)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const beatCountDisplay = document.getElementById("beatCount");
const avartanDisplay = document.getElementById("counter");
const tapButton = document.getElementById("tapButton");
const bubbleContainer = document.getElementById("bubbleContainer");
const maatraInput = document.getElementById("beats");
const bpmInput = document.getElementById("bpmSlider");
const bpmLabel = document.getElementById("bpmLabel");
const increaseBPMButton = document.getElementById("increaseBPM");
const decreaseBPMButton = document.getElementById("decreaseBPM");
const soundToggleButton = document.getElementById("soundToggle");
soundToggleButton.addEventListener("click", toggleSound);
let bubbleUpdateInterval; // To control the bubble update timing


let tapTimes = [];

// Initialize AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let beatSoundBuffer1, beatSoundBuffer2;

// Function to load audio files using fetch and decode them
async function loadSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

// Load both sounds
async function initializeAudio() {
    beatSoundBuffer1 = await loadSound('metronome1.mp3'); // First sound file
    beatSoundBuffer2 = await loadSound('metronome2.mp3'); // Second sound file
}

// Play sound using AudioBufferSourceNode
function playSound(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Call the function to initialize the audio buffers
initializeAudio();

maatraInput.addEventListener("change", (e) => {
    maatra = parseInt(e.target.value, 10) || 12;
    createBubbles();
});

// Function to handle toggle button click
function toggleBeat() {
    if (isPlaying) {
        stopRequested = true;
        toggleButton.textContent = "START";
        toggleButton.classList.remove('stop');
        toggleButton.classList.add('start');
    } else {
        isPlaying = true;
        stopRequested = false;
        toggleButton.textContent = "STOP";
        toggleButton.classList.remove('start');
        toggleButton.classList.add('stop');
        startBeat();
    }
}

// Attach click event for toggleButton
toggleButton.addEventListener("click", toggleBeat);

let soundOn = true;

function toggleSound() {
    soundOn = !soundOn;
    const soundButton = document.getElementById("soundToggle");
    soundButton.innerHTML = soundOn ? "<b>Sound ON</b>" : "<b>Sound OFF</b>";
}

function startBeat() {
    clearInterval(beatInterval);
    beatCount = 0;
    avartanCount = 0;
    avartanDisplay.textContent = avartanCount;
    createBubbles();

    beatInterval = setInterval(() => {
        beatCount++;

        if (beatCount % maatra === 1) {
            if (soundOn) {
                playSound(beatSoundBuffer1); // Play the first sound
            }
        } else {
            if (soundOn) {
                playSound(beatSoundBuffer2); // Play the second sound
            }
        }

        if (beatCount <= maatra) {
            beatCountDisplay.textContent = beatCount;
            updateBubbles();
        }

        if (beatCount > maatra) {
            avartanCount++;
            avartanDisplay.textContent = avartanCount;
            resetBeatCounter();
        }

        if (stopRequested) {
            if (beatCount === 1) { // Check if on the first beat of the next cycle
                avartanDisplay.textContent = avartanCount;
                clearInterval(beatInterval);
                isPlaying = false;
                stopRequested = false;
                beatCountDisplay.textContent = '--';
            }
        }
    }, (60000 / bpm));
}

function resetBeatCounter() {
    beatCount = 1;
    beatCountDisplay.textContent = beatCount;
    updateBubbles();
}

function createBubbles() {
    bubbleContainer.innerHTML = '';
    for (let i = 0; i < maatra; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubbleContainer.appendChild(bubble);
    }
}
const defaultBubbleCount = 12; // Set your default number of bubbles here
let bubbleCount = defaultBubbleCount; // Initialize with the default count

document.addEventListener('DOMContentLoaded', () => {
    createBubbles(bubbleCount);
});

function updateBubbles() {
    const bubbles = bubbleContainer.getElementsByClassName("bubble");

    if (bubbles.length === 0) return; // If no bubbles, do nothing

    // Calculate the current active bubble based on the beat count
    let currentIndex = (beatCount - 1) % bubbles.length;

    // Only update the necessary bubble (the active one)
    Array.from(bubbles).forEach((bubble, index) => {
        if (index === currentIndex) {
            // Highlight the active bubble
            bubble.style.backgroundColor = beatCount % maatra === 1 ? 'green' : '#555'; // First beat green, others grey
        } else {
            // Reset other bubbles
            bubble.style.backgroundColor = 'rgb(221, 221, 221)';
        }
    });
}

// Use requestAnimationFrame for smoother updates
function startBubbleAnimation() {
    if (bubbleUpdateInterval) {
        clearInterval(bubbleUpdateInterval); // Clear previous intervals
    }

    bubbleUpdateInterval = setInterval(() => {
        requestAnimationFrame(updateBubbles); // Smoother animation with requestAnimationFrame
    }, 500); // Sync with beat duration, adjust interval as needed
}
// Call createBubbles to initialize the bubbles and start the animation loop
createBubbles();
startBubbleAnimation();
// Attach click events for BPM buttons
increaseBPMButton.addEventListener("click", increaseBPM);
decreaseBPMButton.addEventListener("click", decreaseBPM);

function increaseBPM() {
    bpm++;
    bpmInput.value = bpm;
    bpmLabel.textContent = `${bpm} BPM`;
    if (isPlaying) {
        updateBeatInterval();
    }
}

function decreaseBPM() {
    if (bpm > 1) {
        bpm--;
        bpmInput.value = bpm;
        bpmLabel.textContent = `${bpm} BPM`;
        if (isPlaying) {
            updateBeatInterval();
        }
    }
}

// Attach click event for tap button
tapButton.addEventListener("click", tapTempo);

function tapTempo() {
    const tapTime = Date.now();
    tapTimes.push(tapTime);
    if (tapTimes.length > 1) {
        const interval = tapTimes[tapTimes.length - 1] - tapTimes[tapTimes.length - 2];
        bpm = Math.round(60000 / interval);
        bpmInput.value = bpm;
        bpmLabel.textContent = `${bpm} BPM`;
        if (isPlaying) {
            updateBeatInterval();
        }
    }
}

// Change BPM label to an input field when clicked
bpmLabel.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "number"; // Set type to number
    input.value = bpm; // Set the current BPM value
    input.style.width = "50px"; // Set width for the input
    input.style.textAlign = "center"; // Center the text
    input.style.font = getComputedStyle(bpmLabel).font; // Match font styles
    input.style.border = "none"; // Remove border for seamless look
    input.style.backgroundColor = "transparent"; // Transparent background
    input.style.color = getComputedStyle(bpmLabel).color; // Match text color
    input.style.outline = "none"; // Remove outline on focus

    // Set a placeholder for visual cue
    input.placeholder = "BPM";

    // Create a span to hold the BPM text
    const bpmText = document.createElement("span");
    bpmText.textContent = " BPM"; // Add BPM text
    bpmText.style.font = getComputedStyle(bpmLabel).font; // Match font styles
    bpmText.style.color = getComputedStyle(bpmLabel).color; // Match text color

    // Replace the BPM label with the input field and BPM text
    bpmLabel.innerHTML = ''; // Clear the label
    bpmLabel.appendChild(input); // Add the input field
    bpmLabel.appendChild(bpmText); // Add the BPM text
    input.focus(); // Focus on the input field

    // Handle when the input loses focus (blur)
    input.addEventListener("blur", () => {
        const newBPM = parseInt(input.value, 10); // Get the new BPM value
        if (!isNaN(newBPM) && newBPM > 0) {
            bpm = newBPM; // Update the BPM variable
            bpmLabel.innerHTML = `${bpm} BPM`; // Update the label text
            bpmInput.value = bpm; // Sync with the BPM input slider
            if (isPlaying) {
                updateBeatInterval(); // Update the interval if playing
            }
        } else {
            bpmLabel.innerHTML = `${bpm} BPM`; // Revert to the original value if invalid
        }
    });

    // Handle when the Enter key is pressed
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            input.blur(); // Trigger the blur event to save the value
        }
    });
});

// Handle BPM slider changes
bpmInput.addEventListener("input", () => {
    bpm = Math.max(30, Math.min(1000, parseInt(bpmInput.value, 10))); // Update BPM from input value
    bpmLabel.textContent = `${bpm} BPM`; // Update label text
    if (isPlaying) {
        updateBeatInterval(); // Update interval if playing
    }
});

// Update beat interval based on the current BPM
function updateBeatInterval() {
    clearInterval(beatInterval); // Clear the existing interval
    startBeat(); // Restart the beat with the new BPM
}
