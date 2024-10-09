let counter; // Declare counter in a higher scope
let stopAfterCycle = false; // Flag to indicate if we should stop after the current cycle
let currentBeat = 0; // Track current beat globally
let count = 0; // Track Avartan count globally
let beatsToCount = 0; // Store beats to count for resuming later
let bpm = 0; // Store BPM for resuming later
let isRunning = false; // Flag to track if the counter is currently running

document.getElementById('startButton').addEventListener('click', function () {
    beatsToCount = parseInt(document.getElementById('beats').value);
    bpm = parseInt(document.getElementById('bpm').value);

    if (isNaN(beatsToCount) || isNaN(bpm) || beatsToCount <= 0 || bpm <= 0) {
        alert("Please enter valid numbers for beats and BPM.");
        return;
    }

    const interval = (60 / bpm) * 1000; // Convert seconds to milliseconds
    const counterDiv = document.getElementById('counter');
    const beatCountDiv = document.getElementById('beatCount');
    const beatSound = document.getElementById('beatSound');

    // Start the counter process
    if (!isRunning) {
        // Reset the Avartan display only when starting fresh
        count = 0; // Reset Avartan count to 0 only if starting fresh
        currentBeat = 0; // Reset current beat when starting fresh
        counterDiv.innerHTML = `Avartan -----> ${count}`;
        
        beatCountDiv.innerHTML = `Counting beat: ${currentBeat}`;

        // Start the counter interval
        counter = setInterval(() => {
            currentBeat++;

            // Play sound for each beat
            beatSound.currentTime = 0; // Reset the audio to start
            beatSound.play();

            // Display the current beat
            beatCountDiv.innerHTML = `Counting beat: ${currentBeat}`;

            // When beatsToCount is reached, increase the Avartan count
            if (currentBeat >= beatsToCount) {
                currentBeat = 0; // Reset current beat after completing the cycle
                count++; // Increase Avartan count
                counterDiv.innerHTML = `Avartan -----> ${count}`; // Update Avartan display
            }

            // Check if we need to stop after the current cycle
            if (stopAfterCycle && currentBeat === 0) {
                clearInterval(counter); // Stop the interval when cycle completes
                stopAfterCycle = false; // Reset the flag
                isRunning = false; // Mark as not running
                beatCountDiv.innerHTML = `Counting beat: 0`; // Reset display
            }
        }, interval); // Interval in milliseconds
    }
    
    isRunning = true; // Mark as running
});

// Stop the counter when the Stop button is clicked
document.getElementById('stopButton').addEventListener('click', function () {
    if (isRunning) {
        // If it's running, toggle the state
        stopAfterCycle = true; // Set the flag to stop after the current cycle
        isRunning = false; // Mark as not running
    } else {
        // If it's not running, restart the counter from where it left off
        stopAfterCycle = false; // Reset the flag
        isRunning = true; // Mark as running
        const interval = (60 / bpm) * 1000; // Convert seconds to milliseconds
        const counterDiv = document.getElementById('counter');
        const beatCountDiv = document.getElementById('beatCount');
        const beatSound = document.getElementById('beatSound');

        // Start the counter interval again
        counter = setInterval(() => {
            currentBeat++;

            // Play sound for each beat
            beatSound.currentTime = 0; // Reset the audio to start
            beatSound.play();

            // Display the current beat
            beatCountDiv.innerHTML = `Counting beat: ${currentBeat}`;

            // When beatsToCount is reached, increase the Avartan count
            if (currentBeat >= beatsToCount) {
                currentBeat = 0; // Reset current beat after completing the cycle
                count++; // Increase Avartan count
                counterDiv.innerHTML = `Avartan -----> ${count}`; // Update Avartan display
            }

            // Check if we need to stop after the current cycle
            if (stopAfterCycle && currentBeat === 0) {
                clearInterval(counter); // Stop the interval when cycle completes
                stopAfterCycle = false; // Reset the flag
                isRunning = false; // Mark as not running
                beatCountDiv.innerHTML = `Counting beat: 0`; // Reset display
            }
        }, interval); // Interval in milliseconds
    }
});

// Clear the counts when the Clear button is clicked
document.getElementById('clearButton').addEventListener('click', function () {
    clearInterval(counter); // Stop the interval if it's running
    currentBeat = 0; // Reset current beat
    count = 0; // Reset Avartan count
    isRunning = false; // Mark as not running
    const counterDiv = document.getElementById('counter');
    const beatCountDiv = document.getElementById('beatCount');

    // Reset the Avartan and beat count displays
    counterDiv.innerHTML = `Avartan -----> 0`;
    beatCountDiv.innerHTML = `Counting beat: 0`;
});
