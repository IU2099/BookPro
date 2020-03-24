var axios = require('axios');
var config = require('./config/config.js');
const crypto = require('crypto');

function md5(data) {
    // 以md5的格式创建一个哈希值
    let hash = crypto.createHash('md5');
    return hash.update(data).digest('base64');
}

function httpPost(url, args) {
    console.log("Send Http Post::" + url);
    return axios.post(webUrl + url, args);
}
function get(route, args, fun) {
    console.log("Send get Post::" + url);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var res;
                try {
                    res = JSON.parse(xhr.responseText);
                    var len = xhr.responseText.length;
                    Log.log('从\"' + route + '\""接收到数据', res);
                    if (res.code === 200) {
                        if (fun) {
                            fun('success', res);
                        }
                    } else {
                        if (fun) {
                            fun('failed', res);
                        }
                    }
                } catch (e) {
                    Log.warn('error ' + e.message + e.stack);
                    fun('str', xhr.responseText);
                }
            } else {
                fun('failed', null);
            }
        }
    };
}

var NetHttp =
{
    init: function (account, password) {
        return httpPost("/", '链接服务器')
    },
    login: function (account, password) {
        return httpPost("/login", {
            account: account,
            password: md5(password)
        })
    },
    regist: function (account, password) {
        return httpPost("/regist", {
            account: account,
            password: md5(password)
        })
    },
}