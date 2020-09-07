/**
 * Created by ued on 2017/1/21.
 */

let _ = require('@sxf/i18n');
let SimpleCompositeValidator = require('../validation/simple_composite_validator');
let IPv4 = require('./ipv4');
let Maskv4 = require('./maskv4');

let { leftPad, formatString } = require('../format/string');
let { parseIPv4 } = require('../format/ip');

/* eslint-disable no-magic-numbers,@sxf/sfchecklist/if-thinner-than-else */

class IPv4Mask extends SimpleCompositeValidator {

    constructor (cfg = {}) {
        Object.assign(cfg, {
            regex: /^([\d.]+)(\/)([\d.]+)$/,
            matchInvalidText: _('不符合“IP/Mask”的书写格式'),
            blocks: [
                {
                    name: 'IP',
                    index: 1,
                    validator: new IPv4()
                },
                {
                    name: _('掩码'),
                    index: 3,
                    validator: new Maskv4()
                }
            ]
        });

        super(cfg);
    }

    verify (value) {
        let flag = super.verify.apply(this, arguments);
        if (flag === true) {//先符合ip/mask格式 再验证主机位全0
            let matchResult = value.match(this.regex),
                ip, binIP,
                mask, masks, binMask, i;
            if (matchResult) {
                ip = parseIPv4(matchResult[1]);
                if (ip) {
                    binIP = '';
                    for (i = 0; i < ip.length; i++) {
                        binIP += leftPad(ip[i].toString(2), 8, '0');
                    }
                }
                mask = matchResult[3];
                let index;
                if (mask.indexOf('.') > -1) {//255.255.0.0格式
                    masks = parseIPv4(mask);
                    binMask = '';
                    for (i = 0; i < masks.length; i++) {
                        binMask += leftPad(masks[i].toString(2), 8, '0');
                    }
                    index = binMask.indexOf('0');//得到从哪里开始为0。如果是全1的情况，index会返回-1
                    index = index > -1 ? index : 32;
                } else {
                    index = parseInt(mask, 10);//数字格式
                    binMask = leftPad('', 32, '0');
                }

                if (binMask.substring(index) === binIP.substring(index)) {
                    return true;
                }
                let suggestStr = binIP.substring(0, index) + leftPad('', 32 - index, '0'),
                    suggestIP = formatString('{0}.{1}.{2}.{3}',
                        parseInt(suggestStr.substring(0, 8), 2),
                        parseInt(suggestStr.substring(8, 16), 2),
                        parseInt(suggestStr.substring(16, 24), 2),
                        parseInt(suggestStr.substring(24, 32), 2)
                    );
                return _('原因是：主机位要求全0，修改建议：{0}/{1}', suggestIP, mask);

            }
        } else {
            return flag;
        }
    }
};

module.exports = IPv4Mask;

/* eslint-enable no-magic-numbers,@sxf/sfchecklist/if-thinner-than-else */
