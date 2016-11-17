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

        //キーボード操作時
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

        //スマホでも操作できるようにタッチ反応型
        bear.on('touchstart', function ()
        {
            //クマを消す
            //core.rootScene.removeChild(this);
        });

        //クマを座標に動かしたい時は本体からの座標を受け取って移動するようにする。
        core.rootScene.on('touchstart', function(pos)
        {
            bear.x = pos.x;
            bear.y = pos.y;
        });

        //オブジェクトに追加する処理(ここに入れたいオブジェクトを指定しないとなにも起きない)
        core.rootScene.addChild(bear);
    }
    core.start();
};