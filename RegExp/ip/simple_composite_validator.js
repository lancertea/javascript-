/**
 * Created by uedc on 2019/10/22.
 */

let Validator = require('./validator');
let _ = require('@sxf/i18n');

let {formatString} = require('../format/string');

/**
 * 简单组合校验器，通过简单的正则表达式进行拆分校验。  <br />
 * 例如“username:password”，通过正则“^(\w+):(\w+)$”拆分，定义的blocks如下： <br />
 * [{ name: "用户名", validator: usernameValidator}, { name: "密码", validator: passwordValidator}]
 * @class SimpleCompositeValidator
 * @extends Validator
 */
class SimpleCompositeValidator extends Validator {

    /**
     * 构造函数
     * @param {Object} cfg   配置项
     * @cfg {Array} blocks 定义正则表达式中对应的区块，每个区块对应正则中的括号匹配，
     * 含3个属性：name、index和validator。name用于校验出错时格式化出错定位信息，
     * index用于映射{@link #regex}中的块，validator则为对应的校验器。
     */
    constructor (cfg) {
        cfg = Object.assign({

            /**
             * @cfg {RegExp} regex 匹配的正则表达式，它用于拆分文本并与{@link #blocks}中的配置对应。 <br />
             * 注意此正则需要使用括号将整个文本分离，例如/^(\w+)#(\w+)$/就是不正确的，应该是/^(\w+)(#)(\w+)$/。 <br />
             * 它对应的两个validator的index分别为1与3。 <br />
             * 只有这样，formalize接口才能根据groups还原出完整的文本。
             */
            regex: /(.*)/i,

            /**
             * @cfg {String} matchInvalidText 当正则匹配失败时返回的错误信息。
             */
            matchInvalidText: _('格式有误'),

            /**
             * @cfg {String} invalidText 当区块校验失败时返回的错误信息，可以含0、1占位符（{0},{1}），
             * 分别表示区块名及区块校验器返回的错误信息。
             */
            invalidText: '{0}{1}'
        }, cfg);
        super(cfg);

        // Object.assign(this, cfg || {});
        let me = this;
        if (!this.blocks) {
            this.blocks = [];
        }

        // 生成block映射Map，方便快速查找
        this.blockMap = {};
        this.blocks.forEach(function (block, index) {
            me.blockMap[block.index || index + 1] = block;
        }, this);
    }

    verify (value) {
        let matchResult;
        let result;
        let i;
        let block;
        let blockTexts;
        if (value && value.match) {
            matchResult = value.match(this.regex);
            if (matchResult) {

                // 先进行blocks单独验证
                for (i = 1; i < matchResult.length; i++) {

                    // 如果没有匹配上（形如 (.+)?的正则）
                    if (matchResult[i] && this.blockMap.hasOwnProperty(i)) {
                        block = this.blockMap[i];
                        if (!block) {
                            throw formatString('block {0} is empty!', i);
                        }
                        result = block.validator.verify(matchResult[i]);
                        if (typeof result === 'string') {
                            return formatString(this.invalidText, block.name, result);
                        }
                    }
                }

                // 再进行额外验证
                blockTexts = [];
                for (i = 0; i < this.blocks.length; i++) {
                    block = this.blocks[i];
                    blockTexts.push(matchResult[block.index]);
                }
                result = this.externalVerify.apply(this, blockTexts);
                if (typeof result === 'string') {
                    return result;
                }
                return true;
            }
        }
        return this.matchInvalidText;
    }

    /**
     * 外部可以用额外的校验
     * @param {String} arg1  根据block中的配置
     * @return {Boolean/String} result 如果通过，返回true，否则返回错误描述字符串
     */
    externalVerify () {
        return true;
    }

    formalize (value) {
        let me = this;
        let strs = [];
        let changed = false;
        const CNT = 2;
        if (value && value.replace) {
            value.replace(this.regex, function (/*text*/) {
                let i;
                let block;
                let groupText;
                let result;
                for (i = 1; i < arguments.length - CNT; i++) {
                    groupText = arguments[i];
                    strs.push(groupText);
                    if (me.blockMap.hasOwnProperty(i)) {
                        block = me.blockMap[i];
                        result = block.validator.formalize(groupText);
                        if (result) {
                            changed = true;
                            strs[i - 1] = result;
                        }
                    }
                }
            });
            if (changed) {
                return strs.join('');
            }
        }
        return null;
    }
}

module.exports = SimpleCompositeValidator;
