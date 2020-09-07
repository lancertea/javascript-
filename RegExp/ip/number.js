/**
 * Created by uedc on 2019/8/24.
 */

module.exports = {

    /**
     * 判断是否是一个数字，比如：“1.23”，字符串也算是
     * @param {Number|String} value 输入
     * @return {boolean}            是则返回true
     */
    isNumberic: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Rounds the passed number to the required decimal precision.
     * @param {Number/String} value The numeric value to round.
     * @param {Number} precision The number of decimal places to which to round the first parameter's value.
     * @return {Number} The rounded value.
     */
    round: function (value, precision) {
        let result = Number(value);
        let ten = 10;
        if (typeof precision === 'number') {
            precision = Math.pow(ten, precision);
            result = Math.round(value * precision) / precision;
        }
        return result;
    }

};
