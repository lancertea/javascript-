/**
 * Created by UEDC on 2019/11/12
 */

let _ = require('@sxf/i18n');
let OrCompositeValidator = require('../validation/or_composite_validator');
let IPv4 = require('./ipv4');
let IPv6 = require('./ipv6');

class IPValidator extends OrCompositeValidator {

    constructor (cfg = {}) {

        Object.assign(cfg, {
            invalidText: _('不符合IPv4或IPv6格式')
        });
        super(cfg);

        this.validators = [
            new IPv4(cfg),
            new IPv6(cfg)
        ];
    }

    findProperValidator (v) {
        if (/^[\d\.]+$/.test(v)) { // 没有冒号，只能是IPv4
            return 0;
        } else if (/^[\da-f:\.]+$/i.test(v)) { // 不是IPv4，只能是IPv6
            return 1; // IPv6
        }
        return null;
    }
}

module.exports = IPValidator;
