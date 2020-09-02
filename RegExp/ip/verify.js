/**
 * 表单校验
 */

import SfVueComponent from '@sxf/sf-vue-component';
import IPv6OrRange from '@sxf/util/validations/ipv6_or_range.js';
import IPv4OrRange from '@sxf/util/validations/ipv4_or_range.js';
import IPv6Range from '@sxf/util/validations/ipv6_range.js';
import IPv4Range from '@sxf/util/validations/ipv4_range.js';
import IP from '@sxf/util/validations/ip.js';
import PortOrRange from './port_or_range.js';

/**
 * 用来处理textarea输入内容，将文本域中输入按换行分割为数组 示例： 'xxx'.split(TEXTAREA_REGEX) => ['xxx']
 * @type {RegExp}
 */
export const TEXTAREA_REGEX = /(?:[\s\uFEFF\xA0]*\r?\n[\s\uFEFF\xA0]*)+/;

/**
 * 校验密码
 */
export const PASSWORD_REGEX = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*"`|{};:<>?()',\\.\s\-+=\/\[\]]+)$)^[\w~!@#$%^&*"`|{};:<>?()',\\.\s\-+=\/\[\]]{8,15}$/;
export const PASSWORD_REGEX_TEXT = '密码长度为8-15位，至少包含字母、数字、特殊字符中的两种（特殊字符支持~!@#$%^&*"`|{};:<>?()\',\\. -+=/[]）';

/**
 * soc工作流新增/修改设备校验密码
 */
export const DEVICE_PASSWORD_REGEX = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*"`|{};:<>?()',\\.\s\-+=\/\[\]]+)$)^[\w~!@#$%^&*"`|{};:<>?()',\\.\s\-+=\/\[\]]{8,15}$/;
export const DEVICE_PASSWORD_REGEX_TEXT = '输入的密码必须为8-15位，且至少包含数字、字母和特殊字符中的两种';

/**
 * 校验联系人
 */
export const CONTACT_REGEX = /^[A-Za-z0-9_\u4e00-\u9fa5]{1,30}$/;
export const CONTACT_REGEX_TEXT = '联系人只能由汉字、数字、字母、下划线组成，长度不能超过30个字符';

/**
 * 校验单位名称
 */
export const UNIT_REGEX = /^[A-Za-z0-9_\u4e00-\u9fa5\s\(\)\[\]<>\{\}·\|\-]{1,128}$/;
export const UNIT_REGEX_TEXT = '单位名称只能由汉字、数字、字母、空格或部分特殊字符（_()[]<>{}·|-）组成，长度不能超过128个字符';

/**
 * 检验电话
 */
export const PHONE_REGEX = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
export const PHONE_REGEX_TEXT = '请输入正确的联系电话';

/**
 * 检验手机号
 */
export const TELLPHONE_REGEX = /^((\+86)|(86))?(1[3456789][0-9])\d{8}$/;
export const TELLPHONE_REGEX_TEXT = '请输入正确的联系电话';


/**
 * 校验邮箱
 */
export const VMS_EMAIL_REGEX = /^[a-zA-Z0-9][-|a-z0-9A-Z._]{0,64}@[a-zA-Z0-9_]{1,32}\.[a-zA-Z0-9-.]{1,20}$/;
export const EMAIL_REGEX  = /^(?=^.{0,64}$)(([^\u4e00-\u9fa5<>()\[\]\\.,;:\s@"]+(\.[^\u4e00-\u9fa5<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_REGEX_TEXT = '请输入正确的邮箱，长度不超过64';

export const ACCOUNT_REGEX  = /^([a-zA-Z0-9]{5,64}$)|(?=^.{0,64}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const ACCOUNT_REGEX_TEXT = '请输入正确的账号，账号请填写数字、字母的任意组合或者邮箱，长度为5-64个字符';

/**
 * 检验域名数量
 */
export const DOMAIN_NUM_REGEX = /^[0-3]{1}$/;
export const DOMAIN_NUM_REGEX_TEXT = '请输入正确数字，最大为3';

/**
 * 校验只能输入30个字的中英文输入
 */
export const THIRTYCHENG_REGEX = /^[A-Za-z\u4e00-\u9fa5\s]{1,30}$/;
export const THIRTYCHENG_REGEX_TEXT = '该项只能由汉字、字母、空格组成，长度不能超过30个字符';

/**
 * 校验只能输入50个字的中英文输入
 */
export const FIFTYCHENG_REGEX = /^[A-Za-z\u4e00-\u9fa5\s]{1,50}$/;
export const FIFTYCHENG_REGEX_TEXT = '该项只能由汉字、字母、空格组成，长度不能超过50个字符';

// 域名校验
export const DOMAIN_REGEX = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
export const DOMAIN_REGEX_TEXT  = '请输入合法的域名，形如www.sangfor.com.cn';

//验证url
export const URL_REGEX  = /^(https?:\/\/)?[\u4e00-\u9fa50-9a-zA-Z][-\u4e00-\u9fa50-9a-zA-Z]{0,62}(\.[-\u4e00-\u9fa50-9a-zA-Z]{1,63})*(\.[-\u4e00-\u9fa50-9a-zA-Z]{0,62}[\u4e00-\u9fa50-9a-zA-Z])(:[0-9]{0,5})?(\/[\w\.-]*)*(#[^#\s]*)?$/i;
export const URL_REGEX_TEXT  = '请输入合法的url，形如http://www.sangfor.com.cn';

// 标准带协议的url
export const PROTOCOL_URL_REGEX = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

//验证IP
export const IP_REGEX = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/;
export const IP_REGEX_TEXT = '请输入合法的IP，如: 121.121.0.1 或 1:1:1::1';


//验证IP4跟子网掩码
export const IP_WITH_MASK_TEXT = '请输入合法IP/掩码，如：10.251.251.250/24 或 10.251.251.250/255.255.255.0';

//验证IP段
export const IP_RANGE_REGEX = /^(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}[\-\/](?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;

//处理不同操作系统的换行符差异、空行、前后空白字符
export const SPACE_REGEX = /(?:[\s\uFEFF\xA0]*\r?\n[\s\uFEFF\xA0]*)+/;

//验证32位的md5
export const MD5_REGEX = /^[A-Za-z0-9]{32}$/;
export const MD5_REGEX_TEXT = '请输入正确的MD5值';

//验证端口号
export const PORT_REGEX_TEXT = '请输入0到65535的整数';
export const PORT_REGEX = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

/**
 * 校验域名
 * @param {String} domain
 * @returns {Boolean}
 */
export function validDomain (domain) {
    return DOMAIN_REGEX.test(domain);
}

/**
 * 校验Url
 * @param {String} url
 * @returns {Boolean}
 */
export function validURL (url) {

    // let regex = /^(https?:\/\/)?[\u4e00-\u9fa50-9a-zA-Z][-\u4e00-\u9fa50-9a-zA-Z]{0,62}(\.[-\u4e00-\u9fa50-9a-zA-Z]{1,63})*(\.[-\u4e00-\u9fa50-9a-zA-Z]{0,62}[\u4e00-\u9fa50-9a-zA-Z])(:[0-9]{0,5})?(\/[\w\.-]*)*(#[^#\s]*)?$/i;
    // 校验url修改为下面这个，上面的会过滤掉中文，By zhaofayu
    let regex = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*(\/[a-zA-Z0-9\&%_\./-~-]*)?$/;
    if (url.length < 1 || url.length > 256) {
        return false;
    }

    return regex.test(url);
}

/**
 * 校验邮箱
 * @param {String} email
 * @returns {Boolean}
 */
export function validEmail (email) {
    let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailReg.test(email);
}

/**
 * 判断IP是否是内网IP
 * 224.0.0.0~239.255.255.255 (D类地址)
 * 240.0.0.0~255.255.255.255  (E类地址)
 * 0.0.0.0~0.255.255.255 (保留地址)
 * 10.0.0.0-10.255.255.255 (内网ip)
 * 172.16.0.0-172.31.255.255  (内网ip)
 * 192.168.0.0-192.168.255.255 (内网ip)
 * 169.254.0.0~169.254.255.255 (DHCP用)
 * 127.0.0.1 (localhost)
 * @param ip
 * @returns {*|boolean}
 */

/*eslint-disable*/
export function isIntranetIP (ip) {
    let intIP = ip2int(ip),
        area1_1 = ip2int('224.0.0.0'),
        area1_2 = ip2int('239.255.255.255'),
        area2_1 = ip2int('240.0.0.0'),
        area2_2 = ip2int('255.255.255.255'),
        area3_1 = ip2int('0.0.0.0'),
        area3_2 = ip2int('0.255.255.255'),
        area4_1 = ip2int('10.0.0.0'),
        area4_2 = ip2int('10.255.255.255'),
        area5_1 = ip2int('172.16.0.0'),
        area5_2 = ip2int('172.31.255.255'),
        area6_1 = ip2int('192.168.0.0'),
        area6_2 = ip2int('192.168.255.255'),
        area7_1 = ip2int('169.254.0.0'),
        area7_2 = ip2int('169.254.255.255'),
        area8 = ip2int('127.0.0.1');

    if (!isIPv4(ip)) {
        return false;
    }

    return (intIP >= area1_1 && intIP <= area1_2) ||
        (intIP >= area2_1 && intIP <= area2_2) ||
        (intIP >= area3_1 && intIP <= area3_2) ||
        (intIP >= area4_1 && intIP <= area4_2) ||
        (intIP >= area5_1 && intIP <= area5_2) ||
        (intIP >= area6_1 && intIP <= area6_2) ||
        (intIP >= area7_1 && intIP <= area7_2) ||
        (intIP === area8);
}
/*eslint-enable*/

/**
 * 是否是IPv4
 * @param {String} ip
 * @returns {Boolean}
 */
export function isIPv4 (ip) {
    let IPAddress = /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/,
        flag = new RegExp(IPAddress);

    return flag.test(ip);
}

/**
 * 把IPV4转换成Int32的形式
 * @param {string} ip
 * @returns {Number}
 */
export function ip2int (ip) {
    let text = ip.toString().trim();
    let a = text.split('.');
    return parseInt(a[0], 10) * 256 * 256 * 256 +
        parseInt(a[1], 10) * 256 * 256 +
        parseInt(a[2], 10) * 256 +
        parseInt(a[3], 10);
}

/**
 * 校验端口号
 * @param {Number} port  //端口号
 * @returns {*}
 */
export function validPort (port) {
    const MIN = 0;
    const MAX = 65536;
    const REGEXP = /^\d+$/i;

    return (REGEXP.test(port) && port < MAX && port > MIN);
}

/**
 * 校验单个端口、端口-端口、
 * @param {Number} port
 * @returns {*}
 *  1
 *  1-20
 */
export function validPortOrRange (port) {
    let validObj = new PortOrRange();

    return validObj.verify(port);
    
}

/**
 * 校验子网掩码
 * @param {String} value  //子网掩码
 * @returns {*}
 */
export  function validMask (value) {
    let result;

    if (!value) {
        return {
            isMatch: false,
            msg: '需要输入IPv4掩码'
        };
    }

    value = value.trim();
    result  = new SfVueComponent.validations.Maskv4()._parseMaskToNumber(value); //校验通过时返回数字，校验不通过时返回的是对象（实际是返回字符串，但是由于该项目全局设置的loadash将其转换成对象）

    if (typeof result === 'number') {
        return {
            isMatch: true,
            msg:''
        };
    }
    return {
        isMatch: false,
        msg:result.__wrapped__
    };

}

/**
 * 校验IP跟子网掩码
 * @param {String} ip  //ip跟子网掩码
 * @returns {*}
 */
export  function validIpWithMask (ip) {
    let ipFormat = ip.split('/'),
        originIp = ipFormat[0],
        mask = ipFormat[1],
        maskFormatValid = validMask(mask); //校验子网掩码

    return {
        isMatch: originIp && IP_REGEX.test(originIp) && maskFormatValid.isMatch,
        msg: IP_WITH_MASK_TEXT
    };
}

/**
 * 校验单个输入是否符合ipv4或ipv6格式
 * @param {String} ip
 * @param {String} err
 * @returns {Boolean}
 *  
 */
export  function validIpSingle (ip, err) {
    let validObj = new IP(),
        properValidator = validObj.findProperValidator(ip),
        validator = {};

    if (typeof properValidator !== 'undefined' && properValidator !== null) {
        validator = validObj.validators[properValidator];
        let validIp = validator.verify(ip);
        if (typeof validIp === 'boolean') {
            return validIp;
        }

        return err.push(IP_REGEX_TEXT);
    
    }      
}

/**
 * 校验多个输入是否符合ipv4或ipv6格式
 * @returns {Boolean}
 *  
 */
export  function validIpMultiple () {
    return function (ip) {
        let validObj = new IP(),
            properValidator = validObj.findProperValidator(ip),
            validator = {};

        if (typeof properValidator !== 'undefined' && properValidator !== null) {
            validator = validObj.validators[properValidator];
            let validIp = validator.verify(ip);
            if (typeof validIp === 'boolean') {
                return validIp;
            }
            return IP_REGEX_TEXT;

        }
    };
}

/**
 * 校验单个IP、IP+掩码、IP段、
 * @param {String} IP
 * @returns {*}
 *  1.2.3.4
 * 1.2.3.4/255.255.255.0
 * 1.2.3.4-5.6.7.8
 * 
 * 2001::1
 * 2001::1/96
 * 2001::1-2001::ffff
 */
export function validIPOrRange (IP) {
    if (IP.includes(':')) {
        let validObjIpv6 = new IPv6OrRange(),
            properValidatorIpv6 = validObjIpv6.findProperValidator(IP),
            validatorIpv6 = {};
        if (typeof properValidatorIpv6 !== 'undefined' && properValidatorIpv6 !== null) {
            validatorIpv6 = validObjIpv6.validators[properValidatorIpv6];
            return  validatorIpv6.verify(IP);
        }
        return validObjIpv6.invalidText;

    }
    let validObjIpv4 = new IPv4OrRange(),
        properValidatorIpv4 = validObjIpv4.findProperValidator(IP),
        validatorIpv4 = {};
    if (typeof properValidatorIpv4 !== 'undefined' && properValidatorIpv4 !== null) {
        validatorIpv4 = validObjIpv4.validators[properValidatorIpv4];
        return  validatorIpv4.verify(IP);
    }
    return validObjIpv4.invalidText;

}


/**
 * 校验单个ip是否符合ipv4或ipv6格式
 * @param {String} ip
 * @returns {Boolean}
 */
export  function validIsIp (ip) {
    let validObj = new IP(),
        properValidator = validObj.findProperValidator(ip),
        validator = {};

    if (typeof properValidator !== 'undefined' && properValidator !== null) {
        validator = validObj.validators[properValidator];
        let validIp = validator.verify(ip);
        if (typeof validIp === 'boolean') {
            return validIp;
        }

        return false;
    
    }      
}

/**
 * 校验IP段
 * @param {String} IPRange
 * @returns {*}
 */
export function validIPRange (IPRange) {
    let regex = /^(.+)(-)(.+)$/,
        startIP = IPRange.match(regex)[1],
        endIP = IPRange.match(regex)[3],
        validRange,
        validEnd,
        validStart = validIsIp(startIP);
    if (validStart === true) {
        validEnd = validIsIp(endIP);
    }
    if (validEnd === true) {
        if (IPRange.includes(':')) {
            let validIpv6Range = new IPv6Range();
                validRange = validIpv6Range.externalVerify(startIP, endIP);
        } else {
            let validIpv4Range = new IPv4Range();
                validRange = validIpv4Range.externalVerify(startIP, endIP);
        }
        if (typeof validRange === 'boolean') {
            return {
                isMatch: true,
                msg: ''
            };
        }
        return {
            isMatch: false,
            msg: 'IP段范围有误'
        };
        
    }
    return {
        isMatch: false,
        msg: 'IP段格式有误'
    };
}

/**
 *表单换行校验公共方法
 * @param {Function | Array} validMethod
 * @param {RegExp} reg 正则
 * @param {number} maxLen 最大输入的长度
 * @param {string | Function} errorTip 自定义的错误提醒内容
 * @returns {Boolean}
 */
export function commonValid (validMethod, reg = '\n', maxLen = 0, errorTip = '') {
    return (value = '', errors = []) => {
        let arr = Array.isArray(value) ? value : value.split(reg);

        arr = arr.filter(item => !(['', null].includes(item)));

        // arr.length判断有输入, maxlen为最大长度
        if (arr.length &&
            maxLen &&
            arr.length > maxLen) {
            errors.push(`该输入项最多允许${maxLen}项`);
            return false;
        }

        for (let item of arr) {

            let result = '';

            // 多个校验规则
            if (!Array.isArray(validMethod)) {
                result = validMethod(item);
            } else {
                for (let i = 0; i < validMethod.length; i++) {
                    let validReg = validMethod[i];
                    result = validReg(item);

                    // 有一个通过校验即可
                    if (result === true) {
                        break;
                    }
                }
            }

            if (result !== true) {
                if (typeof errorTip === 'function') {
                    errors.push(errorTip(item));
                } else {
                    errors.push(errorTip || result);
                }

                return false;
            }
        }

        return true;
    };
}

/**
 * 获取某个范围内的排好序的随机数组
 * @param {Number} loopTime 随机个数
 * @param {Number} minVal 随机数最小值
 * @param {Number} maxVal 随机数最大值（不包含）
 * @returns {Array} 随机数组
 */
export function getSortRandomArr (loopTime, minVal, maxVal) {
    let arr = [];

    for (let i = 0; i < loopTime; i++) {
        arr.push(getRandom(minVal, maxVal));
    }

    // 排序
    arr.sort((a, b) => {
        return a - b;
    });

    return arr;
}

/**
 * 获取范围随机数
 * @param {Number} min 范围最小值
 * @param {Number} max 范围最大值
 * @returns {Number}   范围内的随机数
 */
export function getRandom (min, max) {
    let differ = max - min;

    return parseInt(Math.random() * differ + min);
}

/*
 * 获取url中参数的值
 * @param {String} name  参数名
 * @returns {*}
 */
export function getURLParam (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}

export function getParamObj (str, separator = '&') {
    let arr = str.split(separator),
        obj = {};

    arr.forEach(item =>{
        let targetArr = item.split('=');
        obj[targetArr[0].trim()] = targetArr[1];
    });
    return obj;
}

/**
 * 日期格式化方法
 * 用法：formatDate(date, 'yyyy-MM-dd hh:mm:ss')
 * @param {Date} date
 * @param {String} fmt
 * @returns {*}
 */
export function formatDate (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    let type = typeof date;

    //  时间戳类型
    if (type === 'number') {
        date = date.toString().length === 13 ? date : 1000 * date;
        date = new Date(date);
    }

    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }


    return fmt;
}

/**
 * 将 2018-01-01 12:12:12 转换成 2018/01/01 12:12:12的形式
 * 原因：new Date会有兼容性问题，必须要先转换
 * @param {String} dateStr
 * @returns {String}
 */
export function formatDateToStandard (dateStr) {
    return dateStr.replace(new RegExp('-', 'g'), '/');
}

/**
 * 获取两个日期之间相差的天数
 * @param {String} dateStr1 //dateStr1和dateStr2是2002-12-18格式
 * @param {String} dateStr2
 * @returns {String}
 */
export function getDateDiff (dateStr1, dateStr2) {
    let formatDate1 = new Date(formatDateToStandard(dateStr1)),
        formatDate2 = new Date(formatDateToStandard(dateStr2)),
        days = Math.abs(formatDate1 - formatDate2) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数

    return days;
}

export const KEYSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * 加密操作
 * @param {String} input   需要进行加密的字符串
 * @returns {String} output   加密完成的字符串
 */
export function enCrypt (input = '') {
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = utf8Encode(input);        // 对需要编码的字符串进行UTF-8编码

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + KEYSTR.charAt(enc1) + KEYSTR.charAt(enc2) + KEYSTR.charAt(enc3) + KEYSTR.charAt(enc4);
    }

    return output;
};

/**
 * 返回最近一周的时间范围 [1593089261672, 1593694061672]
 * @returns {number[]}
 */
export function getLatestWeek () {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return [start.valueOf(), end.valueOf()];
}

/**
 * 解密操作
 * @param {String} input   需要进行解密的字符串
 * @returns {String} output   解密完成的字符串
 */
export function deCrypt (input) {
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    if (input) {
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < input.length) {
            enc1 = KEYSTR.indexOf(input.charAt(i++));
            enc2 = KEYSTR.indexOf(input.charAt(i++));
            enc3 = KEYSTR.indexOf(input.charAt(i++));
            enc4 = KEYSTR.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = utf8Decode(output);        // 对已解码的字符串进行UTF-8解码

        return output;
    }
};

//应用
validIpOrIpRange (ipList, errors) {
            if (ipList.length !== [...new Set(ipList)].length) {
                errors.push('存在相同的IP或者IP段');
                return false;
            }

            let validRes = ipList.every(item => {
                if (item.includes('-')) {
                    return validIPRange(item).isMatch;
                }
                return validIpSingle(item, errors);
            });

            if (!validRes) {
                errors.push('请输入合法的IP或者IP段，用","隔开');
            }

            return validRes;
        }
