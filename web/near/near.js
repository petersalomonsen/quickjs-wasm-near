import 'https://cdn.jsdelivr.net/npm/near-api-js@0.44.2/dist/near-api-js.min.js';

import { showLoginDialog } from './near.component.js';

const networkId = 'mainnet';
const accountPostFix = networkId == 'testnet' ? networkId : 'near';
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
        await wc.requestSignIn(
            nearconfig.contractName,
            'JS in Rust'
        );
    }
    return wc;
}

export function getSuggestedDepositForContract(contractbytelength) {
    return nearApi.utils.format.parseNearAmount(`${contractbytelength / 1000}`);
}

export async function deployJScontract(contractbytes, deposit = undefined, deployMethodName = 'deploy_js_contract') {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        await wc.account().functionCall(nearconfig.contractName, deployMethodName, {
            "bytecodebase64": await byteArrayToBase64(contractbytes)
        }, '300000000000000', deposit);
    }
}

export async function initNFTContract() {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        console.log('initializing NFT contract');
        await wc.account().functionCall(nearconfig.contractName, 'new', {});
    }
}

export async function deployStandaloneContract(wasmbytes) {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        const acc = wc.account();
        const minimumStorageDeposit = BigInt(1_000_000_000_000_000_000_000_000 + wasmbytes.length * 10_000_000_000_000_000_000);
        const result = await wc.account().functionCall(nearconfig.contractName, 'deploy_sub_contract', 
            {full_access_key: (await acc.connection.signer.getPublicKey(acc.accountId, acc.connection.networkId)).toString()},
            300000000000000,
            minimumStorageDeposit);
        console.log(result);
    }
}

export async function deleteSubContract() {
    const wc = await createWalletConnection();
    if (await checkSignedin()) {
        
        const nearConnection = await nearApi.connect(nearconfig);
        
        const accountPrefix = wc.account().accountId.substring(0,wc.account().accountId.lastIndexOf(nearconfig.accountPostFix)-1);

        const account = await nearConnection.account(`${accountPrefix}-nft.${nearconfig.contractName}`);
        const keypair =  await wc.account().connection.signer.keyStore.getKey(nearconfig.networkId, wc.account().accountId);
        
        await account.connection.signer.keyStore.setKey(nearconfig.networkId, account.accountId, keypair);

        const result = await account.deleteAccount(await wc.account().accountId);
        console.log(result);
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
        return await wc.account().functionCall(nearconfig.contractName, methodName, args, gas ? gas : (30n * 100_00000_00000n).toString(), deposit ? nearApi.utils.format.parseNearAmount(deposit) : undefined);
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

