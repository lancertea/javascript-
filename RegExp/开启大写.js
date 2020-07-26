/**
 * 开启了大写
 */


/**
 * 注册事件
 * @param {Element} dom     节点
 * @param {String} event    事件名称
 * @param {Function} fn     回调
 * @param {Boolean} capture capture
 */
function fEventListen (dom, event, fn, capture) {
    capture = !!capture;
    if (dom.addEventListener) {
        dom.addEventListener(event, fn, capture);
    } else {
        if (dom.attachEvent) {
            dom.attachEvent('on' + event, fn);
        }
    }
}

let CapsLock = function (opt) {
    if (this instanceof CapsLock) {
        this.initialize(opt);
    } else {
        return new CapsLock(opt);
    }
};


let CapLockProto = CapsLock.prototype;

//CapLockProto.preStatus = undefined;
//CapLockProto.status = undefined;

CapLockProto.initialize = function (opt) {
    let caplock = this;
    let el = opt.el;
    caplock.el = opt.el;
    let k = {
        keypress: function (n) {
            caplock._keyPress(n);
        },
        keydown: function (n) {
            caplock._keyDown(n);
        },
        blur: function (n) {
            caplock._blur(n);
        }
    };
    caplock.capsLockInfo = k;
    caplock.change = opt.change;
    fEventListen(el, 'keypress', k.keypress);
    fEventListen(el, 'keydown', k.keydown);
    fEventListen(el, 'blur', k.blur);
};

CapLockProto.isOn = function () {
    return this.status;
};

CapLockProto.trigger = function () {
    if (this.change) {
        this.change(this.status);
    }
};

CapLockProto._keyDown = function (evt) {
    let caplock = this;
    let keyCode = evt.which || evt.keyCode;
    const CAPS_LOCK = 20;
    if (keyCode === CAPS_LOCK && typeof caplock.status !== 'undefined') {
        caplock.preStatus = caplock.status = !caplock.status;
        caplock.trigger(caplock.status);
    }
};

CapLockProto._keyPress = function (evt) {
    let m = this;
    let keyCode = evt.which || evt.keyCode;
    let k = false;
    let MODIFIERS = 0b100;
    if (evt.shiftKey) {
        k = true;
    } else {
        if (evt.modifiers) {
            k = !!(evt.modifiers & MODIFIERS);
        }
    }
}