// -------------------- Heartbeat monitor example

/**
 * Submit heartbeat from any named service
 * args: {"service_name": "testservice"}
 */
export function reportstate() {
    const params = JSON.parse(input());
   storageWrite(params.service_name, blockTimestamp());
}

/**
 * Get latest state for named service
 * args: {"service_name": "testservice"}
 */
export function latest_state() {
    const params = JSON.parse(input());
    valueReturn(storageRead(params.service_name));
}


// ------------------ Proposal example

/*
* Propose to pay 2 NEAR to psalomo.testnet
* args: {"amount": 2000000000000000000000000, "recipient": "psalomo.testnet"}
*/
export function add_proposal() {
    const params = JSON.parse(input());
    storageWrite(signerAccountId(), JSON.stringify({amount: params.amount, votes: {}, recipient: params.recipient}));  
}
   
/**
 * Vote for proposal by named account
 * args: {"name": "demogorgon.testnet"} 
 */
export function vote_proposal() {
   const params = JSON.parse(input());
   const proposal = JSON.parse(storageRead(params.name));
   proposal.votes[signerAccountId()] = true;
   storageWrite(params.name, JSON.stringify(proposal));
}

/**
 * Act on proposal by named account
 * args: {"name": "demogorgon.testnet"} 
 */
export function act_proposal() {
 const params = JSON.parse(input());
 const proposal = JSON.parse(storageRead(params.name));
 if (Object.keys(proposal.votes).length < 2) {
   panic("minimum 2 votes required");
 } else {
  storageRemove(params.name);
  let ndx = promiseBatchCreate(proposal.recipient);
  ndx = promiseBatchActionTransfer(ndx, BigInt(proposal.amount));
 }
}

// ------------------ Transfer to multiple accounts example

export function transfer() {
   const minimumbalance = 150000000000000000000000000n
   const transferamount = 5000000000000000000000000n;
   if (accountBalance() > minimumbalance) { 
    log('transfering '+transferamount)
    let ndx = promiseBatchCreate('isyvertsen.testnet');
    ndx = promiseBatchActionTransfer(ndx, transferamount * 50n / 100n );
    ndx = promiseBatchThen(ndx, 'psalomo.testnet');
    ndx = promiseBatchActionTransfer(ndx, transferamount * 50n / 100n);
   } else {
    panic('account balance is too low '+accountBalance());
   }
}

// ------------------- Web4 static hosting example

/**
 * HTML body is base64 encoded, see index.html for actual content. 
 */
export function web4_get() {
  valueReturn(JSON.stringify({ contentType: 'text/html', body: 'PCFET0NUWVBFIGh0bWw+CjxodG1sPgogIDxoZWFkPgogICAgPG1ldGEgY2hhcnNldD0iVVRGLTgiPgogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xIj4gICAgCiAgPC9oZWFkPgogIDxib2R5PgoJVGVzdCBzZXJ2aWNlIGxhdGVzdCByZXBvcnQ6IDxzcGFuIGlkPSJ0ZXN0c2VydmljZWxhdGVzdHJlcG9ydCI+PC9zcGFuPgogIDwvYm9keT4KICA8c2NyaXB0IHR5cGU9Im1vZHVsZSI+CiAgICBpbXBvcnQgJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbmVhci1hcGktanNAMC40NC4yL2Rpc3QvbmVhci1hcGktanMubWluLmpzJzsKCiAgICBjb25zdCBjb250cmFjdEFjY291bnQgPSBsb2NhdGlvbi5ob3N0bmFtZS5yZXBsYWNlKCcucGFnZScsICcnKTsKCiAgY29uc3QgbmVhcmNvbmZpZyA9IHsKICAgICAgbm9kZVVybDogJ2h0dHBzOi8vcnBjLnRlc3RuZXQubmVhci5vcmcnLAogICAgICBhcmNoaXZlTm9kZVVybDogJ2h0dHBzOi8vYXJjaGl2YWwtcnBjLnRlc3RuZXQubmVhci5vcmcnLAogICAgICB3YWxsZXRVcmw6ICdodHRwczovL3dhbGxldC50ZXN0bmV0Lm5lYXIub3JnJywKICAgICAgaGVscGVyVXJsOiAnaHR0cHM6Ly9oZWxwZXIudGVzdG5ldC5uZWFyLm9yZycsCiAgICAgIG5ldHdvcmtJZDogJ3Rlc3RuZXQnLAogICAgICBjb250cmFjdE5hbWU6IGNvbnRyYWN0QWNjb3VudCwKICAgICAgZGVwczogewogICAgICAgICAga2V5U3RvcmU6IG51bGwKICAgICAgfQogIH07CgoKICAgIChhc3luYyBmdW5jdGlvbigpIHsKICAgICAgCgogICAgICBjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgbmVhckFwaS5jb25uZWN0KG5lYXJjb25maWcpOwogICAgICBjb25zdCBhY2NvdW50ID0gYXdhaXQgY29ubmVjdGlvbi5hY2NvdW50KCk7CiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFjY291bnQudmlld0Z1bmN0aW9uKGNvbnRyYWN0QWNjb3VudCwnbGF0ZXN0X3N0YXRlJywgeyJzZXJ2aWNlX25hbWUiOiAidGVzdHNlcnZpY2UifSk7CiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN0ZXN0c2VydmljZWxhdGVzdHJlcG9ydCIpLmlubmVySFRNTCA9IG5ldyBEYXRlKHJlc3VsdCAvIDFfMDAwXzAwMCkudG9KU09OKCk7ICAgICAgCiAgICB9KSgpOwogIDwvc2NyaXB0Pgo8L2h0bWw+Cg==', preloadUrls: [] }));
}
