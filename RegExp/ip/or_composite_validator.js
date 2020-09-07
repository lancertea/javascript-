/**
 * Created by uedc on 2019/10/22.
 */

let Validator = require('./validator');
let _ = require('@sxf/i18n');

/**
 * 与组合校验器，当配置的多个校验器有一个通过，则通过。
 * @class OrCompositeValidator
 * @extends Validator
 */
class OrCompositeValidator extends Validator {

    constructor (cfg) {
        cfg = Object.assign({

            /**
             * @cfg {Array} validators 校验器数组，只要其中有一个通过校验，则通过。
             */
            invalidText: _('校验未通过')

        }, cfg);
        super(cfg);

        // Object.assign(this, cfg || {});

        if (!this.validators) {
            this.validators = [];
        }
        this.validators.forEach((validator, index, arr) => {
            if (typeof validator === 'string') {
                arr[index] = new Validator({
                    type: validator
                });
            }
        });
    }

    /**
     * 获取怡当的校验器索引，可能附带有验证结果。
     * 扩展时需保证返回的是最终可能正确选项，即如果它检验不通过，则其它校验器也不会通过。
     * 如果一个都不匹配可以返回null
     * @extendable
     * @param {*} value 需要校验的数据
     * @return {Number/Object} result 返回校验器索引，
     * 或返回索引及校验结果：index和result（可能校验不通过）
     * 如果一个都不满足也可返回null
     */
    findProperValidator (value) {
        let i;
        let validators = this.validators;
        let validator;
        let result;
        for (i = 0; i < validators.length; i++) {
            validator = validators[i];
            result = validator.verify(value);
            if (result === true) {
                return {
                    index: i,
                    result: result
                };
            }
        }
        return null;
    }

    verify (value) {
        let result = this.findProperValidator(value);
        if (typeof result !== 'number' || isNaN(result)) {
            return result ? result.result : this.invalidText;
        }
        return this.validators[result].verify(value);
    }

    formalize (value) {
        let result = this.findProperValidator(value);
        let index;
        if (typeof result === 'number' && !isNaN(result)) {
            index = result;
        } else {

            // 一个都不匹配
            if (result === null) {
                return null;
            } else if (result.result !== true) {
                return null; // 最可能的那个也检验不通过
            }
            index = result.index;
        }
        return this.validators[index].formalize(value);
    }
}

module.exports = OrCompositeValidator;
