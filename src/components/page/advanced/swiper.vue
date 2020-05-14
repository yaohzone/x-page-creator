<style lang="less">
@import (reference) "~@/assets/style/reference";
@import '~swiper/css/swiper.css';

.advanced-swiper-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    // overflow: hidden;
    .swiper-slide {
        display: block;
        text-align: center;
        &::before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 0;
            height: 100%;
        }
        img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .swiper-pagination {
        padding: 0 10px;
        &.align-left {
            text-align: left;
        }
        &.align-center {
            text-align: center;
        }
        &.align-right {
            text-align: right;
        }
    }
}
</style>

<template>
    <div class="advanced-swiper-wrapper" :style="wapperStyle">
        <div ref="swiper" class="swiper-container" :key="ukey">
            <div class="swiper-wrapper">
                <template v-for="banner in banners">
                    <a
                        v-if="banner.href"
                        :key="banner.src"
                        :href="banner.href"
                        class="swiper-slide"
                        :target="banner.target ? '_blank' : ''"
                        :title="banner.alt"
                        :style="{width: width+'px', height: height+'px'}"
                    ><img :src="banner.src" :alt="banner.alt"></a>
                    <div v-else :key="banner.src" class="swiper-slide" :style="{width: width+'px', height: height+'px'}">
                        <img :src="banner.src" :alt="banner.alt">
                    </div>
                </template>
            </div>
            <div v-if="pagination" class="swiper-pagination" :class="'align-'+paginationAlign" :style="{color: paginationColor}"></div>
            <div v-if="navigation" class="swiper-button-prev"></div>
            <div v-if="navigation" class="swiper-button-next"></div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper';
import isEqual from 'lodash/isEqual';
import {calcDisplaySize} from '@/utils/tool.js';
import defaultPicture from '@/assets/images/pic_default_image.jpg';
import {
    marginProps,
    marginStyle
} from '@/components/options.js';

export default {

    props: {
        width: [Number, String],
        height: [Number, String],
        ...marginProps('top,bottom'),
        banners: {
            type: Array,
            default() {
                return [
                    {
                        src: defaultPicture,
                        alt: '图片',
                        href: '',
                        target: true
                    }
                ]
            }
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        // horizontal / vertical
        // direction: {
        //     type: String,
        //     default: 'horizontal'
        // },
        delay: {
            type: Number,
            default: 5000
        },
        speed: {
            type: Number,
            default: 300
        },
        loop: {
            type: Boolean,
            default: false
        },
        // 切换效果: slide / fade / cube / coverflow / flip
        effect: {
            type: String,
            default: 'slide'
        },
        pagination: {
            type: Boolean,
            default: true
        },
        // bullets / fraction / progressbar / custom
        paginationType: {
            type: String,
            default: 'bullets'
        },
        paginationAlign: {
            type: String,
            default: 'center'
        },
        paginationColor: String,
        navigation: {
            type: Boolean,
            default: true
        },
        slidesPerView: {
            type: Number,
            default: 1
        },
        slidesPerColumn: {
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            visible: true,
            ukey: 1
        }
    },
    computed: {
        wapperStyle() {
            return {
                width: calcDisplaySize(this.width),
                // height: calcDisplaySize(this.height),
                ...marginStyle(this)
            }
        },
        swiperOptions() {
            let autoplay = false;
            if(this.autoplay) {
                autoplay = {
                    delay: this.delay,
                    stopOnLastSlide: false, // 播放完毕自动停止， loop时无效
                    disableOnInteraction: false, // 用户操作时暂停轮播
                    reverseDirection: false, // 开启反向自动播放。
                    waitForTransition: true // 等待过渡效果完毕再计算下一次播放时间
                }
            }
            return {
                width: this.width,
                height: this.height,
                // direction: this.direction,
                autoHeight: !this.height,
                autoplay,
                speed: this.speed,
                loop: this.loop,
                effect: this.effect,
                fadeEffect: {
                    crossFade: true // 是否淡出
                },
                // cubeEffect: {
                //     slideShadows: true,// 开启slide阴影。默认 true。
                //     shadow: true,//开启投影。默认 true。
                //     shadowOffset: 20, //投影距离。默认 20，单位px。
                //     shadowScale: 0.94// 投影缩放比例。默认0.94。
                // },
                flipEffect: {
                    slideShadows: false, // slides的阴影。默认true。
                    limitRotation: true //限制最大旋转角度为180度，默认true。
                },
                watchOverflow: true, // 非loop模式slide不足以轮播是否自动隐藏导航等
                preventClicks: false, // 不阻止click事件默认行为
                preventClicksPropagation: false, // 不阻止click事件冒泡
                pagination: {
                    el: '.swiper-pagination',
                    type: this.paginationType,
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                slidesPerView: this.slidesPerView, // 显示行数
                slidesPerGroup: this.slidesPerView, // 切换slide数
                slidesPerColumn: this.slidesPerColumn, // 显示列数
                slidesPerColumnFill: 'row'
            }
        }
    },
    watch: {
        width(value, old) {
            this.ukey++;
            this.initSwiper();
        },
        height() {
            this.ukey++;
            this.initSwiper();
        },
        banners() {
            this.ukey++;
            this.initSwiper();
        },
        swiperOptions: {
            deep: true,
            handler(value, oldValue) {
                let _isEqual = isEqual(value, oldValue);
                if(!_isEqual) {
                    this.swiper && this.swiper.destroy(true, true);
                    this.ukey++;
                    this.initSwiper();
                }
            }
        }
    },
    mounted() {
        this.initSwiper()
    },
    methods: {
        initSwiper() {
            this.$nextTick(() => {
                this.swiper = new Swiper(this.$refs.swiper, this.swiperOptions);
            })
        }
    }
}
</script>
