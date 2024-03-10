class Be extends HTMLElement {
    be;

    camelCaseToDelimitedString(string, delimiter = '-') {
        return string.replace(/([a-z0-9]|(?<!^)(?=[A-Z]))([A-Z])/g, '$1'+delimiter+'$2').toLowerCase();
    }

    delimitedStringToCamelCase(string, delimiter = '-') {
        return string.replace(new RegExp(delimiter + '([a-z])', 'g'), (m, c) => c.toUpperCase());
    }

}

class BaseAudioContext extends Be {

    connectedCallback() {
        //if (this.be === undefined) this.be = new AudioContext();
    }

    disconnectedCallback() {
        console.log("BeAudioContext.disconnectedCallback()");
    }

    adoptedCallback() {
        console.log("BeAudioContext.adoptedCallback()");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`BeAudioContext.attributeChangedCallback(${name}, ${oldValue}, ${newValue})`);
    }
}

class BeAudioContext extends BaseAudioContext {

    be = new AudioContext();
    get destination() { return this.be.destination; }
    
}

class BeAudioNode extends Be {

    cash = {};

    get context() { return this.be.contexct; }
    get numberOfInputs() { return this.be.numberOfInputs; }
    get numberOfOutputs() { return this.be.numberOfOutputs; }
    get channelCount() { return this.be.channelCount; }
    set channelCount(v) { this.be.channelCount = v; }
    get channelCountMode() { return this.be.channelCountMode; }
    set channelCountMode(v) { this.be.channelCountMode = v; }
    get channelInterpretation() { return this.be.channelInterpretation; }
    set channelInterpretation(v) { this.be.channelInterpretation = v; }

    get audioContext() {
        if (this.cash.audioContext === undefined) {
            this.cash.audioContext = this.closest("audio-context").be;
        }
        return this.cash.audioContext;
    }
    get destinations() {
        //if (this.attributes.destination) element = this.querySelector(this.attributes.destination.value);
        if (this.attributes.destinations) {
            const dests = this.attributes.destinations.value;
            return dests? document.querySelectorAll(this.attributes.destinations.value) : [];
        }
        return this.nextElementSibling ? [ this.nextElementSibling ] : [ this.parentElement ];
        //return elements;
    }

    constructor() {
        super();

        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    init() { this.connect(this.destinations); }

    connect(destinations, outputIndex, inputIndex) {
        for (var destination of destinations) {
            destination = destination.nodeName === "AUDIO-CONTEXT" ? destination.destination : destination.be;
            this.be.connect(destination, outputIndex, inputIndex);
        }
        
    }
    disconnect() {
        this.be.disconnect();
    }

    connectedCallback() {
        //super.connectedCallback();
        console.log("BeAudioContext.connectedCallback()");
    }

}

class BeAudioDestinationNode extends BeAudioNode {
    //get be() { return this.audioContext.destination; }

    connectedCallback() {
        this.be = this.audioContext.destination;
    }
}

class BeBiquadFilterNode extends BeAudioNode {
    static observedAttributes = ["frequency", "detune", "q", "gain", "type"];

    options = {};

    get frequency() {
        return this.be ? this.be.frequency.value : this.options.frequency;
    }
    set frequency(v) {
        this.options.frequency = v;
        if (this.be) this.be.frequency.value = v;
    }
    get detune() {
        return this.be ? this.be.detune.value : this.options.detune;
    }
    set detune(v) {
        this.options.detune = v;
        if (this.be) this.be.detune.value = v;
    }
    get q() {
        return this.be ? this.be.Q.value : this.options.Q;
    }
    set q(v) {
        this.options.Q = v;
        if (this.be) this.be.Q.value = v;
    }
    get gain() {
        return this.be ? this.be.gain.value : this.options.gain;
    }
    set gain(v) {
        this.options.gain = v;
        if (this.be) this.be.gain.value = v;
    }
    get type() {
        return this.be ? this.be.type : this.options.type;
    }
    set type(v) {
        this.options.type = v;
        if (this.be) this.be.type = v;
    }

    connectedCallback() {
        this.be = new BiquadFilterNode(this.audioContext, this.options);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`BeAudioContext.attributeChangedCallback(${name}, ${oldValue}, ${newValue})`);
        this[name] = newValue;
    }
}

class BeAnalyserNode extends BeAudioNode {
    static observedAttributes = ["fft-size", "min-decibels", "max-decibels", "smoothing-time-constant"];

    options = {};

    get fftSize() {
        return this.be ? this.be.fftSize : this.options.fftSize;
    }
    set fftSize(v) {
        this.options.fftSize = v;
        if (this.be) this.be.fftSize = v;
    }
    get frequencyBinCount() {
        return this.be.frequencyBinCount;
    }
    get minDecibels() {
        return this.be ? this.be.minDecibels : this.options.minDecibels;
    }
    set minDecibels(v) {
        this.options.minDecibels = v;
        if (this.be) this.be.minDecibels = v;
    }
    get maxDecibels() {
        return this.be ? this.be.maxDecibels : this.options.maxDecibels;
    }
    set maxDecibels(v) {
        this.options.maxDecibels = v;
        if (this.be) this.be.maxDecibels = v;
    }
    get smoothingTimeConstant() {
        return this.be ? this.be.smoothingTimeConstant : this.options.smoothingTimeConstant;
    }
    set smoothingTimeConstant(v) {
        this.options.smoothingTimeConstant = v;
        if (this.be) this.be.smoothingTimeConstant = v;
    }

    connectedCallback() {
        this.be = new AnalyserNode(this.audioContext, this.options);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`BeAudioContext.attributeChangedCallback(${name}, ${oldValue}, ${newValue})`);
        this[this.delimitedStringToCamelCase(name)] = newValue;
    }
}

class BeChannelMergerNode extends BeAudioNode {
    connectedCallback() {
        const numberOfInputs = this.attributes["number-of-inputs"] ? this.attributes["number-of-inputs"].value : 6;
        const options = { numberOfInputs: numberOfInputs };
        this.be = new ChannelMergerNode(this.audioContext, options);
    }
}

class BeChannelSplitterNode extends BeAudioNode {
    connectedCallback() {
        const numberOfOutputs = this.attributes["number-of-outputs"] ? this.attributes["number-of-outputs"].value : 6;
        const options = { numberOfOutputs: numberOfOutputs };
        this.be = new ChannelMergerNode(this.audioContext, options)
    }
}


class BeGainNode extends BeAudioNode {

    get gain() {
        return this.be === undefined ? this.cash.gain : this.be.gain.value;
    }
    set gain(v) {
        this.cash.gain = v;
        if (this.be === undefined) return;
        this.be.gain.value = v;
    }


    constructor() {
        super();
        this.cash.gain = 1;
    }

    init() {
        if (this.attributes.gain) this.gain = parseInt(this.attributes.gain.value);
        super.init();
        //this.connect(this.destination);
    }

    connectedCallback() {
        this.be = new GainNode(this.audioContext);
        this.be.gain.value = this.cash.gain;
    }
}

class BeAudioBufferSourceNode extends BeAudioNode {
    get detune() {
        return this.be === undefined ? this.cash.tune : this.be.detune.value;
    }
    set detune(value) {
        this.cash.detune = value;
        if (this.be === undefined) return;
        this.be.detune.value = value;
    }

    constructor() {
        super();

        this.cash.active = false;
        this.cash.detune = 1;
    }

    connectedCallback() {
        this.setup();
        //this.createShadow();
    }

    init() { }

    createShadow() {
        // Create a shadow root
        // The custom element itself is the shadow host
        const shadow = this.attachShadow({ mode: "open" });
        
        // create the internal implementation
        const detuneElement = document.createElement("input");
        detuneElement.setAttribute("data-path", "this.parentNode");
        detuneElement.setAttribute("name", "detune");
        detuneElement.setAttribute("type", "range");
        detuneElement.setAttribute("list", "detune-buffer-datalist");
        detuneElement.setAttribute("min", "-2400");
        detuneElement.setAttribute("max", "2400");
        detuneElement.setAttribute("value", "0");
        detuneElement.setAttribute("step", "0.01");
        detuneElement.setAttribute("name", "detune");

        shadow.appendChild(detuneElement);
    }

    setup() {
        this.setupSample().then((audioBuffer) => {
            this.audioBuffer = audioBuffer;
        });
    }
    async setupSample() {
        //const audioBuffer = await this.getFile(this.attributes.src.value);
        return await this.getFile(this.attributes.src.value);
        //return audioBuffer;
    }
    async getFile(filepath) {
        const response = await fetch(filepath);
        return await this.audioContext.decodeAudioData(await response.arrayBuffer());
    }

    start() {
        this.startSample(0);
    }
    stop() {
        if (this.be) this.be.stop();
    }

    startSample(time) {
        this.be = new AudioBufferSourceNode(this.audioContext, { buffer: this.audioBuffer });
        this.be.loop = true;
        this.be.detune.value = this.cash.detune;

        this.connect(this.destinations);

        this.be.start(time);


        /*
        
                const audioBufferSourceNode = new AudioBufferSourceNode(this.audioContext, { buffer: this.audioBuffer });
                audioBufferSourceNode.loop = true;
                audioBufferSourceNode.detune.value = this.cash.tune;
        
                const gainNode1 = new GainNode(this.audioContext);
                gainNode1.gain.value = this.cash.active? 1 : 0;
        
                const gainNode2 = new GainNode(this.audioContext);
                gainNode2.gain.value = this.cash.intensity;
        
                audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(this.audioContext.destination);
                audioBufferSourceNode.start(time);
                return [audioBufferSourceNode, gainNode1, gainNode2];
                */
    }
}
/*
class BeAudioBufferSourceNode2 extends BeAudioNode {
    static observedAttributes = ["src"];

    audioBuffer;

    get active() {
        return this.be === undefined? this.cash.active : this.be[1].gain.value === 1? true : false;
    }
    set active(value) {
        this.cash.active = value;
        if (this.be === undefined) return;
        this.be[1].gain.value = this.cash.active = value? 1 : 0;
    }

    get intensity() {
        return this.be === undefined? this.cash.intensity : this.be[2].volume.value;
    }
    set intensity(value) {
        this.cash.intensity = value;
        if (this.be === undefined) return;
        this.be[2].gain.value = value;
    }

    get tune() {
        return this.be === undefined? this.cash.tune : this.be[0].detune.value;
    }
    set tune(value) {
        this.cash.tune = value;
        if (this.be === undefined) return;
        this.be[0].detune.value = value;
    }

    constructor() {
        super();

        this.cash.active = false;
        this.cash.intensity = 0;
        this.cash.tune = 1;
    }

    connectedCallback() {
        this.setup();
    }

    disconnectedCallback() {
        console.log("BeAudioBufferSourceNode.disconnectedCallback()");
    }

    adoptedCallback() {
        console.log("BeAudioBufferSourceNode.adoptedCallback()");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`BeAudioBufferSourceNode.attributeChangedCallback(${name}, ${oldValue}, ${newValue})`);
    }


    setup() {
        this.setupSample().then((audioBuffer) => {
            this.audioBuffer = audioBuffer;
        });
    }

    start() {
        this.be = this.startSample(0);
    }

    stop() {
        if (this.be) this.be.stop();
    }

    async getFile(filepath) {
        const response = await fetch(filepath);
        return await this.audioContext.decodeAudioData(await response.arrayBuffer());
    }

    async setupSample() {
        //const audioBuffer = await this.getFile(this.attributes.src.value);
        return await this.getFile(this.attributes.src.value);
        //return audioBuffer;
    }

    startSample(time) {
        const audioBufferSourceNode = new AudioBufferSourceNode(this.audioContext, { buffer: this.audioBuffer });
        audioBufferSourceNode.loop = true;
        audioBufferSourceNode.detune.value = this.cash.tune;

        const gainNode1 = new GainNode(this.audioContext);
        gainNode1.gain.value = this.cash.active? 1 : 0;

        const gainNode2 = new GainNode(this.audioContext);
        gainNode2.gain.value = this.cash.intensity;

        audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(this.audioContext.destination);
        audioBufferSourceNode.start(time);
        return [audioBufferSourceNode, gainNode1, gainNode2];
    }

}
*/
class BeAudioStackerNode extends HTMLElement {
    //static observedAttributes = ["src"];

    be;
    cash = {};
    audioBuffers = {};

    sounds = [
        ["bassNodes", "Audio/Bass.mp3"],
        ["beatNodes", "Audio/Beat.mp3"],
        ["refrain1Nodes", "Audio/Refrain1.mp3"],
        ["refrain2Nodes", "Audio/Refrain2.mp3"],
        ["refrainBeatNodes", "Audio/RefrainBeat.mp3"],
        ["stack1Nodes", "Audio/Stack1.mp3"],
        ["stack2Nodes", "Audio/Stack2.mp3"],
        ["stack3Nodes", "Audio/Stack3.mp3"],
        ["stack4Nodes", "Audio/Stack4.mp3"]
    ];

    get active() {
        return this.cash.active;
    }
    set active(value) {
        this.cash.active = value;
        if (this.be === undefined) return;
        value = value ? 1 : 0;

        for (const sound of this.sounds) {
            this.be[sound[0]][2].gain.value = value;
        }
    }

    get intensity() {
        return this.cash.intensity;
    }
    set intensity(value) {
        this.cash.intensity = value;
        if (this.be === undefined) return;
        this.speedChanged(value);
    }


    get audioContext() {
        if (this.cash.audioContext === undefined) {
            this.cash.audioContext = this.closest("audio-context").be;
        }
        return this.cash.audioContext;
    }

    constructor() {
        super();

        this.cash.active = false;
        this.cash.intensity = 1;
        this.cash.tune = 1;

        document.addEventListener("DOMContentLoaded", this.init.bind(this));
    }

    connectedCallback() {
        this.setup();
    }

    init() { this.filterNode = document.querySelector("biquad-filter-node").be; }

    setup() {
        for (const sound of this.sounds) {
            this.setupSample(sound[1]).then((audioBuffer) => {
                this.audioBuffers[sound[0]] = audioBuffer;
            });
        }
    }

    start() {
        this.be = {};
        for (const sound of this.sounds) {
            this.be[sound[0]] = this.startSample(this.audioBuffers[sound[0]], 0);
            this.be[sound[0]][1].gain.value = 0;
        }
    }

    stop() {
        for (const sound of this.sounds) {
            if (this.be[sound[0]]) this.be[sound[0]][0].stop();
        }
    }


    async getFile(filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    async setupSample(filepath) {
        const audioBuffer = await this.getFile(filepath);
        return audioBuffer;
    }

    startSample(audioBuffer, time) {
        const audioBufferSourceNode = new AudioBufferSourceNode(this.audioContext, { buffer: audioBuffer });
        audioBufferSourceNode.loop = true;
        audioBufferSourceNode.detune.value = this.cash.tune;

        const gainNode1 = new GainNode(this.audioContext);
        gainNode1.gain.value = 0;

        const gainNode2 = new GainNode(this.audioContext);
        gainNode2.gain.value = this.cash.active;

        audioBufferSourceNode.connect(gainNode1).connect(gainNode2);
        gainNode2.connect(this.audioContext.destination);
        gainNode2.connect(this.filterNode);
        audioBufferSourceNode.start(time);
        return [audioBufferSourceNode, gainNode1, gainNode2];
    }

    speedChanged(speed) {
        if (this.be.refrain1Nodes !== undefined) {
            var overSpeed = false;

            if (speed > 144) {
                this.be.refrain2Nodes[1].gain.value = (speed - 144) / 18;
                overSpeed = true;
            }
            else this.be.refrain2Nodes[1].gain.value = 0;

            if (speed > 126) {
                if (overSpeed) this.be.refrain1Nodes[1].gain.value = 1;
                else {
                    this.be.refrain1Nodes[1].gain.value = (speed - 126) / 18;
                    overSpeed = true;
                }
            }
            else this.be.refrain1Nodes[1].gain.value = 0;

            if (speed > 108) {
                if (overSpeed) this.be.refrainBeatNodes[1].gain.value = 1;
                else {
                    this.be.refrainBeatNodes[1].gain.value = (speed - 108) / 18;
                    overSpeed = true;
                }
            }
            else this.be.refrainBeatNodes[1].gain.value = 0;

            if (speed > 90) {
                if (overSpeed) this.be.stack4Nodes[1].gain.value = 1;
                else {
                    this.be.stack4Nodes[1].gain.value = (speed - 90) / 18;
                    this.be.overSpeed = true;
                }
            }
            else this.be.stack4Nodes[1].gain.value = 0;

            if (speed > 72) {
                if (overSpeed) this.be.stack3Nodes[1].gain.value = 1;
                else {
                    this.be.stack3Nodes[1].gain.value = (speed - 72) / 18;
                    overSpeed = true;
                }
            }
            else this.be.stack3Nodes[1].gain.value = 0;

            if (speed > 54) {
                if (overSpeed) this.be.stack2Nodes[1].gain.value = 1;
                else {
                    this.be.stack2Nodes[1].gain.value = (speed - 54) / 18;
                    overSpeed = true;
                }
            }
            else this.be.stack2Nodes[1].gain.value = 0;

            if (speed > 36) {
                if (overSpeed) this.be.stack1Nodes[1].gain.value = 1;
                else {
                    this.be.stack1Nodes[1].gain.value = (speed - 36) / 18;
                    overSpeed = true;
                }
            }
            else this.be.stack1Nodes[1].gain.value = 0;

            if (speed > 18) {
                if (overSpeed) this.be.bassNodes[1].gain.value = 1;
                else {
                    this.be.bassNodes[1].gain.value = (speed - 18) / 18;
                    overSpeed = true;
                }
            }
            else this.be.bassNodes[1].gain.value = 0;

            if (overSpeed) this.be.beatNodes[1].gain.value = 1;
            else this.be.beatNodes[1].gain.value = speed / 18;
        }
    }
}

customElements.define("audio-context", BeAudioContext);
customElements.define("audio-destination-node", BeAudioDestinationNode);
customElements.define("audio-buffer-source-node", BeAudioBufferSourceNode);
customElements.define("gain-node", BeGainNode);
customElements.define("channel-merger-node", BeChannelMergerNode);
customElements.define("biquad-filter-node", BeBiquadFilterNode);
customElements.define("analyser-node", BeAnalyserNode);

customElements.define("audio-stacker-node", BeAudioStackerNode);
