/**
 * Created by ued on 2017/1/21.
 */

let _ = require('@sxf/i18n');
let OrCompositeValidator = require('../validation/or_composite_validator');
let IPv4 = require('./ipv4');
let IPv4Mask = require('./ipv4_mask');
let IPv4Range = require('./ipv4_range');

/*
 * 1.2.3.4
 * 1.2.3.4/255.255.255.0
 * 1.2.3.4-5.6.7.8
 */
class IPv4OrRange extends OrCompositeValidator {

    constructor (cfg = {}) {

        cfg = Object.assign({

            invalidText: _('不符合IP、IP/Mask或IP-IP的格式')

            /**
             * @cfg {Object} ipConfig (optional) 子块起始IP的配置
             */

            /**
             * @cfg {Object} ipMaskConfig (optional) 子块结束IP的配置
             */

            /**
             * @cfg {Object} ipRangeConfig (optional) 子块结束IP的配置
             */

        }, cfg);

        super(cfg);
        this.validators = [
            new IPv4(this.ipConfig),
            new IPv4Mask(this.ipMaskConfig),
            new IPv4Range(this.ipRangeConfig)
        ];
    }

    findProperValidator (v) {
        const IPV4 = 0;
        const IPV4_MASK = 1;
        const IPV4_RANGE = 2;

        if (/^[\d\.]+$/.test(v)) { // 没有“/”或“-”，只能是IP
            return IPV4;
        } else if (/^[\d\.]+\/[\d\.]+$/i.test(v)) { // 有“/”，只能是IP/Mask
            return IPV4_MASK;
        } else if (/^[\d\.]+\-[\d\.]+$/i.test(v)) { // 有“-”，只能是IP-IP
            return IPV4_RANGE;
        }
        return null;
    }
};
module.exports = IPv4OrRange;
