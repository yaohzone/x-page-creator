<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-video-trigger {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    max-width: 100%;
    background: url(~@/assets/images/play.png) no-repeat center center;
    background-size: auto auto;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        opacity: 0.8;
    }
}

.basic-video-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2001;
    text-align: center;
    &::before {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
    }
}
.basic-video-modal {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: .6s!important;
}
.basic-video-container {
    position: relative;
    display: inline-block;
    width: 889px;
    height: 500px;
    vertical-align: middle;
    background-color: rgba(0, 0, 0, 0.8);
    transition: .6s!important;
    .video {
        width: 100%;
        height: 100%;
    }
    .close {
        position: absolute;
        top: -20px;
        right: -20px;
        z-index: 9;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0,0,0,0.5);
        line-height: 40px;
        font-size: 26px;
        text-align: center;
        color: #fff;
        opacity: 0.8;
        transition: 0.2s;
        &:hover {
            opacity: 1;
            background: rgba(0,0,0,0.8);
        }
    }
    @media (max-width: @width-mobile) {
        width: 100vw;
        height: 100vh;
        .close {
            top: 0;
            right: 0;
        }
    }
}
</style>

<script>
import Vue from 'vue';
import {
    calcDisplaySize,
    backgroundImage,
    backgroundImageFill
} from '@/utils/tool.js';
import {
    overflowProps,
    backgroundProps,
    backgroundStyle,
    borderStyle
} from '@/components/options.js';

/*
<transition name="popdown-shade">
    <div v-if="visible" class="basic-video-wrap">
        <div class="basic-video-modal e-shade"></div>
        <div class="basic-video-container e-block">
            <a class="close" href="javascript: void 0;" @click="visible = false"><i class="el-icon-close"></i></a>
            <video class="video" :src="src" controls="controls" preload="preload" autoplay="autoplay">您的浏览器不支持video播放。</video>
        </div>
    </div>
</transition>
*/
const VideoDialog = Vue.extend({
    data() {
        return {
            visible: false
        }
    },
    props: {
        src: String,
        transition: {
            type: String,
            default: 'popdown-shade'
        }
    },
    render(h) {
        let children = [];
        if(this.visible) {
            children = [
                h('div', {
                    staticClass: 'basic-video-wrap'
                }, [
                    h('div', {
                        staticClass: 'basic-video-modal e-shade'
                    }),
                    h('div', {
                        staticClass: 'basic-video-container e-block'
                    }, [
                        h('a', {
                            staticClass: 'close',
                            attrs: {
                                href: 'javascript: void 0;'
                            },
                            on: {
                                click: () => this.visible = false
                            }
                        }, [h('i', {staticClass: 'el-icon-close'})]),
                        h('video', {
                            staticClass: 'video',
                            attrs: {
                                src: this.src,
                                controls: true,
                                preload: true,
                                autoplay: true
                            }
                        }, '您的浏览器不支持video播放')
                    ])
                ])
            ];
        }
        return h('transition', {
            props: {name: this.transition}
        }, children)
    }
})

let videoDialogInstance;
function openVideoDialog(opts) {
    opts = opts || {};
    if(!videoDialogInstance) {
        videoDialogInstance = new VideoDialog().$mount(document.createElement('div'));
        document.body.appendChild(videoDialogInstance.$el);
    }

    videoDialogInstance.src = opts.src;
    opts.transition && (videoDialogInstance.transition = opts.transition);

    Vue.nextTick(() => {
        videoDialogInstance.visible = true;
    });

    return () => {
        videoDialogInstance.visible = false;
    }
}

export default {
    props: {
        src: String,
        title: {
            type: String,
            default: '视频'
        },
        // auto / full / fixed
        widthType: {
            type: String,
            default: 'fixed'
        },
        width: {
            type: [Number, String],
            default: 100
        },
        // auto / full / fixed
        heightType: {
            type: String,
            default: 'fixed'
        },
        height: {
            type: [Number, String],
            default: 100
        },
        ...backgroundProps(),
        backgroundColor: {
            type: String,
            default: 'rgba(0, 0, 0, 0.3)'
        },
        borderWidth: {
            type: [Number, String],
            default: 4
        },
        borderColor: {
            type: String,
            default: '#ffffff'
        },
        borderStyle: {
            type: String,
            default: 'solid'
        },
        borderRadius: {
            type: [Number, String],
            default: 50
        },
        ...overflowProps(),
        openTransition: {
            type: String,
            default: 'fadescale-shade'
        }
    },
    data() {
        return {
            visible: false
        }
    },
    computed: {
        style() {
            let width = this.widthType === 'full' ? '100%' : calcDisplaySize(this.width);
            let height = this.heightType === 'full' ? '100%' : calcDisplaySize(this.height);
            return {
                width,
                height,
                ...borderStyle(this),
                ...backgroundStyle(this),
                overflow: this.overflow
            }
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'basic-video-trigger',
            class: {
                'g-hide-scrollbar': this.hideScrollbar
            },
            style: this.style,
            attrs: {
                title: this.title
            },
            on: {
                click: this.openVideo
            }
        })
    },
    methods: {
        openVideo() {
            let close = openVideoDialog({src: this.src, transition: this.openTransition});
        }
    }
}
</script>
