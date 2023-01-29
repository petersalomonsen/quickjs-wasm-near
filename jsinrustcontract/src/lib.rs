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
            "/app.96692492.js" => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreiathagrajpfossqgp3ou4na2umqqbhjrtzt3xrmqnfypjcqke7bzu?filename=app.96692492.js".to_string()) },
            _ => Web4Response::BodyUrl { body_url: ("https://ipfs.web4.near.page/ipfs/bafkreicccumg6ym5pmignwruu2tuckrqkjqbcuvyabkzuygyulg6t5rheq?filename=index.html".to_string()) }
        };
    }

    pub fn fs_store(&mut self) {

    }
}
