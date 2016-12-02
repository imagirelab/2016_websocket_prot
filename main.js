//var socket = io.connect('https://safe-reef-35714.herokuapp.com/');
var socket = io.connect('http://localhost:5555');

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
    //フラグ
    var Flag;
    //タイマー
    var Timer;

		socket.on("PushPlayerID", function(Data)
		{
			PUPU.PlayerID = Data.PlayerID;
			POPO.PlayerID = Data.PlayerID;
			PIPI.PlayerID = Data.PlayerID;
		});

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
    core.preload('img/huki_blue.png');
    core.preload('img/huki_green.png');
    core.preload('img/huki_red.png');

    //fpsの設定
    core.fps = 30;

    core.onload = function ()
    {
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
                    PushDemon(PUPU, pupuBtn, tapPos, endPos, PUPU.PlayerID);
            }
            //ポポボタンの場所で押してた場合
            else if(tapObj == "popoBtn")
            {
                Flag = FlagCheck(haveCost, POPO, Flag);
                haveCost = CostCheck(haveCost, POPO);
                if (Flag == "Succes")
                    PushDemon(POPO, popoBtn, tapPos, endPos, POPO.PlayerID);
            }
            //ピピボタンの場所で押してた場合
            else if(tapObj == "pipiBtn")
            {
                Flag = FlagCheck(haveCost, PIPI, Flag);
                haveCost = CostCheck(haveCost, PIPI);
                if (Flag == "Succes")
                    PushDemon(PIPI, pipiBtn, tapPos, endPos, PIPI.PlayerID);
            }

            tapObj = null;
        });

        ////////描画////////
        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        core.rootScene.addChild(back);  //一番背景

        core.rootScene.addChild(pupuBtn);
        core.rootScene.addChild(popoBtn);
        core.rootScene.addChild(pipiBtn);

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