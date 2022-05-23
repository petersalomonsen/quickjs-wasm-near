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

const STORAGE_KEY_KEY_POSITIONS = "keypositions";

export function newgame() {
  const keypositions = imageUrls.map((val, ndx) => ({
    x: Math.floor(Math.random() * 3),
    y: Math.floor(Math.random() * 3),
    attempts: 0
  }));
  env.jsvm_storage_write(STORAGE_KEY_KEY_POSITIONS, JSON.stringify(keypositions), 0);
}

/*
* example args: {"x": 1, "y": 1, "currentStep": 1}
*/
export function tryFindKey() {
  env.jsvm_args(0);
  const input = env.read_register(0);
  const args = JSON.parse(input);
  env.jsvm_storage_read(STORAGE_KEY_KEY_POSITIONS, 1)
  const keypositions = JSON.parse(env.read_register(1));
  const keyposition = keypositions[args.currentStep];
  let keyFound = false;
  if (!keyposition.keyFound) {
    keyposition.attempts++;
    
    if (keyposition.x == args.x && keyposition.y == args.y) {
      keyFound = true;
      keyposition.keyFound = true;
    } else {
      keyFound = false;
    }
  } else {
    keyFound = true;
  }
  env.jsvm_storage_write(STORAGE_KEY_KEY_POSITIONS, JSON.stringify(keypositions), 0);
  env.jsvm_value_return(JSON.stringify({keyFound, attempts: keyposition.attempts}));
}

export function nextstep() {
  env.jsvm_args(0)
  const input = env.read_register(0)
  const parsedInput = JSON.parse(input);
  let currentStep = parsedInput.currentStep;
  if (currentStep >= 0 && currentStep < imageUrls.length) {
    currentStep++;
  } else {
    currentStep = 0;
  }
  env.jsvm_value_return(JSON.stringify({
    currentStep,
    image: imageUrls[currentStep]
  }));
}