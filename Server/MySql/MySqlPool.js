var mysql = require("mysql");

class MySqlPool {
    constructor() {
        this.__init__ = false;
    }
    init() {
        this.pool = mysql.createPool({
            host: '119.28.41.16',//远程MySQL数据库的ip地址
            user: 'root',
            password: 'iu520',
            database: 'BookPro'
        });
        this.__init__ = true;
    }
    /**
    * 获取连接
    */
    async query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    return reject(err);
                }
                connection.query(sql, args, (err, result) => {
                    //释放连接
                    connection.release();
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
    }
}

let pool = new MySqlPool();
module.exports = pool;