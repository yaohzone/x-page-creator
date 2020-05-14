<template>
    <div class="picture-picker" @click="pickPicture">
        <template v-if="value">
            <el-image class="image" :src="value" fit="scale-down"></el-image>
            <i class="el-icon-delete clear" @click.stop="clearPicture"></i>
        </template>
        <i v-else class="el-icon-plus icon"></i>
    </div>
</template>

<script>
import photosManager from '@/components/photos';

export default {
    props: {
        value: {
            type: String
        }
    },
    methods: {
        // 选择图片
        pickPicture() {
            return new Promise((resolve, reject) => {
                let picturePicker = photosManager({isPicker: true});
                picturePicker.$off('confirm').$on('confirm', picture => {
                    this.$emit('input', picture.url);
                });
            })
        },
        // 清理图片
        clearPicture(evt) {
            this.$emit('input', null);
        }
    }
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

.picture-picker {
    position: relative;
    display: block;
    width: 120px;
    height: 120px;
    border: 1px dashed #eee;
    border-radius: 4px;
    text-align: center;
    color: #888;
    font-size: 22px;
    cursor: pointer;
    transition: 0.2s;
    .image {
        width: 118px;
        height: 118px;
    }
    .clear {
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 9;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
        background-color: rgba(0,0,0,.6);
        text-align: center;
        font-size: 16px;
        color: #fff;
        transition: 0.2s;
        &:hover {
            background-color: rgba(0,0,0,.8);
        }
    }
    .icon {
        display: inline-block;
        line-height: 118px;
    }
    &:hover {
        border-color: @color-info;
        color: @color-info;
    }
}
</style>
