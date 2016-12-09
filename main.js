//var socket = io.connect('https://safe-reef-35714.herokuapp.com/');
//var socket = io.connect('ws://192.168.198.144:5555/');
//var socket = io.connect('ws://localhost:5555/');
var socket = io.connect('ws://192.168.11.250:5555/');

var myPlayerID = 0;

socket.on("connect", function () {
    var id = socket.io.engine.id;
    console.log("Connected ID: " + id);
    socket.emit("EnterRobby");
});

//プレイヤーIDのセット
socket.on("PushPlayerID", function (idData) {
    myPlayerID = idData.PlayerID;
    console.log("Connect PlayerID: " + myPlayerID);
});

enchant();

window.onload = function ()
{
    var core = new Core(3200, 1800);

    //悪魔               Type     Dir  Level ID   BASECOST COST  HP  ATK  SPEED    
    var PUPU = new Demon("PUPU", "None", 0, null, 100,     100, 200, 500, 6);
    var POPO = new Demon("POPO", "None", 0, null, 100,     100, 200, 500, 6);
    var PIPI = new Demon("PIPI", "None", 0, null, 100,     100, 200, 500, 6);

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
    //必殺技コスト数
    var deadlyCost = 10;
    //パワーアップのコストが増える間隔
    var powerUpInterval = 5;

    //10個までの魂保管用配列
    var spiritsLength = 10;
    var Spirits = new Array(spiritsLength);
    for (var i = 0; i < spiritsLength; i++)
    {
        Spirits[i] = null;
    }
    //魂をふよふよさせるために必要な変数
    var degree = 0;

    //キー割り当て(デバッグ用)
    core.keybind(' '.charCodeAt(0), 'summonSpirit');

    //押した時に一回だけ呼ばれるようにするためのフラグ
    var oneCallFlag = false;

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
    core.preload('img/blacknumber.png');
    core.preload('img/huki_blue.png');
    core.preload('img/huki_green.png');
    core.preload('img/huki_red.png');
    core.preload('img/ponpu1.png');
    core.preload('img/ponpu3.png');
    core.preload('img/ponpu3.5.png');

    //スピリット
    core.preload('img/pupu_soul.png');
    core.preload('img/popo_soul.png');
    core.preload('img/pipi_soul.png');

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
        ponpuCable.x = 1200;
        ponpuCable.y = 600;

        //ポンプ本体
        var ponpu = new Sprite(600, 600);
        ponpu.image = core.assets['img/ponpu3.png'];
        ponpu.scale(3, 3);
        ponpu.x = 1200;
        ponpu.y = 600;

        //ポンプの上からかぶせるガラスケース
        var ponpuCover = new Sprite(600, 600);
        ponpuCover.image = core.assets['img/ponpu3.5.png'];
        ponpuCover.scale(3, 3);
        ponpuCover.x = 1200;
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

        //所持コストのフォント
        var costFont = new Array();
        var costDigit = 4;  //桁数(初期設定4桁)
        for (var i = 0; i < costDigit; i++)
        {
            costFont[i] = new Sprite(120, 120);
            costFont[i].image = core.assets['img/rednumber_siro.png'];
            costFont[i].scale(4, 4);
            costFont[i].x = 1300 - (i + 1) * 150;
            costFont[i].y = 1600;
            costFont[i].frame = 0;
        }

        //デーモンに必要なコストのフォント
        var DemoncostDigit = 3;  //桁数(初期設定3桁)

        var PUPUcostFont = new Array();
        for (var i = 0; i < DemoncostDigit; i++) {
            PUPUcostFont[i] = new Sprite(120, 120);
            PUPUcostFont[i].image = core.assets['img/blacknumber.png'];
            PUPUcostFont[i].scale(2, 2);
            PUPUcostFont[i].x = 2400 - (i + 1) * 100;
            PUPUcostFont[i].y = 100;
            PUPUcostFont[i].frame = 0;
        }

        var POPOcostFont = new Array();
        for (var i = 0; i < DemoncostDigit; i++) {
            POPOcostFont[i] = new Sprite(120, 120);
            POPOcostFont[i].image = core.assets['img/blacknumber.png'];
            POPOcostFont[i].scale(2, 2);
            POPOcostFont[i].x = 2400 - (i + 1) * 100;
            POPOcostFont[i].y = 700;
            POPOcostFont[i].frame = 0;
        }

        var PIPIcostFont = new Array();
        for (var i = 0; i < DemoncostDigit; i++)
        {
            PIPIcostFont[i] = new Sprite(120, 120);
            PIPIcostFont[i].image = core.assets['img/blacknumber.png'];
            PIPIcostFont[i].scale(2, 2);
            PIPIcostFont[i].x = 2400 - (i + 1) * 100;
            PIPIcostFont[i].y = 1300;
            PIPIcostFont[i].frame = 0;
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
            for (var i = costDigit - 1; i >= 0; i--)
            {
                FontSet(haveCost, i, costFont[i]);
            }

            for (var i = DemoncostDigit - 1; i >= 0; i--)
            {
                FontSet(PUPU.Cost, i, PUPUcostFont[i]);
                FontSet(POPO.Cost, i, POPOcostFont[i]);
                FontSet(PIPI.Cost, i, PIPIcostFont[i]);
            }

            //スペースボタンを押すと魂が取得できるように
            core.addEventListener('summonSpiritbuttondown', function ()
            {
                oneCallFlag = true;
            });

            core.addEventListener('summonSpiritbuttonup', function ()
            {
                if (oneCallFlag)
                {
                    socket.emit("SpiritPush", { Type: "PUPU", PlayerID: myPlayerID });
                    oneCallFlag = false;
                }
            });

            for (var i = 0; i < spiritsLength; i++)
            {
                if(Spirits[i] != null)
                {
                    var radian = Math.PI / 180 * degree;
                    Spirits[i].Sprite.y += Math.sin(degree) * 5;
                }
            }

            degree += 0.2;
        });

        socket.on("PushStopRequest", function ()
        {
            console.log("called");
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
                //必殺コスト分の魂があるか確認。
                if (SpiritCheck(Spirits, deadlyCost, spiritsLength))
                {
                    deadlyBtn.image = core.assets['img/deadly3.png'];
                    //ここで必殺情報をサーバーに送る
                    PushDeadly(myPlayerID);
                    //コストを最大に回復
                    haveCost = MaxCost;
                    //使用フラグを立てる
                    deadlyFlag = true;
                    //使用した魂の削除
                    Spirits = UsedSpirits(Spirits, deadlyCost, spiritsLength, core);
                }
                else
                {
                    deadlyBtn.image = core.assets['img/deadly.png'];
                }
            }
        });

        //タップした場所を使った処理はここから
        core.rootScene.on('touchend', function (endPos)
        {
            //ププボタンの場所で押してた場合
            if(tapObj == "pupuBtn")
            {
                if ((tapPos.y - endPos.y) > pupuBtn.height / 2 * pupuBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, PUPU, Flag);
                    haveCost = UseCost(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.y - endPos.y) < -pupuBtn.height / 2 * pupuBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, PUPU, Flag);
                    haveCost = UseCost(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.x - endPos.x) < -pupuBtn.height / 2 * pupuBtn.scaleX || (tapPos.x - endPos.x) > pupuBtn.height / 2 * pupuBtn.scaleX) 
                {
                    Flag = CostCheck(haveCost, PUPU, Flag);
                    haveCost = UseCost(haveCost, PUPU);
                    if (Flag == "Succes")
                        PushDemon(PUPU, pupuBtn, tapPos, endPos, myPlayerID);
                }
                //パワーアップを選択時
                else
                {
                    if(SpiritCheck(Spirits, Math.floor(PUPU.Level / powerUpInterval + 1), spiritsLength))
                    {
                        PUPU.Level += 1;
                        PUPU.Cost = PUPU.BaseCost + PUPU.Level * 10;
                        //使用した魂の削除
                        Spirits = UsedSpirits(Spirits, Math.floor(PUPU.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            //ポポボタンの場所で押してた場合
            else if(tapObj == "popoBtn")
            {
                if ((tapPos.y - endPos.y) > popoBtn.height / 2 * popoBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, POPO, Flag);
                    haveCost = UseCost(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.y - endPos.y) < -popoBtn.height / 2 * popoBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, POPO, Flag);
                    haveCost = UseCost(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.x - endPos.x) < -popoBtn.height / 2 * popoBtn.scaleX || (tapPos.x - endPos.x) > popoBtn.height / 2 * popoBtn.scaleX) 
                {
                    Flag = CostCheck(haveCost, POPO, Flag);
                    haveCost = UseCost(haveCost, POPO);
                    if (Flag == "Succes")
                        PushDemon(POPO, popoBtn, tapPos, endPos, myPlayerID);
                }
                //パワーアップを選択時
                else 
                {
                    if (SpiritCheck(Spirits, Math.floor(POPO.Level / powerUpInterval + 1), spiritsLength))
                    {
                        POPO.Level += 1;
                        POPO.Cost = POPO.BaseCost + POPO.Level * 10;
                        //使用した魂の削除
                        Spirits = UsedSpirits(Spirits, Math.floor(POPO.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            //ピピボタンの場所で押してた場合
            else if(tapObj == "pipiBtn")
            {
                if ((tapPos.y - endPos.y) > pipiBtn.height / 2 * pipiBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, PIPI, Flag);
                    haveCost = UseCost(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.y - endPos.y) < -pipiBtn.height / 2 * pipiBtn.scaleY) 
                {
                    Flag = CostCheck(haveCost, PIPI, Flag);
                    haveCost = UseCost(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, myPlayerID);
                }
                else if ((tapPos.x - endPos.x) < -pipiBtn.height / 2 * pipiBtn.scaleX || (tapPos.x - endPos.x) > pipiBtn.height / 2 * pipiBtn.scaleX) 
                {
                    Flag = CostCheck(haveCost, PIPI, Flag);
                    haveCost = UseCost(haveCost, PIPI);
                    if (Flag == "Succes")
                        PushDemon(PIPI, pipiBtn, tapPos, endPos, myPlayerID);
                }
                //パワーアップを選択時
                else
                {
                    if (SpiritCheck(Spirits, Math.floor(PIPI.Level / powerUpInterval + 1), spiritsLength))
                    {
                        PIPI.Level += 1;
                        PIPI.Cost = PIPI.BaseCost + PIPI.Level * 10;
                        //使用した魂の削除
                        Spirits = UsedSpirits(Spirits, Math.floor(PIPI.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            console.log(PUPU.Cost);

            tapObj = null;
        });

        ////////描画////////
        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        /////////////背景/////////////
        core.rootScene.addChild(back);  

        core.rootScene.addChild(pupuBtn);
        core.rootScene.addChild(popoBtn);
        core.rootScene.addChild(pipiBtn);
        core.rootScene.addChild(deadlyBtn);

        core.rootScene.addChild(ponpuCable);
        core.rootScene.addChild(ponpu);

        core.rootScene.addChild(PUPU_UI);
        core.rootScene.addChild(POPO_UI);
        core.rootScene.addChild(PIPI_UI);

        //矢印表示のためにここに処理
        core.rootScene.on('touchmove', function (nowPos)
        {
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

        core.rootScene.on('touchend', function ()
        {
            Arrow.x = 9000;
            Arrow.y = -9000;
        });

        //魂の受け取り&描画処理
        socket.on("SpiritPushed", function (SpiritData)
        {
            if (SpiritData.PlayerID == myPlayerID)
            {
                for (var i = 0; i < spiritsLength; i++)
                {
                    if (Spirits[i] == null)
                    {
                        Spirits[i] = new Spirit(SpiritData.Type, SpiritData.PlayerID, core);
                        core.rootScene.addChild(Spirits[i].Sprite);
                        break;
                    }
                }

                console.log(Spirits);
            }
        });

        core.rootScene.addChild(ponpuCover);

        //フォント
        core.rootScene.addChild(CPFont);
        for (var i = 0; i < costDigit; i++)
        {
            core.rootScene.addChild(costFont[i]);
        }

        for (var i = 0; i < DemoncostDigit; i++)
        {
            core.rootScene.addChild(PUPUcostFont[i]);
            core.rootScene.addChild(POPOcostFont[i]);
            core.rootScene.addChild(PIPIcostFont[i]);
        }
        /////////////前面/////////////
    }
    core.start();
};

/////////////////クラス/////////////////
//デーモンクラス
function Demon(Type, Direction, Level, PlayerID, BaseCost, Cost, HP, ATK, SPEED){
    this.Type = Type;
    this.Direction = Direction;
    this.Level = Level;
    this.PlayerID = PlayerID;
    this.BaseCost = BaseCost;
    this.Cost = Cost;
    this.HP = HP;
    this.ATK = ATK;
    this.SPEED = SPEED;
}
//座標取得クラス
function TapPos(x, y) {
    this.x = x;
    this.y = y;
}
//スピリットクラス
function Spirit(Type, PlayerID, core)
{
    this.Type = Type;
    this.PlayerID = PlayerID;
    this.Sprite = new Sprite(600, 600);
    if (this.Type == "PUPU")
    {
        this.Sprite.image = core.assets['img/pupu_soul.png'];
    }
    else if (this.Type == "POPO")
    {
        this.Sprite.image = core.assets['img/pupu_soul.png'];
    }
    else if (this.Type == "PIPI")
    {
        this.Sprite.image = core.assets['img/pupu_soul.png'];
    }

    this.Sprite.scale(0.3, 0.3);

    this.Sprite.x = Math.floor(Math.random() * 500) + 700;
    this.Sprite.y = Math.floor(Math.random() * 700) + 250;    
}

/////////////////関数/////////////////
function FontSet(_Cost, Digit, Sprite)
{
    if (Digit == 3) {
        Sprite.frame = _Cost / 1000;
    }
    else if (Digit == 2) {
        Sprite.frame = (_Cost % 1000) / 100;
    }
    else if (Digit == 1) {
        Sprite.frame = (_Cost % 100) / 10;
    }
    else if (Digit == 0) {
        Sprite.frame = _Cost % 10;
    }

    return Sprite;
}

function CostCheck(_haveCost, _demon, _Flag)
{
    if (_haveCost - (_demon.Cost + _demon.Level * 10) >= 0) {
        _Flag = "Succes";
    }
    else {
        _Flag = "Faild";
        console.log("Faild");
    }
    return _Flag;
}

function UseCost(_haveCost, _demon)
{
    if (_haveCost - _demon.Cost >= 0)
    {
        _haveCost -= _demon.Cost;
    }
    return _haveCost;
}

function SpiritCheck(_Spirits, _Cost, Length)
{
    var countSpirit = 0;
    for(var i = 0; i < Length; i++)
    {
        //ここでスピリットデータがあるかの確認をする。
        if (_Spirits[i] != null)
        {
            countSpirit += 1;
        }
    }
    //スピリット量が必殺技コストより多い場合trueを返す
    if (countSpirit >= _Cost)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function UsedSpirits(_Spirits, _Cost, Length, core)
{
    var count = 0;

    for (var i = 0; i < Length; i++)
    {
        if(_Spirits[i] != null)
        {
            core.rootScene.removeChild(_Spirits[i].Sprite);
            _Spirits[i] = null;
            count += 1;
            if (count >= _Cost)
                break;
        }
    }

    return _Spirits;
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

//エラー時アラートが呼び出されるように
window.onerror = function(error)
{
    alert(error);
}
