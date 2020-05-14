<template>
    <el-color-picker
        :value="value"
        show-alpha
        :predefine="localColors"
        @change="colorChanged"
    ></el-color-picker>
</template>

<script>
const defaultColors = [
    '#ffffff',
    '#f4f4f4',
    '#c0c0c0',
    '#888888',
    '#222222',
    '#FEF0F0',
    '#FF5436',
    '#F03A58',
    '#00A5FF',
    '#00C65D'
];

export default {
    data() {
        let localColors = this.$localStore.get('pickedColors');
        return {
            localColors: defaultColors.concat(localColors || [])
        }
    },
    props: {
        value: String
    },
    methods: {
        colorChanged(value) {
            value = value ? value.replace(/\s/g, '') : value;
            this.$emit('input', value);
            this.saveLocalColor(value);
        },
        saveLocalColor(color) {
            if(!color) return;
            let localColors = this.$localStore.get('pickedColors') || [];
            let index = localColors.indexOf(color);
            if(index > -1) {
                localColors.splice(index, 1);
            }
            localColors.unshift(color);
            if(localColors.length > 20) {
                localColors.length = 20;
            }
            this.$localStore.set('pickedColors', localColors);
            this.localColors = defaultColors.concat(localColors);
        }
    }
}
</script>

<style>

</style>
