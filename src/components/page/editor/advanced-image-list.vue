<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <div>
        <el-divider>项设置</el-divider>
        <el-table
            :data="props.list"
            style="width: 100%">
            <el-table-column
                type="index"
                :index='1'
                label="#"
                width="40">
            </el-table-column>
            <el-table-column label="图片" width="120" v-slot="{row}">
                <el-image :src="row.src" fit="contain" :style="{width: '100px', height: '60px', backgroundColor: 'rgba(0,0,0,0.3)'}"></el-image>
            </el-table-column>
            <el-table-column prop="href" label="链接" v-slot="{row}">
                <el-link v-if="row.href" :href="row.href" target="_blank">{{row.href}}</el-link>
            </el-table-column>
            <el-table-column label="操作" width="80" v-slot="{row, $index}">
                <el-link icon="el-icon-edit" :underline="false" title="编辑" @click="editOption(row)"></el-link>&nbsp;
                <el-link icon="el-icon-plus" :underline="false" title="添加" @click="addOption($index)"></el-link>&nbsp;
                <el-link v-if="props.list.length > 1" icon="el-icon-delete" :underline="false" title="删除" @click="removeOption($index)"></el-link>&nbsp;
                <el-link v-if="$index > 0" icon="el-icon-top" :underline="false" title="上移" @click="upOption(row)"></el-link>&nbsp;
                <el-link v-if="$index < props.list.length-1" icon="el-icon-bottom" :underline="false" title="下移" @click="downOption(row)"></el-link>&nbsp;
            </el-table-column>
        </el-table>

        <el-form label-position="top">
            <!-- <el-divider>布局</el-divider> -->
            <el-form-item label="列数">
                <el-input-number v-model="props.column" controls-position="right" :min="2" :max="20"></el-input-number>
            </el-form-item>
            <el-form-item label="间距">
                <el-input-number v-model="props.space" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item>
                <template slot="label">项高度 <i class="g-hint">(自动计算图片高度设置为空即可)</i></template>
                <el-input-number v-model="props.itemHeight" controls-position="right" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <margin-props-editor includes="top,bottom"></margin-props-editor>

            <hover-effect-props-editor></hover-effect-props-editor>
        </el-form>

        <el-dialog
            title="设置项"
            :visible.sync="settingVisible"
            width="420px"
            append-to-body
            :center="true">
            <el-form v-if="settingOption" label-position="top" style="padding: 0 20px;">
                <el-form-item label="图片源">
                    <picture-picker v-model="settingOption.src"></picture-picker>
                </el-form-item>
                <el-form-item label="图片说明">
                    <el-input v-model="settingOption.alt" placeholder="埋点标识文案" clearable></el-input>
                </el-form-item>
                <el-form-item label="链接地址">
                    <el-input v-model="settingOption.href" placeholder="示例: https://vipmro.com （无需链接请留空）" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="settingOption.href" label="新页面打开链接">
                    <el-switch v-model="settingOption.target"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="settingVisible = false">取 消</el-button>
                <el-button type="success" size="medium" @click="saveOption">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            settingVisible: false,
            settingOption: null,
            currentOption: null
        }
    },
    methods: {
        getNewOption() {
            return {
                src: '',
                alt: '图片',
                href: '',
                target: true
            }
        },
        addOption(index) {
            this.settingVisible = true;
            this.currentOption = index;
            this.settingOption = this.getNewOption();
        },
        editOption(option) {
            this.settingVisible = true;
            this.currentOption = option;
            this.settingOption = Object.assign(this.getNewOption(), option);
        },
        saveOption() {
            if(!this.settingOption.src) return this.$message.warning('必须设置图片');
            this.settingVisible = false;
            let list = this.props.list;
            if(typeof this.currentOption === 'number') {
                // 按序新增
                list.splice(this.currentOption + 1, 0, this.settingOption);
                return;
            }
            let index = list.indexOf(this.currentOption);
            if(index > -1) {
                // 编辑
                list.splice(index, 1, this.settingOption);
            } else {
                // 末尾新增
                list.push(this.settingOption);
            }
        },
        removeOption(index) {
            if(typeof index !== 'number') return;
            let list = this.props.list;
            if(list.length <= 1) {
                return this.$message.warning('请至少设置一项');
            }
            list.splice(index, 1);
        },
        upOption(option) {
            let list = this.props.list;
            let index = list.indexOf(option);
            if(index > 0) {
                list.splice(index, 1);
                list.splice(index - 1, 0, option);
            }
        },
        downOption(option) {
            let list = this.props.list;
            let index = list.indexOf(option);
            if(index < list.length - 1) {
                list.splice(index, 1);
                list.splice(index + 1, 0, option);
            }
        }
    }
}
</script>
