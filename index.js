// Default countdown date (January 1, 2026)
let countdownDate = new Date(2026, 0, 1, 0, 0, 0).getTime();
let completeMessage = "Welcome to SpiritX 2026!";

// Load configuration from config.html
fetch('config.html')
    .then(response => response.text())
    .then(html => {
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get event date from meta tag
        const eventDateMeta = doc.querySelector('meta[name="event-date"]');
        if (eventDateMeta) {
            const eventDateStr = eventDateMeta.getAttribute('content');
            const eventDate = new Date(eventDateStr);
            if (!isNaN(eventDate)) {
                countdownDate = eventDate.getTime();
            }
        }
        
        // Get complete message from meta tag
        const completeMessageMeta = doc.querySelector('meta[name="complete-message"]');
        if (completeMessageMeta) {
            completeMessage = completeMessageMeta.getAttribute('content');
            document.getElementById('complete-message').textContent = completeMessage;
        }
        
        // Initialize the countdown with the loaded configuration
        updateCountdown();
    })
    .catch(error => {
        console.error('Error loading configuration:', error);
        // Use default configuration if config file can't be loaded
        updateCountdown();
    });

// Update the countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    // Get current time
    const now = new Date().getTime();
    
    // Calculate the time remaining
    const timeRemaining = countdownDate - now;
    
    // If countdown is finished
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown-message').style.display = 'none';
        document.getElementById('complete-message').style.display = 'block';
        
        // Set all time blocks to zero
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Add leading zeros if needed
    const daysFormatted = String(days).padStart(2, '0');
    const hoursFormatted = String(hours).padStart(2, '0');
    const minutesFormatted = String(minutes).padStart(2, '0');
    const secondsFormatted = String(seconds).padStart(2, '0');
    
    // Display the countdown
    document.getElementById('days').textContent = daysFormatted;
    document.getElementById('hours').textContent = hoursFormatted;
    document.getElementById('minutes').textContent = minutesFormatted;
    document.getElementById('seconds').textContent = secondsFormatted;
}

// Add some visual effects - pulsing animation for the countdown digits
const timeElements = document.querySelectorAll('.time');
timeElements.forEach(element => {
    element.addEventListener('animationend', () => {
        element.classList.remove('pulse');
    });
});

// Pulse animation when seconds change
setInterval(() => {
    document.getElementById('seconds').classList.add('pulse');
}, 1000);

// Add this CSS for the pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);

  