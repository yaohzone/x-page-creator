<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <el-form label-position="top">
        <el-divider>背景</el-divider>
        <background-props-editor></background-props-editor>
        <el-form-item v-if="props.backgroundImage">
            <template slot="label">背景图悬浮 <i class="g-hint">不随页面一起滚动</i></template>
            <el-switch v-model="props.backgroundAttachment"></el-switch>
        </el-form-item>
    </el-form>
</template>

<script>
export default {

}
</script>
