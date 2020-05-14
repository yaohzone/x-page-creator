<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

</style>

<template>
    <div class="">
        <el-divider>项设置</el-divider>
        <el-table
            :data="props.banners"
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
                <el-link v-if="props.banners.length > 1" icon="el-icon-delete" :underline="false" title="删除" @click="removeOption($index)"></el-link>&nbsp;
                <el-link v-if="$index > 0" icon="el-icon-top" :underline="false" title="上移" @click="upOption(row)"></el-link>&nbsp;
                <el-link v-if="$index < props.banners.length-1" icon="el-icon-bottom" :underline="false" title="下移" @click="downOption(row)"></el-link>&nbsp;
            </el-table-column>
        </el-table>

        <el-form label-position="top">
            <el-divider>布局</el-divider>
            <el-form-item v-if="pageMode !== 'mobile'">
                <template slot="label">整体宽度 <i class="g-hint">（设置为空时撑满外容器）</i></template>
                <el-input-number v-model="props.width" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item v-if="pageMode !== 'mobile'">
                <template slot="label">项高度 <i class="g-hint">（设置为空时自适应内容）</i></template>
                <el-input-number v-model="props.height" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <margin-props-editor includes="top,bottom"></margin-props-editor>
            <el-form-item v-if="pageMode !== 'mobile'" label="每组显示列数">
                <el-input-number v-model="props.slidesPerView" controls-position="right" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item v-if="pageMode !== 'mobile'" label="每组显示行数">
                <el-input-number v-model="props.slidesPerColumn" controls-position="right" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <p class="g-hint">* 多行多列显示时注意配合效果设置宽高</p>

            <br>
            <el-divider>轮播设置</el-divider>
            <p class="g-hint">* 轮播项数必须超过一组（行x列）才有轮播效果</p>
            <!-- <el-form-item label="方向">
                <el-radio-group v-model="props.direction">
                    <el-radio-button label="horizontal">水平</el-radio-button>
                    <el-radio-button label="vertical">垂直</el-radio-button>
                </el-radio-group>
            </el-form-item> -->

            <el-form-item label="效果">
                <el-radio-group v-model="props.effect">
                    <el-radio-button label="slide">位移</el-radio-button>
                    <el-radio-button label="fade">淡入</el-radio-button>
                    <!-- <el-radio-button label="cube">方块</el-radio-button> -->
                    <el-radio-button label="coverflow">3D流</el-radio-button>
                    <el-radio-button label="flip">翻转</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <p class="g-hint">* 部分效果不支持多行多列显示</p>
            <el-form-item label="显示切换">
                <el-switch v-model="props.navigation"></el-switch>
            </el-form-item>
            <el-form-item label="显示分页">
                <el-switch v-model="props.pagination"></el-switch>
            </el-form-item>
            <el-form-item v-if="props.pagination" label="分页类型">
                <el-radio-group v-model="props.paginationType">
                    <el-radio-button label="bullets">圆点</el-radio-button>
                    <el-radio-button label="fraction">数字</el-radio-button>
                    <el-radio-button label="progressbar">进度条</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="props.pagination && props.paginationType !== 'progressbar'" label="分页对齐">
                <el-radio-group v-model="props.paginationAlign">
                    <el-radio-button label="left">居左</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="right">居右</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="props.pagination && props.paginationType === 'fraction'" label="分页字色">
                <color-picker v-model="props.paginationColor"></color-picker>
            </el-form-item>

            <el-form-item label="自动播放">
                <el-switch v-model="props.autoplay"></el-switch>
            </el-form-item>
            <!-- <el-form-item v-if="props.autoplay" label="反向播放">
                <el-switch v-model="props.reverseDirection"></el-switch>
            </el-form-item> -->
            <el-form-item v-if="props.autoplay" label="间隔时间">
                <el-input-number v-model="props.delay" controls-position="right" :min="100"></el-input-number> 毫秒
            </el-form-item>
            <el-form-item v-if="props.autoplay" label="过渡时间">
                <el-input-number v-model="props.speed" controls-position="right" :min="100"></el-input-number> 毫秒
            </el-form-item>
            <!-- <el-form-item v-if="props.autoplay" label="循环播放">
                <el-switch v-model="props.loop"></el-switch>
            </el-form-item> -->
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
            let banners = this.props.banners;
            if(typeof this.currentOption === 'number') {
                // 按序新增
                banners.splice(this.currentOption + 1, 0, this.settingOption);
                return;
            }
            let index = banners.indexOf(this.currentOption);
            if(index > -1) {
                // 编辑
                banners.splice(index, 1, this.settingOption);
            } else {
                // 末尾新增
                banners.push(this.settingOption);
            }
        },
        removeOption(index) {
            if(typeof index !== 'number') return;
            let banners = this.props.banners;
            if(banners.length <= 1) {
                return this.$message.warning('请至少设置一项');
            }
            banners.splice(index, 1);
        },
        upOption(option) {
            let banners = this.props.banners;
            let index = banners.indexOf(option);
            if(index > 0) {
                banners.splice(index, 1);
                banners.splice(index - 1, 0, option);
            }
        },
        downOption(option) {
            let banners = this.props.banners;
            let index = banners.indexOf(option);
            if(index < banners.length - 1) {
                banners.splice(index, 1);
                banners.splice(index + 1, 0, option);
            }
        }
    }
}
</script>
