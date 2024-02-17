for (const node of document.querySelectorAll("input[data-path]")) {
    const entries = node.dataset.path.split('.');
    if (entries[0] === "this") {
        const obj = node[entries[1]];
        node.value = obj[node.name];

        node.addEventListener("input", handleEvent.bind(obj));
    } else {
        console.log("not this");
    }
}

function handleEvent(event) {
    this[event.currentTarget.name] = event.currentTarget.value;
}


const startButton = document.getElementById("play-test")
startButton.addEventListener("click", startAllSources);

function startAllSources(event) {
    const nodeList = document.querySelectorAll("audio-buffer-source-node");

    for (const node of nodeList) {
        node.start()
    }
}

const stopButton = document.getElementById("stop-reset")
stopButton.addEventListener("click", stopAllSources);

function stopAllSources(event) {
    const nodeList = document.querySelectorAll("audio-buffer-source-node");

    for (const node of nodeList) {
        node.stop()
    }
}