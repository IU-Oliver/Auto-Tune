class BeAudioContext extends HTMLElement {
    
    //static observedAttributes = ["color", "size"];

    be;

    constructor() {
        console.log("BeAudioContext()");

        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        console.log("BeAudioContext.connectedCallback()");

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

    get volume() {
        return this.be === undefined? 1 : this.be[1].gain.value;
    }
    set volume(value) {
        if (this.be === undefined) return;
        this.be[1].gain.value = value;
    }
    get detune() {
        return this.be[1].gain.value;
    }
    set detune(value) {
        this.be[0].detune.value = value;
    }

    get audioContext() {
        if (this.cash.audioContext === undefined) {
            this.cash.audioContext = this.closest("audio-context").be;
        }
        return this.cash.audioContext;
    }


    constructor() {
        console.log("BeAudioBufferSourceNode()");

        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        console.log("BeAudioBufferSourceNode.connectedCallback()");

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
        const gainNode1 = new GainNode(this.audioContext);
        const gainNode2 = new GainNode(this.audioContext);
        audioBufferSourceNode.connect(gainNode1).connect(gainNode2).connect(this.audioContext.destination);
        audioBufferSourceNode.start(time);
        return [audioBufferSourceNode, gainNode1, gainNode2];
    }
    
    
    /*
        async function setupSample(soundFileInput) {
            return await audioCtx.decodeAudioData(await soundFileInput.files[0].arrayBuffer());
        }
    
    async function setupFile(filePath, name) {
        sample = await getFile(audioCtx, filePath);
        globalThis[name] = sample;
    };
    */

}


customElements.define("audio-context", BeAudioContext);
customElements.define("audio-buffer-source-node", BeAudioBufferSourceNode);

