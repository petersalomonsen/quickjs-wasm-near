import 'https://cdn.jsdelivr.net/npm/near-api-js@0.44.2/dist/near-api-js.min.js';
import { getSynthWasm } from './synth.js';
import { AudioWorkletProcessorUrl } from './audioworkletprocessor.js';

let audioworkletnode;
const contractAccount = 'apsolomo.testnet';

const nearconfig = {
    nodeUrl: 'https://rpc.testnet.near.org',
    archiveNodeUrl: 'https://archival-rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    networkId: 'testnet',
    contractName: 'dev-1650702826986-24017505724534',
    deps: {
        keyStore: null
    }
};

const walletConnection = new Promise(async resolve => {
    nearconfig.deps.keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearApi.connect(nearconfig);
    const wc = new nearApi.WalletConnection(near);
    resolve(wc);
});


async function checkSignedin() {
    const wc = await walletConnection;
    const acc = wc.account();
    if (!(await acc.connection.signer.getPublicKey(acc.accountId, acc.connection.networkId))) {
        wc.signOut();
    }

    if (!wc.isSignedIn()) {
        await wc.requestSignIn(
            nearconfig.contractName,
            'js-on-near'
        );
    }
    return wc;
}

async function callJSContract(methodName, args = '', deposit = undefined) {
    const wc = await checkSignedin();
    const input = Buffer.concat([Buffer.from(contractAccount), Buffer.from([0]), Buffer.from(methodName), Buffer.from([0]), Buffer.from(JSON.stringify(args))]);
    const result = await wc.account().functionCall(nearconfig.contractName, 'call_js_contract', input, undefined, deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined);
    return result.status.SuccessValue ? atob(result.status.SuccessValue) : ''
}

async function viewJSContract(methodName, args = '') {
    const wc = await checkSignedin();
    const input = Buffer.concat([Buffer.from(contractAccount), Buffer.from([0]), Buffer.from(methodName), Buffer.from([0]), Buffer.from(JSON.stringify(args))]);
    const result = await wc._near.connection.provider.query({
        request_type: "call_function",
        account_id: nearconfig.contractName,
        method_name: 'view_js_contract',
        args_base64: btoa(input),
        finality: "optimistic"
    });
    const resultvalue = result.result.map(c => String.fromCharCode(c)).join('');
    return resultvalue;
}

let musicPlaying = false;
async function playMusic() {
    if (musicPlaying) {
        return;
    }
    musicPlaying = true;
    const audioctx = new AudioContext();
    audioctx.resume();

    const wasmsynth = await getSynthWasm();

    await audioctx.audioWorklet.addModule(AudioWorkletProcessorUrl);
    audioworkletnode = new AudioWorkletNode(audioctx, 'asc-midisynth-audio-worklet-processor', {
        outputChannelCount: [2]
    });
    audioworkletnode.port.start();

    audioworkletnode.port.postMessage({
        samplerate: audioctx.sampleRate,
        wasm: wasmsynth
    });
    
    audioworkletnode.connect(audioctx.destination);
}

customElements.define('close-protocol', class CloseProtocolComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.init();
    }

    async init() {
        this.shadowRoot.innerHTML = await fetch(new URL('closeprotocol.component.html', import.meta.url)).then(r => r.text());
        this.enterbutton = this.shadowRoot.getElementById('enterbutton');
        this.imagediv = this.shadowRoot.getElementById('imagediv');

        this.enterbutton.addEventListener('click', async () => {
            this.enterbutton.style.display = 'none';

            this.setInfoText('Creating new game');
            await callJSContract('newgame', '', '0.1');
            await this.updateGameState();
        });
        this.imagediv.addEventListener('click', async (e) => {
            const x = Math.floor(e.offsetX * 3 / this.imagediv.clientWidth);
            const y = Math.floor(e.offsetY * 3 / this.imagediv.clientHeight);
            this.setInfoText('Trying to find key');
            await callJSContract('try_find_key', { x, y });
            await this.updateGameState();
        });
        
        await checkSignedin();
        await this.updateGameState();
    }

    setInfoText(txt = '') {
        this.shadowRoot.querySelector('#infotext').innerHTML = txt;
    }

    async updateGameState() {
        this.walletConnection = await checkSignedin();
        const gamestatejson = await viewJSContract('view_game_state',
            { "account_id": this.walletConnection.account().accountId }
        );
        if (gamestatejson) {
            const gamestate = JSON.parse(gamestatejson);
            const currentStep = gamestate.reduce((prev, curr, ndx) => curr.keyFound ? ndx + 1 : prev, 0);
            const gameStateObj = gamestate[currentStep];
            const imageElement = new Image();
            imageElement.src = gameStateObj.image;

            console.log(imageElement.src);
            this.imagediv.replaceChildren(imageElement);
            this.enterbutton.style.display = 'block';
            this.setInfoText(`Click on the image and try to find the next key. You have made ${gameStateObj.attempts} attempts.`);

            audioworkletnode.port.postMessage({
                sequencedata: gamestate.filter(m => m.music).map(m => m.music.eventlistuncompressed).flat().sort((a,b) => a.time - b.time)
            });
        }
    }
});

window.enterCloseProtocol = () => {
    playMusic();
    document.body.innerHTML = '<close-protocol></close-protocol>';
}