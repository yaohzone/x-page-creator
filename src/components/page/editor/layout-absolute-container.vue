<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <el-form label-position="top">
        <el-divider>定位</el-divider>
        <position-props-editor></position-props-editor>
        <el-form-item label="层级">
            <el-input-number v-model="props.zIndex" controls-position="right" :min="100" :max="999"></el-input-number>
        </el-form-item>

        <br>
        <el-divider>布局</el-divider>
        <el-form-item label="宽度">
            <el-radio v-model="props.widthType" label="auto">自适应内容</el-radio>
            <el-radio v-model="props.widthType" label="full">100%</el-radio>
            <el-radio v-model="props.widthType" label="fixed">固定宽度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.widthType === 'fixed'" label="">
            <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="高度">
            <el-radio v-model="props.heightType" label="auto">自适应内容</el-radio>
            <el-radio v-model="props.heightType" label="full">100%</el-radio>
            <el-radio v-model="props.heightType" label="fixed">固定高度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.heightType === 'fixed'" label="">
            <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <padding-props-editor></padding-props-editor>
        <overflow-props-editor></overflow-props-editor>

        <br>
        <el-divider>背景</el-divider>
        <background-props-editor></background-props-editor>

        <br>
        <el-divider>边框</el-divider>
        <border-props-editor></border-props-editor>

        <br>
        <el-divider>动效</el-divider>
        <hover-effect-props-editor></hover-effect-props-editor>
        <animate-props-editor></animate-props-editor>
    </el-form>
</template>

<script>
export default {

}
</script>
