function resizeCalculator() {
    const calculator = document.getElementById('calculator');
    const maxWidth = window.innerWidth / 77; // Scale based on viewport width
    const maxHeight = window.innerHeight / 111; // Scale based on viewport height

    // Use the smaller scale to maintain the aspect ratio
    const scale = Math.min(maxWidth, maxHeight);

    // Apply the scale dynamically
    calculator.style.transform = `scale(${scale})`;
}

// Run on load
window.addEventListener('load', resizeCalculator);

// Run on viewport resize
window.addEventListener('resize', resizeCalculator);
