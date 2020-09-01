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
