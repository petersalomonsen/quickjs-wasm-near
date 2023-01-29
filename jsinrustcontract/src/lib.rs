mod web4;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen};
use web4::{Web4Request,Web4Response};

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct JSInRust {}

#[near_bindgen]
impl JSInRust {
    pub fn web4_get(&self, request: Web4Request) -> Web4Response {
        return match request.path.as_str() {
            "/serviceworker.js" => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreib7supsnm6kre7yk7r7suxsjlq6etqce4zid37idjz2jsxjvmipsm?filename=serviceworker.js".to_string()) },
            "/app.222bd130.js" => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreieangjmipcii5k72lydcyd6rzmwmwiuqxm4o4m7dbwjbzn6ox7kbq?filename=app.222bd130.js".to_string()) },
            _ => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreid5d2a5xx6inesxgzcvcrzv2yfdaj426g5dx67d7wyryqpqb3xtje?filename=index.html".to_string()) }
        };
    }

    pub fn fs_store(&mut self) {

    }
}
