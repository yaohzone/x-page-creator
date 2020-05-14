<template>
    <el-form label-position="top">
        <el-form-item label="水平定位相对方向">
            <el-radio v-model="props.horizontalReference" label="left">左侧</el-radio>
            <el-radio v-model="props.horizontalReference" label="right">右侧</el-radio>
        </el-form-item>
        <el-form-item v-if="props.horizontalReference === 'left'" label="距离左侧">
            <el-input-number v-model="props.left" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item v-if="props.horizontalReference === 'right'" label="距离右侧">
            <el-input-number v-model="props.right" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="垂直定位相对方向">
            <el-radio v-model="props.verticalReference" label="top">顶部</el-radio>
            <el-radio v-model="props.verticalReference" label="bottom">底部</el-radio>
        </el-form-item>
        <el-form-item v-if="props.verticalReference === 'top'" label="距离顶部">
            <el-input-number v-model="props.top" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item v-if="props.verticalReference === 'bottom'" label="距离底部">
            <el-input-number v-model="props.bottom" controls-position="right"></el-input-number>
        </el-form-item>
    </el-form>
</template>
