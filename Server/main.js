var express = require('express');
var config = require('./config');//引入配置文件
var userMange = require("./userMange/UserMange");
const { BusiError, SysError } = require('./exception/exception');


var app = express();

// var connection = sql.createConnection({
//     host: '119.28.41.16',//远程MySQL数据库的ip地址
//     user: 'root',
//     password: '123456',
//     database: 'BookProDB'
// });
// connection.connect();

app.listen(port, host, () => {//监听
    console.log(`服务器运行在http://${host}:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', function (req, res) {
    var data = {
        data: '链接成功',
    }
    res.send(data);
});

app.post('/login', function (req, res) {
    let account = req.body.account;
    let password = req.body.password;

    userMange.login(account, password).then((data) => {
        res.send({ code: 200, msg: "success", data: data });
    }).catch((err) => {
        let msg = "系统异常, 请稍后再试";
        console.log("err:", err);
        if (err instanceof BusiError) {
            msg = err.message;
        }
        res.send({ code: 500, msg: msg });
    });
})
app.post('/regist', function (req, res) {
    let account = req.body.account;
    let password = req.body.password;

    if (account === "" && account.length < 6) {
        res.send({ code: 500, msg: '请输入6位以上的密码' });
        return;
    }
    if (password === "" && password.length < 6) {
        res.send({ code: 500, msg: '请输入6位以上的密码' });
        return;
    }
    userMange.regist(account, password).then((data) => {
        res.send({ code: 200, msg: "success", data: data });
    }).catch((err) => {
        let msg = "系统异常, 请稍后再试";
        console.log("err:", err);
        if (err instanceof BusiError) {
            msg = err.message;
        }
        res.send({ code: 500, msg: msg });
    });
})