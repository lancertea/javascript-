/**
 * Created by ued on 2017/1/21.
 */

let _ = require('@sxf/i18n');
let SimpleCompositeValidator = require('../validation/simple_composite_validator');
let IPv6 = require('./ipv6');
let {parseIPv6} = require('../format/ip');

class IPv6Range extends SimpleCompositeValidator {

    constructor (cfg = {}) {
        Object.assign(cfg, {

            /**
             * @cfg {Object} beginConfig (optional) 子块起始IP的配置
             */
            /**
             * @cfg {Object} endConfig (optional) 子块结束IP的配置
             */

            regex: /^(.+)(-)(.+)$/,
            matchInvalidText: _('不符合IPv6类型“IP-IP”的书写格式'),
            blocks: [
                {
                    name: _('起始IP'),
                    index: 1,
                    validator: new IPv6(cfg.beginConfig)
                },
                {
                    name: _('结束IP'),
                    index: 3,
                    validator: new IPv6(cfg.endConfig)
                }
            ]
        });
        super(cfg);
    }

    externalVerify (startIP, endIP) {
        var start = parseIPv6(startIP),
            end = parseIPv6(endIP), 
            i, a, b;
        for (i = 0; i < start.length; i++) {
            a = start[i];
            b = end[i];
            if (a < b) {
                break;
            } else if (a > b) {
                return _('起始IP不能超过结束IP');
            }
        }
        return true;
    }
};

module.exports = IPv6Range;
