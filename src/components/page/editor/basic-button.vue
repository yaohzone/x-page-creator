<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
        <el-form label-position="top">

            <el-divider>基础</el-divider>
            <el-form-item label="文本">
                <el-input v-model="props.text" placeholder="也作埋点文案" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="props.type">
                    <el-radio-button label="primary">默认</el-radio-button>
                    <el-radio-button label="success">成功</el-radio-button>
                    <el-radio-button label="warning">警告</el-radio-button>
                    <el-radio-button label="danger">危险</el-radio-button>
                    <el-radio-button label="info">忽视</el-radio-button>
                    <el-radio-button label="text">文字</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="大小">
                <el-radio-group v-model="props.size">
                    <el-radio-button label="medium">中</el-radio-button>
                    <el-radio-button label="small">小</el-radio-button>
                    <el-radio-button label="mini">迷你</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="朴素">
                <el-switch v-model="props.plain"></el-switch>
            </el-form-item>
            <el-form-item label="圆角">
                <el-switch v-model="props.round"></el-switch>
            </el-form-item>
            <el-form-item label="圆形">
                <el-switch v-model="props.circle"></el-switch>
            </el-form-item>

            <br>
            <el-divider>布局</el-divider>
            <el-form-item>
                <template slot="label">宽度 <i class="g-hint">（设置为空时自适应内容）</i></template>
                <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item>
                <template slot="label">高度 <i class="g-hint">（设置为空时自适应内容）</i></template>
                <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <margin-props-editor includes="left,right"></margin-props-editor>

            <br>
            <el-divider>链接</el-divider>
            <el-form-item label="链接地址">
                <el-input v-model="props.href" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="props.href" label="新页面打开链接">
                <el-switch v-model="props.target"></el-switch>
            </el-form-item>

            <br>
            <el-divider>扩展</el-divider>
            <background-props-editor></background-props-editor>
        </el-form>

</template>

<script>
export default {

}
</script>
