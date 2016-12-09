//var socket = io.connect('https://safe-reef-35714.herokuapp.com/');
var socket = io.connect('ws://192.168.198.144:5555');

//test
var myPlayerID = 0;

socket.on("connect", function () {
    var id = socket.io.engine.id;
    console.log("Connected ID: " + id);
    socket.emit("EnterRobby");
});



enchant();

window.onload = function ()
{
    var core = new Core(3200, 1800);

    //謔ｪ鬲・              Type     Dir  Level ID   BASECOST COST  HP  ATK  SPEED    
    var PUPU = new Demon("PUPU", "None", 0, null, 100,     100, 200, 500, 6);
    var POPO = new Demon("POPO", "None", 0, null, 100,     100, 200, 500, 6);
    var PIPI = new Demon("PIPI", "None", 0, null, 100,     100, 200, 500, 6);

    //閾ｪ蛻・・蛻晄悄謇謖√さ繧ｹ繝・
    var haveCost = 500;

    //譛螟ｧ謇謖√さ繧ｹ繝・
    var MaxCost = 3000;

    //豈守ｧ貞叙蠕励〒縺阪ｋ繧ｳ繧ｹ繝・
    var fpsCost = 25;

    //繧ｿ繝・メ縺怜ｧ九ａ縺ｮ蝣ｴ謇繧堤｢ｺ隱・
    var tapPos = new TapPos();
    //縺ｪ縺ｫ繧偵ち繝・・縺励◆縺九・遒ｺ隱・
    var tapObj;
    //繧ｳ繧ｹ繝医′謇輔∴繧九°縺ｮ繝輔Λ繧ｰ
    var Flag;
    //繧ｿ繧､繝槭・
    var Timer;

    //蠢・ｮｺ謚繧呈茶縺｣縺溘°縺ｮ繝輔Λ繧ｰ
    var deadlyFlag;
    //蠢・ｮｺ謚繧ｳ繧ｹ繝域焚
    var deadlyCost = 10;
    //繝代Ρ繝ｼ繧｢繝・・縺ｮ繧ｳ繧ｹ繝医′蠅励∴繧矩俣髫・
    var powerUpInterval = 5;

    //10蛟九∪縺ｧ縺ｮ鬲ゆｿ晉ｮ｡逕ｨ驟榊・
    var spiritsLength = 10;
    var Spirits = new Array(spiritsLength);
    for (var i = 0; i < spiritsLength; i++)
    {
        Spirits[i] = null;
    }
    //鬲ゅｒ縺ｵ繧医・繧医＆縺帙ｋ縺溘ａ縺ｫ蠢・ｦ√↑螟画焚
    var degree = 0;

    //繧ｭ繝ｼ蜑ｲ繧雁ｽ薙※(繝・ヰ繝・げ逕ｨ)
    core.keybind(' '.charCodeAt(0), 'summonSpirit');

    //謚ｼ縺励◆譎ゅ↓荳蝗槭□縺大他縺ｰ繧後ｋ繧医≧縺ｫ縺吶ｋ縺溘ａ縺ｮ繝輔Λ繧ｰ
    var oneCallFlag = false;

    //莠句燕縺ｫ繝ｭ繝ｼ繝峨ｒ陦後≧
    //閭梧勹
    core.preload('img/back5.png');

    //繝懊ち繝ｳ
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

    //UI繝ｻ繝輔か繝ｳ繝・
    core.preload('img/CP.png');
    core.preload('img/rednumber_siro.png');
    core.preload('img/blacknumber.png');
    core.preload('img/huki_blue.png');
    core.preload('img/huki_green.png');
    core.preload('img/huki_red.png');
    core.preload('img/ponpu1.png');
    core.preload('img/ponpu3.png');
    core.preload('img/ponpu3.5.png');

    //繧ｹ繝斐Μ繝・ヨ
    core.preload('img/pupu_soul.png');
    core.preload('img/popo_soul.png');
    core.preload('img/pipi_soul.png');

    //fps縺ｮ險ｭ螳・
    core.fps = 30;

    core.onload = function ()
    {
        //繝励Ξ繧､繝､繝ｼID縺ｮ繧ｻ繝・ヨ
        socket.on("PushPlayerID", function (idData) {
            myPlayerID = idData.PlayerID;
            console.log("Connect PlayerID: " + myPlayerID);
        });

        //繝輔Ξ繝ｼ繝繝ｪ繧ｻ繝・ヨ
        core.frame = 0;

        ////////逕ｻ蜒乗ュ蝣ｱ蜃ｦ逅・///////

        //繝励・縺ｮ繝懊ち繝ｳ
        var pupuBtn = new Sprite(1200, 1200);
        pupuBtn.image = core.assets['img/pupu.png'];
        pupuBtn.scale(0.25, 0.25);
        pupuBtn.x = 2200;
        pupuBtn.y = -300;

        //繝昴・縺ｮ繝懊ち繝ｳ
        var popoBtn = new Sprite(1200, 1200);
        popoBtn.image = core.assets['img/popo.png'];
        popoBtn.scale(0.25, 0.25);
        popoBtn.x = 2200;
        popoBtn.y = 300;

        //繝斐ヴ縺ｮ繝懊ち繝ｳ
        var pipiBtn = new Sprite(1200, 1200);
        pipiBtn.image = core.assets['img/pipi.png'];
        pipiBtn.scale(0.25, 0.25);
        pipiBtn.x = 2200;
        pipiBtn.y = 900;

        //蠢・ｮｺ謚縺ｮ繝懊ち繝ｳ
        var deadlyBtn = new Sprite(300, 300);
        deadlyBtn.image = core.assets['img/deadly.png'];
        deadlyBtn.scale(1.5, 1.5);
        deadlyBtn.x = 200;
        deadlyBtn.y = 750;

        //閭梧勹
        var back = new Sprite(3200, 1800);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;

        //UI
        //繝励・縺ｮUI閭梧勹
        var PUPU_UI = new Sprite(600, 600);
        PUPU_UI.image = core.assets['img/huki_red.png'];
        PUPU_UI.scale(1.2, 1.2);
        PUPU_UI.x = 1900;
        PUPU_UI.y = 0;

        //繝昴・縺ｮUI閭梧勹
        var POPO_UI = new Sprite(600, 600);
        POPO_UI.image = core.assets['img/huki_green.png'];
        POPO_UI.scale(1.2, 1.2);
        POPO_UI.x = 1900;
        POPO_UI.y = 600;

        //繝斐ヴ縺ｮUI閭梧勹
        var PIPI_UI = new Sprite(600, 600);
        PIPI_UI.image = core.assets['img/huki_blue.png'];
        PIPI_UI.scale(1.2, 1.2);
        PIPI_UI.x = 1900;
        PIPI_UI.y = 1200;

        //繝昴Φ繝励こ繝ｼ繝悶Ν
        var ponpuCable = new Sprite(600, 600);
        ponpuCable.image = core.assets['img/ponpu1.png'];
        ponpuCable.scale(3, 3);
        ponpuCable.x = 1200;
        ponpuCable.y = 600;

        //繝昴Φ繝玲悽菴・
        var ponpu = new Sprite(600, 600);
        ponpu.image = core.assets['img/ponpu3.png'];
        ponpu.scale(3, 3);
        ponpu.x = 1200;
        ponpu.y = 600;

        //繝昴Φ繝励・荳翫°繧峨°縺ｶ縺帙ｋ繧ｬ繝ｩ繧ｹ繧ｱ繝ｼ繧ｹ
        var ponpuCover = new Sprite(600, 600);
        ponpuCover.image = core.assets['img/ponpu3.5.png'];
        ponpuCover.scale(3, 3);
        ponpuCover.x = 1200;
        ponpuCover.y = 600;

        //遏｢蜊ｰ
        var Arrow = new Sprite(600, 600);
        Arrow.image = core.assets['img/ya_blue.png'];
        Arrow.scale(0.5, 0.5);
        Arrow.x = 5000;
        Arrow.y = -5000;

        //CP縺ｮ繝輔か繝ｳ繝・
        var CPFont = new Sprite(150, 150);
        CPFont.image = core.assets['img/CP.png'];
        CPFont.scale(1, 1);
        CPFont.x = 1300;
        CPFont.y = 1600;

        //謇謖√さ繧ｹ繝医・繝輔か繝ｳ繝・
        var costFont = new Array();
        var costDigit = 4;  //譯∵焚(蛻晄悄險ｭ螳・譯・
        for (var i = 0; i < costDigit; i++)
        {
            costFont[i] = new Sprite(120, 120);
            costFont[i].image = core.assets['img/rednumber_siro.png'];
            costFont[i].scale(4, 4);
            costFont[i].x = 1300 - (i + 1) * 150;
            costFont[i].y = 1600;
            costFont[i].frame = 0;
        }

        //繝・・繝｢繝ｳ縺ｫ蠢・ｦ√↑繧ｳ繧ｹ繝医・繝輔か繝ｳ繝・
        var DemoncostDigit = 3;  //譯∵焚(蛻晄悄險ｭ螳・譯・

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

        ////////繝｡繧､繝ｳ蜃ｦ逅・///////
        //繝輔Ξ繝ｼ繝縺斐→縺ｫ蜃ｦ逅・☆繧・
        core.addEventListener('enterframe', function ()
        {
            if (core.frame % core.fps == 0)
            {
                if (haveCost < MaxCost)
                    haveCost += fpsCost;
                else
                    haveCost = MaxCost;
            }

            //CP繝輔か繝ｳ繝・
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

            //繧ｹ繝壹・繧ｹ繝懊ち繝ｳ繧呈款縺吶→鬲ゅ′蜿門ｾ励〒縺阪ｋ繧医≧縺ｫ
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

        //繝懊ち繝ｳ縺梧款縺輔ｌ縺滓凾縺ｮ蜃ｦ逅・
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

        //繧ｿ繝・・縺励◆蝣ｴ謇縺ｮ蠎ｧ讓吝叙蠕・
        core.rootScene.on('touchstart', function (startPos)
        {
            tapPos.x = startPos.x;
            tapPos.y = startPos.y;
        });

        //髮｢縺輔ｌ縺滓凾縺ｮ蜃ｦ逅・
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
                //蠢・ｮｺ繧ｳ繧ｹ繝亥・縺ｮ鬲ゅ′縺ゅｋ縺狗｢ｺ隱阪・
                if (SpiritCheck(Spirits, deadlyCost, spiritsLength))
                {
                    deadlyBtn.image = core.assets['img/deadly3.png'];
                    //縺薙％縺ｧ蠢・ｮｺ諠・ｱ繧偵し繝ｼ繝舌・縺ｫ騾√ｋ
                    PushDeadly(myPlayerID);
                    //繧ｳ繧ｹ繝医ｒ譛螟ｧ縺ｫ蝗槫ｾｩ
                    haveCost = MaxCost;
                    //菴ｿ逕ｨ繝輔Λ繧ｰ繧堤ｫ九※繧・
                    deadlyFlag = true;
                    //菴ｿ逕ｨ縺励◆鬲ゅ・蜑企勁
                    Spirits = UsedSpirits(Spirits, deadlyCost, spiritsLength, core);
                }
                else
                {
                    deadlyBtn.image = core.assets['img/deadly.png'];
                }
            }
        });

        //繧ｿ繝・・縺励◆蝣ｴ謇繧剃ｽｿ縺｣縺溷・逅・・縺薙％縺九ｉ
        core.rootScene.on('touchend', function (endPos)
        {
            //繝励・繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
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
                //繝代Ρ繝ｼ繧｢繝・・繧帝∈謚樊凾
                else
                {
                    if(SpiritCheck(Spirits, Math.floor(PUPU.Level / powerUpInterval + 1), spiritsLength))
                    {
                        PUPU.Level += 1;
                        PUPU.Cost = PUPU.BaseCost + PUPU.Level * 10;
                        //菴ｿ逕ｨ縺励◆鬲ゅ・蜑企勁
                        Spirits = UsedSpirits(Spirits, Math.floor(PUPU.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            //繝昴・繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
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
                //繝代Ρ繝ｼ繧｢繝・・繧帝∈謚樊凾
                else 
                {
                    if (SpiritCheck(Spirits, Math.floor(POPO.Level / powerUpInterval + 1), spiritsLength))
                    {
                        POPO.Level += 1;
                        POPO.Cost = POPO.BaseCost + POPO.Level * 10;
                        //菴ｿ逕ｨ縺励◆鬲ゅ・蜑企勁
                        Spirits = UsedSpirits(Spirits, Math.floor(POPO.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            //繝斐ヴ繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
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
                //繝代Ρ繝ｼ繧｢繝・・繧帝∈謚樊凾
                else
                {
                    if (SpiritCheck(Spirits, Math.floor(PIPI.Level / powerUpInterval + 1), spiritsLength))
                    {
                        PIPI.Level += 1;
                        PIPI.Cost = PIPI.BaseCost + PIPI.Level * 10;
                        //菴ｿ逕ｨ縺励◆鬲ゅ・蜑企勁
                        Spirits = UsedSpirits(Spirits, Math.floor(PIPI.Level / powerUpInterval + 1), spiritsLength, core);
                    }
                }
            }
            console.log(PUPU.Cost);

            tapObj = null;
        });

        ////////謠冗判////////
        //繧ｪ繝悶ず繧ｧ繧ｯ繝医↓霑ｽ蜉縺吶ｋ蜃ｦ逅・縺薙％縺ｫ蜈･繧後◆縺・が繝悶ず繧ｧ繧ｯ繝医ｒ謠冗判鬆・↓謖・ｮ・
        /////////////閭梧勹/////////////
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

        //遏｢蜊ｰ陦ｨ遉ｺ縺ｮ縺溘ａ縺ｫ縺薙％縺ｫ蜃ｦ逅・
        core.rootScene.on('touchmove', function (nowPos) {
            //繝励・繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
            if (tapObj == "pupuBtn") {
                Arrow = ArrowSet(PUPU, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
                //繝昴・繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
            else if (tapObj == "popoBtn") {
                Arrow = ArrowSet(POPO, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
                //繝斐ヴ繝懊ち繝ｳ縺ｮ蝣ｴ謇縺ｧ謚ｼ縺励※縺溷ｴ蜷・
            else if (tapObj == "pipiBtn") {
                Arrow = ArrowSet(PIPI, pipiBtn, tapPos, nowPos, Arrow, core);
                core.rootScene.addChild(Arrow);
            }
        });
        core.rootScene.on('touchend', function () {
            Arrow.x = 9000;
            Arrow.y = -9000;
        });
        //鬲ゅ・蜿励￠蜿悶ｊ&謠冗判蜃ｦ逅・
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

        //繝輔か繝ｳ繝・
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
        /////////////蜑埼擇/////////////
    }
    core.start();
};

/////////////////繧ｯ繝ｩ繧ｹ/////////////////
//繝・・繝｢繝ｳ繧ｯ繝ｩ繧ｹ
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
//蠎ｧ讓吝叙蠕励け繝ｩ繧ｹ
function TapPos(x, y) {
    this.x = x;
    this.y = y;
}
//繧ｹ繝斐Μ繝・ヨ繧ｯ繝ｩ繧ｹ
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

/////////////////髢｢謨ｰ/////////////////
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
        //縺薙％縺ｧ繧ｹ繝斐Μ繝・ヨ繝・・繧ｿ縺後≠繧九°縺ｮ遒ｺ隱阪ｒ縺吶ｋ縲・
        if (_Spirits[i] != null)
        {
            countSpirit += 1;
        }
    }
    //繧ｹ繝斐Μ繝・ヨ驥上′蠢・ｮｺ謚繧ｳ繧ｹ繝医ｈ繧雁､壹＞蝣ｴ蜷・rue繧定ｿ斐☆
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
    //蠎ｧ讓吶・遘ｻ蜍募ｹ・ｒ隕九※譁ｹ蜷第欠螳・
    //荳頑婿蜷第凾
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
    //荳区婿蜷第凾
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
    //蜿ｳ譁ｹ蜷第凾
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
    //蟾ｦ譁ｹ蜷第凾
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

//繝・・繝｢繝ｳ縺ｮ騾∽ｿ｡
function PushDemon(demon, btn, startPos, endPos, setPlayerID)
{
    //蠎ｧ讓吶・遘ｻ蜍募ｹ・ｒ隕九※譁ｹ蜷第欠螳・
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
    //繝励Ξ繧､繝､繝ｼID險ｭ螳・
    demon.PlayerID = setPlayerID;

    //繝・・繧ｿ騾∽ｿ｡
    if (demon.Direction != "None")
        socket.emit("DemonPush", { Type: demon.Type, Direction: demon.Direction, Level: demon.Level, PlayerID: demon.PlayerID });

    //繝ｭ繧ｰ蜃ｺ蜉・
    console.log(demon.Type);
    console.log(demon.Direction);
    console.log(demon.Level);
    console.log(demon.PlayerID);
}

//蠢・ｮｺ謚騾∽ｿ｡
function PushDeadly(setPlayerID)
{
    socket.emit("DeadlyPush", { Deadly: "Fire", PlayerID: setPlayerID});
    console.log("DeadlyPushed");
}

//繧ｨ繝ｩ繝ｼ譎ゅい繝ｩ繝ｼ繝医′蜻ｼ縺ｳ蜃ｺ縺輔ｌ繧九ｈ縺・↓
window.onerror = function(error)
{
    alert(error);
}
