/**
 * Created by UEDC on 2019/11/12
 */

let _ = require('@sxf/i18n');
let SimpleCompositeValidator = require('../validation/simple_composite_validator');
let Port = require('./port');

const BEGIN_INDEX = 1;
const END_INDEX = 3;

class PortRangeValidator extends SimpleCompositeValidator {

    /**
     * @cfg {Object} beginConfig (optional) 子块起始端口的配置
     * @cfg {Object} endConfig (optional) 子块结束端口的配置
     */

    constructor (cfg = {}) {

        Object.assign(cfg, {
            regex : /^(.+)(-)(.+)$/,
            matchInvalidText : _('不符合“端口-端口”的书写格式'),
            blocks : [
                {
                    name : _('起始端口'),
                    index : BEGIN_INDEX,
                    validator : new Port(cfg.beginConfig)
                },
                {
                    name : _('结束端口'),
                    index : END_INDEX,
                    validator : new Port(cfg.endConfig)
                }
            ]
        });
        super(cfg);
    }

    externalVerify (startPort, endPort) {
        let start = parseInt(startPort, 10),
            end = parseInt(endPort, 10),
            blocks = this.blocks;
        if (start > end) {
            return _('{0}不能超过{1}', blocks[0].name, blocks[1].name);
        }
        return true;
    }
}

module.exports = PortRangeValidator;
