const button = document.querySelector("button");
const detune = document.getElementById("detune")

detune.addEventListener("input", (event) => {
    window.source.detune.value = event.target.value;
});

let audioCtx;

// Stereo
let channels = 2;

function init() {
    audioCtx = new AudioContext();
}

button.onclick = () => {
    if (!audioCtx) {
        init();
    }
    fetch('40 Instrumental.mp3').then(function (response) {
        console.log("response")
        console.log(response)
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.arrayBuffer();
    }).then(function (buffer) {
        console.log("buffer")
        console.log(buffer)
        return audioCtx.decodeAudioData(buffer);
    }).then(function (decodedData) {
        console.log("decodedData")
        console.log(decodedData)

        // Get an AudioBufferSourceNode.
        // This is the AudioNode to use when we want to play an AudioBuffer
        window.source = audioCtx.createBufferSource();
        source.buffer = decodedData;
        source.connect(audioCtx.destination);
        // start the source playing
        source.start();
    });

};
