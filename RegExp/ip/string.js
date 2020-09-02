/**
 * Created by uedc on 2019/8/24.
 */

const FORMAT_RE = /\{(\d+)\}/g;

module.exports = {

    trim (string) {
        if (!string && string !== 0) {
            return '';
        }
        if (typeof string !== 'string') {
            string += '';
        }
        if (typeof string.trim === 'function') {
            return string.trim();
        }
        return string.replace(/(^\s*)|(\s*$)/g, '');
    },

    multiTrim: function (v, split, join) {
        let ret = [];
        v = v || '';
        v = v.split(split || ',');
        v.forEach(function (item) {
            item = item.trim();
            if (item) {
                ret.push(item);
            }
        }, this);
        return ret.join(join || ',');
    },

    leftPad (string, size, character) {
        let result = String(string);

        character = character || ' ';

        while (result.length < size) {
            result = character + result;
        }

        return result;
    },

    formatString (format, ...args) {
        return format.replace(FORMAT_RE, function (m, i) {
            return args[i];
        });
    },

    /**
     * 增加中文字符长度判断，在UTF8中，通常中文字符占三字节，所以一个中文字符长度==3个英文字符长度
     * @param {string} s
     * @return {number} 字符串实际长度
     */
    getUTF8Length (s) {
        let totalLength = 0;
        let i;
        let charCode;
        if (!s && s !== 0) {
            s = '';
        }
        s = String(s);

        const ONE = 1;
        const TWO = 2;
        const THREE = 3;

        const U_7F = 0x007f;
        const U_80 = 0x0080;
        const U_7FF = 0x07ff;
        const U_800 = 0x0800;
        const U_FFFF = 0xffff;

        for (i = 0; i < s.length; i++) {
            charCode = s.charCodeAt(i);
            if (charCode < U_7F) {
                totalLength = totalLength + ONE;
            } else if ((U_80 <= charCode) && (charCode <= U_7FF)) {
                totalLength += TWO;
            } else if ((U_800 <= charCode) && (charCode <= U_FFFF)) {
                totalLength += THREE;
            }
        }
        return totalLength;

    },

    str2arr (str, split = '\n') {
        return module.exports.multiTrim(str, split, split).split(split).filter(item => !!item);
    }

};
