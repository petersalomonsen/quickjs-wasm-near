import 'https://cdn.jsdelivr.net/npm/near-api-js@0.44.2/dist/near-api-js.min.js';
import { showLoginDialog } from './near.component.js';

const networkId = (location.origin == 'https://jsinrust.near.page' ? 'mainnet' : 'testnet');
const accountPostFix = (networkId == 'testnet' ? networkId : 'near');
const contracts = [`jsinrust.${accountPostFix}`]

const LOGGED_IN_CONTRACT_NAME = 'loggedincontractname';
const nearconfig = {
    nodeUrl: `https://rpc.${networkId}.near.org`,
    archiveNodeUrl: `https://archival-rpc.${networkId}.near.org`,
    contractName: `jsinrust.${accountPostFix}`,
    walletUrl: `https://wallet.${networkId}.near.org`,
    helperUrl: `https://helper.${networkId}.near.org`,
    networkId: networkId,
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
                'JS in Rust'
            );
        } else {
            return null;
        }
    }
    return wc;
}

export function getSuggestedDepositForContract(contractbytelength) {
    return nearApi.utils.format.parseNearAmount(`${contractbytelength / 1000}`);
}

export async function deployJScontract(contractbytes, deposit = undefined, deployMethodName = 'deploy_js_contract') {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        if (deployMethodName == 'deploy_js_contract') {
            await wc.account().functionCall(nearconfig.contractName, deployMethodName, contractbytes, null, deposit);
        } else {
            await wc.account().functionCall(nearconfig.contractName, deployMethodName, {
                "bytecodebase64": await byteArrayToBase64(contractbytes)
            }, '300000000000000', deposit);
        }
    }
}

export async function initNFTContract() {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        console.log('initializing NFT contract');
        await wc.account().functionCall(nearconfig.contractName, 'new', {});
    }
}

export async function isStandaloneMode() {
    const account = (await createWalletConnection()).account();
    return (await account.findAccessKey()).accessKey.permission == 'FullAccess';
}

export async function deployStandaloneContract(wasmbytes) {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        if (await isStandaloneMode()) {
            const result = await wc.account().deployContract(wasmbytes);
            console.log(result);
        } else {
            throw('Full access key is required to deploy standalone contracts');
        }
    }
}

export async function callJSContract(contractAccount, methodName, args, deposit) {
    const wc = await checkSignedin();
    if (wc) {
        let input = Buffer.concat([Buffer.from(contractAccount), Buffer.from([0]), Buffer.from(methodName), Buffer.from([0]), Buffer.from(args)]);
        return await wc.account().functionCall(nearconfig.contractName, 'call_js_contract', input, null, deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined);
    }
}

export async function callStandaloneContract(contractAccount, methodName, args, deposit, gas) {
    const wc = await checkSignedin();
    if (wc) {        
        return await wc.account().functionCall(contractAccount, methodName, args, gas ? gas : (30n * 100_00000_00000n).toString(), deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined);
    }
}

export async function viewStandaloneContract(contractAccount, methodName, args) {
    const wc = await checkSignedin();
    if (wc) {        
        return await wc.account().viewFunction(contractAccount, methodName, args);
    }
}

export async function logout() {
    const wc = await checkSignedin();
    await wc.signOut();
    console.log('logged out');
    clearWalletConnection();
}

export async function getTargetContractName() {
    return (await createWalletConnection()).account().accountId;
}
