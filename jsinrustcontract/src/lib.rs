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

    #[payable]
    pub fn deploy_sub_contract(&mut self) {
        let signer_account = env::signer_account_id().to_string();
        let signer_account_parts = signer_account.split(".").collect::<Vec<&str>>();
        let prefix = signer_account_parts.first().unwrap();

        let account_id = prefix.to_string() + "-nft." + &env::current_account_id().to_string();
        Promise::new(account_id.parse().unwrap())
            .create_account()
            .transfer(env::attached_deposit())
            .add_full_access_key(signer_account_pk())
            .deploy_contract(CONTRACT_WASM.to_vec());
    }
}
