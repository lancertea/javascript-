/**
 * Created by hjh on 2018/4/13.
 */

let _ = require('@sxf/i18n');
let Validator = require('../validation/validator');
let { parseIPv6 } = require('../format/ip');

module.exports =  class IPv6Validator extends Validator {
    verify (value) {
        let result = parseIPv6(value);
        if (result) {
            return true;
        }
        return _('不符合IPv6格式');
    }
};
