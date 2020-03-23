const bcrypt = require('bcryptjs');

bcrypt.genSaltSync(10);

class BCryptUtil {
    constructor() {
    }

    /**
     * 字符hash
     * @param {String} str
     * @returns {String}
     */
    hash(str) {
        return bcrypt.hashSync(str, bcrypt.genSaltSync(10));
    }

    /**
     * 字符hash匹配校验
     * @param {String} str
     * @param {String} hash
     * @returns {Boolean}
     */
    verify(str, hash) {
        return bcrypt.compareSync(str, hash);
    }
}

let bcryptUtil = new BCryptUtil();
// console.log(bcryptUtil.hash("25d55ad283aa400af464c76d713c07ad"));
module.exports = bcryptUtil;