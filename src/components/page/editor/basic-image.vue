<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <el-form label-position="top">
        <el-divider>基础</el-divider>
        <el-form-item label="图片源">
            <picture-picker v-model="props.src"></picture-picker>
        </el-form-item>
        <el-form-item v-if="props.widthType !== 'auto' && props.heightType !== 'auto'" label="填充方式">
            <el-radio-group v-model="props.fit">
                <el-radio-button v-for="fit in base.imageFits" :key="fit.value" :label="fit.value" >{{fit.label}}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="宽度">
            <el-radio v-model="props.widthType" label="auto">自适应</el-radio>
            <el-radio v-model="props.widthType" label="full">100%</el-radio>
            <el-radio v-model="props.widthType" label="fixed">固定宽度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.widthType === 'fixed'" label="">
            <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="高度">
            <el-radio v-model="props.heightType" label="auto">自适应</el-radio>
            <el-radio v-model="props.heightType" label="full">100%</el-radio>
            <el-radio v-model="props.heightType" label="fixed">固定高度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.heightType === 'fixed'" label="">
            <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <margin-props-editor includes="top,bottom"></margin-props-editor>

        <br>
        <el-divider>扩展</el-divider>
        <el-form-item label="链接">
            <el-input v-model="props.href" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="props.href" label="新页面打开链接">
            <el-switch v-model="props.target"></el-switch>
        </el-form-item>
        <el-form-item label="图片说明">
            <el-input v-model="props.alt" placeholder="埋点标识文案" clearable></el-input>
        </el-form-item>
        <hover-effect-props-editor></hover-effect-props-editor>
    </el-form>
</template>

<script>
export default {

}
</script>
