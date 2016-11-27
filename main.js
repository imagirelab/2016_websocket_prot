var socket = io.connect('https://safe-reef-35714.herokuapp.com/');

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);

    var Type;

    var Direction;

    //���O�Ƀ��[�h���s��
    core.preload('img/back5.png');
    core.preload('img/pupu.png');
    core.preload('img/pipi.png');
    core.preload('img/popo.png');
    core.preload('img/pupu2.png');
    core.preload('img/pipi2.png');
    core.preload('img/popo2.png');
    //fps�̐ݒ�
    core.fps = 15;

    core.onload = function ()
    {
        //�X�v���C�g���̓���
        //�{�^��
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

        //�w�i
        var back = new Sprite(640, 360);
        back.image = core.assets['img/back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

        ////�X�}�z�ł�����ł���悤�Ƀ^�b�`�����^
        //bear.on('touchstart', function ()
        //{
        //    //�N�}������
        //    //core.rootScene.removeChild(this);
        //});

        //�{�^���������ꂽ���̏���
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

        //�{�^���������ꂽ���̏���
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

        //�I�u�W�F�N�g�ɒǉ����鏈��(�����ɓ��ꂽ���I�u�W�F�N�g��`�揇�Ɏw��)
        core.rootScene.addChild(back);  //��Ԕw�i
        core.rootScene.addChild(pupuBtn);  //��ԑO��
        core.rootScene.addChild(popoBtn);  //��ԑO��
        core.rootScene.addChild(pipiBtn);  //��ԑO��
    }
    core.start();
};