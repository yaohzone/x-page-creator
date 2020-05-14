/**
 * 组件配置数据
 *
 * {
 *  label: '组件显示名称' // required
 *  name: '组件名'  // required
 *  group: '分组'  // required
 *  role: '角色行为'  // required
 *  allowRoles: '允许嵌套的role列表'
 *  initialData: '组件初始配置属性'
 *  allowModes: ['pc', 'mobile'], // 允许使用模式
 *  position: '拖动定位'
 *  // resize: '拖边设置尺寸'
 *  icon: '组件显示图标'
 *  thumbnail: '组件显示缩略图'
 * }
 *
 */

const componentsMap = {
    'layout-root' : {
        label: "根容器",
        group: "layout",
        role: 'root',
        allowRoles: ['container', 'row', 'fixed', 'absolute'],
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    },
    'layout-container' : {
        label: "普通容器",
        group: "layout",
        role: 'container',
        allowRoles: ['container', 'absolute', 'row', 'component'],
        allowModes: ['pc', 'mobile'],
        resize: true,
        initialData: {
            props: {
                // heightAuto: false,
                // height: 100
            }
        }
    },
    'layout-row': {
        label: "行容器",
        group: "layout",
        role: 'row',
        allowRoles: ['column'],
        allowModes: ['pc', 'mobile'],
    },
    'layout-column': {
        label: "列容器",
        group: "layout",
        role: 'column',
        allowRoles: ['container', 'absolute', 'row', 'component'],
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                width: 100,
                height: 100
            }
        }
    },
    'layout-absolute-container' : {
        label: "定位容器",
        group: "layout",
        role: 'absolute',
        allowRoles: ['container', 'absolute', 'row', 'component'],
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                widthType: 'fixed',
                width: 200,
                heightType: 'fixed',
                height: 200
            }
        },
        position: true,
        resize: true
    },
    'layout-fixed-container' : {
        label: "悬浮容器",
        group: "layout",
        role: 'fixed',
        allowRoles: ['container', 'absolute', 'row', 'component'],
        allowModes: ['pc'],
        initialData: {
            props: {
                widthType: 'fixed',
                width: 200,
                heightType: 'fixed',
                height: 200
            }
        },
        position: true,
        resize: true
    },
    'basic-image': {
        label: '图片',
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    },
    'basic-rich-text': {
        label: "富文本",
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                value: "<p>初始化<strong>富文本</strong>内容</p>"
            }
        }
    },
    'basic-link': {
        label: '超链接',
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                href: 'https://vipmro.com/',
                text: '超链接'
            }
        }
    },
    'basic-button': {
        label: '按钮',
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                text: '按钮'
            }
        }
    },
    'basic-title': {
        label: "标题",
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                title: '标题'
            }
        }
    },
    'basic-video': {
        label: '视频',
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    },
    'basic-divider': {
        label: '分隔线',
        group: 'basic',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                title: '分隔线'
            }
        }
    },
    'advanced-swiper': {
        label: "轮播",
        group: 'advanced',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {

            }
        }
    },
    'advanced-image-text': {
        label: "图文",
        group: 'advanced',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {
                text: "初始化段落文字"
            }
        }
    },
    'advanced-image-list': {
        label: "阵列图",
        group: 'advanced',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    },
    'advanced-inline-links': {
        label: "链接列表",
        group: 'advanced',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    },
    'advanced-block-links': {
        label: "块链接列表",
        group: 'advanced',
        role: 'component',
        allowModes: ['pc', 'mobile'],
        initialData: {
            props: {}
        }
    }
}

// 组件列表
const components = Object.keys(componentsMap).map(key => {
    let options = componentsMap[key];
    options.name = key;
    options._componentSetting = true;
    return options
})

// 设置组件icon
const componentIcons = {};
let iconRequire = require.context('./assets/images/components', false, /\.(jpg|png|svg)$/);
iconRequire.keys().forEach(path => {
    let icon = iconRequire(path);
    let imageName = path.replace(/^.+\//, '').replace(/\.\w+$/, '');
    let image = new Image();
    image.src = icon;
    componentIcons[imageName] = {image, icon};
});

components.forEach(item => {
    let {image, icon} = componentIcons[item.name] || {};
    icon && (item.icon = icon);
    image && (item.dragImage = image);
});

export {
    components as default,
    componentsMap
}
