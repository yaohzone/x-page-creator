<style lang="less" scoped>
@import (reference) "~@/assets/style/reference";

.m-contextmenu-panel {
    position: absolute;
    z-index: 8888;
    min-width: 100px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 14px;
    // text-align: center;
    box-shadow: 0 2px 8px 2px rgba(68, 73, 77, 0.16);
    transition: 0.2s;

    .title {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        border-bottom: 1px solid #ddd;
        background: #f5f5f5;
        font-weight: 500;
        font-size: 12px;
        color: #555;
        .ellipsis-oneline();
    }
    .list{
        padding: 6px 0;
        .divider {
            display: block;
            margin: 5px;
            height: 1px;
            background: #eee;
        }
        .item {
            display: block;
            height: 25px;
            line-height: 25px;
            padding: 0 20px;
            font-size: 12px;
            color: #555;
            transition: 0.2s;
            .ellipsis-oneline();
            &:hover{
                background: #f2f3f4;
                color: #222;
            }
            &[disabled] {
                background: #fff;
                color: #c0c0c0;
                cursor: not-allowed;
            }
        }
    }
}
</style>

<template>
    <transition name="fadeup">
        <div v-if="visible" class="m-contextmenu-panel" :style="{left: x+'px', top: y+'px'}">
            <div class="title">{{title}}</div>
            <div class="list">
                <template v-for="(item, index) in options">
                    <a v-if="item.name" :key="item.name" class="item" href="javascript:void 0;" :disabled="item.disabled" @click="execCommond(item)"
                    >{{item.label}}</a>
                    <div v-else-if="item === '|'" :key="index" class="divider"></div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script type="text/javascript">
export default {
    data() {
        return {
            visible: false,
        }
    },
    props: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: '操作'
        },
        options: {
            type: Array,
            default () {
                return []
            }
        }
    },
    // computed: {
    //     optionGroups() {
    //         return this.options.map(i => i)
    //     }
    // },
    methods: {
        execCommond(item) {
            this.$emit('selected', item);
            if(item.disabled || typeof item.commond !== 'function') return;
            item.commond(item, this);
            this.$emit('completed', item);
        }
    }
}
</script>
