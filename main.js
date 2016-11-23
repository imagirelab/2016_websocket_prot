var socket = io.connect('https://safe-reef-35714.herokuapp.com/');

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);
    //���O�Ƀ��[�h���s��
    core.preload('back5.png');
    core.preload('chara1.png');
    //fps�̐ݒ�
    core.fps = 15;

    core.onload = function ()
    {
        //�X�v���C�g���̓���
        //�L�����N�^�[
        var bear = new Sprite(32, 32);
        bear.image = core.assets['chara1.png'];
        bear.x = 0;
        bear.y = 0;
        bear.frame = 1;

        //�w�i
        var back = new Sprite(640, 360);
        back.image = core.assets['back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

        //�L�[�{�[�h���쎞
        bear.addEventListener('enterframe', function ()
        {
            if (core.input.left)
            {
                this.x -= 5;
                this.scale = (-1, 1);
                this.frame = this.age % 3;
            }
            if (core.input.right)
            {
                this.x += 5;
                this.frame = this.age % 3;
            }
            if (core.input.up)
            {
                this.y -= 5;
                this.frame = this.age % 3;
            }
            if (core.input.down)
            {
                this.y += 5;
                this.frame = this.age % 3;
            }
        });

        //�X�}�z�ł�����ł���悤�Ƀ^�b�`�����^
        bear.on('touchstart', function ()
        {
            //�N�}������
            //core.rootScene.removeChild(this);
        });

        //�N�}�����W�ɓ������������͖{�̂���̍��W���󂯎���Ĉړ�����悤�ɂ���B
        core.rootScene.on('touchstart', function(pos)
        {
            bear.x = pos.x;
            bear.y = pos.y;
        });

        //�I�u�W�F�N�g�ɒǉ����鏈��(�����ɓ��ꂽ���I�u�W�F�N�g��`�揇�Ɏw��)
        core.rootScene.addChild(back);  //��Ԕw�i
        core.rootScene.addChild(bear);  //��ԑO��
    }
    core.start();
};