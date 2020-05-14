<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>

    <el-form label-position="top">

        <!-- <el-divider>基础</el-divider> -->
        <el-form-item label="标题级别">
            <el-radio-group v-model="props.level">
                <el-radio-button :label="1">1</el-radio-button>
                <el-radio-button :label="2">2</el-radio-button>
                <el-radio-button :label="3">3</el-radio-button>
                <el-radio-button :label="4">4</el-radio-button>
                <el-radio-button :label="5">5</el-radio-button>
                <el-radio-button :label="6">6</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="风格">
            <el-radio-group v-model="props.titleStyle">
                <el-radio-button label="">默认</el-radio-button>
                <el-radio-button label="a">A</el-radio-button>
                <el-radio-button label="b">B</el-radio-button>
                <el-radio-button label="c">C</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="标题">
            <el-input v-model="props.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="副标题">
            <el-input v-model="props.desc" clearable></el-input>
        </el-form-item>
        <el-form-item label="右侧">
            <el-input v-model="props.asideText" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="props.asideText" label="右侧链接">
            <el-input v-model="props.asideHref" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
        </el-form-item>

        <margin-props-editor includes="top,bottom"></margin-props-editor>
        <padding-props-editor></padding-props-editor>

    </el-form>

</template>

<script>
export default {

}
</script>
