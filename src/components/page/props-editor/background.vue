<template>
    <el-form label-position="top">
        <el-form-item label="背景色">
            <color-picker v-model="props.backgroundColor"></color-picker>
        </el-form-item>
        <el-form-item label="背景图">
            <picture-picker v-model="props.backgroundImage"></picture-picker>
        </el-form-item>
        <el-form-item v-if="props.backgroundImage" label="填充方式">
            <el-radio-group v-model="props.backgroundImageFill">
                <el-radio-button label="cover">填充</el-radio-button>
                <el-radio-button label="contain">适应</el-radio-button>
                <el-radio-button label="stretch">拉伸</el-radio-button>
                <el-radio-button label="center">居中</el-radio-button>
                <el-radio-button label="tile">平铺</el-radio-button>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>
