/**
 * Created by ued on 2017/1/21.
 */

let _ = require('@sxf/i18n');
let SimpleCompositeValidator = require('../validation/simple_composite_validator');
let IPv6 = require('./ipv6');
let Maskv6 = require('./maskv6');

class IPv6Mask extends SimpleCompositeValidator {

    constructor (cfg = {}) {

        Object.assign(cfg, {

            /**
             * @cfg {Object} ipConfig (optional) 子块IP的配置
             */
            /**
             * @cfg {Object} maskConfig (optional) 子块Mask的配置
             */

            regex : /^([\da-f:.]+)(\/)(\d+)$/i,
            matchInvalidText : _('不符合“IP/Mask”的书写格式'),
            blocks : [
                {
                    name : 'IP',
                    index : 1,
                    validator : new IPv6(cfg.ipConfig)
                },
                {
                    name : _('掩码'),
                    index : 3,
                    validator : new Maskv6(cfg.maskConfig)
                }
            ]
        });
        super(cfg);
    }
};

module.exports = IPv6Mask;
