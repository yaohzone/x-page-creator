<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';


</style>

<template>
    <el-form label-position="top">
        <!-- <el-divider>基础</el-divider> -->
        <el-form-item label="文本内容">
            <rich-editor
                v-model="props.value"
                :upload-image="{
                    url: '/api/imageInfo/uploadFile',
                    fileFeildName: 'pic'
                }"
            ></rich-editor>
        </el-form-item>
        <el-form-item label="高度">
            <template slot="label">高度 <i class="g-hint">（设置为空时自适应内容）</i></template>
            <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <margin-props-editor includes="top,bottom"></margin-props-editor>
        <padding-props-editor></padding-props-editor>
    </el-form>
</template>

<script>
import RichEditor from '@/components/rich-editor';

export default {
    components: {RichEditor}
}
</script>
