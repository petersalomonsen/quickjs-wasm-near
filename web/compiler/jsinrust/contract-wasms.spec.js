import { getJSEnvProperties } from "./contract-wasms.js";

describe('contract-wasms', () => {
    it('should get built-in properties of NFT contract', async () => {
        const properties = await getJSEnvProperties('nft');
        expect(properties).to.include.members(["panic","value_return","input","block_timestamp_ms","current_account_id",
            "signer_account_id","verify_signed_message","store_signing_key","base64_encode",
            "sha256_utf8_to_base64","get_content_base64","contract_owner","nft_token","nft_supply_for_owner","nft_tokens"]);
    }, 10000);

    it('should get built-in properties of minimum-web4 contract', async () => {
        const properties = await getJSEnvProperties('minimum-web4');
        expect(properties).to.include.members(["panic",
                    "value_return",
                    "input",
                    "block_timestamp_ms",
                    "current_account_id",
                    "signer_account_id",
                    "verify_signed_message",
                    "store_signing_key",
                    "base64_encode",
                    "sha256_utf8_to_base64",
                    "get_content_base64"]);
    }, 10000);
});