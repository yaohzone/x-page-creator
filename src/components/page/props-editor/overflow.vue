<template>
    <el-form label-position="top">
        <el-form-item label="溢出">
            <el-radio-group v-model="props.overflow">
                <el-radio-button label="">默认</el-radio-button>
                <el-radio-button label="visible">显示</el-radio-button>
                <el-radio-button label="hidden">隐藏</el-radio-button>
                <el-radio-button label="auto">滚动</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-if="props.overflow === 'auto'" label="隐藏滚动条">
            <el-switch v-model="props.hideScrollbar"></el-switch>
        </el-form-item>
    </el-form>
</template>
