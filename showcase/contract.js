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

export function nextstep() {
    env.jsvm_args(0)
    const input = env.read_register(0)
    const parsedInput = JSON.parse(input);
    let currentStep = parsedInput.currentStep;
    if (currentStep >=0 && currentStep < imageUrls.length) {
      currentStep++;
    } else {
      currentStep = 0;
    }
    env.jsvm_value_return(JSON.stringify({
      currentStep,
      image: imageUrls[currentStep]
    }));
}