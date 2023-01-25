use std::str::FromStr;
mod web4;
use near_sdk::PublicKey;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, Promise};
use web4::{Web4Request,Web4Response};

static CONTRACT_WASM: &'static [u8] = include_bytes!("../../web/near/nft.wasm");

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct JSInRust {}

#[near_bindgen]
impl JSInRust {
    pub fn web4_get(&self, request: Web4Request) -> Web4Response {
        return match request.path.as_str() {
            "/serviceworker.js" => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreib7supsnm6kre7yk7r7suxsjlq6etqce4zid37idjz2jsxjvmipsm?filename=serviceworker.js".to_string()) },
            "/app.beda6f7c.js" => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreiarci7zzae5seudpm5aih5spvanomebikxkbcwtobn7vwxozib2z4?filename=app.beda6f7c.js".to_string()) },
            _ => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreicdmfmpx32gvppz5idwdkbsscjxfmxgj5flgawsgikqlozjfbdjzq?filename=index.html".to_string()) }
        };
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

    pub fn fs_store(&mut self) {

    }
}
