let counter; // Declare counter in a higher scope
let stopAfterCycle = false; // Flag to indicate if we should stop after the current cycle
let clickTimes = []; // Array to store click timestamps
let clickInterval; // Variable to store interval for click BPM calculation

document.getElementById('startButton').addEventListener('click', function () {
    const beatsToCount = parseInt(document.getElementById('beats').value);
    const bpm = parseInt(document.getElementById('bpm').value);

    if (isNaN(beatsToCount) || isNaN(bpm) || beatsToCount <= 0 || bpm <= 0) {
        alert("Please enter valid numbers for beats and BPM.");
        return;
    }

    // Reset click times and BPM display
    clickTimes = [];
    document.getElementById('calculatedBPM').innerText = '0';

    const interval = (60 / bpm) * 1000; // Convert seconds to milliseconds
    let count = 0;
    let currentBeat = 0;
    const counterDiv = document.getElementById('counter');
    const beatCountDiv = document.getElementById('beatCount');
    const beatSound = document.getElementById('beatSound');

    // Start the counter process
    counter = setInterval(() => {
        currentBeat++;

        // Play sound for each beat
        beatSound.currentTime = 0; // Reset the audio to start
        beatSound.play();

        // Display the current beat
        beatCountDiv.innerHTML = `Counting beat: ${currentBeat}`;

        // When beatsToCount is reached, increase the Avartan count
        if (currentBeat >= beatsToCount) {
            currentBeat = 0;
            count++;
            counterDiv.innerHTML = `Avartan -----> ${count}`;
        }

        // Check if we need to stop after the current cycle
        if (stopAfterCycle && currentBeat === 0) {
            clearInterval(counter); // Stop the interval when cycle completes
            stopAfterCycle = false; // Reset the flag
            beatCountDiv.innerHTML = `Counting beat: 0`; // Reset display
        }
    }, interval); // Interval in milliseconds
});

// Stop the counter when the Stop button is clicked
document.getElementById('stopButton').addEventListener('click', function () {
    stopAfterCycle = true; // Set the flag to stop after the current cycle
});

// Clear the counts when the Clear button is clicked
document.getElementById('clearButton').addEventListener('click', function () {
    clearInterval(counter); // Stop the interval if it's running
    const counterDiv = document.getElementById('counter');
    const beatCountDiv = document.getElementById('beatCount');

    // Reset the Avartan and beat count displays
    counterDiv.innerHTML = `Avartan -----> 0`;
    beatCountDiv.innerHTML = `Counting beat: 0`;
});

// Click to record beat and calculate BPM
document.getElementById('clickButton').addEventListener('click', function () {
    const currentTime = Date.now();
    clickTimes.push(currentTime);

    // Keep only the last 5 click timestamps
    if (clickTimes.length > 5) {
        clickTimes.shift();
    }

    // Calculate BPM
    if (clickTimes.length > 1) {
        const intervals = clickTimes.slice(1).map((time, index) => (time - clickTimes[index]) / 1000); // Get intervals in seconds
        const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const bpm = averageInterval > 0 ? Math.round(60 / averageInterval) : 0;
        document.getElementById('calculatedBPM').innerText = bpm;
    }
});
