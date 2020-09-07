/**
 * IPv4范围检验器
 * @type {*|SF.validation.SimpleCompositeValidator}
 */

let _ = require('@sxf/i18n');
let SimpleCompositeValidator = require('../validation/simple_composite_validator');
let IPv4 = require('./ipv4');
let {parseIPv4} = require('../format/ip');

class IPv4Range extends SimpleCompositeValidator {

    constructor (cfg = {}) {
        Object.assign(cfg, {
            regex: /^(.+)(-)(.+)$/,
            matchInvalidText: _('不符合IPv4类型“IP-IP”的书写格式'),
            blocks: [
                {
                    name: _('起始IP'),
                    index: 1,
                    validator: new IPv4()
                },
                {
                    name: _('结束IP'),
                    index: 3,
                    validator: new IPv4()
                }
            ]
        });
        super(cfg);
    }

    externalVerify (startIP, endIP) {
        let start = parseIPv4(startIP),
            end = parseIPv4(endIP);
        for (let i = 0; i < start.length; i++) {
            let a = start[i];
            let b = end[i];
            if (a < b) {
                break;
            } else if (a > b) {
                return _('起始IP不能超过结束IP');
            }
        }
        return true;
    }
};

module.exports = IPv4Range;
