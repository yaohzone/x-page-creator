/**
 * 文件尺寸显示
 */

const transfer = function() {
    var size = [].shift.call(arguments);
    var result = '';
    for (var i = 0, fn; (fn = arguments[i++]); ) {
        if ((result = fn.call(null, size)) !== 'next') {
            break;
        }
    }
    return result;
};

const computes = {
    T(size) {
        var result = 'next';
        var res = size / (1024 * 1024 * 1024 * 1024);
        if (res >= 1) {
            result = parseFloat(res).toFixed(2) + 'TB';
        }
        return result;
    },
    G(size) {
        var result = 'next';
        var res = size / (1024 * 1024 * 1024);
        if (res >= 1) {
            result = parseFloat(res).toFixed(2) + 'GB';
        }
        return result;
    },
    M(size) {
        var result = 'next';
        var res = size / (1024 * 1024);
        if (res >= 1) {
            result = parseFloat(res).toFixed(2) + 'MB';
        }
        return result;
    },
    K(size) {
        var result = 'next';
        var res = size / 1024;
        if (res >= 1) {
            result = parseFloat(res).toFixed(2) + 'KB';
        }
        return result;
    },
    B(size) {
        return size + 'B';
    }
};

const methods = {
    // 单位自动化(最高单位：T)
    auto(size) {
        size = size || 0;
        return transfer(size, computes.T, computes.G, computes.M, computes.K, computes.B);
    },
    // 文件尺寸全值显示(最高单位：G)
    all(size) {
        size = size || 0;
        var B, K, M, G, _G, _M, _K;
        G = parseInt(size / (1024 * 1024 * 1024), 10);
        _G = size % (1024 * 1024 * 1024);
        M = parseInt(_G / (1024 * 1024), 10);
        _M = _G % (1024 * 1024);
        K = parseInt(_M / 1024, 10);
        _K = _M % 1024;
        B = parseInt(_K, 10);

        var check = function(A, val) {
            if (val > 0) {
                return val + A + ' ';
            } else {
                return '';
            }
        };
        return check('GB', G) + check('MB', M) + check('KB', K) + check('B', B);
    }
};

export default function(value, type) {
    if (typeof value !== 'number') {
        let _value = parseInt(value, 10);
        if (isNaN(_value)) return value;
        value = _value;
    }
    if (!value) {
        return '0B';
    }
    type = ['auto', 'all'].indexOf(type) !== -1 ? type : 'auto';
    return methods[type](value);
}
