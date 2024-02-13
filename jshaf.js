if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    // List cameras and microphones.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
            console.log("device")
            console.log(device)
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }




/*

soundFileInput.addEventListener("change",
    () => {
        let isPlaying = false;

        setupSample().then((sample) => {
            
            //loadingEl.style.display = "none";
            
            dtmf = sample; // to be used in our playSample function

            play.addEventListener("click", (ev) => {
                isPlaying = !isPlaying;

                if (isPlaying) {
                    // Start playing

                    // Check if context is in suspended state (autoplay policy)
                    if (audioCtx.state === "suspended") {
                        audioCtx.resume();
                    }

                    //currentNote = 0;
                    //nextNoteTime = audioCtx.currentTime;

                    carData.currentIndex = 0

                    window.source = playSample(audioCtx, dtmf, 0);
                    scheduler(); // kick off scheduling
                    //requestAnimationFrame(draw); // start the drawing loop.
                    //ev.target.dataset.playing = "true";
                } else {
                    //window.clearTimeout(timerID);
                    //ev.target.dataset.playing = "false";
                }
            });
        });

    },
    false
)

function playSample(audioContext, audioBuffer, time) {
    const sampleSource = new AudioBufferSourceNode(audioCtx, {
        buffer: audioBuffer
    });
    sampleSource.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource;
}
async function setupSample() {
    const soundFile = soundFileInput.files[0]
    const arrayBuffer = await soundFile.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

function scheduler() {
    const speed = carData[carData.currentIndex].spd
    window.source.detune.value = (speed - 75) * 10
    //window.source.playbackRate.value = speed / 100

    carData.currentIndex++



    // console.log("audioCtx.currentTime")
    // console.log(audioCtx.currentTime)
    // console.log("carData[carData.currentIndex].t")
    // console.log(carData[carData.currentIndex].t)

    // console.log("(carData[carData.currentIndex].t - audioCtx.currentTime) * 1000")
    // console.log((carData[carData.currentIndex].t - audioCtx.currentTime) * 1000)



    if (carData.currentIndex < carData.length) {
        setTimeout(scheduler, (carData[carData.currentIndex].t - audioCtx.currentTime) * 1000);
    }
}







*/
