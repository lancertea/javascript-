/**
 * 校验端口或者端口范围
 */

import Port from '@sxf/util/validations/port.js';
import PortRange from '@sxf/util/validations/port_range.js';

const PORT_CONFIG = {
    allowZero: true
};

class PortOrRange {
    constructor () {
        this.invalidText = '不符合端口或者“端口-端口”格式，端口有效取值范围为0~65535';
        this.validators = [
            new Port(PORT_CONFIG),
            new PortRange({
                beginConfig: PORT_CONFIG
            })
        ];
    }

    findProperValidator (v) {
        const PORT = 0;
        const PORT_RANGE = 1;

        if (/^[\d]+$/.test(v)) { // 没有“-”，只能是单个端口
            return PORT;
        } else if (/^[\d]+\-[\d]+$/i.test(v)) { // 有“-”，只能是端口-端口
            return PORT_RANGE;
        }
        return null;
    }

    verify (v) {
        let properValidator = this.findProperValidator(v),
            validator = {};

    if (typeof properValidator !== 'undefined' && properValidator !== null) {
        validator = this.validators[properValidator];
        return  validator.verify(v);
    }
        return this.invalidText;
    }

}

export default PortOrRange;
