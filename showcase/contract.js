const imageUrls = ['https://fictionspawnsite.files.wordpress.com/2022/05/bus-close-protocol.jpg',
  'https://fictionspawnsite.files.wordpress.com/2022/04/another-cabin-save.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/swamp-sketch.jpg',
  'https://fictionspawnsite.files.wordpress.com/2022/05/bus-inside.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/bus-steering-wheel-sketch.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/bunker-entrance-closed.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/bunker-entrance.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/hut-inside.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/open-box-close.jpg?w=1578',
  'https://fictionspawnsite.files.wordpress.com/2022/05/open-box-rope.jpg?w=2048',
  'https://fictionspawnsite.files.wordpress.com/2022/05/dead-man-close-sketch.jpg?w=2048'
];

function signerAccountId() {
  env.signer_account_id(0)
  return env.read_register(0)
}

function argsJSON() {
  env.jsvm_args(0);
  const input = env.read_register(0);
  return JSON.parse(input);
}

function readGameState(account_id) {
  env.jsvm_storage_read(account_id, 1);

  const gamestatejson = env.read_register(1);
  if (gamestatejson) {
    return JSON.parse(gamestatejson);
  } else {
    return null;
  }
}

export function newgame() {
  const keypositions = imageUrls.map((val, ndx) => ({
    x: Math.floor(Math.random() * 3),
    y: Math.floor(Math.random() * 3),
    attempts: 0,
    keyFound: false
  }));
  env.jsvm_storage_write(signerAccountId(), JSON.stringify(keypositions), 0);
}

export function viewGameState() {
  const args = argsJSON();
  const gamestate = readGameState(args.account_id);
  if (gamestate) {    
    env.jsvm_value_return(JSON.stringify(gamestate.map((step, ndx, arr) => ({
      attempts: step.attempts,
      keyFound: step.keyFound,
      image: (step.keyFound || ndx == 0 || arr[ndx-1].keyFound) ? imageUrls[ndx] : null
    }))));
  }
}

/*
* example args: {"x": 1, "y": 1, "currentStep": 1}
*/
export function tryFindKey() {
  const args = argsJSON();
  
  const gamestate = readGameState(signerAccountId());
  const stateobj = gamestate.find(stateobj => !stateobj.keyFound);

  if (!stateobj.keyFound) {
    stateobj.attempts++;
    
    if (stateobj.x == args.x && stateobj.y == args.y) {
      stateobj.keyFound = true;      
    }
  }
  env.jsvm_storage_write(signerAccountId(), JSON.stringify(gamestate), 0);
}
