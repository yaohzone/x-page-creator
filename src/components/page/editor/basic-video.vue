<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <el-form label-position="top">
        <el-divider>基础</el-divider>
        <el-form-item label="视频源">
            <el-input v-model="props.src" placeholder="视频源地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="视频说明">
            <el-input v-model="props.title" placeholder="埋点标识文案" clearable></el-input>
        </el-form-item>

        <br>
        <el-divider>布局</el-divider>
        <el-form-item label="宽度">
            <el-radio v-model="props.widthType" label="full">100%</el-radio>
            <el-radio v-model="props.widthType" label="fixed">固定宽度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.widthType === 'fixed'" label="">
            <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="高度">
            <el-radio v-model="props.heightType" label="full">100%</el-radio>
            <el-radio v-model="props.heightType" label="fixed">固定高度</el-radio>
        </el-form-item>
        <el-form-item v-if="props.heightType === 'fixed'" label="">
            <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <overflow-props-editor></overflow-props-editor>

        <br>
        <el-divider>背景</el-divider>
        <background-props-editor></background-props-editor>

        <br>
        <el-divider>边框</el-divider>
        <border-props-editor></border-props-editor>

        <br>
        <el-divider>动效</el-divider>
        <el-form-item label="弹出视频">
            <el-radio-group v-model="props.openTransition">
                <el-radio-button label="fadescale-shade">放大</el-radio-button>
                <el-radio-button label="popleft-shade">左入</el-radio-button>
                <el-radio-button label="popright-shade">右入</el-radio-button>
                <el-radio-button label="popup-shade">上入</el-radio-button>
                <el-radio-button label="popdown-shade">下入</el-radio-button>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
export default {

}
</script>
