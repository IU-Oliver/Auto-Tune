

const startButton = document.getElementById("play-test")
startButton.addEventListener("click", startAllSources);

function startAllSources(event) {
    const nodeList = document.querySelectorAll("audio-buffer-source-node, audio-stacker-node");

    for (const node of nodeList) {
        node.start()
    }
}

const stopButton = document.getElementById("stop-reset")
stopButton.addEventListener("click", stopAllSources);

function stopAllSources(event) {
    const nodeList = document.querySelectorAll("audio-buffer-source-node, audio-stacker-node");

    for (const node of nodeList) {
        node.stop()
    }
}



const accelPdlPosnInput = document.getElementById("accel-pdl-posn");
const trqLdInput = document.getElementById("trq-ld");
const speedInput = document.getElementById("speed");
const speedTargets = document.querySelectorAll("audio-buffer-source-node, audio-stacker-node > input[type=range]");
//const speedTargets = document.querySelectorAll("audio-buffer-source-node");

speedInput.addEventListener("input",
    () => {
        const speed = speedInput.value;
        const detune = (speed - 75) * 10;

        for (const target of speedTargets) {
            if (target.tagName === "INPUT") {
                target.value = speed;
                target.dispatchEvent(new Event('input'));
            }
            else {
                if (target.be !== undefined) target.be[0].detune.value = detune;
            }
        }

        // für den Tunnel
        globalThis.speed = speed / 500;
    },
    false
);
speedInput.addEventListener("change",
    () => {
        console.log("change");

        /*
        const speed = speedInput.value;

        if (globalThis.spdNodes) {
            spdNodes[0].detune.value = (speed - 75) * 10;
        }
        stackerSpeedChanged(speed);

        globalThis.speed = speed / 500;
        */
    },
    false
);


const carDataPlayInput = document.getElementById("autodaten-play");
const filepath = "Fahrdaten/daten.json";

async function getCarData() {
    const response = await fetch(filepath);
    globalThis.carData = await response.json();
}

carDataPlayInput.addEventListener("click", (ev) => {
    if (globalThis.carData) {
        globalThis.carData.currentIndex = 0;
        scheduler(); // kick off scheduling
    }

});

function scheduler() {
    const speed = carData[carData.currentIndex].spd;
    const trqLd = carData[carData.currentIndex].trqLd;
    const accelPdlPosn = carData[carData.currentIndex].accelPdlPosn;

    speedInput.value = speed;
    trqLdInput.value = trqLd;
    accelPdlPosnInput.value = accelPdlPosn;

    trqLdInput.dispatchEvent(new Event('input'));
    speedInput.dispatchEvent(new Event('input'));
    accelPdlPosnInput.dispatchEvent(new Event('input'));

    carData.currentIndex++;

    if (carData.currentIndex < carData.length) {
        setTimeout(scheduler, 10);
        //setTimeout(scheduler, (carData[carData.currentIndex].t - audioCtx.currentTime) * 1000);
    }
}

getCarData().then(() => { console.log("Fahrdaten geladen"); });

/*
class Counter extends EventTarget {
    constructor(initialValue = 0) {
        super();
        this.value = initialValue;
    }

    #emitChangeEvent() {
        this.dispatchEvent(new CustomEvent("valuechange", { detail: this.value }));
    }

    increment() {
        this.value++;
        this.#emitChangeEvent();
    }

    decrement() {
        this.value--;
        this.#emitChangeEvent();
    }
}
*/
