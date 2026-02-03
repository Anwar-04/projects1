// Timer Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCounter = 0;
let laps = [];

// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

// Time display elements
const hoursDisplay = timerDisplay.querySelector('.hours');
const minutesDisplay = timerDisplay.querySelector('.minutes');
const secondsDisplay = timerDisplay.querySelector('.seconds');
const millisecondsDisplay = timerDisplay.querySelector('.milliseconds');

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// Start Timer Function
function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10); // Update every 10ms for smooth milliseconds
        isRunning = true;
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        lapBtn.disabled = false;
        
        // Change button text
        startBtn.textContent = 'Running...';
        pauseBtn.textContent = 'Pause';
    }
}

// Pause Timer Function
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Change button text
        startBtn.textContent = 'Resume';
        pauseBtn.textContent = 'Paused';
    }
}

// Reset Timer Function
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 0;
    laps = [];
    
    // Reset display
    updateDisplay(0, 0, 0, 0);
    
    // Clear laps
    lapsList.innerHTML = '<div class="laps-empty">No laps recorded yet</div>';
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    lapBtn.disabled = true;
    
    // Reset button text
    startBtn.textContent = 'Start';
    pauseBtn.textContent = 'Pause';
}

// Update Time Function
function updateTime() {
    elapsedTime = Date.now() - startTime;
    
    const time = calculateTime(elapsedTime);
    updateDisplay(time.hours, time.minutes, time.seconds, time.milliseconds);
}

// Calculate Time Components
function calculateTime(elapsed) {
    const milliseconds = Math.floor((elapsed % 1000) / 10);
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    
    return { hours, minutes, seconds, milliseconds };
}

// Update Display Function
function updateDisplay(hours, minutes, seconds, milliseconds) {
    hoursDisplay.textContent = pad(hours);
    minutesDisplay.textContent = pad(minutes);
    secondsDisplay.textContent = pad(seconds);
    millisecondsDisplay.textContent = pad(milliseconds);
}

// Pad numbers with leading zero
function pad(num) {
    return num.toString().padStart(2, '0');
}

// Format time for display
function formatTime(elapsed) {
    const time = calculateTime(elapsed);
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}:${pad(time.milliseconds)}`;
}

// Record Lap Function
function recordLap() {
    if (isRunning) {
        lapCounter++;
        
        // Calculate lap difference
        const currentLapTime = elapsedTime;
        const previousLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
        const lapDifference = currentLapTime - previousLapTime;
        
        // Store lap data
        laps.push({
            number: lapCounter,
            time: currentLapTime,
            difference: lapDifference
        });
        
        // Display lap
        displayLap(lapCounter, currentLapTime, lapDifference);
    }
}

// Display Lap Function
function displayLap(number, time, difference) {
    // Remove empty state message if it exists
    const emptyState = lapsList.querySelector('.laps-empty');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create lap item
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    
    lapItem.innerHTML = `
        <span class="lap-number">Lap ${number}</span>
        <span class="lap-time">${formatTime(time)}</span>
        <span class="lap-diff">+${formatTime(difference)}</span>
    `;
    
    // Insert at the top of the list
    lapsList.insertBefore(lapItem, lapsList.firstChild);
}

// Initialize with empty state
lapsList.innerHTML = '<div class="laps-empty">No laps recorded yet</div>';

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key.toLowerCase()) {
        case 's':
            if (!startBtn.disabled) startTimer();
            break;
        case 'p':
            if (!pauseBtn.disabled) pauseTimer();
            break;
        case 'r':
            if (!resetBtn.disabled) resetTimer();
            break;
        case 'l':
            if (!lapBtn.disabled) recordLap();
            break;
        case ' ':
            e.preventDefault(); // Prevent page scroll
            if (isRunning) {
                pauseTimer();
            } else if (elapsedTime > 0) {
                startTimer();
            } else if (!startBtn.disabled) {
                startTimer();
            }
            break;
    }
});

// Console log for debugging
console.log('Timer Clock Initialized');
console.log('Keyboard shortcuts:');
console.log('S - Start/Resume');
console.log('P - Pause');
console.log('R - Reset');
console.log('L - Lap');
console.log('Space - Start/Pause toggle');
