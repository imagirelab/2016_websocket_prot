// 1.���W���[���I�u�W�F�N�g�̏�����
var fs = require("fs");
var server = require("http").createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
}).listen(3000);
var io = require("socket.io").listen(server);

// ���[�U�Ǘ��n�b�V��
var userHash = {};

// 2.�C�x���g�̒�`
io.sockets.on("connection", function (socket)
{
    log('connected');
});