var http = require('http');
//�T�[�o�C���X�^���X�쐬
var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('server connected');
});
var io = require('socket.io').listen(server);

server.listen(3000);//8888�ԃ|�[�g�ŋN��

console.log("Server started.");

io.sockets.on("connection", function (socket) {
    console.log("connect new cliant");
});