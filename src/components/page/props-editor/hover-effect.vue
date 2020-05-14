<template>
    <el-form-item v-if="pageMode === 'pc'" label="悬浮效果">
        <el-radio-group v-model="props.hoverEffect">
            <el-radio-button label="">无</el-radio-button>
            <el-radio-button label="fade">渐淡</el-radio-button>
            <el-radio-button label="zoomout">缩小</el-radio-button>
            <el-radio-button label="zoomin">放大</el-radio-button>
            <el-radio-button label="left">左移</el-radio-button>
            <el-radio-button label="right">右移</el-radio-button>
            <el-radio-button label="top">上移</el-radio-button>
            <el-radio-button label="bottom">下移</el-radio-button>
        </el-radio-group>
    </el-form-item>
</template>
