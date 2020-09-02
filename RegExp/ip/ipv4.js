/**
 * Created by ued on 2016/11/2.
 */

let _ = require('@sxf/i18n');
let Validator = require('../validation/validator');
let { parseIPv4 } = require('../format/ip');

class IPv4Validator extends Validator {
    verify (value) {
        let result = parseIPv4(value);
        if (result) {
            return true;
        }
        return _('不符合IPv4格式');
    }
}

module.exports = IPv4Validator;
