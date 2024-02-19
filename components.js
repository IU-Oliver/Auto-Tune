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

    get volume() {
        return this.be === undefined? this.cash.volume : this.be[2].volume.value;
    }
    set volume(value) {
        this.cash.volume = value;
        if (this.be === undefined) return;
        this.be[2].gain.value = value;
    }
    
    get detune() {
        return this.be === undefined? this.cash.detune : this.be[0].detune.value;
    }
    set detune(value) {
        this.cash.detune = value;
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

        this.cash.gain = 1;
        this.cash.active = false;
        this.cash.detune = 1
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
        audioBufferSourceNode.detune.value = this.detune;

        const gainNode1 = new GainNode(this.audioContext);
        gainNode1.gain.value = this.cash.active? 1 : 0;

        const gainNode2 = new GainNode(this.audioContext);
        gainNode2.gain.value = this.cash.gain;

        audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(this.audioContext.destination);
        audioBufferSourceNode.start(time);
        return [audioBufferSourceNode, gainNode1, gainNode2];
    }

}


customElements.define("audio-context", BeAudioContext);
customElements.define("audio-buffer-source-node", BeAudioBufferSourceNode);

