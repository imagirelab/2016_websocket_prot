var socket = io.connect('https://safe-reef-35714.herokuapp.com/');
//var socket = io.connect('ws://192.168.11.250:5555', {forceJSONP: true});
//var socket = io.connect('ws://192.168.11.250:5555', {transports: ["websocket"]});

var PlayerID = 0;

socket.on("connect", function () {
    var id = socket.io.engine.id;
    console.log("Connected ID: " + id);
    socket.emit("EnterRobby");
});



enchant();

window.onload = function ()
{
    var core = new Core(3200, 1800);

    //悪魔                Type    Dir  Level ID   COST HP   ATK  SPEED    
    var PUPU = new Demon("PUPU", "None", 0, null, 100, 200, 500, 6);
    var POPO = new Demon("POPO", "None", 0, null, 100, 200, 500, 6);
    var PIPI = new Demon("PIPI", "None", 0, null, 100, 200, 500, 6);

    //自分の初期所持コスト
    var haveCost = 500;

    //最大所持コスト
    var MaxCost = 3000;

    //毎秒取得できるコスト
    var fpsCost = 25;

    //タッチし始めの場所を確認
    var tapPos = new TapPos();
    //なにをタップしたかの確認
    var tapObj;
    //コストが払えるかのフラグ
    var Flag;
    //タイマー
    var Timer;
    //必殺技を撃ったかのフラグ
    var deadlyFlag;

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
    core.preload('img/deadly.png');
    core.preload('img/deadly2.png');
    core.preload('img/deadly3.png');

    //UI・フォント
    core.preload('img/CP.png');
    core.preload('img/rednumber_siro.png');
    core.preload('img/huki_blue.png');
    core.preload('img/huki_green.png');
    core.preload('img/huki_red.png');
    core.preload('img/ponpu1.png');
    core.preload('img/ponpu3.png');
    core.preload('img/ponpu3.5.png');

    //fpsの設定
    core.fps = 30;

    core.onload = function ()
    {
        //プレイヤーIDのセット
        socket.on("PushPlayerID", function (idData) {
            PlayerID = idData.PlayerID;
            console.log("Connect PlayerID: " + PlayerID);
        });

        //フレームリセット
        core.frame = 0;

        ////////画像情報処理////////

        //ププのボタン
        var pupuBtn = new Sprite(1200, 1200);
        pupuBtn.image = core.assets['img/pupu.png'];
        pupuBtn.scale(0.25, 0.25);
        pupuBtn.x = 2200;
        pupuBtn.y = -300;

        //ポポのボタン
        var popoBtn = new Sprite(1200, 1200);
        popoBtn.image = core.assets['img/popo.png'];
        popoBtn.scale(0.25, 0.25);
        popoBtn.x = 2200;
        popoBtn.y = 300;

        //ピピのボタン
        var pipiBtn = new Sprite(1200, 1200);
        pipiBtn.image = core.assets['img/pipi.png'];
        pipiBtn.scale(0.25, 0.25);
        pipiBtn.x = 2200;
        pipiBtn.y = 900;

        //必殺技のボタン
        var deadlyBtn = new Sprite(300, 300);
        deadlyBtn.image = core.assets['img/deadly.png'];
        deadlyBtn.scale(1.5, 1.5);
        deadlyBtn.x = 200;
        deadlyBtn.y = 750;

        //背景
        var back = new Sprite(3200, 1800);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;

        //UI
        //ププのUI背景
        var PUPU_UI = new Sprite(600, 600);
        PUPU_UI.image = core.assets['img/huki_red.png'];
        PUPU_UI.scale(1.2, 1.2);
        PUPU_UI.x = 1900;
        PUPU_UI.y = 0;

        //ポポのUI背景
        var POPO_UI = new Sprite(600, 600);
        POPO_UI.image = core.assets['img/huki_green.png'];
        POPO_UI.scale(1.2, 1.2);
        POPO_UI.x = 1900;
        POPO_UI.y = 600;

        //ピピのUI背景
        var PIPI_UI = new Sprite(600, 600);
        PIPI_UI.image = core.assets['img/huki_blue.png'];
        PIPI_UI.scale(1.2, 1.2);
        PIPI_UI.x = 1900;
        PIPI_UI.y = 1200;

        //ポンプケーブル
        var ponpuCable = new Sprite(600, 600);
        ponpuCable.image = core.assets['img/ponpu1.png'];
        ponpuCable.scale(3, 3);
        ponpuCable.x = 1000;
        ponpuCable.y = 600;

        //ポンプ本体
        var ponpu = new Sprite(600, 600);
        ponpu.image = core.assets['img/ponpu3.png'];
        ponpu.scale(3, 3);
        ponpu.x = 1000;
        ponpu.y = 600;

        //ポンプの上からかぶせるガラスケース
        var ponpuCover = new Sprite(600, 600);
        ponpuCover.image = core.assets['img/ponpu3.5.png'];
        ponpuCover.scale(3, 3);
        ponpuCover.x = 1000;
        ponpuCover.y = 600;

        //矢印
        var Arrow = new Sprite(600, 600);
        Arrow.image = core.assets['img/ya_blue.png'];
        Arrow.scale(0.5, 0.5);
        Arrow.x = 5000;
        Arrow.y = -5000;

        //CPのフォント
        var CPFont = new Sprite(150, 150);
        CPFont.image = core.assets['img/CP.png'];
        CPFont.scale(1, 1);
        CPFont.x = 1300;
        CPFont.y = 1600;

        //コストのフォント
        var CostFont = new Array();
        var costDigit = 4;  //桁数(初期設定4桁)
        for (var i = 0; i < costDigit; i++)
        {
            CostFont[i] = new Sprite(120, 120);
            CostFont[i].image = core.assets['img/rednumber_siro.png'];
            CostFont[i].scale(4, 4);
            CostFont[i].x = 1300 - (i + 1) * 150;
            CostFont[i].y = 1600;
            CostFont[i].frame = 0;
        }

        ////////メイン処理////////
        //フレームごとに処理する
        core.addEventListener('enterframe', function ()
        {
            if (core.frame % core.fps == 0)
            {
                if (haveCost < MaxCost)
                    haveCost += fpsCost;
                else
                    haveCost = MaxCost;
            }

            //CPフォント
            for (var i = costDigit; i >= 0; i--)
            {
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

        deadlyBtn.on('touchstart', function ()
        {
            if (!deadlyFlag) {
                deadlyBtn.image = core.assets['img/deadly2.png'];
                tapObj = "deadlyBtn";
            }
        });

        //タップした場所の座標取得
        core.rootScene.on('touchstart', function (startPos)
        {
            tapPos.x = startPos.x;
            tapPos.y = startPos.y;
        });

        //離された時の処理
        pupuBtn.on('touchend', function () {
            pupuBtn.image = core.assets['img/pupu.png'];
        });

        popoBtn.on('touchend', function () {
            popoBtn.image = core.assets['img/popo.png'];            
        });

        pipiBtn.on('touchend', function () {
            console.log("call");
            pipiBtn.image = core.assets['img/pipi.png'];            
        });

        deadlyBtn.on('touchend', function ()
        {
            if(!deadlyFlag)
            {
                deadlyBtn.image = core.assets['img/deadly3.png'];
                PushDeadly(PlayerID);
                deadlyFlag = true;
            }
        });

        //タップした場所を使った処理はここから
        core.rootScene.on('touchend', function (endPos)
        {
            //ププボタンの場所で押してた場合
            if(tapObj == "pupuBtn")
            {
                if ((tapPos.y - endPos.y) > pupuBtn.height / 2 * pupuBtn.scaleY) {
                    Flag = FlagCheck(haveCost, PUPU, Flag);
                    haveCost = CostCheck(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.y - endPos.y) < -pupuBtn.height / 2 * pupuBtn.scaleY) {
                    Flag = FlagCheck(haveCost, PUPU, Flag);
                    haveCost = CostCheck(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.x - endPos.x) < -pupuBtn.height / 2 * pupuBtn.scaleX || (tapPos.x - endPos.x) > pupuBtn.height / 2 * pupuBtn.scaleX) {
                    Flag = FlagCheck(haveCost, PUPU, Flag);
                    haveCost = CostCheck(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, PlayerID);
                }
                else {
                    
                }
            }
            //ポポボタンの場所で押してた場合
            else if(tapObj == "popoBtn")
            {
                if ((tapPos.y - endPos.y) > popoBtn.height / 2 * popoBtn.scaleY) {
                    Flag = FlagCheck(haveCost, POPO, Flag);
                    haveCost = CostCheck(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.y - endPos.y) < -popoBtn.height / 2 * popoBtn.scaleY) {
                    Flag = FlagCheck(haveCost, POPO, Flag);
                    haveCost = CostCheck(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.x - endPos.x) < -popoBtn.height / 2 * popoBtn.scaleX || (tapPos.x - endPos.x) > popoBtn.height / 2 * popoBtn.scaleX) {
                    Flag = FlagCheck(haveCost, POPO, Flag);
                    haveCost = CostCheck(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, PlayerID);
                }
                else {

                }
            }
            //ピピボタンの場所で押してた場合
            else if(tapObj == "pipiBtn")
            {
                if ((tapPos.y - endPos.y) > pipiBtn.height / 2 * pipiBtn.scaleY) {
                    Flag = FlagCheck(haveCost, PIPI, Flag);
                    haveCost = CostCheck(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.y - endPos.y) < -pipiBtn.height / 2 * pipiBtn.scaleY) {
                    Flag = FlagCheck(haveCost, PIPI, Flag);
                    haveCost = CostCheck(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, PlayerID);
                }
                else if ((tapPos.x - endPos.x) < -pipiBtn.height / 2 * pipiBtn.scaleX || (tapPos.x - endPos.x) > pipiBtn.height / 2 * pipiBtn.scaleX) {
                    Flag = FlagCheck(haveCost, PIPI, Flag);
                    haveCost = CostCheck(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, PlayerID);
                }
                else {

                }
            }

            tapObj = null;
        });

        ////////描画////////
        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        core.rootScene.addChild(back);  //一番背景

        core.rootScene.addChild(pupuBtn);
        core.rootScene.addChild(popoBtn);
        core.rootScene.addChild(pipiBtn);
        core.rootScene.addChild(deadlyBtn);

        core.rootScene.addChild(ponpuCable);
        core.rootScene.addChild(ponpu);
        core.rootScene.addChild(ponpuCover);

        core.rootScene.addChild(PUPU_UI);
        core.rootScene.addChild(POPO_UI);
        core.rootScene.addChild(PIPI_UI);

        core.rootScene.addChild(CPFont);
        for (var i = 0; i < costDigit; i++) {
            core.rootScene.addChild(CostFont[i]);  //一番前面
        }

        //矢印表示のためにここに処理
        core.rootScene.on('touchmove', function (nowPos) {
            //ププボタンの場所で押してた場合
            if (tapObj == "pupuBtn") {
                Arrow = ArrowSet(PUPU, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
                //ポポボタンの場所で押してた場合
            else if (tapObj == "popoBtn") {
                Arrow = ArrowSet(POPO, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
                //ピピボタンの場所で押してた場合
            else if (tapObj == "pipiBtn") {
                Arrow = ArrowSet(PIPI, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
        });

        core.rootScene.on('touchend', function () {
            Arrow.x = 9000;
            Arrow.y = -9000;
        });
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

function ArrowSet(demon, btn, startPos, endPos, Arrow, core)
{
    //座標の移動幅を見て方向指定
    //上方向時
    if ((startPos.y - endPos.y) > btn.height / 2 * btn.scaleY)
    {
        if (demon.Type == "PUPU")
        {
            Arrow.image = core.assets['img/ya_red.png'];
            Arrow.x = 2500;
            Arrow.y = -200;
            Arrow.rotation = 0;
        }
        else if (demon.Type == "POPO")
        {
            Arrow.image = core.assets['img/ya_green.png'];
            Arrow.x = 2500;
            Arrow.y = 400;
            Arrow.rotation = 0;
        }
        else if (demon.Type == "PIPI")
        {
            Arrow.image = core.assets['img/ya_blue.png'];
            Arrow.x = 2500;
            Arrow.y = 1000;
            Arrow.rotation = 0;
        }        
    }
    //下方向時
    else if ((startPos.y - endPos.y) < -btn.height / 2 * btn.scaleY)
    {
        if (demon.Type == "PUPU") {
            Arrow.image = core.assets['img/ya_red.png'];
            Arrow.x = 2500;
            Arrow.y = 200;
            Arrow.rotation = 180;
        }
        else if (demon.Type == "POPO") {
            Arrow.image = core.assets['img/ya_green.png'];
            Arrow.x = 2500;
            Arrow.y = 800;
            Arrow.rotation = 180;
        }
        else if (demon.Type == "PIPI") {
            Arrow.image = core.assets['img/ya_blue.png'];
            Arrow.x = 2500;
            Arrow.y = 1400;
            Arrow.rotation = 180;
        }
    }
    //右方向時
    else if ((startPos.x - endPos.x) < -btn.height / 2 * btn.scaleX)
    {
        if (demon.Type == "PUPU") {
            Arrow.image = core.assets['img/ya_red.png'];
            Arrow.x = 2700;
            Arrow.y = 0;
            Arrow.rotation = 90;
        }
        else if (demon.Type == "POPO") {
            Arrow.image = core.assets['img/ya_green.png'];
            Arrow.x = 2700;
            Arrow.y = 600;
            Arrow.rotation = 90;
        }
        else if (demon.Type == "PIPI") {
            Arrow.image = core.assets['img/ya_blue.png'];
            Arrow.x = 2700;
            Arrow.y = 1200;
            Arrow.rotation = 90;
        }
    }
    //左方向時
    else if ((startPos.x - endPos.x) > btn.height / 2 * btn.scaleX)
    {
        if (demon.Type == "PUPU") {
            Arrow.image = core.assets['img/ya_red.png'];
            Arrow.x = 2300;
            Arrow.y = 0;
            Arrow.rotation = 270;
        }
        else if (demon.Type == "POPO") {
            Arrow.image = core.assets['img/ya_green.png'];
            Arrow.x = 2300;
            Arrow.y = 600;
            Arrow.rotation = 270;
        }
        else if (demon.Type == "PIPI") {
            Arrow.image = core.assets['img/ya_blue.png'];
            Arrow.x = 2300;
            Arrow.y = 1200;
            Arrow.rotation = 270;
        }
    }

    return Arrow;
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

//必殺技送信
function PushDeadly(setPlayerID)
{
    socket.emit("DeadlyPush", { Deadly: "Fire", PlayerID: setPlayerID});
    console.log("DeadlyPushed");
}

window.onerror = function(error)
{
    alert(error);
}
