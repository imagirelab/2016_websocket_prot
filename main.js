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
            Type = 'PUPU';
            Direction = 'Middle';
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
        });

        popoBtn.on('touchstart', function ()
        {
            Type = 'POPO';
            Direction = 'Middle';
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
        });

        pipiBtn.on('touchstart', function ()
        {
            Type = 'PIPI';
            Direction = 'Middle';
            socket.emit("DemonPush", { Type: Type, Direction: Direction, Level: 1, PlayerID: id });
        });

        ////�N�}�����W�ɓ������������͖{�̂���̍��W���󂯎���Ĉړ�����悤�ɂ���B
        //core.rootScene.on('touchstart', function(pos)
        //{
        //});

        //�I�u�W�F�N�g�ɒǉ����鏈��(�����ɓ��ꂽ���I�u�W�F�N�g��`�揇�Ɏw��)
        core.rootScene.addChild(back);  //��Ԕw�i
        core.rootScene.addChild(pupuBtn);  //��ԑO��
        core.rootScene.addChild(popoBtn);  //��ԑO��
        core.rootScene.addChild(pipiBtn);  //��ԑO��
    }
    core.start();
};