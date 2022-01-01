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
loadSprite("brickBlock", "pogC9x5.png");
loadSprite("disbaledBlock", "bdrLpi6.png");

scene("game", () => {

    layers(["bg", "obj", "ui"], "obj");

    const map = [
        "                                    ",
        "                                    ",
        "     #     C                        ",
        "     #    CC  ?+                    ",
        "         CCC                        ",
        "                                    ",
        "=======================  ==========="
    ];

    const levelConfig = {
        height: 20,
        width: 20,
        "=": [sprite("groundBrown"), solid()],
        "C": [sprite("coin"), "coin"],
        "?": [sprite("qBlock"), solid(), "mushroom-qBlock"],
        "+": [sprite("qBlock"), solid(), "coin-qBlock"],
        "#": [sprite("brickBlock"), solid(), "brickBlock"],
        "0": [sprite("disbaledBlock"), solid(), "disbaledBlock"],
    };

    const level = addLevel(map, levelConfig);

    const mario = add([
        sprite("mario", solid()),
        pos(20, 0),
        body(), // gravity
        origin("bot") // disbale unnecesary stuff from using body()
    ]);

    const scoreLabel = add([
        text(0),
        pos(30, 30),
        layer("ui"),
        {
            value: 0
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
        if(mario.grounded())
            mario.jump(jumpForce);
    });

    // Game logic
    mario.on("headbump", obj => {
        if(obj.is("coin-qBlock")){
            // Spawn temp. coin and disable block
            let tmpCoin = level.spawn("C", obj.gridPos.sub(0,1));
            // Spawn disabled block
            level.spawn("0", obj.gridPos.sub(0,0))
            destroy(obj);

            // Increment score
            updateScore(100);

            // Remove coin from box
            setTimeout(() => {
                destroy(tmpCoin);
                console.log(score);
            }, 500)
        }
        else if(obj.is("brickBlock")){
            destroy(obj);
        }
    });

    updateScore = (value) => {
        scoreLabel.value += value;
        scoreLabel.text =  scoreLabel.value;
    }

});

start("game");


