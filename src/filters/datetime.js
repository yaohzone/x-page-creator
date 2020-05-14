/**
 * 转换时间格式
 */

export default function(value, format) {
    if (!value) {
        return '';
    }

    var date;
    if (typeof value === 'string' || typeof value === 'number') {
        date = new Date(value);
    } else if (value instanceof Date) {
        date = value;
    }

    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();

    m = m >= 10 ? m : '0' + m;
    d = d >= 10 ? d : '0' + d;
    h = h >= 10 ? h : '0' + h;
    i = i >= 10 ? i : '0' + i;
    s = s >= 10 ? s : '0' + s;

    format = format || 'y-m-d h:i';

    return format.replace(/(y+)|(m+)|(d+)|(h+)|(i+)|(s+)/ig, function(match, $1, $2, $3, $4, $5, $6) {
        var reval = '';
        switch (match) {
            case $1:
                reval = y;
                break;
            case $2:
                reval = m;
                break;
            case $3:
                reval = d;
                break;
            case $4:
                reval = h;
                break;
            case $5:
                reval = i;
                break;
            case $6:
                reval = s;
                break;
        }
        return reval;
    });
}