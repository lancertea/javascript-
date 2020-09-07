/**
 * Created by ued on 2017/1/21.
 */


let _ = require('@sxf/i18n');
let Validator = require('../validation/validator');

const MAX = 128;

class Maskv6 extends Validator {

    verify (value) {
        if (!value) {
            return _('不能为空');
        }
        if (!/^\d+$/.test(value)) {
            return _('只能是数字');
        }
        value = parseInt(value, 10);
        if (value < 0 || value > MAX) {
            return _('取值范围为0~128');
        }
        return true;
    }
};

module.exports = Maskv6;
