<template>
    <el-form-item label="外边距">
        <el-form :inline="true">
            <el-form-item v-if="include('top')" label="上">
                <el-input-number v-model="props.marginTop" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item v-if="include('left')" label="左">
                <el-input-number v-model="props.marginLeft" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item v-if="include('bottom')" label="下">
                <el-input-number v-model="props.marginBottom" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item v-if="include('right')" label="右">
                <el-input-number v-model="props.marginRight" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
    </el-form-item>
</template>

<script>
export default {
    props: {
        includes: {
            type: String,
            default() {
                return 'left,right,top,bottom'
            }
        }
    },
    methods: {
        include(prop) {
            return this.includes.indexOf(prop) > -1;
        }
    }
}
</script>
