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
      bodyUrl: 'https://ipfs.web4.near.page/ipfs/bafkreihqouywazkaite62oz47timvlmjkhgasyg5lksqz3ubevg4cku6fe?filename=index.html'
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

function generateSeedFromString(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed += str.charCodeAt(i);
  }
  return seed;
}

function generateEmojiUsingSeed(seed) {
  const colors = ['yellow', 'gold', 'lightyellow', 'khaki', 'orange', 'pink', 'purple', 'red'];
  const template = [
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const emoji = [];
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    if (template[row][col] === 0) {
      emoji.push('black');
    } else {
      const colorRand = Math.floor((seed + i) / 10) % colors.length;
      emoji.push(colors[colorRand]);
    }
  }
  return emoji;
}

function create_svg(token_id, font_size, colors) {
  const WIDTH = 9;
  const HEIGHT = 9;
  if (!colors) {
    colors = generateEmojiUsingSeed(generateSeedFromString(token_id));
  }
  const svgstring = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    ${colors.map((color, ndx) => `<rect x="${ndx % WIDTH}" y="${Math.floor(ndx / WIDTH)}" width="1" height="1" fill="${color}"/>`)}
    <text x="4.5" y="5.5" text-anchor="middle" font-size="${font_size ?? 3}"
            font-family="system-ui" fill="white">
        ${token_id}
    </text>
  </svg>`;
  return svgstring;
}

export function svg_preview() {
  const args = JSON.parse(env.input());
  env.value_return(JSON.stringify({
    svg: create_svg(args.token_id, args.font_size, args.colors)
  }));
}

export function nft_mint() {
  const args = JSON.parse(env.input());
  const svgstring = create_svg(args.token_id, args.font_size, args.colors);

  const title = args.title ?? `jsinrust#${args.token_id}`;
  const description = args.description ?? `made with jsinrustnft.near.page`;
  return JSON.stringify({
    title: title,
    description: description,
    media: args.media ?? `data:image/svg+xml;base64,${env.base64_encode(svgstring)}`,
    media_hash: args.media_hash ?? env.sha256_utf8_to_base64(svgstring),
    extra: args.extra
  });
}

export function nft_payout() {
  const args = JSON.parse(env.input());
  const balance = BigInt(args.balance);
  const payout = {};
  const token_obj = JSON.parse(env.nft_token(args.token_id));
  const token_owner_id = token_obj.owner_id;
  const contract_owner = env.contract_owner();

  const addPayout = (account, amount) => {
    if (!payout[account]) {
      payout[account] = 0n;
    }
    payout[account] += amount;
  };

  try {
    const royalties = JSON.parse(token_obj.metadata.extra).filter(extradata => extradata.trait_type == 'royalty');
    let remainingbalance = balance;
    for (const royalty of royalties) {
      const amount = balance * BigInt(royalty.value.numerator) / BigInt(10000);
      remainingbalance -= amount;
      addPayout(royalty.value.account_id, amount);
    }
    addPayout(token_owner_id, remainingbalance);
  } catch (e) {
    addPayout(token_owner_id, balance);
  }

  Object.keys(payout).forEach(k => payout[k] = payout[k].toString());
  return JSON.stringify({ payout });
}
