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
            <el-table-column prop="title" label="名称" min-width="80"></el-table-column>
            <el-table-column prop="href" label="链接地址" min-width="120" v-slot="{row}">
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
            <br>
            <el-divider>样式设置</el-divider>
            <el-form-item label="水平对齐">
                <el-radio-group v-model="props.align">
                    <el-radio-button label="left">左对齐</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="right">右对齐</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="水平间距">
                <el-input-number v-model="props.marginRight" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="垂直间距">
                <el-input-number v-model="props.marginBottom" controls-position="right" :min="0" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="字号">
                <el-input-number v-model="props.fontSize" controls-position="right" :min="12" :max="48"></el-input-number>
            </el-form-item>
            <el-form-item label="字色">
                <color-picker v-model="props.color"></color-picker>
            </el-form-item>

            <!-- <hover-effect-props-editor></hover-effect-props-editor> -->
        </el-form>

        <el-dialog
            title="设置项"
            :visible.sync="settingVisible"
            width="420px"
            append-to-body
            :center="true">
            <el-form v-if="settingOption" label-position="top" style="padding: 0 20px;">
                <el-form-item label="链接名称">
                    <el-input v-model="settingOption.title" clearable></el-input>
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
                title: '链接项',
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
