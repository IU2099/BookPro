class CommonError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BusiError extends CommonError {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

class SysError extends CommonError {
    constructor(error) {
        super(error.message);
        this.data = { error };
    }
}

class ErrorResult {
    constructor(err, data){
        let code = 500;
        let msg = "系统异常, 请稍后再试";
        console.logw(err);
        if (err instanceof BusiError){
            msg = err.message;
            code = err.code;
            if(err.data){
                this.data = err.data;
            }
            
        }else if (err instanceof SysError){
            msg = err.message;
        }

        if(data){
            this.data = data;
        }

        this.code = code;
        this.msg = msg;
    }
}

module.exports = {
    BusiError,
    SysError,
    ErrorResult
};