// initialize kaboom context
kaboom({
    debug: true,
    global: true,
    fullscreen: true,
    clearColor: [0, 0, 0, 1],
    scale: 1.5
});

// Load sprites
loadRoot("https://i.imgur.com/");

loadSprite("mario", "Wb1qfhK.png");
loadSprite("qBlock", "gesQ1KP.png");
loadSprite("groundBrown", "M6rwarW.png");
loadSprite("coin", "wbKxhcd.png");

scene("game", () => {

    layers(["bg", "obj", "ui"], "obj");

    const map = [
        "                                    ",
        "                                    ",
        "           C                        ",
        "          CC  ?+                    ",
        "         CCC                        ",
        "                                    ",
        "=======================  ==========="
    ];

    const levelConfig = {
        height: 20,
        width: 20,
        "=": [sprite("groundBrown"), solid()],
        "C": [sprite("coin")],
        "?": [sprite("qBlock"), solid(), "mushroom-qBlock"],
        "+": [sprite("qBlock"), solid(), "mushroom-qBlock"]
    };

    const level = addLevel(map, levelConfig);

    const mario = add([
        sprite("mario", solid()),
        pos(20, 0),
        body(), // gravity
        origin("bot") // disbale unnecesary stuff from using body()
    ]);

    const score = 0;
    const scoreLabel = add([
        text(score),
        pos(30, 30),
        layer("ui"),
        {
            value: score
        }
    ])

    // Controls
    const moveSpeed = 120;
    const jumpForce = 360;
    const turboMoveSpeed = moveSpeed + 100;

    let turboEnabled = false;

    keyDown("left", () => {
        mario.move(turboEnabled ? -turboMoveSpeed : -moveSpeed, 0);
    });
    keyDown("right", () => {
        mario.move(turboEnabled ? turboMoveSpeed : moveSpeed, 0);
    });
    keyDown("c", () => {
        turboEnabled = true;
    });
    keyRelease("c", () => {
        turboEnabled = false;
    });
    keyPress("space", () => {
        if(mario.grounded()){
            mario.jump(jumpForce);
        }
    })

});

start("game");
