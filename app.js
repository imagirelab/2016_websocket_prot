// 1.モジュールオブジェクトの初期化
var fs = require("fs");
var server = require("http").createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
}).listen(3000);
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// 2.イベントの定義
io.sockets.on("connection", function (socket)
{
    log('connected');
});