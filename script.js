let isPlaying = false;
let stopRequested = false;
let beatCount = 0;
let bpm = 120;
let avartanCount = 0;
let maatra = 12;
let beatInterval;

const toggleButton = document.getElementById("toggleButton");
const beatCountDisplay = document.getElementById("beatCount");
const avartanDisplay = document.getElementById("counter");
const tapButton = document.getElementById("tapButton");
const bubbleContainer = document.getElementById("bubbleContainer");
const maatraInput = document.getElementById("beats");
const bpmInput = document.getElementById("bpmSlider");
const bpmLabel = document.getElementById("bpmLabel");

const increaseBPMButton = document.getElementById("increaseBPM");
const decreaseBPMButton = document.getElementById("decreaseBPM");

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
    beatSoundBuffer1 = await loadSound('metronome1.mp3');
    beatSoundBuffer2 = await loadSound('metronome2.mp3');
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

toggleButton.addEventListener("click", () => {
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
});

let soundOn = true;

function toggleSound() {
    soundOn = !soundOn;
    const soundButton = document.getElementById("soundToggle");
    soundButton.innerHTML = soundOn ? "<b>Sound ON</b>" : "<b>Sound OFF</b>";
}

document.getElementById("soundToggle").addEventListener("click", toggleSound);

function startBeat() {
    clearTimeout(beatInterval); // Clear any previous timer
    beatCount = 0; // Reset the beat counter
    avartanCount = 0; // Reset the avartan count
    avartanDisplay.textContent = avartanCount; // Update display
    createBubbles(); // Initialize bubbles

    const interval = 60000 / bpm; // Time per beat in milliseconds
    let nextBeatTime = Date.now(); // Schedule the first beat

    function scheduleBeat() {
        const now = Date.now();

        // Play the current beat
        executeBeat();

        // Calculate the next beat's time
        nextBeatTime += interval;

        // Calculate the drift and adjust
        const drift = nextBeatTime - now;
        const adjustedInterval = Math.max(0, drift);

        // Schedule the next beat with adjustment
        if (!stopRequested) {
            beatInterval = setTimeout(scheduleBeat, adjustedInterval);
        } else {
            clearBeat();
        }
    }

    // Start scheduling beats
    scheduleBeat();
}

// Function to execute a beat (sound, visuals, counters)
function executeBeat() {
    beatCount++;

    // Play sound and update visuals
    if (beatCount % maatra === 1) {
        if (soundOn) {
            playSound(beatSoundBuffer1); // Play the first sound
        }
    } else {
        if (soundOn) {
            playSound(beatSoundBuffer2); // Play the second sound
        }
    }

    // Update beat counter and bubble visuals
    if (beatCount <= maatra) {
        beatCountDisplay.textContent = beatCount;
        updateBubbles();
    }

    // Handle avartan increment
    if (beatCount > maatra) {
        avartanCount++;
        avartanDisplay.textContent = avartanCount;
        resetBeatCounter();
    }
}

// Clear state when stopping
function clearBeat() {
    avartanCount++;
    avartanDisplay.textContent = avartanCount;

    isPlaying = false;
    stopRequested = false;
    beatCountDisplay.textContent = '--';
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

function updateBubbles() {
    const bubbles = bubbleContainer.getElementsByClassName("bubble");
    if (bubbles.length > 0) {
        for (let i = 0; i < bubbles.length; i++) {
            if (i === (beatCount - 1)) {
                if (beatCount % maatra === 1) {
                    bubbles[i].style.backgroundColor = 'green';
                } else {
                    bubbles[i].style.backgroundColor = '#555';
                }
            } else {
                bubbles[i].style.backgroundColor = 'rgb(221, 221, 221)';
            }
        }
    }
}

bpmInput.addEventListener("input", () => {
    bpm = parseInt(bpmInput.value, 10);
    bpmLabel.textContent = `${bpm} BPM`;
    if (isPlaying) {
        updateBeatInterval();
    }
});

function updateBeatInterval() {
    clearInterval(beatInterval);
    beatInterval = setInterval(() => {
        beatCount++;

        if (beatCount % maatra === 1) {
            if (soundOn) {
                playSound(beatSoundBuffer1); // Play first sound
            }
        } else {
            if (soundOn) {
                playSound(beatSoundBuffer2); // Play second sound
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

        if (stopRequested && beatCount === 1) {
            avartanCount++;
            avartanDisplay.textContent = avartanCount;

            clearInterval(beatInterval);
            isPlaying = false;
            stopRequested = false;
            beatCountDisplay.textContent = '--';
        }
    }, (60000 / bpm));
}

increaseBPMButton.addEventListener("click", () => {
    bpm++;
    bpmInput.value = bpm;
    bpmLabel.textContent = `${bpm} BPM`;
    if (isPlaying) {
        updateBeatInterval();
    }
});

decreaseBPMButton.addEventListener("click", () => {
    if (bpm > 1) {
        bpm--;
        bpmInput.value = bpm;
        bpmLabel.textContent = `${bpm} BPM`;
        if (isPlaying) {
            updateBeatInterval();
        }
    }
});

tapButton.addEventListener("click", () => {
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
});
