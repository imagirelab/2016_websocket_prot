var socket = io.connect('https://safe-reef-35714.herokuapp.com/');
//var socket = io.connect('http://localhost:5555');

socket.on("connect", function () {
    var id = socket.io.engine.id;
    console.log("Connected ID: " + id);
});

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);

    //悪魔                Type    Dir  Level ID   COST HP   ATK  SPEED    
    var PUPU = new Demon("PUPU", "None", 0, null, 100, 200, 500, 6);
    var POPO = new Demon("POPO", "None", 0, null, 100, 200, 500, 6);
    var PIPI = new Demon("PIPI", "None", 0, null, 100, 200, 500, 6);

    //自分の初期所持コスト
    var haveCost = 500;

    //最大所持コスト
    var MaxCost = 3000;

    //毎秒取得できるコスト
    var fpsCost = 1;

    //タッチし始めの場所を確認
    var tapPos = new TapPos();
    //なにをタップしたかの確認
    var tapObj;
    //フラグ
    var Flag;
    //タイマー
    var Timer;

    //事前にロードを行う
    //背景
    core.preload('img/back5.png');

    //ボタン
    core.preload('img/pupu.png');
    core.preload('img/pipi.png');
    core.preload('img/popo.png');
    core.preload('img/pupu2.png');
    core.preload('img/pipi2.png');
    core.preload('img/popo2.png');
    core.preload('img/ya_blue.png');
    core.preload('img/ya_green.png');
    core.preload('img/ya_red.png');

    //UI・フォント
    core.preload('img/CP.png');
    core.preload('img/rednumber_siro.png');

    //fpsの設定
    core.fps = 30;

    core.onload = function ()
    {
        //フレームリセット
        core.frame = 0;

        //スプライト情報の入力
        //ボタン
        var pupuBtn = new Sprite(1200, 1200);
        pupuBtn.image = core.assets['img/pupu.png'];
        pupuBtn.scale(0.05, 0.05);
        pupuBtn.x = -50;
        pupuBtn.y = -500;
        pupuBtn.frame = 1;

        var popoBtn = new Sprite(1200, 1200);
        popoBtn.image = core.assets['img/popo.png'];
        popoBtn.scale(0.05, 0.05);
        popoBtn.x = -50;
        popoBtn.y = -400;
        popoBtn.frame = 1;

        var pipiBtn = new Sprite(1200, 1200);
        pipiBtn.image = core.assets['img/pipi.png'];
        pipiBtn.scale(0.05, 0.05);
        pipiBtn.x = -50;
        pipiBtn.y = -300;
        pipiBtn.frame = 1;

        //背景
        var back = new Sprite(640, 360);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

        //UI・フォント
        var CPFont = new Sprite(150, 150);
        CPFont.image = core.assets['img/CP.png'];
        CPFont.scale(0.35, 0.35);
        CPFont.x = 200;
        CPFont.y = 250;
        CPFont.frame = 1;

        var CostFont = new Array();

        //桁数(初期設定4桁)
        var costDigit = 4;

        for (var i = 0; i < costDigit; i++)
        {
            CostFont[i] = new Sprite(120, 120);
            CostFont[i].image = core.assets['img/rednumber_siro.png'];
            CostFont[i].x = 200 - (i + 1) * 45;
            CostFont[i].y = 250;
            CostFont[i].frame = 0;
        }

        ////////メイン処理////////

        core.addEventListener('enterframe', function ()
        {
            if (core.frame % core.fps == 0);
            {
                if (haveCost < MaxCost)
                    haveCost += fpsCost;
                else
                    haveCost = MaxCost;
            }

            //CPフォント
            for (var i = costDigit; i >= 0; i--) {
                FontSet(haveCost, i, CostFont[i]);
            }
        });

        //ボタンが押された時の処理
        pupuBtn.on('touchstart', function ()
        {
            pupuBtn.image = core.assets['img/pupu2.png'];
            tapObj = "pupuBtn";
        });

        popoBtn.on('touchstart', function ()
        {
            popoBtn.image = core.assets['img/popo2.png'];
            tapObj = "popoBtn";
        });

        pipiBtn.on('touchstart', function ()
        {
            pipiBtn.image = core.assets['img/pipi2.png'];
            tapObj = "pipiBtn";
        });

        //タップした場所の座標取得
        core.rootScene.on('touchstart', function (startPos)
        {
            tapPos.x = startPos.x;
            tapPos.y = startPos.y;
        });

        //ボタンで離された時の処理
        pupuBtn.on('touchend', function (startPos) {
            pupuBtn.image = core.assets['img/pupu.png'];
        });

        popoBtn.on('touchend', function () {
            popoBtn.image = core.assets['img/popo.png'];            
        });

        pipiBtn.on('touchend', function () {
            pipiBtn.image = core.assets['img/pipi.png'];            
        });

        //タップした場所を使った処理はここから
        core.rootScene.on('touchend', function (endPos)
        {
            //ププボタンの場所で押してた場合
            if(tapObj == "pupuBtn")
            {
                Flag = FlagCheck(haveCost, PUPU, Flag);
                haveCost = CostCheck(haveCost, PUPU);
                if (Flag == "Succes")
                    PushDemon(PUPU, pupuBtn, tapPos, endPos, 1);
            }
            //ポポボタンの場所で押してた場合
            else if(tapObj == "popoBtn")
            {
                Flag = FlagCheck(haveCost, POPO, Flag);
                haveCost = CostCheck(haveCost, POPO);
                if (Flag == "Succes")
                    PushDemon(POPO, popoBtn, tapPos, endPos, 1);
            }
            //ピピボタンの場所で押してた場合
            else if(tapObj == "pipiBtn")
            {
                Flag = FlagCheck(haveCost, PIPI, Flag);
                haveCost = CostCheck(haveCost, PIPI);
                if (Flag == "Succes")
                    PushDemon(PIPI, pipiBtn, tapPos, endPos, 1);
            }
        });

        ////////描画////////
        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        core.rootScene.addChild(back);  //一番背景
        core.rootScene.addChild(pupuBtn);  //一番前面
        core.rootScene.addChild(popoBtn);  //一番前面
        core.rootScene.addChild(pipiBtn);  //一番前面
        core.rootScene.addChild(CPFont);  //一番前面
        for (var i = 0; i < costDigit; i++) {
            core.rootScene.addChild(CostFont[i]);  //一番前面
        }
        
    }
    core.start();
};

//デーモンクラス
function Demon(Type, Direction, Level, PlayerID, Cost, HP, ATK, SPEED){
    this.Type = Type;
    this.Direction = Direction;
    this.Level = Level;
    this.PlayerID = PlayerID;
    this.Cost = Cost;
    this.HP = HP;
    this.ATK = ATK;
    this.SPEED = SPEED;
}

function TapPos(x, y) {
    this.x = x;
    this.y = y;
}

//CPフォントのセット
function FontSet(_haveCost, Digit, Sprite) {
    if (Digit == 3) {
        Sprite.frame = _haveCost / 1000;
    }
    else if (Digit == 2) {
        Sprite.frame = (_haveCost % 1000) / 100;
    }
    else if (Digit == 1) {
        Sprite.frame = (_haveCost % 100) / 10;
    }
    else if (Digit == 0) {
        Sprite.frame = _haveCost % 10;
    }

    return Sprite;
}

function FlagCheck(_haveCost, demon, _Flag)
{
    if (_haveCost - (demon.Cost + demon.Level * 10) >= 0) {
        _Flag = "Succes";
    }
    else {
        _Flag = "Faild";
        console.log("Faild");
    }
    return _Flag;
}

function CostCheck(_haveCost, demon) {
    if (_haveCost - (demon.Cost + demon.Level * 10) >= 0) {
        _haveCost -= (demon.Cost + demon.Level * 10);
    }
    return _haveCost;
}

//デーモンの送信
function PushDemon(demon, btn, startPos, endPos, setPlayerID)
{
    //座標の移動幅を見て方向指定
    if ((startPos.y - endPos.y) > btn.height / 2 * btn.scaleY) {
        demon.Direction = "Top";
    }
    else if ((startPos.y - endPos.y) < -btn.height / 2 * btn.scaleY) {
        demon.Direction = "Bottom";
    }
    else if ((startPos.x - endPos.x) < -btn.height / 2 * btn.scaleX || (startPos.x - endPos.x) > btn.height / 2 * btn.scaleX) {
        demon.Direction = "Middle";
    }
    else {
        demon.Direction = "None";
    }
    //プレイヤーID設定
    demon.PlayerID = setPlayerID;
    //データ送信
    if (demon.Direction != "None")
        socket.emit("DemonPush", { Type: demon.Type, Direction: demon.Direction, Level: demon.Level, PlayerID: demon.PlayerID });
    //ログ出力
    console.log(demon.Type);
    console.log(demon.Direction);
    console.log(demon.Level);
    console.log(demon.PlayerID);
}