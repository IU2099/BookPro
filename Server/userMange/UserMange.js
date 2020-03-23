var mysqlManage = require('../MySql/MySqlManage')
var bcryptUtil = require('../util/bcryptUtil');

const { BusiError, SysError } = require('../exception/exception');

class UserMange {
    constructor() { }
    async login(account, password) {
        let ret = await mysqlManage.getUserByMobile(account);
        if (ret === null || ret === undefined) {
            console.log("用户不存在:", account);
            throw new BusiError(500, "用户不存在");
        }
        let res = bcryptUtil.verify(password, ret.password);
        if (!res) {
            console.log("密码错误:", account);
            throw new BusiError(500, "密码错误");
        }
    }
    async regist(account, password) {
        let psw = bcryptUtil.hash(password);
        let ret = await mysqlManage.createUser(account, psw);
        if (ret.code === 500) {
            throw new BusiError(500, "注册失败:" + ret.msg);
        }
        if (ret.code === 200) {
            return ret.data;
        }
    }
}

let userMange = new UserMange();
module.exports = userMange;