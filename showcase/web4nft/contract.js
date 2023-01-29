const icon_svg_base64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5IDkiPgogICAgPHJlY3QgeT0iMCIgd2lkdGg9IjkiIGhlaWdodD0iMyIgZmlsbD0iIzBiZiIvPgogICAgPHJlY3QgeT0iMyIgd2lkdGg9IjYiIGhlaWdodD0iMyIgZmlsbD0iI2Y4MiIvPgogICAgPHJlY3QgeD0iNiIgeT0iMyIgd2lkdGg9IjMiIGhlaWdodD0iMyIgZmlsbD0iIzMzMyIgLz4KICAgIDxyZWN0IHk9IjYiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiMyYWEiLz4KICAgIDxyZWN0IHg9IjMiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjMiIGZpbGw9IiM2NjYiIC8+Cjwvc3ZnPg==';

export function web4_get() {
  const request = JSON.parse(env.input()).request;

  let response;
  if (request.path == '/icon.svg' || request.path == '/assets/icon.svg') {
    response = {
      contentType: "image/svg+xml",
      body: icon_svg_base64
    };
  } else {
    response = {
      contentType: "text/html; charset=UTF-8",
      bodyUrl: 'https://ipfs.web4.near.page/ipfs/bafkreidtdbs3ufb2hddodw6adszsre4gqn7aslzeq7iwykybvhvrk36bry?filename=index.html'
    };
  }
  env.value_return(JSON.stringify(response));
}

export function store_signing_key() {
  if (env.nft_supply_for_owner(env.signer_account_id()) > 0) {
    env.store_signing_key(env.block_timestamp_ms() + 24 * 60 * 60 * 1000);
  }
}

export function nft_metadata() {
  return {
    name: "JSinRust",
    symbol: "JSINRUST",
    icon: `data:image/svg+xml;base64,${icon_svg_base64}`,
    base_uri: null,
    reference: null,
    reference_hash: null,
  };
}

export function nft_mint() {
  const args = JSON.parse(env.input());
  const svgstring = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9">
  <rect y="0" width="9" height="3" fill="#0bf"/>
  <rect y="3" width="6" height="3" fill="#f82"/>
  <rect x="6" y="3" width="3" height="3" fill="#333" />
  <rect y="6" width="3" height="3" fill="#2aa"/>
  <rect x="3" y="6" width="6" height="3" fill="#666" />
  <text x="4.5" y="5.5" text-anchor="middle" font-size="3"
          font-family="system-ui" fill="white">
      ${args.token_id}
  </text>
</svg>`;

  return JSON.stringify({
    title: `JSinRust NFT token number #${args.token_id}`,
    description: `An example of Rust NFT customizable with Javascript`,
    media: `data:image/svg+xml;base64,${env.base64_encode(svgstring)}`,
    media_hash: env.sha256_utf8_to_base64(svgstring)
  });
}

/**
 * @returns 
 */
export function nft_payout() {
  const args = JSON.parse(env.input());
  const balance = BigInt(args.balance);
  const payout = {};
  const token_owner_id = JSON.parse(env.nft_token(args.token_id)).owner_id;
  const contract_owner = env.contract_owner();

  const addPayout = (account, amount) => {
    if (!payout[account]) {
      payout[account] = 0n;
    }
    payout[account] += amount;
  };
  addPayout(token_owner_id, balance * BigInt(80_00) / BigInt(100_00));
  addPayout(contract_owner, balance * BigInt(20_00) / BigInt(100_00));
  Object.keys(payout).forEach(k => payout[k] = payout[k].toString());
  return JSON.stringify({ payout });
}
