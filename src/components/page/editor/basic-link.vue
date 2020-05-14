<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>

    <el-form label-position="top">
        <el-divider>基础</el-divider>
        <el-form-item label="类型">
            <el-radio-group v-model="props.type">
                <el-radio-button label="inline">文本</el-radio-button>
                <el-radio-button label="button">按钮</el-radio-button>
                <el-radio-button label="full">覆盖</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="是否锚链接">
            <el-switch v-model="props.isAnchor"></el-switch>
        </el-form-item>
        <el-form-item v-if="props.isAnchor" label="锚组件ID">
            <el-input v-model="props.href" placeholder="组件ID，将滚动定位到该组件位置（设置空即返回顶部）" clearable></el-input>
        </el-form-item>
        <el-form-item v-else label="链接地址">
            <el-input v-model="props.href" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!props.isAnchor && props.href" label="新页面打开链接">
            <el-switch v-model="props.target"></el-switch>
        </el-form-item>
        <el-form-item label="链接文本">
            <el-input v-model="props.text" clearable placeholder="链接文案"></el-input>
        </el-form-item>
        <el-form-item label="埋点文本">
            <el-input v-model="props.title" clearable placeholder="不填时使用链接文案"></el-input>
        </el-form-item>

        <br>
        <el-divider >布局</el-divider>

        <el-form-item v-if="props.type === 'full'" label="层级">
            <el-input-number v-model="props.zIndex" controls-position="right" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <template v-if="props.type === 'button'">
            <el-form-item>
                <template slot="label">宽度 <i class="g-hint">（设置为空时自适应内容）</i></template>
                <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
                <template slot="label">高度 <i class="g-hint">（设置为空时自适应内容）</i></template>
                <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
        </template>
        <margin-props-editor v-if="props.type !== 'full'" includes="left,right"></margin-props-editor>
        <template v-if="props.type !== 'inline'">
            <padding-props-editor></padding-props-editor>
            <overflow-props-editor></overflow-props-editor>
        </template>

        <template v-if="props.type === 'full' || props.type === 'button'">
            <br>
            <el-divider>边框</el-divider>
            <border-props-editor></border-props-editor>
            <el-divider>背景</el-divider>
            <background-props-editor></background-props-editor>
        </template>
        <template v-if="props.text">
            <el-form-item label="文本字号">
                <el-input-number v-model="props.fontSize" controls-position="right" :min="12" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="文本颜色">
                <color-picker v-model="props.color"></color-picker>
            </el-form-item>
            <el-form-item v-if="props.type === 'inline'" label="下划线">
                <el-switch v-model="props.underline"></el-switch>
            </el-form-item>
        </template>
    </el-form>

</template>

<script>
export default {

}
</script>
