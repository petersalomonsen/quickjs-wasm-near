import { rename } from 'fs/promises';
import { existsSync } from 'fs';
import { KeyPair, Near, keyStores } from 'near-api-js';

const testAccountFileName = 'testnet/testaccount.json';
if (existsSync(testAccountFileName)) {
    process.exit(0);
}

const keyStore = new keyStores.UnencryptedFileSystemKeyStore('.');
const networkId = 'testnet';
const near = new Near({ networkId, keyStore, nodeUrl: 'https://rpc.testnet.near.org', helperUrl: 'https://helper.testnet.near.org' });

const randomNumber = Math.floor(Math.random() * (99999999999999 - 10000000000000) + 10000000000000);

const accountId = `dev-${Date.now()}-${randomNumber}`;
const keyPair = await KeyPair.fromRandom('ed25519');
await near.accountCreator.createAccount(accountId, keyPair.publicKey);
await keyStore.setKey(networkId, accountId, keyPair);
await rename(`testnet/${accountId}.json`, testAccountFileName);