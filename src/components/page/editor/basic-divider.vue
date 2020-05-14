<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>

    <el-form label-position="top">

        <el-divider>分隔线</el-divider>
        <margin-props-editor includes="top,bottom"></margin-props-editor>
        <el-form-item label="风格">
            <el-radio-group v-model="props.borderBottomStyle">
                <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="厚度">
            <el-input-number v-model="props.borderBottomWidth" controls-position="right" :min="0" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="颜色">
            <color-picker v-model="props.borderBottomColor"></color-picker>
        </el-form-item>

        <br>
        <el-divider>标题</el-divider>
        <el-form-item label="标题">
            <el-input v-model="props.title" clearable></el-input>
        </el-form-item>
        <template v-if="props.title">
            <el-form-item label="位置">
                <el-radio-group v-model="props.titleAligin">
                    <el-radio-button label="left">居左</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="right">居右</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="字号">
                <el-input-number v-model="props.titleSize" controls-position="right" :min="12" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="字色">
                <color-picker v-model="props.titleColor"></color-picker>
            </el-form-item>
            <el-form-item label="背景色">
                <color-picker v-model="props.titleBackgroundColor"></color-picker>
            </el-form-item>
            <el-form-item label="背景高度">
                <el-input-number v-model="props.titleHeight" controls-position="right" :min="1" :max="100"></el-input-number>
            </el-form-item>
        </template>
    </el-form>

</template>

<script>
export default {
    data() {
        return {
            borderStyleOptions: [
                {label: '无', value: 'none'},
                {label: '实线', value: 'solid'},
                {label: '虚线', value: 'dashed'},
                {label: '点线', value: 'dotted'}
            ]
        }
    }
}
</script>
