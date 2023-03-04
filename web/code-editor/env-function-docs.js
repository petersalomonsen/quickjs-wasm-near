export const env_function_docs = {
    "panic": {
        info: "Terminates the execution of the program with the UTF-8 encoded message.",
        detail: "(message)"
    },
    "value_return": {
        info: "Sets the string of data as the return value of the contract.",
        detail: "(data)"
    },
    "input": {
        info: "The input to the contract call as a string"
    },
    "block_timestamp_ms": {
        info: "Current block timestamp, i.e, number of non-leap-milliseconds since January 1, 1970 0:00:00 UTC."
    },
    "current_account_id": {
        info: "The id of the account that owns the current contract."
    },
    "signer_account_id": {
        info: "The id of the account that either signed the original transaction or issued the initial cross-contract call."
    },
    "verify_signed_message": {
        info: "Verify a message against the signature and the provided account who's public key is stored using the store_signing_key function",
        detail: "(message, signature, account)"
    },
    "store_signing_key": {
        info: "Store the public key of the account that signed the current transaction. Set the expiry timestamp for this public key to be used",
        detail: "(expires_timestamp_ms)"
    },
    "base64_encode": {
        info: "Base64 encode input string",
        detail: "(data)"
    },
    "sha256_utf8_to_base64": {
        info: "Calculate SHA256 sum of input string and return it as a Base64 encoded string",
        detail: "(data)"
    },
    "get_content_base64": {
        info: "get base64 encoded string of data from storage",
        detail: "(storagekey)"
    }
};