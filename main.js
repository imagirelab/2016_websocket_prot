var socket = io.connect('http://localhost:3000');

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);
    core.preload('chara1.png');
    core.fps = 15;
    core.onload = function () {
        var bear = new Sprite(32, 32);
        bear.image = core.assets['chara1.png'];
        bear.x = 0;
        bear.y = 0;
        bear.frame = 1;

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

        //�I�u�W�F�N�g�ɒǉ����鏈��(�����ɓ��ꂽ���I�u�W�F�N�g���w�肵�Ȃ��ƂȂɂ��N���Ȃ�)
        core.rootScene.addChild(bear);
    }
    core.start();
};