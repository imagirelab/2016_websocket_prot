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

    //����                Type    Dir  Level ID   COST HP   ATK  SPEED    
    var PUPU = new Demon("PUPU", "None", 0, null, 100, 200, 500, 6);
    var POPO = new Demon("POPO", "None", 0, null, 100, 200, 500, 6);
    var PIPI = new Demon("PIPI", "None", 0, null, 100, 200, 500, 6);

    //�����̏��������R�X�g
    var haveCost = 500;

    //�ő及���R�X�g
    var MaxCost = 3000;

    //���b�擾�ł���R�X�g
    var fpsCost = 1;

    //�^�b�`���n�߂̏ꏊ���m�F
    var tapPos = new TapPos();
    //�Ȃɂ��^�b�v�������̊m�F
    var tapObj;
    //�t���O
    var Flag;
    //�^�C�}�[
    var Timer;

    //���O�Ƀ��[�h���s��
    //�w�i
    core.preload('img/back5.png');

    //�{�^��
    core.preload('img/pupu.png');
    core.preload('img/pipi.png');
    core.preload('img/popo.png');
    core.preload('img/pupu2.png');
    core.preload('img/pipi2.png');
    core.preload('img/popo2.png');
    core.preload('img/ya_blue.png');
    core.preload('img/ya_green.png');
    core.preload('img/ya_red.png');

    //UI�E�t�H���g
    core.preload('img/CP.png');
    core.preload('img/rednumber_siro.png');

    //fps�̐ݒ�
    core.fps = 30;

    core.onload = function ()
    {
        //�t���[�����Z�b�g
        core.frame = 0;

        //�X�v���C�g���̓���
        //�{�^��
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

        //�w�i
        var back = new Sprite(640, 360);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

        //UI�E�t�H���g
        var CPFont = new Sprite(150, 150);
        CPFont.image = core.assets['img/CP.png'];
        CPFont.scale(0.35, 0.35);
        CPFont.x = 200;
        CPFont.y = 250;
        CPFont.frame = 1;

        var CostFont = new Array();

        //����(�����ݒ�4��)
        var costDigit = 4;

        for (var i = 0; i < costDigit; i++)
        {
            CostFont[i] = new Sprite(120, 120);
            CostFont[i].image = core.assets['img/rednumber_siro.png'];
            CostFont[i].x = 200 - (i + 1) * 45;
            CostFont[i].y = 250;
            CostFont[i].frame = 0;
        }

        ////////���C������////////

        core.addEventListener('enterframe', function ()
        {
            if (core.frame % core.fps == 0);
            {
                if (haveCost < MaxCost)
                    haveCost += fpsCost;
                else
                    haveCost = MaxCost;
            }

            //CP�t�H���g
            for (var i = costDigit; i >= 0; i--) {
                FontSet(haveCost, i, CostFont[i]);
            }
        });

        //�{�^���������ꂽ���̏���
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

        //�^�b�v�����ꏊ�̍��W�擾
        core.rootScene.on('touchstart', function (startPos)
        {
            tapPos.x = startPos.x;
            tapPos.y = startPos.y;
        });

        //�{�^���ŗ����ꂽ���̏���
        pupuBtn.on('touchend', function (startPos) {
            pupuBtn.image = core.assets['img/pupu.png'];
        });

        popoBtn.on('touchend', function () {
            popoBtn.image = core.assets['img/popo.png'];            
        });

        pipiBtn.on('touchend', function () {
            pipiBtn.image = core.assets['img/pipi.png'];            
        });

        //�^�b�v�����ꏊ���g���������͂�������
        core.rootScene.on('touchend', function (endPos)
        {
            //�v�v�{�^���̏ꏊ�ŉ����Ă��ꍇ
            if(tapObj == "pupuBtn")
            {
                Flag = FlagCheck(haveCost, PUPU, Flag);
                haveCost = CostCheck(haveCost, PUPU);
                if (Flag == "Succes")
                    PushDemon(PUPU, pupuBtn, tapPos, endPos, 1);
            }
            //�|�|�{�^���̏ꏊ�ŉ����Ă��ꍇ
            else if(tapObj == "popoBtn")
            {
                Flag = FlagCheck(haveCost, POPO, Flag);
                haveCost = CostCheck(haveCost, POPO);
                if (Flag == "Succes")
                    PushDemon(POPO, popoBtn, tapPos, endPos, 1);
            }
            //�s�s�{�^���̏ꏊ�ŉ����Ă��ꍇ
            else if(tapObj == "pipiBtn")
            {
                Flag = FlagCheck(haveCost, PIPI, Flag);
                haveCost = CostCheck(haveCost, PIPI);
                if (Flag == "Succes")
                    PushDemon(PIPI, pipiBtn, tapPos, endPos, 1);
            }
        });

        ////////�`��////////
        //�I�u�W�F�N�g�ɒǉ����鏈��(�����ɓ��ꂽ���I�u�W�F�N�g��`�揇�Ɏw��)
        core.rootScene.addChild(back);  //��Ԕw�i
        core.rootScene.addChild(pupuBtn);  //��ԑO��
        core.rootScene.addChild(popoBtn);  //��ԑO��
        core.rootScene.addChild(pipiBtn);  //��ԑO��
        core.rootScene.addChild(CPFont);  //��ԑO��
        for (var i = 0; i < costDigit; i++) {
            core.rootScene.addChild(CostFont[i]);  //��ԑO��
        }
        
    }
    core.start();
};

//�f�[�����N���X
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

//CP�t�H���g�̃Z�b�g
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

//�f�[�����̑��M
function PushDemon(demon, btn, startPos, endPos, setPlayerID)
{
    //���W�̈ړ��������ĕ����w��
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
    //�v���C���[ID�ݒ�
    demon.PlayerID = setPlayerID;
    //�f�[�^���M
    if (demon.Direction != "None")
        socket.emit("DemonPush", { Type: demon.Type, Direction: demon.Direction, Level: demon.Level, PlayerID: demon.PlayerID });
    //���O�o��
    console.log(demon.Type);
    console.log(demon.Direction);
    console.log(demon.Level);
    console.log(demon.PlayerID);
}