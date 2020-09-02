/**
 * Created by ued on 2017/1/17.
 */

let _ = require('@sxf/i18n');
let Validator = require('../validation/validator');

const REGEXP = /^\d+$/i;
const MIN = 0;
const MAX = 65536;

class PortValidator extends Validator {

    constructor (options = {}) {
        super(options);

        this.allowZero = options.allowZero === true;
    }

    verify (value) {
        let port;
        const INVALID_TEXT = _('不符合端口格式，有效取值范围为{0}', this.allowZero ? '0~65535' : '1~65535');

        if (REGEXP.test(value)) {
            if (String(value).length > 1 && String(value)[0] === '0') {
                return INVALID_TEXT;
            }

            port = parseInt(value, 10);
            if (port >= MIN + (this.allowZero ? 0 : 1) && port < MAX) {
                return true;
            }
            return INVALID_TEXT;
        }
        return _('不符合端口格式');
    }
};

module.exports = PortValidator;
