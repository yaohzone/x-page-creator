/** 
 * 转换为金额
 */

export default function(value) {
    return (parseFloat(value) || 0).toFixed(2);
}