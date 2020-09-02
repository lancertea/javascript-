/**
 * Created by ued on 2017/1/21.
 */

let _ = require('@sxf/i18n');
let OrCompositeValidator = require('../validation/or_composite_validator');
let IPv6 = require('./ipv6');
let IPv6Mask = require('./ipv6_mask');
let IPv6Range = require('./ipv6_range');

/*
 * 2001::1
 * 2001::1/96
 * 2001::1-2001::ffff
 */
class IPv6OrRange extends OrCompositeValidator {

    constructor (cfg = {}) {
        Object.assign(cfg, {
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
        });

        super(cfg);

        this.validators = [
            new IPv6(this.ipConfig),
            new IPv6Mask(this.ipMaskConfig),
            new IPv6Range(this.ipRangeConfig)
        ];
    }

    findProperValidator (v) {
        const IPV6 = 0;
        const IPV6_MASK = 1;
        const IPV6_RANGE = 2;

        if (/^[\da-f:\.]+$/i.test(v)) {

            // 没有“/”或“-”，只能是IP
            return IPV6;

        } else if (/^[\da-f:\.]+\/[\da-f:\.]+$/i.test(v)) {

            // 有“/”，只能是IP/Mask
            return IPV6_MASK;

        } else if (/^[\da-f:\.]+\-[\da-f:\.]+$/i.test(v)) {

            // 有“-”，只能是IP-IP
            return IPV6_RANGE;

        }
        return null;
    }
};

module.exports = IPv6OrRange;
