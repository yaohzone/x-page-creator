/**
 * 常量值
 */

// 响应对象code值 -正常状态
export const RESPONCE_CODE_OK = 0;

// 创建组件拖拽类型
export const CREATE_DATATRANSFER_TYPE = "component/creator";
// 移动组件拖拽类型
export const MOVE_DATATRANSFER_TYPE = "component/mover";
// 定位拖拽类型
export const POS_DATATRANSFER_TYPE = "component/position";

// 接收组件拖拽处理类型
export const HANDLE_RELATED_DATATRANSFER_TYPES = [
    CREATE_DATATRANSFER_TYPE,
    MOVE_DATATRANSFER_TYPE
];

// 拖拽类型对应效果
export const DRAG_EFFECT_ALLOWED = {
    [CREATE_DATATRANSFER_TYPE]: "copy",
    [MOVE_DATATRANSFER_TYPE]: "move",
    [POS_DATATRANSFER_TYPE]: "move"
};

// 拖拽组件应为enter组件 --子组件
export const DRAG_BE_FOCUS_CHILD = "child";
// 拖拽组件应为enter组件 --兄弟组件
export const DRAG_BE_FOCUS_SIBLING = "sibling";

// 页面内容缓存历史记录最大bytes
export const PAGE_CACHE_HISTORY_MAX_BYTES = 1024 * 1024; // 1M

// 页面数据全局变量
export const GLOBAL_STATE_VARIABLE = "__XPAGE_EDITOR_STATE__";

// 锚点属性名称
export const ANCHOR_PREFIX = 'anchor-component';

// 图片fits
export const IMAGE_FITS = [
    {label: '原大小', value: 'none'},
    {label: '拉伸', value: 'fill'},
    {label: '填充', value: 'cover'},
    {label: '适应', value: 'contain'},
    {label: '溢出适应', value: 'scale-down'}
]

// 动画名
export const ANIMATE_NAMES = [
    "bounce",
    "flash",
    "pulse",
    "rubberBand",
    "shake",
    "headShake",
    "swing",
    "tada",
    "wobble",
    "jello",
    "bounceIn",
    "bounceInDown",
    "bounceInLeft",
    "bounceInRight",
    "bounceInUp",
    "bounceOut",
    "bounceOutDown",
    "bounceOutLeft",
    "bounceOutRight",
    "bounceOutUp",
    "fadeIn",
    "fadeInDown",
    "fadeInDownBig",
    "fadeInLeft",
    "fadeInLeftBig",
    "fadeInRight",
    "fadeInRightBig",
    "fadeInUp",
    "fadeInUpBig",
    "fadeOut",
    "fadeOutDown",
    "fadeOutDownBig",
    "fadeOutLeft",
    "fadeOutLeftBig",
    "fadeOutRight",
    "fadeOutRightBig",
    "fadeOutUp",
    "fadeOutUpBig",
    "flipInX",
    "flipInY",
    "flipOutX",
    "flipOutY",
    "lightSpeedIn",
    "lightSpeedOut",
    "rotateIn",
    "rotateInDownLeft",
    "rotateInDownRight",
    "rotateInUpLeft",
    "rotateInUpRight",
    "rotateOut",
    "rotateOutDownLeft",
    "rotateOutDownRight",
    "rotateOutUpLeft",
    "rotateOutUpRight",
    "hinge",
    "jackInTheBox",
    "rollIn",
    "rollOut",
    "zoomIn",
    "zoomInDown",
    "zoomInLeft",
    "zoomInRight",
    "zoomInUp",
    "zoomOut",
    "zoomOutDown",
    "zoomOutLeft",
    "zoomOutRight",
    "zoomOutUp",
    "slideInDown",
    "slideInLeft",
    "slideInRight",
    "slideInUp",
    "slideOutDown",
    "slideOutLeft",
    "slideOutRight",
    "slideOutUp",
    "heartBeat"
];

export const ANIMATE_DELAYS = [
    {label: '0', value: ''},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'}
];

export const ANIMATE_SPEEDS = [
    {label: '最快', value: 'faster'},
    {label: '快', value: 'fast'},
    {label: '默认', value: ''},
    {label: '慢', value: 'slow'},
    {label: '最慢', value: 'slower'},
]


// SEO字段默认值
export const SEO_KEYWORDS = '工业品采购网,电气工控,工业自动化,低压电器,机电五金城,手动电动工具,劳保用品批发,工品汇商城';
export const SEO_DESCRIPTION = '工品汇一站式工业品采购商城，正品、低价、货期短。主营商品已覆盖电气工程、工具、劳保、办公住宅清洁用品、测量设备、机械部件等八大品类，为您节省时间和成本,提供专业的采购服务。';
