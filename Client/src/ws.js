const net = require('net');
var port = 9090;
var host = 'localhost';


var wsTcp = (() => {
    function wsTcp() { }

    var __proto = wsTcp.prototype;
    var socket = null;

    __proto.create = (url) => {
        //socket = new WebSocket("ws://127.0.0.1:9090/chatsocket");
        //socket = new WebSocket(url);

        socket = new net.Socket();

        //连接服务器
        socket.connect(port, host)

        socket.on('connect', function () {
            console.log('【连接成功】')
            socket.write("客户端已连接");
        })
        socket.on('data', function (data) {
            console.log('【收到消息】', data.toString())
        })
        socket.on('error', function () {
            console.log('【断开链接】')
        })
        socket.on('end', function (evt) {
            console.log('【发生错误】', evt)
        })
    }
    __proto.send = (data) => {
        console.log('发送数据 ', data);
        var buf = Buffer.from(data);
        socket.write(buf);
        // socket.write(data[, encoding][, callback])
        // 在 socket 上发送数据。第二个参数指定了字符串的编码，默认是 UTF8 编码。
    }


    wsTcp._instance = null;
    wsTcp.instance = () => {
        if (!wsTcp._instance) {
            wsTcp._instance = new wsTcp();
        }
        return wsTcp._instance;
    }
    return wsTcp;
})()






