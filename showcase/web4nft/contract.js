const icon_svg_base64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5IDkiPgogICAgPHJlY3QgeT0iMCIgd2lkdGg9IjkiIGhlaWdodD0iMyIgZmlsbD0iIzBiZiIvPgogICAgPHJlY3QgeT0iMyIgd2lkdGg9IjYiIGhlaWdodD0iMyIgZmlsbD0iI2Y4MiIvPgogICAgPHJlY3QgeD0iNiIgeT0iMyIgd2lkdGg9IjMiIGhlaWdodD0iMyIgZmlsbD0iIzMzMyIgLz4KICAgIDxyZWN0IHk9IjYiIHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiMyYWEiLz4KICAgIDxyZWN0IHg9IjMiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjMiIGZpbGw9IiM2NjYiIC8+Cjwvc3ZnPg==';
const index_html_base64 = 'PCFET0NUWVBFIGh0bWw+CjxodG1sPgogICAgPGhlYWQ+CiAgICAgICAgPHN0eWxlPgogICAgICAgICAgICAjbG9naW5idXR0b24gewogICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTsKICAgICAgICAgICAgfQogICAgICAgICAgICAjbG9nZ2VkX2luX2NvbnRlbnQgewogICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTsKICAgICAgICAgICAgfQogICAgICAgIDwvc3R5bGU+CiAgICA8L2hlYWQ+CiAgICA8Ym9keT4KICAgICAgICA8aDE+TWludCBORlQ8L2gxPgogICAgCiAgICAgICAgPHA+CiAgICAgICAgICAgIDxidXR0b24gaWQ9ImxvZ2luYnV0dG9uIj5Mb2dpbjwvYnV0dG9uPgogICAgICAgIDwvcD4gICAgCgogICAgICAgIDxkaXYgaWQ9ImxvZ2dlZF9pbl9jb250ZW50Ij4KICAgICAgICAgICAgPGJ1dHRvbiBpZD0ibG9nb3V0YnV0dG9uIj5Mb2dvdXQ8L2J1dHRvbj4KICAgICAgICAgICAgPHA+VG9rZW4gaWQ6IDxpbnB1dCB0eXBlPSJ0ZXh0IiBpZD0idG9rZW5faWRfaW5wdXQiIHZhbHVlPSIyMiIgLz4KICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9Im1pbnRfYnV0dG9uIj5NaW50PC9idXR0b24+CiAgICAgICAgICAgIDwvcD4gICAgICAgICAgICAKICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2PgogICAgICAgICAgICA8cHJlIGlkPSJtaW50cmVzdWx0dmlldyI+PC9wcmU+CiAgICAgICAgPC9kaXY+CiAgICA8L2JvZHk+CiAgICA8c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9uZWFyLWFwaS1qc0AxLjEuMC9kaXN0L25lYXItYXBpLWpzLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1QNFVXT2VRdTNBck4wRGJQQ3pkeWZZQmFlS0x6S3UrN1YrQlpjbXhGaWdFPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyI+PC9zY3JpcHQ+CiAgICA8c2NyaXB0IHR5cGU9Im1vZHVsZSI+CmNvbnN0IHsgY29ubmVjdCwga2V5U3RvcmVzLCBXYWxsZXRDb25uZWN0aW9uLCBDb250cmFjdCwgdXRpbHMgfSA9IG5lYXJBcGk7Cgpjb25zdCBjb250cmFjdEFjY291bnRJZCA9ICdzdGFuZGFsb25lanN0ZXN0LnRlc3RuZXQnOwpjb25zdCBuZXR3b3JrSWQgPSAndGVzdG5ldCc7Cgpjb25zdCBjb25uZWN0aW9uQ29uZmlnID0gewogICAgbmV0d29ya0lkOiBuZXR3b3JrSWQsCiAgICBrZXlTdG9yZTogbmV3IGtleVN0b3Jlcy5Ccm93c2VyTG9jYWxTdG9yYWdlS2V5U3RvcmUoKSwKICAgIG5vZGVVcmw6IGBodHRwczovL3JwYy4ke25ldHdvcmtJZH0ubmVhci5vcmdgLAogICAgd2FsbGV0VXJsOiBgaHR0cHM6Ly93YWxsZXQuJHtuZXR3b3JrSWR9Lm5lYXIub3JnYCwKICAgIGhlbHBlclVybDogYGh0dHBzOi8vaGVscGVyLiR7bmV0d29ya0lkfS5uZWFyLm9yZ2AsCiAgICBleHBsb3JlclVybDogYGh0dHBzOi8vZXhwbG9yZXIuJHtuZXR3b3JrSWR9Lm5lYXIub3JnYCwKfTsKY29uc3QgbmVhckNvbm5lY3Rpb24gPSBhd2FpdCBjb25uZWN0KGNvbm5lY3Rpb25Db25maWcpOwpjb25zdCB3YWxsZXRDb25uZWN0aW9uID0gbmV3IFdhbGxldENvbm5lY3Rpb24obmVhckNvbm5lY3Rpb24pOwoKaWYgKCF3YWxsZXRDb25uZWN0aW9uLmlzU2lnbmVkSW4oKSkgewogICAgY29uc3QgbG9naW5idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5idXR0b24nKTsKICAgIGxvZ2luYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snOwogICAgbG9naW5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7CiAgICAgICAgd2FsbGV0Q29ubmVjdGlvbi5yZXF1ZXN0U2lnbkluKAogICAgICAgICAgICB7Y29udHJhY3RJZDogY29udHJhY3RBY2NvdW50SWQsIG1ldGhvZE5hbWVzOiBbJ25mdF9taW50J119CiAgICAgICAgKTsKICAgIH0pOwp9IGVsc2UgewogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ291dGJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4gewogICAgICAgIGF3YWl0IHdhbGxldENvbm5lY3Rpb24uc2lnbk91dCgpOwogICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpOwogICAgfSk7CiAgICBjb25zdCBtaW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbnRfYnV0dG9uJyk7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nZ2VkX2luX2NvbnRlbnQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsKICAgIG1pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7CiAgICAgICAgbWludEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7CiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbnRyZXN1bHR2aWV3JykuaW5uZXJIVE1MID0gJ1BsZWFzZSB3YWl0IHdoaWxlIGV4ZWN1dGluZyB0cmFuc2FjdGlvbic7CiAgICAgICAgY29uc3QgYWNjb3VudCA9IHdhbGxldENvbm5lY3Rpb24uYWNjb3VudCgpOwogICAgICAgIGNvbnN0IGNvbnRyYWN0ID0gbmV3IENvbnRyYWN0KGFjY291bnQsIGNvbnRyYWN0QWNjb3VudElkLCB7CiAgICAgICAgICAgIGNoYW5nZU1ldGhvZHM6IFsnbmZ0X21pbnQnXQogICAgICAgIH0pOwogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbnRyYWN0Lm5mdF9taW50KHsKICAgICAgICAgICAgICAgIHRva2VuX2lkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9rZW5faWRfaW5wdXQnKS52YWx1ZSwKICAgICAgICAgICAgICAgIHRva2VuX293bmVyX2lkOiBhY2NvdW50LmFjY291bnRJZAogICAgICAgICAgICB9LCB1bmRlZmluZWQsIHV0aWxzLmZvcm1hdC5wYXJzZU5lYXJBbW91bnQoIjAuMSIpKTsKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbnRyZXN1bHR2aWV3JykuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAxKTsKICAgICAgICB9IGNhdGNoKGUpIHsKICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbnRyZXN1bHR2aWV3JykuaW5uZXJIVE1MID0gZS50b1N0cmluZygpOwogICAgICAgIH0KICAgIH0pOwp9CiAgICA8L3NjcmlwdD4KPC9odG1sPg==';

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
      body: index_html_base64
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
  if (env.signer_account_id() != env.current_account_id()) {
    env.panic('only contract account can mint');
  }
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
