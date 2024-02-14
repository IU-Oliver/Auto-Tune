//const playbackRateInput = document.getElementById("playback-rate")

let isPlaying = false;

/*
playbackRateInput.addEventListener("input",
    () => {
        source.playbackRate.value = playbackRateInput.value;
    },
    false
)
*/


/*
sounds
*/
const audioCtx = new AudioContext();

// Loading the file: fetch the audio file and decode the data
async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;

    //const soundFile = soundFileInput.files[0]
    //const arrayBuffer = await soundFile.arrayBuffer();
    //const arrayBuffer = await soundFileInput.files[0].arrayBuffer();

    //const arrayBuffer = await response.arrayBuffer();
    //const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    //return audioBuffer;
}

async function setupFile(filePath, name) {
    sample = await getFile(audioCtx, filePath);
    globalThis[name] = sample;
};

async function setupSample(soundFileInput) {
    return await audioCtx.decodeAudioData(await soundFileInput.files[0].arrayBuffer());
}

function playSample(audioContext, audioBuffer, time) {
    const audioBufferSourceNode = new AudioBufferSourceNode(audioCtx, { buffer: audioBuffer });
    audioBufferSourceNode.loop = true;
    const gainNode1 = new GainNode(audioCtx);
    const gainNode2 = new GainNode(audioCtx);
    audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(audioContext.destination);
    audioBufferSourceNode.start(time);
    return [audioBufferSourceNode, gainNode1, gainNode2];
}


/*
accelPdlPosn
*/
const accelPdlPosnOnInput = document.getElementById("accel-pdl-posn-on");
const accelPdlPosnSoundInput = document.getElementById("accel-pdl-posn-sound");
const accelPdlPosnIntensityInput = document.getElementById("accel-pdl-posn-intensity");

accelPdlPosnSoundInput.addEventListener("change", () => {
    setupSample(accelPdlPosnSoundInput).then((sample) => {
        accelPdlPosnSample = sample;
    });
});
accelPdlPosnOnInput.addEventListener("click", (ev) => {
    if (accelPdlPosnOnInput.checked == true) {
        if (audioCtx.state === "suspended") audioCtx.resume();
        if (globalThis.accelPdlPosnSample) accelPdlPosnNodes = playSample(audioCtx, accelPdlPosnSample, 0);
    } else {

    }
});
accelPdlPosnIntensityInput.addEventListener("input",
    () => {
        accelPdlPosnNodes[1].gain.value = accelPdlPosnIntensityInput.value;
    },
    false
);


/*
trqLd
*/
const trqLdOnInput = document.getElementById("trq-ld-on");
const trqLdSoundInput = document.getElementById("trq-ld-sound");
const trqLdIntensityInput = document.getElementById("trq-ld-intensity");

trqLdSoundInput.addEventListener("change", () => {
    setupSample(trqLdSoundInput).then((sample) => {
        trqLdSample = sample;
    });
});
trqLdOnInput.addEventListener("click", (ev) => {
    if (trqLdOnInput.checked == true) {
        if (audioCtx.state === "suspended") audioCtx.resume();
        if (globalThis.trqLdSample) trqLdNodes = playSample(audioCtx, trqLdSample, 0);
    } else {

    }
});
trqLdIntensityInput.addEventListener("input",
    () => {
        trqLdNodes[1].gain.value = trqLdIntensityInput.value;
    },
    false
);

/*
spd
*/
const spdOnInput = document.getElementById("spd-on");
const spdSoundInput = document.getElementById("spd-sound");
const spdIntensityInput = document.getElementById("spd-intensity");

spdSoundInput.addEventListener("change", () => {
    setupSample(spdSoundInput).then((sample) => {
        spdSample = sample;
    });

});
spdOnInput.addEventListener("click", (ev) => {
    if (spdOnInput.checked == true) {
        if (audioCtx.state === "suspended") audioCtx.resume();
        if (globalThis.spdSample) spdNodes = playSample(audioCtx, spdSample, 0);
    } else {
        if (globalThis.spdNodes) spdNodes[0].stop();
    }
});
spdIntensityInput.addEventListener("input",
    () => {
        spdNodes[1].gain.value = spdIntensityInput.value;
    },
    false
);

/*
stacker
*/
const stackerOnInput = document.getElementById("stacker-on");

setupFile("Audio/Bass.mp3", "bass");
setupFile("Audio/Beat.mp3", "beat");
setupFile("Audio/Refrain1.mp3", "refrain1");
setupFile("Audio/Refrain2.mp3", "refrain2");
setupFile("Audio/RefrainBeat.mp3", "refrainBeat");
setupFile("Audio/Stack1.mp3", "stack1");
setupFile("Audio/Stack2.mp3", "stack2");
setupFile("Audio/Stack3.mp3", "stack3");
setupFile("Audio/Stack4.mp3", "stack4");

stackerOnInput.addEventListener("click", (ev) => {
    if (stackerOnInput.checked == true) {
        if (audioCtx.state === "suspended") audioCtx.resume();

        bassNodes = playSample(audioCtx, bass, 0);
        beatNodes = playSample(audioCtx, beat, 0);
        refrain1Nodes = playSample(audioCtx, refrain1, 0);
        refrain2Nodes = playSample(audioCtx, refrain2, 0);
        refrainBeatNodes = playSample(audioCtx, refrainBeat, 0);
        stack1Nodes = playSample(audioCtx, stack1, 0);
        stack2Nodes = playSample(audioCtx, stack2, 0);
        stack3Nodes = playSample(audioCtx, stack3, 0);
        stack4Nodes = playSample(audioCtx, stack4, 0);

        bassNodes[1].gain.value = 0;
        beatNodes[1].gain.value = 0;
        refrain1Nodes[1].gain.value = 0;
        refrain2Nodes[1].gain.value = 0;
        refrainBeatNodes[1].gain.value = 0;
        stack1Nodes[1].gain.value = 0;
        stack2Nodes[1].gain.value = 0;
        stack3Nodes[1].gain.value = 0;
        stack4Nodes[1].gain.value = 0;

    } else {
        if (globalThis.bassNodes) bassNodes[0].stop();
        if (globalThis.beatNodes) beatNodes[0].stop();
        if (globalThis.refrain1Nodes) refrain1Nodes[0].stop();
        if (globalThis.refrain2Nodes) refrain2Nodes[0].stop();
        if (globalThis.refrainBeatNodes) refrainBeatNodes[0].stop();
        if (globalThis.stack1Nodes) stack1Nodes[0].stop();
        if (globalThis.stack2Nodes) stack2Nodes[0].stop();
        if (globalThis.stack3Nodes) stack3Nodes[0].stop();
        if (globalThis.stack4Nodes) stack4Nodes[0].stop();
    }
});

function stackerSpeedChanged(speed) {
    if (globalThis.refrain1Nodes) {
        var overSpeed = false;

        if (speed > 144) {
            refrain2Nodes[1].gain.value = (speed - 144) / 18;
            overSpeed = true;
        }
        else refrain2Nodes[1].gain.value = 0;
        
        if (speed > 126) {
            if (overSpeed) refrain1Nodes[1].gain.value = 1;
            else {
                refrain1Nodes[1].gain.value = (speed - 126) / 18;
                overSpeed = true;
            }
        }
        else refrain1Nodes[1].gain.value = 0;
    
        if (speed > 108) {
            if (overSpeed) refrainBeatNodes[1].gain.value = 1;
            else {
                refrainBeatNodes[1].gain.value = (speed - 108) / 18;
                overSpeed = true;
            }
        }
        else refrainBeatNodes[1].gain.value = 0;
    
        if (speed > 90) {
            if (overSpeed) stack4Nodes[1].gain.value = 1;
            else {
                stack4Nodes[1].gain.value = (speed - 90) / 18;
                overSpeed = true;
            }
        }
        else stack4Nodes[1].gain.value = 0;
    
        if (speed > 72) {
            if (overSpeed) stack3Nodes[1].gain.value = 1;
            else {
                stack3Nodes[1].gain.value = (speed - 72) / 18;
                overSpeed = true;
            }
        }
        else stack3Nodes[1].gain.value = 0;
    
        if (speed > 54) {
            if (overSpeed) stack2Nodes[1].gain.value = 1;
            else {
                stack2Nodes[1].gain.value = (speed - 54) / 18;
                overSpeed = true;
            }
        }
        else stack2Nodes[1].gain.value = 0;
    
        if (speed > 36) {
            if (overSpeed) stack1Nodes[1].gain.value = 1;
            else {
                stack1Nodes[1].gain.value = (speed - 36) / 18;
                overSpeed = true;
            }
        }
        else stack1Nodes[1].gain.value = 0;
    
        if (speed > 18) {
            if (overSpeed) bassNodes[1].gain.value = 1;
            else {
                bassNodes[1].gain.value = (speed - 18) / 18;
                overSpeed = true;
            }
        }
        else bassNodes[1].gain.value = 0;
    
        if (overSpeed) beatNodes[1].gain.value = 1;
        else beatNodes[1].gain.value = speed / 18;
    }    
}



/*
controllers
*/

const accelPdlPosnInput = document.getElementById("accel-pdl-posn");
const trqLdInput = document.getElementById("trq-ld");
const speedInput = document.getElementById("speed");

speedInput.addEventListener("input",
    () => {
        const speed = speedInput.value;

        if (globalThis.spdNodes) {
            spdNodes[0].detune.value = (speed - 75) * 10;
        }
        stackerSpeedChanged(speed);

        globalThis.speed = speed / 500;
    },
    false
);
speedInput.addEventListener("change",
    () => {
        const speed = speedInput.value;

        if (globalThis.spdNodes) {
            spdNodes[0].detune.value = (speed - 75) * 10;
        }
        stackerSpeedChanged(speed);

        globalThis.speed = speed / 500;
    },
    false
);


/*
// Why does this work? There is not any code like getElement… for the Element with ID play …?
play.addEventListener("click", (ev) => {
    console.log("play.addEventListener")
    if (isPlaying) {
        isPlaying = false;
    }
    else {
        startPlayingSounds();
    }



});
*/


function startPlayingSounds() {
    



}




/*
simulators
*/

const carDataFileInput = document.getElementById("car-data");
const carDataPlayInput = document.getElementById("autodaten-play");

carDataFileInput.addEventListener("change",
    () => {
        carDataFileInput.files[0].text()
            .then((text) => { window.carData = JSON.parse(text); });
    },
    false
);





carDataPlayInput.addEventListener("click", (ev) => {
    if (isPlaying = false) {
    
    }
    if (globalThis.carData) {
        carData.currentIndex = 0;
        scheduler(); // kick off scheduling
    }

});


function scheduler() {
    const accelPdlPosn = carData[carData.currentIndex].accelPdlPosn;
    accelPdlPosnInput.value = accelPdlPosn;
    if (globalThis.accelPdlPosnNodes) {
        
        accelPdlPosnNodes[1].gain.value = accelPdlPosn / 50;
    }
    const trqLd = carData[carData.currentIndex].trqLd;
    trqLdInput.value = trqLd;
    if (globalThis.trqLdNodes) {
        trqLdNodes[1].gain.value = trqLd / 50;
    }

    var speed = carData[carData.currentIndex].spd;
    speedInput.value = speed;

    globalThis.speed = speed / 500;


    if (globalThis.spdNodes) {
        spdNodes[0].detune.value = (speed - 75) * 10;
    }

    //speedInput.value = speed;

    stackerSpeedChanged(speed);

    carData.currentIndex++;

    if (carData.currentIndex < carData.length) {
        setTimeout(scheduler, (carData[carData.currentIndex].t - audioCtx.currentTime) * 1000);
    }
}





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
