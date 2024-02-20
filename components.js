class BeAudioContext extends HTMLElement {
    
    //static observedAttributes = ["color", "size"];

    be;

    connectedCallback() {
        if (this.be === undefined) this.be = new AudioContext();
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

class BeAudioBufferSourceNode extends HTMLElement {
    static observedAttributes = ["src"];

    be;
    cash = {};
    audioBuffer;

    get active() {
        return this.be === undefined? this.cash.active : this.be[2].gain.value === 1? true : false;
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
        if (this.be) this.be[0].stop();
    }

    async getFile(filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    async setupSample() {
        const audioBuffer = await this.getFile(this.attributes.src.value);
        return audioBuffer;
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
        value = value? 1 : 0;

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
    }

    connectedCallback() {
        this.setup();
    }

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
        gainNode1.gain.value = this.cash.active;

        const gainNode2 = new GainNode(this.audioContext);
        gainNode2.gain.value = 0;

        audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(this.audioContext.destination);
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
customElements.define("audio-buffer-source-node", BeAudioBufferSourceNode);
customElements.define("audio-stacker-node", BeAudioStackerNode);
