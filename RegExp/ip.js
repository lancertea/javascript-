/**
 * Created by uedc on 2019/8/24.
 */

let {leftPad, trim} = require('./string');
let {isNumberic} = require('./number');

const IPV4 = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;

/**
 * 把IP字符串形式转化成int32
 * @param {String} ip  格式：1.1.11.1
 * @returns {Number}   IP转化成数字
 */
function parseIPv4 (ip) {
    let v4parts;
    let v4numbers;
    let i;
    if (!IPV4.test(ip)) {
        return null;
    }

    // 解析IPv4为4个数字
    v4parts = ip.split('.');
    v4numbers = [];
    for (i = 0; i < v4parts.length; i++) {
        v4numbers.push(parseInt(v4parts[i], 10));
    }
    return v4numbers;
}

const RE_VALID_CHARS = /^[0-9a-f:.]{2,45}$/i;
const RE_PART = /^[0-9a-f]{1,4}$/i;

/* eslint-disable */
function parseIPv6 (ip, resultFormat /* = "full" */) {
    let numbers = ipv6ToNumbers(ip);

    if (!numbers) {
        return null;
    }
    switch (resultFormat) {
        case 'full':
            return fullFormatIPv6(numbers);
        case 'simple':
            return simpleFormatIPv6(numbers);
        //case "numbers":
        default:
            return numbers;
    }
}

function ipv6ToNumbers (ip) {
    let i;
    // ---------- 基础字符判断 ----------
    // 移除前后的空格换行等
    ip = trim(ip);
    // 判断长度及有效字符
    if (!RE_VALID_CHARS.test(ip)) {
        return null; // 含无效IPv6字符
    }

    // ---------- 分段简写判断 ----------
    // 判断"::"简写，并分段
    let subs = ip.split('::');
    if (subs.length > 2) {
        return null; // 简写只能有1个
    }
    // 判断是否有简写
    let hasEllipsis = subs.length > 1;
    // 将地址拆分为头部，省略部，尾部三部分。省略部及尾部可能为空。
    let headParts, tailParts, compatibleIPv4;
    headParts = subs[0] ? subs[0].split(':') : []; // 当IP如"::111"的形式时，前部是空的
    tailParts = hasEllipsis && subs[1] ? subs[1].split(':') : [];
    // 判断是否有IPv4兼容字符
    compatibleIPv4 = ip.indexOf('.') >= 0;

    // 计算显式声明的段数量，IPv4兼容格式的一段等于IPv6的两段
    let implictPartCount = headParts.length + tailParts.length + (compatibleIPv4 ? 1 : 0);
    if (implictPartCount > 8 || implictPartCount === 8 && hasEllipsis) {
        return null; // "::"必定有省略，如果含"::"并且还是有8段，那表明地址非法
    }

    // 生成补全后的段
    let parts = headParts;
    if (hasEllipsis) {
        for (i = 8 - implictPartCount; i > 0; i--) {
            parts.push('0');
        }
        parts = parts.concat(tailParts);
    }
    // debug
    if (parts.length !== (compatibleIPv4 ? 7 : 8)) {
        //throw "parseIPv6 logic error!";
        return null; // 长度不对
    }
    // ---------- 各段格式判断，并转换为数字 ----------
    // 验证各段有效性
    let part, numParts = [], checkNum = compatibleIPv4 ? 6 : 8;
    for (i = 0; i < checkNum; i++) {
        part = parts[i];
        if (!RE_PART.test(parts[i])) {
            return null;
        }
        numParts.push(parseInt(part, 16));
    }
    let ipv4, v4numbers;
    if (compatibleIPv4) {
        ipv4 = parts[6];
        // 最后一段有可能是IPv4兼容格式
        v4numbers = parseIPv4(ipv4);
        if (!v4numbers) {
            return null; // 非法的IPv4地址
        }
        // 还原为IPv6的7,8段
        numParts.push(v4numbers[0] * 0x100 + v4numbers[1]);
        numParts.push(v4numbers[2] * 0x100 + v4numbers[3]);
    }
    return numParts;
}

function fullFormatIPv6 (numbers) {
    let strs = [], i;
    for (i = 0; i < numbers.length; i++) {
        strs.push(leftPad(numbers[i].toString(16), 4, '0'));
    }
    return strs.join(':');
}

function simpleFormatIPv6 (numbers) {
    let strs, i;

    /*
     * 简化的方法是：
     * 1. 前导0可以去掉，这点直接toString(16)就可以了
     * 2. 连续的0可以省略，这里还要检测一下最长的0串
     */
    // 查找最长的连续0，必须大于1
    let number, start = 0, len = 0, maxStart = 0, maxLen = 0;
    for (i = 0; i < numbers.length; i++) {
        number = numbers[i];
        if (number === 0) {
            len++;
            if (len > maxLen) {
                maxStart = start;
                maxLen = len;
            }
        } else {
            len = 0;
            start = i + 1;
        }
    }
    let frontPart, endPart, frontStr, endStr;
    if (maxLen > 1) { // 有可简化为“::”的段
        frontPart = numbers.slice(0, maxStart);
        endPart = numbers.slice(maxStart + maxLen);

        strs = [];
        for (i = 0; i < frontPart.length; i++) {
            strs.push(frontPart[i].toString(16));
        }
        frontStr = strs.join(':');

        strs = [];
        for (i = 0; i < endPart.length; i++) {
            strs.push(endPart[i].toString(16));
        }
        endStr = strs.join(':');

        return frontStr + '::' + endStr;
    } else { // 无法简化
        strs = [];
        for (i = 0; i < numbers.length; i++) {
            strs.push(numbers[i].toString(16));
        }
        return strs.join(':');
    }
}

function ipv4ToNumber (ip) {
    ip = parseIPv4(ip);
    if (!ip) {
        return NaN;
    }
    let num = 0;
    let byte = 256;
    num = Number(ip[0]) * byte * byte * byte + Number(ip[1]) * byte * byte + Number(ip[2]) * byte + Number(ip[3]);
    num = num >>> 0;
    return num;
}

function numberToIPv4 (num) {
    if (!isNumberic(num)) {
        throw `${num} is an invalide number`;
    }
    let str;
    let tt = [];

    /* eslint-disable no-magic-numbers */
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3]);
    return str;

    /* eslint-enable no-magic-numbers */
}

/**
 * 获取IP段中的所有IP，仅支持IPv4
 * @param {String} ip1
 * @param {String} ip2
 * @returns {Array<String>}
 */
function getIpByIpRange (ip1, ip2) {
    let ipInt1 = ipv4ToNumber(ip1);
    let ipInt2 = ipv4ToNumber(ip2);
    let ret = [];
    if (ipInt1 > ipInt2) {
        let temp = ipInt2;
        ipInt2 = ipInt1;
        ipInt1 = temp;
    }
    for (let i = ipInt1; i <= ipInt2; i++) {
        ret.push(numberToIPv4(i));
    }
    return ret;
}

module.exports = {

    ipv4ToNumber,
    numberToIPv4,

    ipv6ToNumbers,

    // numbersToIPv6,

    parseIPv4,
    parseIPv6,

    getIpByIpRange
};
