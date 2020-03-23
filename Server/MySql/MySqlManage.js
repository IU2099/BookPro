const mysqlPool = require('../MySql/MySqlPool')
const { BusiError, SysError } = require('../exception/exception');

mysqlPool.init();

class MySqlManage {
    constructor() { }
    async getUserByMobile(mobile) {
        let sql = 'select * from users where account=?';
        let args = [mobile];
        let res = await mysqlPool.query(sql, args);
        if (res) {
            return res[0];
        }
        return null;
    }
    async createUser(account, password) {
        let sql = 'select * from users where account=?';
        let args = [account];
        let res = await mysqlPool.query(sql, args);
        if (!res || res.length === 0) {
            sql = 'insert into users (account,uid,password,createTime)' + ' values(?,?,?,?)';
            let uid = this.RandomUid(7);
            let createTime = new Date().getTime();
            args = [account, uid, password, createTime];
            res = await mysqlPool.query(sql, args);
            if (res) {
                console.log("创建用户成功 ", uid, account, createTime, password);
                return {
                    code: 200,
                    data: {
                        uid: uid,
                        name: 'hhh',
                        account: account,
                    },
                    msg: "注册成功"
                };
            }
        }
        if (res) {
            return { code: 500, msg: "该用户已经被注册" };
        }
        return null;
    }








    RandomUid(len) {
        let $chars = '0123456789';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            pwd = Number(pwd);

            pwd += "";
        }
        return pwd;
    }
}
let manage = new MySqlManage();
module.exports = manage;


