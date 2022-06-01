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

const midiparts = [{ "eventlistuncompressed": [{ "time": 6906, "message": [150, 81, 53] }, { "time": 6993, "message": [134, 81, 0] }, { "time": 7020, "message": [150, 84, 78] }, { "time": 7146, "message": [150, 86, 68] }, { "time": 7160, "message": [134, 84, 0] }, { "time": 7313, "message": [150, 88, 74] }, { "time": 7319, "message": [134, 86, 0] }, { "time": 7613, "message": [134, 88, 0] }, { "time": 7720, "message": [150, 88, 54] }, { "time": 7746, "message": [150, 89, 68] }, { "time": 7747, "message": [134, 88, 0] }, { "time": 7913, "message": [134, 89, 0] }, { "time": 8066, "message": [150, 91, 39] }, { "time": 8093, "message": [134, 91, 0] }, { "time": 8100, "message": [150, 89, 54] }, { "time": 8146, "message": [150, 91, 23] }, { "time": 8180, "message": [134, 89, 0] }, { "time": 9060, "message": [150, 89, 39] }, { "time": 9066, "message": [134, 91, 0] }, { "time": 9153, "message": [134, 89, 0] }, { "time": 9160, "message": [150, 91, 92] }, { "time": 9227, "message": [134, 91, 0] }, { "time": 9246, "message": [150, 89, 75] }, { "time": 9333, "message": [150, 88, 74] }, { "time": 9333, "message": [134, 89, 0] }, { "time": 9800, "message": [134, 88, 0] }, { "time": 16333, "message": [150, 81, 62] }, { "time": 16413, "message": [134, 81, 0] }, { "time": 16446, "message": [150, 84, 78] }, { "time": 16539, "message": [134, 84, 0] }, { "time": 16546, "message": [150, 86, 64] }, { "time": 16859, "message": [134, 86, 0] }, { "time": 16933, "message": [150, 88, 44] }, { "time": 17133, "message": [134, 88, 0] }, { "time": 17333, "message": [150, 89, 49] }, { "time": 17593, "message": [134, 89, 0] }, { "time": 17653, "message": [150, 91, 72] }, { "time": 17813, "message": [134, 91, 0] }, { "time": 18000, "message": [150, 91, 70] }, { "time": 18020, "message": [150, 92, 73] }, { "time": 18073, "message": [134, 91, 0] }, { "time": 18073, "message": [134, 92, 0] }, { "time": 18086, "message": [150, 93, 83] }, { "time": 18986, "message": [134, 93, 0] }, { "time": 19006, "message": [150, 91, 67] }, { "time": 19079, "message": [134, 91, 0] }, { "time": 19086, "message": [150, 93, 75] }, { "time": 19153, "message": [134, 93, 0] }, { "time": 19173, "message": [150, 91, 87] }, { "time": 19273, "message": [134, 91, 0] }, { "time": 19280, "message": [150, 89, 65] }, { "time": 19953, "message": [134, 89, 0] }, { "time": 20006, "message": [150, 84, 83] }, { "time": 20673, "message": [134, 84, 0] }], "startTimes": [0], "channel": 6 }, { "eventlistuncompressed": [{ "time": 0, "message": [144, 81, 93] }, { "time": 0, "message": [144, 22, 88] }, { "time": 1666, "message": [144, 93, 79] }, { "time": 2606, "message": [128, 93, 0] }, { "time": 2666, "message": [144, 86, 82] }, { "time": 4333, "message": [144, 88, 83] }, { "time": 4413, "message": [128, 86, 0] }, { "time": 4753, "message": [128, 81, 0] }, { "time": 5333, "message": [144, 81, 83] }, { "time": 5446, "message": [128, 88, 0] }, { "time": 7000, "message": [144, 93, 79] }, { "time": 7953, "message": [128, 93, 0] }, { "time": 8000, "message": [144, 86, 83] }, { "time": 9666, "message": [144, 88, 83] }, { "time": 9760, "message": [128, 86, 0] }, { "time": 9800, "message": [128, 81, 0] }, { "time": 10593, "message": [128, 22, 0] }, { "time": 10666, "message": [144, 81, 84] }, { "time": 10666, "message": [144, 29, 67] }, { "time": 10673, "message": [128, 88, 0] }, { "time": 12333, "message": [144, 93, 79] }, { "time": 13320, "message": [128, 93, 0] }, { "time": 13333, "message": [144, 86, 83] }, { "time": 15000, "message": [144, 88, 72] }, { "time": 15086, "message": [128, 86, 0] }, { "time": 15906, "message": [128, 81, 0] }, { "time": 16000, "message": [144, 81, 87] }, { "time": 16047, "message": [128, 88, 0] }, { "time": 17666, "message": [144, 93, 75] }, { "time": 18599, "message": [128, 93, 0] }, { "time": 18666, "message": [144, 86, 79] }, { "time": 20333, "message": [144, 88, 82] }, { "time": 20419, "message": [128, 86, 0] }, { "time": 21253, "message": [128, 88, 0] }, { "time": 21293, "message": [128, 29, 0] }, { "time": 21293, "message": [128, 81, 0] }], "startTimes": [0], "channel": 0 }, { "eventlistuncompressed": [{ "time": 20, "message": [145, 60, 67] }, { "time": 33, "message": [145, 53, 64] }, { "time": 46, "message": [145, 34, 51] }, { "time": 10660, "message": [129, 53, 0] }, { "time": 10680, "message": [145, 64, 54] }, { "time": 10686, "message": [145, 26, 65] }, { "time": 10686, "message": [129, 34, 0] }, { "time": 10693, "message": [145, 57, 78] }, { "time": 10700, "message": [129, 60, 0] }, { "time": 18653, "message": [145, 67, 47] }, { "time": 18666, "message": [145, 60, 67] }, { "time": 18667, "message": [129, 64, 0] }, { "time": 18680, "message": [145, 29, 57] }, { "time": 18686, "message": [129, 26, 0] }, { "time": 18773, "message": [129, 57, 0] }, { "time": 21293, "message": [129, 60, 0] }, { "time": 21293, "message": [129, 29, 0] }, { "time": 21300, "message": [129, 67, 0] }], "startTimes": [0], "channel": 1 }, { "eventlistuncompressed": [{ "time": 0, "message": [146, 67, 70] }, { "time": 0, "message": [146, 73, 100] }, { "time": 7, "message": [130, 67, 0] }, { "time": 67, "message": [130, 73, 0] }, { "time": 1000, "message": [146, 73, 50] }, { "time": 1133, "message": [130, 73, 0] }, { "time": 1333, "message": [146, 73, 100] }, { "time": 1466, "message": [130, 73, 0] }, { "time": 1666, "message": [146, 67, 100] }, { "time": 2000, "message": [146, 73, 80] }, { "time": 2067, "message": [130, 73, 0] }, { "time": 2333, "message": [130, 67, 0] }], "startTimes": [0, 2666, 5333, 8000, 10666, 13333, 16000, 18666], "channel": 2 }];

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
function writeGameState(game_state) {
  const gameStateString = JSON.stringify(game_state);
  env.jsvm_storage_write(signerAccountId(),
    gameStateString.padEnd(2048),
  0);
}

export function newgame() {
  const gamestate = imageUrls.map((val, ndx) => ({
    x: Math.floor(Math.random() * 3),
    y: Math.floor(Math.random() * 3),
    attempts: 0,
    keyFound: false
  }));
  writeGameState(gamestate);
}

export function view_game_state() {
  const args = argsJSON();
  const gamestate = readGameState(args.account_id);
  if (gamestate) {
    env.jsvm_value_return(JSON.stringify(gamestate.map((step, ndx, arr) => ({
      attempts: step.attempts,
      keyFound: step.keyFound,
      image: (step.keyFound || ndx == 0 || arr[ndx - 1].keyFound) ? imageUrls[ndx] : null,
      music: (step.keyFound || ndx == 0 || arr[ndx - 1].keyFound) ? midiparts[ndx] : null,
    }))));
  }
}

/*
* example args: {"x": 1, "y": 1, "currentStep": 1}
*/
export function try_find_key() {
  const args = argsJSON();

  const gamestate = readGameState(signerAccountId());
  const stateobj = gamestate.find(stateobj => !stateobj.keyFound);

  if (!stateobj.keyFound) {
    stateobj.attempts++;

    if (stateobj.x == args.x && stateobj.y == args.y) {
      stateobj.keyFound = true;
    }
  }
  writeGameState(gamestate);
}
