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
loadSprite("mushroom", "0wMd92p.png");

scene("game", () => {

    layers(["bg", "obj", "ui"], "obj");

    const map = [
        "                                    ",
        "                                    ",
        "     #     C                        ",
        "     #    CC  ?+                    ",
        "         CCC                        ",
        "                      =             ",
        "=======================  ==========="
    ];

    const levelConfig = {
        height: 20,
        width: 20,
        "=": [sprite("groundBrown"), solid()],
        "C": [sprite("coin"), "coin"],
        "c": [sprite("coin"), "coinFromBlock"],
        "?": [sprite("qBlock"), solid(), "mushroomQBlock"],
        "+": [sprite("qBlock"), solid(), "coinQBlock"],
        "#": [sprite("brickBlock"), solid(), "brickBlock"],
        "0": [sprite("disbaledBlock"), solid(), "disbaledBlock"],
        "M": [sprite("mushroom"), "mushroom"]
    };

    const level = addLevel(map, levelConfig);

    const mario = add([
        sprite("mario", solid()),
        pos(20, 0),
        body(), // gravity
        origin("bot"), // disbale unnecesary stuff from using body()
        marioSizeExt()
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
        if (mario.grounded())
            mario.jump(jumpForce);
    });

    // Game logic
    mario.on("headbump", obj => {
        if (obj.is("coinQBlock")) {
            // Spawn temp. coin and disable block
            let tmpCoin = level.spawn("c", obj.gridPos.sub(0, 1));
            // Spawn disabled block
            level.spawn("0", obj.gridPos.sub(0, 0));
            destroy(obj);

            // Increment score
            updateScore(100);

            // Remove coin from box
            setTimeout(() => {
                destroy(tmpCoin);
            }, 500)
        }
        else if (obj.is("mushroomQBlock")) {
            level.spawn("M", obj.gridPos.sub(0, 1));
            level.spawn("0", obj.gridPos.sub(0, 0));
            destroy(obj);
        }
        else if (obj.is("brickBlock")) {
            destroy(obj);
        }
    });

    mario.collides("coin", coin => {
        updateScore(100);
        destroy(coin);
    });

    mario.collides("mushroom", mushroom => {
        mario.makeBig();
        destroy(mushroom);
    });


    // Helper functions
    updateScore = (value) => {
        scoreLabel.value += value;
        scoreLabel.text = scoreLabel.value;
    }

    function marioSizeExt(){
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            makeSmall() {
                this.scale = vec2(1)
                timer = 0
                isBig = false
            },
            makeBig(time) {
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

});

start("game");


