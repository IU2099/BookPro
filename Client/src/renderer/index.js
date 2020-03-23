const ipcRenderer = require('electron').ipcRenderer;

//wsTcp.instance().create(webUrl);
NetHttp.init().then((res) => {
    if (res.status === 200) {
        console.log(res.data);
    } else {
        console.log("系统异常, 请稍后再试");
    }
}).catch((err) => {
    console.log(err);
    if (err.message.indexOf('Network Error') >= 0) {
        console.log("网络连接失败, 请稍后再试");
        return;
    }
    console.log("系统异常, 请稍后再试");
});

window.onload = () => {
    var btn_close = this.document.querySelector('#close');
    var btn_min = this.document.querySelector('#min');
    var btn_login = this.document.querySelector('#login');
    var btn_regist = this.document.querySelector('#regist');
    var account = this.document.querySelector('#account');
    var password = this.document.querySelector('#pas');

    btn_close.onclick = () => {
        console.log('btn_close');
        ipcRenderer.send('close');
    }
    btn_min.onclick = () => {
        console.log('btn_min');
        ipcRenderer.send('min');
    }
    btn_login.onclick = () => {
        console.log('btn_login');
        console.log(account.value);
        console.log(password.value);

        NetHttp.login(account.value, password.value).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
            if (err.message.indexOf('Network Error') >= 0) {
                console.log("网络连接失败, 请稍后再试");
                return;
            }
            console.log("系统异常, 请稍后再试");
        });
    }
    btn_regist.onclick = () => {
        console.log('btn_regist');
        console.log(account.value);
        console.log(password.value);

        NetHttp.regist(account.value, password.value).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
            if (err.message.indexOf('Network Error') >= 0) {
                console.log("网络连接失败, 请稍后再试");
                return;
            }
            console.log("系统异常, 请稍后再试");
        });
    }
}



