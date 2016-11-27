var socket = io.connect('https://safe-reef-35714.herokuapp.com/');

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);

    var Type;

    var Direction;

    //事前にロードを行う
    core.preload('img/back5.png');
    core.preload('img/pupu.png');
    core.preload('img/pipi.png');
    core.preload('img/popo.png');
    core.preload('img/pupu2.png');
    core.preload('img/pipi2.png');
    core.preload('img/popo2.png');
    //fpsの設定
    core.fps = 15;

    core.onload = function ()
    {
        //スプライト情報の入力
        //ボタン
        var pupuBtn = new Sprite(1200, 1200);
        pupuBtn.image = core.assets['img/pupu.png'];
        pupuBtn.scaleX = 0.05;
        pupuBtn.scaleY = 0.05;
        pupuBtn.x = -50;
        pupuBtn.y = -500;
        pupuBtn.frame = 1;

        var popoBtn = new Sprite(1200, 1200);
        popoBtn.image = core.assets['img/popo.png'];
        popoBtn.scaleX = 0.05;
        popoBtn.scaleY = 0.05;
        popoBtn.x = -50;
        popoBtn.y = -400;
        popoBtn.frame = 1;

        var pipiBtn = new Sprite(1200, 1200);
        pipiBtn.image = core.assets['img/pipi.png'];
        pipiBtn.scaleX = 0.05;
        pipiBtn.scaleY = 0.05;
        pipiBtn.x = -50;
        pipiBtn.y = -300;
        pipiBtn.frame = 1;

        //背景
        var back = new Sprite(640, 360);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

        ////スマホでも操作できるようにタッチ反応型
        //bear.on('touchstart', function ()
        //{
        //    //クマを消す
        //    //core.rootScene.removeChild(this);
        //});

        //ボタンが押された時の処理
        pupuBtn.on('touchstart', function ()
        {
            pupuBtn.image = core.assets['img/pupu2.png'];
        });

        popoBtn.on('touchstart', function ()
        {
            popoBtn.image = core.assets['img/popo2.png'];
        });

        pipiBtn.on('touchstart', function ()
        {
            pipiBtn.image = core.assets['img/pipi2.png'];
        });

        //ボタンが離された時の処理
        pupuBtn.on('touchend', function () {
            pupuBtn.image = core.assets['img/pupu.png'];
            Type = "PUPU";
            Direction = "Middle";
            id = 1;
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
            console.log(Type);
            console.log(Direction);
            console.log(id);
        });

        popoBtn.on('touchend', function () {
            popoBtn.image = core.assets['img/popo.png'];
            Type = "POPO";
            Direction = "Middle";
            id = 1;
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
            console.log(Type);
            console.log(Direction);
            console.log(id);
        });

        pipiBtn.on('touchend', function () {
            pipiBtn.image = core.assets['img/pipi.png'];
            Type = "PIPI";
            Direction = "Middle";
            id = 1;
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
            console.log(Type);
            console.log(Direction);
            console.log(id);
        });

        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        core.rootScene.addChild(back);  //一番背景
        core.rootScene.addChild(pupuBtn);  //一番前面
        core.rootScene.addChild(popoBtn);  //一番前面
        core.rootScene.addChild(pipiBtn);  //一番前面
    }
    core.start();
};