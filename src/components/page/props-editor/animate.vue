<template>
    <el-form label-position="top">
        <el-form-item label="启用动画">
            <el-switch v-model="props.animate"></el-switch>
        </el-form-item>
        <template v-if="props.animate">
            <el-form-item label="动画名">
                <el-select v-model="props.animateName">
                    <el-option
                        v-for="name in base.animateNames"
                        :key="name"
                        :label="name"
                        :value="name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <template v-if="props.animateName">
                <el-form-item label="动画速度">
                    <el-radio-group v-model="props.animateSpeed">
                        <el-radio-button v-for="speed in base.animateSpeeds" :key="speed.value" :label="speed.value">{{speed.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="无限播放">
                    <el-switch v-model="props.animateInfinite"></el-switch>
                </el-form-item>
                <el-form-item >
                    <template slot="label">延迟（秒） <i class="g-hint">页面加载完毕多久后开始播放动画</i></template>
                    <el-radio-group v-model="props.animateDelay">
                        <el-radio-button v-for="delay in base.animateDelays" :key="delay.value" :label="delay.value">{{delay.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </template>
        </template>
    </el-form>
</template>
