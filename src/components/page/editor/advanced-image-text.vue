<style lang="less" scoped>
@import (reference) "~@/assets/style/reference";

</style>

<template>
    <el-form label-position="top">

        <el-divider>基础</el-divider>
        <el-form-item label="图片源">
            <picture-picker v-model="props.src"></picture-picker>
        </el-form-item>
        <el-form-item label="填充方式">
            <el-radio-group v-model="props.fit">
                <el-radio-button v-for="fit in base.imageFits" :key="fit.value" :label="fit.value" >{{fit.label}}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="图片描述">
            <el-input v-model="props.alt" placeholder="埋点标识文案" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接">
            <el-input v-model="props.href" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="props.href" label="新页面打开链接">
            <el-switch v-model="props.target"></el-switch>
        </el-form-item>

        <el-form-item label="文本">
            <rich-editor
                v-model="props.text"
                :upload-image="{
                    url: '/api/imageInfo/uploadFile',
                    fileFeildName: 'pic'
                }"
            ></rich-editor>
        </el-form-item>
        <el-form-item>
            <template slot="label">宽度 <i class="g-hint">（设置为空时撑满外容器）</i></template>
            <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <margin-props-editor includes="top,bottom"></margin-props-editor>

        <hover-effect-props-editor></hover-effect-props-editor>

    </el-form>
</template>

<script>
import RichEditor from '@/components/rich-editor';

export default {
    components: {RichEditor}
}
</script>
