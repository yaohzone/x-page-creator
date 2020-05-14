<template>
    <el-form label-position="top">
        <el-form-item>
            <template slot="label">
                边框风格
                <span style="margin-left: 20px;">拆分 <el-switch v-model="styleFullSide"></el-switch></span>
            </template>
            <el-form v-if="styleFullSide" :inline="true">
                <el-form-item label="上">
                    <el-radio-group v-model="borderStyles.top">
                        <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="左">
                    <el-radio-group v-model="borderStyles.left">
                        <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="下">
                    <el-radio-group v-model="borderStyles.bottom">
                        <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="右">
                    <el-radio-group v-model="borderStyles.right">
                        <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-radio-group v-else v-model="props.borderStyle">
                <el-radio-button v-for="option in borderStyleOptions" :key="option.value" :label="option.value">{{option.label}}</el-radio-button>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <template slot="label">
                边框宽度
                <span style="margin-left: 20px;">拆分 <el-switch v-model="widthFullSide"></el-switch></span>
            </template>
            <el-form v-if="widthFullSide" :inline="true">
                <el-form-item label="上">
                    <el-input-number v-model="borderWidths.top" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="左">
                    <el-input-number v-model="borderWidths.left" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="下">
                    <el-input-number v-model="borderWidths.bottom" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="右">
                    <el-input-number v-model="borderWidths.right" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <el-input-number v-else v-model="props.borderWidth" controls-position="right" :min="0" :max="1000"></el-input-number>
        </el-form-item>

        <el-form-item>
            <template slot="label">
                边框颜色
                <span style="margin-left: 20px;">拆分 <el-switch v-model="colorFullSide"></el-switch></span>
            </template>
            <el-form v-if="colorFullSide" :inline="true">
                <el-form-item label="上">
                    <color-picker v-model="borderColors.top"></color-picker>
                </el-form-item>
                <el-form-item label="左">
                    <color-picker v-model="borderColors.left"></color-picker>
                </el-form-item>
                <el-form-item label="下">
                    <color-picker v-model="borderColors.bottom"></color-picker>
                </el-form-item>
                <el-form-item label="右">
                    <color-picker v-model="borderColors.right"></color-picker>
                </el-form-item>
            </el-form>
            <color-picker v-else v-model="props.borderColor"></color-picker>
        </el-form-item>

        <el-form-item>
            <template slot="label">
                圆角
                <span style="margin-left: 20px;">拆分 <el-switch v-model="radiusFullSide"></el-switch></span>
            </template>
            <el-form v-if="radiusFullSide" :inline="true">
                <el-form-item label="左上">
                    <el-input-number v-model="borderRadiuses.top" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="右上">
                    <el-input-number v-model="borderRadiuses.right" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="左下">
                    <el-input-number v-model="borderRadiuses.left" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="右下">
                    <el-input-number v-model="borderRadiuses.bottom" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <el-input-number v-else v-model="props.borderRadius" controls-position="right" :min="0" :max="1000"></el-input-number>
        </el-form-item>
    </el-form>
</template>

<script>
import isEqual from 'lodash/isEqual';
import {calcDisplaySize} from '@/utils';

const undef = void 0;

function getFullSideObj(value, isNumber) {
    if(typeof value === 'number') return {top: value, right: value, bottom: value, left: value};
    if(typeof value !== 'string') return {top: undef, right: undef, bottom: undef, left: undef};
    let values = value.split(' ');
    let [top, right, bottom, left] = values;
    if(isNumber) {
        top = parseFloat(top);
        right = parseFloat(right);
        bottom = parseFloat(bottom);
        left = parseFloat(left);
    }

    switch(values.length) {
        case 1:
            return {top, right: top, bottom: top, left: top};
        case 2:
            return {top, right, bottom: top, left: right};
        case 3:
            return {top, right, bottom, left: right};
        case 4:
            return {top, right, bottom, left};
        default:
            return {top: undef, right: undef, bottom: undef, left: undef}
    }
}

function getFullSideValue(obj, isNumber) {
    let {top, right, bottom, left} = obj || {};
    if(isNumber) {
        return calcDisplaySize(top||0) + ' ' + calcDisplaySize(right||0) + ' ' + calcDisplaySize(bottom||0) + ' ' + calcDisplaySize(left||0);
    }
    return (top || '') + ' ' + (right || '') + ' ' + (bottom || '') + ' ' + (left || '');
}

function isFullSide(value) {
    if(typeof value === 'number') return false;
    if(typeof value !== 'string') return false;
    return value.indexOf(' ') > -1;
}

export default {
    data() {
        return {
            borderStyleOptions: [
                {label: '无', value: 'none'},
                {label: '实线', value: 'solid'},
                {label: '虚线', value: 'dashed'},
                {label: '点线', value: 'dotted'}
            ],
            borderWidths: {},
            borderColors: {},
            borderStyles: {},
            borderRadiuses: {}
        }
    },
    computed: {
        widthFullSide: {
            get() {
                return isFullSide(this.props.borderWidth)
            },
            set(value) {
                this.props.borderWidth = value ? getFullSideValue(this.borderWidths, true) : this.borderWidths.top;
            }
        },
        colorFullSide: {
            get() {
                return isFullSide(this.props.borderColor)
            },
            set(value) {
                this.props.borderColor = value ? getFullSideValue(this.borderColors) : this.borderColors.top;
            }
        },
        styleFullSide: {
            get() {
                return isFullSide(this.props.borderStyle)
            },
            set(value) {
                this.props.borderStyle = value ? getFullSideValue(this.borderStyles) : this.borderStyles.top;
            }
        },
        radiusFullSide: {
            get() {
                return isFullSide(this.props.borderRadius)
            },
            set(value) {
                this.props.borderRadius = value ? getFullSideValue(this.borderRadiuses) : this.borderRadiuses.top;
            }
        }
    },
    watch: {
        'props.borderWidth': {
            immediate: true,
            handler(value) {
                this.borderWidths = getFullSideObj(value, true);
            }
        },
        borderWidths: {
            deep: true,
            handler(value) {
                if(this.widthFullSide) {
                    this.props.borderWidth = getFullSideValue(value, true);
                }
            }
        },

        'props.borderColor': {
            immediate: true,
            handler(value) {
                this.borderColors = getFullSideObj(value);
            }
        },
        borderColors: {
            deep: true,
            handler(value) {
                if(this.colorFullSide) {
                    this.props.borderColor = getFullSideValue(value);
                }
            }
        },

        'props.borderStyle': {
            immediate: true,
            handler(value) {
                this.borderStyles = getFullSideObj(value);
            }
        },
        borderStyles: {
            deep: true,
            handler(value) {
                if(this.styleFullSide) {
                    this.props.borderStyle = getFullSideValue(value);
                }
            }
        },

        'props.borderRadius': {
            immediate: true,
            handler(value) {
                this.borderRadiuses = getFullSideObj(value, true);
            }
        },
        borderRadiuses: {
            deep: true,
            handler(value) {
                if(this.radiusFullSide) {
                    this.props.borderRadius = getFullSideValue(value, true);
                }
            }
        }
    }
}
</script>
