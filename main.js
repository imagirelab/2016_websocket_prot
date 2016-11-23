var socket = io.connect('https://safe-reef-35714.herokuapp.com/');

enchant();

window.onload = function ()
{
    var core = new Core(640, 360);
    //事前にロードを行う
    core.preload('back5.png');
    core.preload('chara1.png');
    //fpsの設定
    core.fps = 15;

    core.onload = function ()
    {
        //スプライト情報の入力
        //キャラクター
        var bear = new Sprite(32, 32);
        bear.image = core.assets['chara1.png'];
        bear.x = 0;
        bear.y = 0;
        bear.frame = 1;

        //背景
        var back = new Sprite(640, 360);
        back.image = core.assets['back5.png'];
        back.x = 0;
        back.y = 0;
        back.frame = 1;

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

        //オブジェクトに追加する処理(ここに入れたいオブジェクトを描画順に指定)
        core.rootScene.addChild(back);  //一番背景
        core.rootScene.addChild(bear);  //一番前面
    }
    core.start();
};