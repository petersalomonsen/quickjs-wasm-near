import 'https://cdn.jsdelivr.net/npm/near-api-js@0.44.2/dist/near-api-js.min.js';
import { showLoginDialog } from './near.component.js';

const LOGGED_IN_CONTRACT_NAME = 'loggedincontractname';
const contracts = ['dev-1650702826986-24017505724534', 'jsvm.testnet'];
const nearconfig = {
    nodeUrl: 'https://rpc.testnet.near.org',
    archiveNodeUrl: 'https://archival-rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    networkId: 'testnet',
    deps: {
        keyStore: null
    }
};
let walletConnection;

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export function getNearConfig() {
    return nearconfig;
}

export async function byteArrayToBase64(data) {
    return await new Promise(r => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result.split('base64,')[1]);
        fr.readAsDataURL(new Blob([data]));
    });
}

export function createWalletConnection() {
    if (walletConnection) {
        return walletConnection;
    }
    walletConnection = new Promise(async resolve => {
        nearconfig.deps.keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
        nearconfig.contractName = localStorage.getItem(LOGGED_IN_CONTRACT_NAME);
        const near = await nearApi.connect(nearconfig);
        const wc = new nearApi.WalletConnection(near);
        resolve(wc);
    });
    return walletConnection;
}

export function clearWalletConnection() {
    walletConnection = null;
}

export async function checkSignedin() {
    const wc = await createWalletConnection();
    const acc = wc.account();

    if (!(await acc.connection.signer.getPublicKey(acc.accountId, acc.connection.networkId))
        || !nearconfig.contractName
    ) {
        wc.signOut();
    }

    if (!wc.isSignedIn()) {
        const contractname = await showLoginDialog(contracts);
        if (contractname) {
            localStorage.setItem(LOGGED_IN_CONTRACT_NAME, contractname);
            await wc.requestSignIn(
                contractname,
                'near-javascript'
            );
        } else {
            return null;
        }
    }
    return wc;
}

export async function deployJScontract(contractbytes) {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        await wc.account().functionCall(nearconfig.contractName, 'deploy_js_contract',
            contractbytes
            , null, nearApi.utils.format.parseNearAmount(`${contractbytes.length / 1000}`)
        );
    }
}

export async function callJSContract(contractAccount, methodName, args, deposit) {
    const wc = await checkSignedin();
    if (wc) {
        let input = Buffer.concat([Buffer.from(contractAccount), Buffer.from([0]), Buffer.from(methodName), Buffer.from([0]), Buffer.from(args)]);
        return await wc.account().functionCall(nearconfig.contractName, 'call_js_contract', input, null, deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined);
    }
}

export async function logout() {
    const wc = await checkSignedin();
    wc.signOut();
}
