use near_sdk::{near_bindgen,base64::{encode}, env, Promise, Balance};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

const MIN_STORAGE: Balance = 1_000_000_000_000_000_000_000 +
                           395_450_000_000_000_000_000_000;

static CONTRACT_WASM: &'static [u8] = include_bytes!("contract.wasm");

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct JSInRust {

}

#[near_bindgen]
impl JSInRust {
    pub fn web4_get(&self) {
        let json_string = format!("{{ \
            \"contentType\": \"text/html; charset=UTF-8\", \
            \"body\": \"{}\"\
          }}", encode("hello"));
        env::value_return(json_string.as_bytes());
    }

    pub fn deploy_sub_contract(&mut self) {
        let signer_account = env::signer_account_id().to_string();
        let signer_account_parts = signer_account.split(".").collect::<Vec<&str>>();
        let prefix = signer_account_parts.first().unwrap();

        let account_id = prefix.to_string() + "." + &env::current_account_id().to_string();
            Promise::new(account_id.parse().unwrap())
            .create_account()
            .transfer(MIN_STORAGE)
            .deploy_contract(CONTRACT_WASM.to_vec());
    }
}