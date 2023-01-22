use std::str::FromStr;

use near_sdk::PublicKey;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env::signer_account_pk;
use near_sdk::{base64::encode, env, near_bindgen, Promise};

static CONTRACT_WASM: &'static [u8] = include_bytes!("../../web/near/nft.wasm");

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct JSInRust {}

#[near_bindgen]
impl JSInRust {
    pub fn web4_get(&self) {
        let json_string = format!(
            "{{ \
            \"contentType\": \"text/html; charset=UTF-8\", \
            \"body\": \"{}\"\
          }}",
            encode("JS in Rust coming soon")
        );
        env::value_return(json_string.as_bytes());
    }

    fn target_account_id(&mut self) -> String {
        let signer_account = env::signer_account_id().to_string();
        let signer_account_parts = signer_account.split(".").collect::<Vec<&str>>();
        let prefix = signer_account_parts.first().unwrap();

        return prefix.to_string() + "-nft." + &env::current_account_id().to_string();
    }

    #[payable]
    pub fn deploy_sub_contract(&mut self, full_access_key: String) -> Promise {
        let target_account_id = self.target_account_id();
        return Promise::new(target_account_id.parse().unwrap())
            .create_account()
            .transfer(env::attached_deposit())
            .add_full_access_key(PublicKey::from_str(full_access_key.as_str()).unwrap())
            .deploy_contract(CONTRACT_WASM.to_vec())
            .function_call("new".to_string(), vec![], 0, near_sdk::Gas(30000000000000));
    }

    pub fn post_quickjs_bytecode(&mut self) -> Promise {
        let target_account_id = self.target_account_id();
        return Promise::new(target_account_id.parse().unwrap()).function_call(
            "post_quickjs_bytecode".to_string(),
            env::input().unwrap(),
            env::attached_deposit(),
            near_sdk::Gas(30000000000000),
        );
    }
}
