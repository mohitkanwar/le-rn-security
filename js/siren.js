function playSiren() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    let oscillator;
    const duration = 2; // each sweep duration
    let startTime = audioCtx.currentTime;
    let endTime = startTime + duration;
    let totalDuration = 0;

    function createOscillator() {
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
    }

    function sweep() {
        if (totalDuration >= 20) { // stop after 20 seconds
            oscillator.stop();
            audioCtx.close();
            return;
        }

        createOscillator();

        oscillator.frequency.setValueAtTime(440, startTime); // 440 Hz is A4
        oscillator.frequency.linearRampToValueAtTime(880, startTime + 1); // 880 Hz is A5
        oscillator.frequency.linearRampToValueAtTime(440, endTime); // back to 440 Hz

        oscillator.start(startTime);
        oscillator.stop(endTime);

        oscillator.onended = () => {
            totalDuration += duration;
            startTime = audioCtx.currentTime;
            endTime = startTime + duration;
            sweep();
        };
    }

    sweep();
}
