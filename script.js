// Get the canvas and context
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Set canvas size to match its display size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Access the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // Size of the FFT for frequency data
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            requestAnimationFrame(draw); // Continuously update the visualization

            analyser.getByteFrequencyData(dataArray); // Get frequency data

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] * 2; // Scale height
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`; // Color based on height
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth + 1; // Space between bars
            }
        }

        draw(); // Start the visualization
    })
    .catch(err => console.error('Error accessing microphone:', err));