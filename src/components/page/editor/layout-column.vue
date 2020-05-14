<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

.picture-picker {
    // display: flex;
    display: block;
    width: 120px;
    height: 120px;
    border: 1px dashed #eee;
    border-radius: 4px;
    text-align: center;
    color: #888;
    font-size: 22px;
    transition: 0.2s;
    .icon {
        display: inline-block;
        line-height: 120px;
    }
    &:hover {
        border-color: @color-info;
        color: @color-info;
    }
}
</style>

<template>
    <el-form label-position="top">
        <el-divider>布局</el-divider>
        <el-form-item>
            <template slot="label">自动分配宽度 <i class="g-hint">（根据同级列内容宽占比自动计算伸缩）</i></template>
            <el-switch v-model="props.autoadaptation"></el-switch>
        </el-form-item>
        <el-form-item>
            <template v-if="props.autoadaptation" slot="label">基础宽度 <i class="g-hint">（伸缩宽度将基于该值计算）</i></template>
            <template v-else slot="label">固定宽度 <i class="g-hint">（设置为空时自适应内容）</i></template>
            <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
            <template slot="label">高度 <i class="g-hint">（设置为空时自适应内容）</i></template>
            <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <margin-props-editor includes="left,right"></margin-props-editor>
        <padding-props-editor></padding-props-editor>
        <overflow-props-editor></overflow-props-editor>
        <el-form-item label="行内对齐方式">
            <el-radio-group v-model="props.innerAlign">
                <el-radio-button label="left">居左</el-radio-button>
                <el-radio-button label="center">居中</el-radio-button>
                <el-radio-button label="right">居右</el-radio-button>
            </el-radio-group>
        </el-form-item>

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
