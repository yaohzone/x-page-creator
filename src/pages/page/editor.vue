<style lang="less" scoped>
@import (reference) "~@/assets/style/reference";

.page-editor {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;

    .editor-header {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 3001;
        height: 50px;
        padding: 5px 10px;
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: 0.2s;
        &.hide {
            transform: translateY(-100%);
        }
        .header-title {
            line-height: 40px;
            font-size: 22px;
            color: @color-info;
        }
        .header-handles {
            position: absolute;
            right: 10px;
            top: 50%;
            z-index: 9;
            transform: translateY(-50%);
            .item {
                margin-left: 10px;
                margin-right: 10px;
            }
        }
        .toggle-btn {
            content: '';
            position: absolute;
            right: 10px;
            bottom: -20px;
            z-index: 8;
            width: 40px;
            height: 20px;
            border: 1px solid #dfdfdf;
            border-radius: 0 0 5px 5px;
            border-top: none;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(0, 0, 0, 0.1);
            background: #fff;
            line-height: 20px;
            text-align: center;
            font-size: 16px;
            color: @color-info;
            cursor: pointer;
            opacity: 0.8;
            transition: 0.2s;
            &:hover{
                opacity: 1;
            }
        }
    }

    .editor-navbar {
        position: fixed;
        left: 0;
        top: 50%;
        right: 0;
        z-index: 3000;
        width: 120px;
        max-height: calc(100% - 140px);
        padding: 10px 0 10px 10px;
        border-radius: 0 8px 8px 0;
        background: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        transform: translate(0, -50%);
        transition: 0.2s;
        &.hide {
            transform: translate(-100%, -50%);
        }
        .toggle-btn {
            content: '';
            position: absolute;
            right: -20px;
            top: 50%;
            z-index: 8;
            width: 20px;
            height: 40px;
            margin-top: -20px;
            border-radius: 0 5px 5px 0;
            border: 1px solid #dfdfdf;
            border-left: none;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.1), inset 1px 0 4px rgba(0, 0, 0, 0.1);
            background: #fff;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: @color-info;
            cursor: pointer;
            opacity: 0.8;
            transition: 0.2s;
            &:hover{
                opacity: 1;
            }
        }
        .component-list {
            height: 100%;
            overflow-y: auto;
            .component-title {
                margin-top: 16px;
                margin-bottom: 8px;
                color: #888;
                font-size: 12px;
            }
            .component-item {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                margin: 5px 0;
                padding: 0 8px;
                line-height: 24px;
                font-size: 12px;
                color: #222;
                cursor: move;
                opacity: 0.8;
                .icon {
                    flex: 0 0 20px;
                    // display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: contain;
                    vertical-align: middle;
                    text-align: center;
                }
                .name {
                    flex: auto;
                    .ellipsis-oneline();
                }
                &:hover {
                    opacity: 1;
                }
            }
        }
    }

    .editor-container {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        overflow: hidden;
        transition: 0.2s;
        &.full-vertical {
            top: 0;
        }
        .editor-workspace {
            position: relative;
            height: 100%;
            // position: absolute;
            // top: 0;
            // left: 0;
            // right: 0;
            // bottom: 0;
            background-color: #fff;
            overflow-x: hidden;
            overflow-y: auto;
            &.mobile {
                width: 750px;
                max-width: 100%;
                margin-left: auto;
                margin-right: auto;
                box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.15);
            }
            &.editing {
                background-image: linear-gradient(
                    45deg,
                    #f2f2f2 25%,
                    transparent 0,
                    transparent 75%,
                    #f2f2f2 0
                ),
                linear-gradient(
                    45deg,
                    #f2f2f2 25%,
                    transparent 0,
                    transparent 75%,
                    #f2f2f2 0
                );
                background-position: 0 0, 10px 10px;
                background-size: 20px 20px;
            }
        }
        .mobile-setting {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 9;
            width: 180px;
            padding: 10px;
            background: #fff;
        }
    }

    .component-editor {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        width: 420px;
        padding-left: 20px;
        background: #fff;
        box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
        transition: 0.2s;
        .sidebar-handles {
            position: absolute;
            left: -10px;
            top: 0;
            z-index: 10;
            width: 20px;
            padding-top: 25px;
            .tag {
                position: relative;
                display: block;
                width: 20px;
                height: 20px;
                margin-bottom: 10px;
                border-radius: 50%;
                background-color: fade(#9facc3, 70);
                background-repeat: no-repeat;
                background-position: center center;
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
                transition: 0.3s;
                &.tree {
                    background-image: url(~@/assets/images/tree.png);
                }
                &.history {
                    background-image: url(~@/assets/images/history.png);
                }
                &.to-hide {
                    &:before {
                        content: '';
                        position: absolute;
                        left: 10%;
                        top: 50%;
                        z-index: 2;
                        width: 80%;
                        height: 2px;
                        background-color: #fff;
                        transform: rotate(30deg);
                    }
                }

                &:hover {
                    background-color: #9facc3;
                }
            }
        }
        .title {
            height: 60px;
            padding-top: 10px;
            line-height: 50px;
            font-size: 16px;
            color: #888;
            border-bottom: 1px solid #ddd;
            .ellipsis-oneline();
            .extra {
                margin-left: 20px;
                font-size: 14px;
                color: #555;
            }
        }
        .wrapper {
            position: absolute;
            left: 0;
            top: 60px;
            right: 0;
            bottom: 0;
            z-index: 9;
            padding: 20px;
            overflow-x: visible;
            overflow-y: auto;
            .page-tree {
                margin-bottom: 20px;
                overflow: auto;
            }
        }

        &.max {
            width: 98%;
            padding-left: 40px;
            .wrapper {
                padding: 20px 40px;
            }
        }
    }


    &.dark {
        .editor-header{
            background: #222;
            .header-title{
                color: #fff;
            }
        }
    }
}

.page-templates {
    padding: 0 20px;
    .templates-list {
        margin-top: 20px;
        &:first-child {
            margin-top: 0;
        }
        .title {
            margin-bottom: 10px;
            color: #222;
        }
        .item {
            margin-bottom: 10px;
            margin-left: 0!important;
            margin-right: 20px!important;
        }
    }
}

.setting-item {
    font-size: 12px;
    .name {
        color: #222;
    }
    .desc {
        float: right;
        margin-left: 10px;
        color: #8492a6;
    }
}
</style>

<template>
    <div ref="wrapper" class="page-editor">
        <div class="editor-header" :class="{hide: !headerShown}">
            <div class="toggle-btn" @click="toggleHeaderShown">
                <i :class="{'el-icon-arrow-up': headerShown, 'el-icon-arrow-down': !headerShown}"></i>
            </div>
            <div class="header-title">页面搭建系统</div>
            <div class="header-handles">
                <router-link to="/document"><el-button round>使用文档 <i class="el-icon-question"></i></el-button></router-link>
                <el-radio-group class="item" v-model="editing">
                    <el-radio-button :label="1"><i class="el-icon-edit"></i> 编辑模式</el-radio-button>
                    <el-radio-button :label="0"><i class="el-icon-view"></i> 预览模式</el-radio-button>
                </el-radio-group>
                <el-button-group class="item">
                    <el-button
                        :type="pageMode === 'pc' ? 'primary' : ''"
                        icon="el-icon-monitor"
                        round
                        :disabled="pageInfo.isTemplate === 1"
                        @click="switchPageMode('pc')"
                    >PC</el-button>
                    <el-button
                        :type="pageMode === 'mobile' ? 'primary' : ''"
                        icon="el-icon-mobile"
                        round
                        :disabled="pageInfo.isTemplate === 1"
                        @click="switchPageMode('mobile')"
                    >移动</el-button>
                </el-button-group>
                <el-button type="warning" round @click="showPhotosManager"><i class="el-icon-picture"></i> 图片素材</el-button>
                <el-button type="warning" round @click="pageTemplatesVisible = true"><i class="el-icon-menu"></i> 模板</el-button>
                <el-button type="primary" round @click="preparePageInfo"><i class="el-icon-setting"></i> 基础设置</el-button>
                <el-button v-if="pageInfo.isTemplate && pageId" type="primary" round @click="preparePageTemplate"><i class="el-icon-setting"></i> 模板设置</el-button>
                <el-button type="info" round @click="clearPageTree"><i class="el-icon-brush"></i> 清空</el-button>
                <el-button type="success" round @click="savePageContent"><i class="el-icon-finished"></i> 保存</el-button>
                <el-button v-if="pageInfo.isTemplate && pageId" type="danger" round @click="preparePageTemplate(true)"><i class="el-icon-finished"></i> 保存为新模板</el-button>
                <el-button v-if="!pageInfo.isTemplate && pageId" type="danger" round @click="preparePageTemplate(true)"><i class="el-icon-document-copy"></i> 保存为模板</el-button>
            </div>
        </div>
        <div class="editor-navbar" :class="{hide: !navShown}">
            <div class="toggle-btn" @click="toggleNavShown">
                <i :class="{'el-icon-arrow-left': navShown, 'el-icon-arrow-right': !navShown}"></i>
            </div>
            <div class="component-list">
                <div v-if="layoutComponents.length" class="component-title">布局组件</div>
                <div class="component-item" v-for="component in layoutComponents" :key="component.name" v-creator="component" :title="component.label">
                    <i class="icon" :style="{backgroundImage: component.icon ? 'url('+component.icon+')' : ''}">{{!component.icon ? '#' : ''}}</i>
                    {{component.label}}
                </div>
                <div v-if="basicComponents.length" class="component-title">基础组件</div>
                <div class="component-item" v-for="component in basicComponents" :key="component.name" v-creator="component" :title="component.label">
                    <i class="icon" :style="{backgroundImage: component.icon ? 'url('+component.icon+')' : ''}">{{!component.icon ? '#' : ''}}</i>
                    {{component.label}}
                </div>
                <div v-if="advancedComponents.length" class="component-title">高级组件</div>
                <div class="component-item" v-for="component in advancedComponents" :key="component.name" v-creator="component" :title="component.label">
                    <i class="icon" :style="{backgroundImage: component.icon ? 'url('+component.icon+')' : ''}">{{!component.icon ? '#' : ''}}</i>
                    {{component.label}}
                </div>
            </div>
        </div>
        <div class="editor-container" :class="{'full-vertical': !headerShown}">
            <div
                ref="editorWorkspace"
                id="editorWorkspace"
                class="editor-workspace"
                :class="{editing: !!editing, mobile: pageMode === 'mobile'}"
                :style="workspaceStyle"
            >
                <page-parser :key="pageParserKey" :tree="pageTree" :edit="editing"></page-parser>
            </div>
            <div v-if="pageMode === 'mobile'" class="mobile-setting">
                <el-form label-position="top" size="mini">
                    <el-form-item label="选择机型尺寸">
                        <el-select v-model="mobileModeSetting.selected" placeholder="请选择机型">
                            <el-option
                                v-for="mobile in mobileSizes"
                                :key="mobile.id"
                                :label="mobile.label"
                                :value="mobile.id">
                                <div class="setting-item">
                                    <span class="name">{{ mobile.label }}</span>
                                    <span class="desc">
                                        {{ mobile.value.width || '*' }} x {{mobile.value.height || '*'}}
                                    </span>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宽">
                        <el-input-number v-if="mobileModeSetting.selected" :value="currentMobileSize.width" controls-position="right" disabled></el-input-number>
                        <el-input-number v-else v-model="mobileModeSetting.width" controls-position="right" :min="300" :max="1024"></el-input-number>
                    </el-form-item>
                    <el-form-item label="高">
                        <el-input-number v-if="mobileModeSetting.selected" :value="currentMobileSize.height" controls-position="right" disabled></el-input-number>
                        <el-input-number v-else v-model="mobileModeSetting.height" controls-position="right" :min="300" :max="1024"></el-input-number>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="g-hint">* 使用图片建议使用2X或3X图，在高倍屏手机可以获得更优画质</div>
                    </el-form-item>
                </el-form>
            </div>
            <transition name="popright">
                <div v-if="drawerVisible && focusComponent" class="component-editor" :class="{max: drawerVisibleMax}">
                    <div class="sidebar-handles">
                        <i
                            class="tag el-icon-close"
                            title="关闭"
                            @click="drawerVisible=false, drawerVisibleMax=false, showHistory=false"
                        ></i>
                        <i
                            class="tag"
                            :class="{'el-icon-back': !drawerVisibleMax, 'el-icon-right': drawerVisibleMax}"
                            :title="drawerVisibleMax ? '收缩' : '展开'"
                            @click="drawerVisibleMax=!drawerVisibleMax"
                        ></i>
                        <!-- <i
                            class="tag history"
                            :class="{'to-hide': showHistory}"
                            :title="showHistory ? '隐藏历史记录' : '显示历史记录'"
                            @click="showHistory=!showHistory"
                        ></i> -->
                        <i
                            class="tag tree"
                            :class="{'to-hide': showPageTree}"
                            :title="showPageTree ? '隐藏树' : '显示树'"
                            @click="showPageTree=!showPageTree"
                        ></i>
                    </div>
                    <div class="title">
                        编辑
                        <span class="extra">{{focusComponent.label}} &lt;{{focusComponent.name}}&gt; [ID:{{focusComponent.id}}]</span>
                    </div>
                    <div class="wrapper">

                        <!-- 历史记录 -->
                        <!-- <div v-if="showHistory" class="page-history">
                            历史记录
                        </div> -->

                        <!-- 组件树节点展示 -->
                        <div v-if="showPageTree" class="page-tree">
                            <el-divider>页面组件树</el-divider>
                            <el-tree
                                :key="pageTreeKey"
                                :data="pageTrees"
                                :show-checkbox="false"
                                default-expand-all
                                node-key="id"
                                ref="pageTree"
                                highlight-current
                                :expand-on-click-node="false"
                                :current-node-key="focusComponent.id"
                                :props="{
                                    children: 'children',
                                    label: pageTreeLabel
                                }"
                                @node-click="changeFocusComponent"
                            >
                            </el-tree>
                        </div>

                        <!-- 组件编辑器 -->
                        <component-editer :component="focusComponent">
                            <p class="g-message">该组件还没有组件编辑器</p>
                        </component-editer>
                    </div>
                </div>
            </transition>
        </div>
        <el-dialog
            title="基础设置"
            :visible.sync="pageInfoVisible"
            width="420px"
            :center="true">
            <el-form v-if="editingPageInfo" ref="pageInfo" :model="editingPageInfo" :rules="pageInfoRules" label-position="top" style="padding: 0 20px;">
                <el-form-item label="页面名称" prop="name">
                    <el-input
                        v-model="editingPageInfo.name"
                        size="medium"
                        clearable
                        placeholder="页面名称（项目名）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Title" prop="title">
                    <el-input
                        v-model="editingPageInfo.title"
                        size="medium"
                        clearable
                        placeholder="标题（SEO）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Keywords" prop="keywords">
                    <el-input
                        v-model="editingPageInfo.keywords"
                        size="medium"
                        clearable
                        placeholder="关键字（SEO）"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="desc">
                    <el-input
                        v-model="editingPageInfo.desc"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        size="medium"
                        clearable
                        placeholder="描述（SEO）"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="pageInfoVisible = false">取 消</el-button>
                <el-button type="success" size="medium" @click="savePageInfo">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="模板设置"
            :visible.sync="templateInfoVisible"
            width="420px"
            :center="true">
            <el-form v-if="editingTemplateInfo" ref="pageInfo" label-position="top" style="padding: 0 20px;">
                <el-form-item label="模板名称">
                    <el-input
                        v-model="editingTemplateInfo.name"
                        size="medium"
                        clearable
                        placeholder="项目名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="设为共享模板">
                    <el-switch v-model="editingTemplateInfo.isPublic" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="templateInfoVisible = false">取 消</el-button>
                <el-button type="success" size="medium" @click="saveTemplateInfo">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="模板管理"
            :visible.sync="pageTemplatesVisible"
            width="560px"
            :center="true">
            <div v-loading="pageTemplatesLoading" class="page-templates">
                <div class="templates-list">
                    <div class="title">私有模板：</div>
                    <el-radio-group v-if="privatePageTemplates.length" v-model="selectedPageTemplateId">
                        <el-radio v-for="template in privatePageTemplates" :key="template.id" class="item" :label="template.id" border>{{template.name}}</el-radio>
                    </el-radio-group>
                    <div v-else class="g-message">还没相应模板</div>
                </div>
                <div class="templates-list">
                    <div class="title">共享模板：</div>
                    <el-radio-group v-if="sharePageTemplates.length" v-model="selectedPageTemplateId">
                        <el-radio v-for="template in sharePageTemplates" :key="template.id" class="item" :label="template.id" border>{{template.name}}</el-radio>
                    </el-radio-group>
                    <div v-else class="g-message">还没相应模板</div>
                </div>
            </div>
            <div slot="footer">
                <el-button size="medium" @click="pageTemplatesVisible = false">取 消</el-button>
                <el-button type="danger" size="medium" :disabled="!selectedPageTemplate" @click="usePageTemplate">应用模板</el-button>
                <el-button type="primary" size="medium" :disabled="!selectedPageTemplate || !selectedPageTemplate.canEdit" @click="editPageTemplate">编辑模板</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {Loading} from "element-ui";
import cloneDeep from 'lodash/cloneDeep';
import {
    normalizeStoreComponent,
    createPageRoot,
    preventDefaultListener,
    beforeunloadListener,
    cacheEditorPageTree,
    getEditorPageTreeCache,
    clearEditorPageTreeCacheHistory,
    commondClearPageTree,
    commondSetPageTree,
    commondSetPageInfo,
    commondTogglePageEditeState,
    commondTogglePageModeState,
    commondToggleComponentEditor,
    commondSetFocusComponent,
    normalizeStoreTemplate,
    extractPageStateFromStoreTemplate
} from '@/utils';
import {createKeyboardShortcutsListener} from './keyboard-shortcuts.js'
import PageParser from '@/components/page-parser.js';
import ComponentEditer from '@/components/component-editer.js';
import photosManager from '@/components/photos';
import components from '@/page-components.js';

const pageComponents = cloneDeep(components);

/**
 * 页面编辑 & 模板编辑
 * -- 允许直接保存生成新页面，以及基于已有模板保存生成新页面
 * -- 允许基于已有页面或模板生成新模板，暂不支持直接保存生成新模板
 */

export default {
    components: {
        PageParser,
        ComponentEditer
    },
    data() {
        let mobileModeSetting = this.$localStore.get('mobileModeSetting') || {selected: 1, width: 750, height: void 0};
        return {
            allPageComponents: pageComponents,
            navShown: this.$session.get('editorNavShown') !== false ? true : false,
            headerShown: this.$session.get('editorHeaderShown') !== false ? true : false,
            photosVisiable: true,
            drawerVisibleMax: false,
            showPageTree: false,
            showHistory: false,

            pageSaving: false,

            pageInfoVisible: false,
            editingPageInfo: null,
            pageInfoRules: {
                name: {required: true, message: '必填'},
                title: {required: true, message: '必填'},
                keywords: {required: true, message: '必填'},
                desc: {required: true, message: '必填'}
            },

            templateInfoVisible: false,
            editingTemplateInfo: null,
            saveAsNewTemplate: false,

            pageTemplatesVisible: false,
            pageTemplatesLoading: false,
            allPageTemplates: [],
            selectedPageTemplateId: '',

            mobileModeSetting,
            // 移动机型尺寸
            mobileSizes: [
                {
                    id: '',
                    label: '自定义',
                    value: {
                        width: mobileModeSetting.width,
                        height: mobileModeSetting.height
                    }
                },
                {
                    id: 1,
                    label: 'Android机型(通用)',
                    value: {
                        width: 360,
                        height: 640
                    }
                },
                {
                    id: 2,
                    label: 'iPhone XR/XSMax/11/11PMax',
                    value: {
                        width: 414,
                        height: 896
                    }
                },
                {
                    id: 3,
                    label: 'iPhone X/XS/11P',
                    value: {
                        width: 375,
                        height: 812
                    }
                },
                {
                    id: 4,
                    label: 'iPhone 6/6S/7/8 Plus',
                    value: {
                        width: 414,
                        height: 736
                    }
                },
                {
                    id: 5,
                    label: 'iPhone 6/6S/7/8',
                    value: {
                        width: 375,
                        height: 667
                    }
                },
                {
                    id: 6,
                    label: 'iPhone 5/5S/5C/SE',
                    value: {
                        width: 320,
                        height: 568
                    }
                },
                {
                    id: 7,
                    label: 'Samsung Galaxy S8/S8+',
                    value: {
                        width: 360,
                        height: 740
                    }
                },
                {
                    id: 8,
                    label: 'Samsung Galaxy Note 4/5',
                    value: {
                        width: 480,
                        height: 853
                    }
                },
                {
                    id: 9,
                    label: 'Google Pixel系列/Nexus系列',
                    value: {
                        width: 411,
                        height: 731
                    }
                }
            ],
            // 用来强制更新
            pageParserKey: 1,
            pageTreeKey: 1
        }
    },
    computed: {
        paramsId() {
            return this.$route.params.id;
        },
        paramsMode() {
            return this.$route.query.mode;
        },
        editing: {
            get() {
                return this.$store.state.pageEditor.editing;
            },
            set(value) {
                commondTogglePageEditeState(value);
            }
        },
        currentMobileSize() {
            let {selected, width, height} = this.mobileModeSetting;
            if(selected) {
                let select = this.mobileSizes.find(item => item.id === selected);
                select && ({value: {width, height}} = select);
            }
            return {width, height}
        },
        workspaceStyle() {
            if(this.pageMode !== 'mobile') return {};
            let mobileSize = this.currentMobileSize;
            return {
                width: mobileSize.width && mobileSize.width + 'px' || void 0,
                height: mobileSize.height && mobileSize.height + 'px' || void 0,
            }
        },
        pageComponents() {
            return this.allPageComponents.filter(component => {
                if(!Array.isArray(component.allowModes)) return false;
                return component.allowModes.indexOf(this.pageMode) > -1
            })
        },
        layoutComponents() {
            return this.pageComponents.filter(i => i.group === 'layout' && i.role !== 'root');
        },
        basicComponents() {
            return this.pageComponents.filter(i => i.group === 'basic');
        },
        advancedComponents() {
            return this.pageComponents.filter(i => i.group === 'advanced');
        },
        pageId() {
            return this.pageInfo.id
        },
        pageMode() {
            return this.$store.state.pageEditor.pageMode;
        },
        pageInfo() {
            return this.$store.state.pageEditor.pageInfo;
        },
        pageTree() {
            return this.$store.state.pageEditor.pageTree;
        },
        pageTrees() {
            return [this.pageTree]
        },
        focusComponent() {
            return this.$store.state.pageEditor.focusComponent;
        },
        drawerVisible: {
            get () {
                return this.$store.state.pageEditor.componentEditing;
            },
            set (value) {
                commondToggleComponentEditor(value)
            }
        },
        // 过滤到相应平台模板
        pageTemplates() {
            let contentField = this.pageMode === 'mobile' ? 'mobileContent' : 'webContent';
            return this.allPageTemplates.filter(template => template.detail[contentField]);
        },
        sharePageTemplates() {
            return this.pageTemplates.filter(template => template.isPublic === 1);
        },
        privatePageTemplates() {
            return this.pageTemplates.filter(template => template.isPublic === 0);
        },
        selectedPageTemplate() {
            let id = this.selectedPageTemplateId;
            if(!id) return;
            return this.pageTemplates.find(template => template.id === id);
        }
    },
    watch: {
        editing(value) {
            this.headerShown = this.navShown = !!value;
            if(!value) this.drawerVisible = false;
        },
        mobileModeSetting: {
            deep: true,
            handler(value) {
                this.pageParserKey++;
                this.$localStore.set('mobileModeSetting', value);
            }
        },
        navShown(value) {
            this.$session.set('editorNavShown', value);
        },
        headerShown(value) {
            this.$session.set('editorHeaderShown', value);
        },
        focusComponent(value) {
            let id = value && value.id;
            this.$nextTick(() => {
                // 焦点组件变化，高亮组件树相应节点
                this.$refs.pageTree && this.$refs.pageTree.setCurrentKey(id);
            })
        },
        pageTemplatesVisible(value) {
            if(value) {
                this.getPageTemplates();
            }
        },
        pageTrees: {
            deep: true,
            handler(value) {
                this.pageTreeKey++;
            }
        }
    },
    mounted() {
        // element-ui Loading fullScreen导致的本页面样式问题，此处补丁一下
        document.body.classList.add('static');

        this.initPageData();
        this.keyboardShortcutsListener = createKeyboardShortcutsListener(this);
        window.addEventListener('keydown', this.keyboardShortcutsListener, false);
        window.addEventListener('beforeunload', beforeunloadListener, false);
        window.addEventListener('contextmenu', preventDefaultListener, false);
    },
    destroyed() {
        document.body.classList.remove('static');

        this.keyboardShortcutsListener && window.removeEventListener('keydown', this.keyboardShortcutsListener, false);
        window.removeEventListener('beforeunload', beforeunloadListener, false);
        window.removeEventListener('contextmenu', preventDefaultListener, false)
    },
    beforeRouteLeave (to, from, next) {
        let changed = false;
        try {
            // 检查是否变化
            let pageTreeData = normalizeStoreComponent(this.pageTree);
            let cacheData = getEditorPageTreeCache();
            changed = JSON.stringify(pageTreeData) !== JSON.stringify(cacheData);
        } catch (err) {
            changed = true;
        }
        if(!changed) return next();

        // 提醒保存
        this.$confirm('页面内容还未保存，确定要离开吗？', '提示', {
            type: 'warning',
            center: true
        }).then(() => {
            if(this.pageId) {
                // 丢弃缓存
                clearEditorPageTreeCacheHistory();
            } else {
                // 缓存以备后用
                cacheEditorPageTree();
            }
            next();
        });
    },
    methods: {

        // 初始化页面数据
        async initPageData() {
            commondTogglePageModeState(this.paramsMode);
            if(this.paramsId) {
                // 编辑页面
                await this.$store.dispatch('pageEditor/updatePageFromServer', this.paramsId).catch(err => {});
                // 丢弃缓存历史 --重新开始
                clearEditorPageTreeCacheHistory();
                cacheEditorPageTree();
            } else {
                // 创建页面
                let pageTree;
                let cache = getEditorPageTreeCache();
                if(cache) {
                    pageTree = cache;
                    // await this.$confirm('发现最近有未保存的内容，是否继续编辑？', '提示', {
                    //     type: 'success',
                    //     center: true
                    // }).then(res => {
                    //     pageTree = cache
                    // }).catch(err => {});
                } else {
                    pageTree = createPageRoot();
                }
                commondSetPageTree(pageTree);
            }

        },

        // 切换页面类型
        async switchPageMode(value) {
            if(this.pageMode === value) return;
            let confirm = true;
            if(this.pageId || this.paramsId) {
                confirm = await this.$confirm('该操作将重置缓存历史，是否继续？<br>请注意当前编辑内容是否已保存。', '提示', {
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    center: true
                }).catch(e => false);
            }
            if(confirm) {
                this.$router.replace({query: {mode: value}});
            }
        },

        toggleNavShown() {
            this.navShown = !this.navShown;
        },
        toggleHeaderShown() {
            this.headerShown = !this.headerShown;
        },
        // 显示图片素材管理
        showPhotosManager() {
            photosManager({isPicker: false});
        },
        // 组件树label
        pageTreeLabel(data, node) {
            return `${data.label} [ID:${data.id}]`
        },
        // 点击组件树节点设置焦点组件
        changeFocusComponent(data, node) {
            commondSetFocusComponent(data.id);
        },
        // 显示页面信息
        preparePageInfo() {
            let {name, detail: {title, keywords, desc}={}} = this.pageInfo;
            this.editingPageInfo = {name, title, keywords, desc};
            this.pageInfoVisible = true;
        },
        // 校验页面信息
        validatePageInfo() {
            return this.$refs.pageInfo.validate().then(result => {
                let {name, title, keywords, desc} = this.editingPageInfo;
                name = name.trim();
                title = title.trim();
                keywords = keywords.trim();
                desc = desc.trim();
                if(!name || !title || !keywords || !desc) {
                    this.$message.warning('请填写完整页面信息')
                    return Promise.reject();
                }
                return true;
            })
        },

        /**
         * 保存基础信息 （页面/模板）
         *  -- 保存已有页面/模板
         *  -- 保存为新增时（pageInfo无id），作新页面保存，直接创建新页面并切换到编辑页面模式
         */
        savePageInfo() {
            this.validatePageInfo().then(async result => {
                let {name, title, keywords, desc} = this.editingPageInfo;
                let {id, isTemplate=0, isPublic=0, canEdit, detail: {webContent='', mobileContent=''}={}} = this.pageInfo || {};
                let op = 'edit';

                // 判断编辑权限
                if(canEdit === false) {
                    return this.$alert(`您当前不被允许操作该${isTemplate ? '模板' : '页面'}`, {
                        type: 'warning',
                        center: true
                    });
                }

                if(!id) {
                    // 生成新页面
                    op = 'add';
                    isTemplate = 0;
                    isPublic = 0;

                    // 首次保存生成页面内容
                    let template = await normalizeStoreTemplate(this.pageTree, this.pageMode);
                    // 根据平台存储
                    if(this.pageMode === 'mobile') {
                        mobileContent = template;
                    } else {
                        webContent = template;
                    }
                }

                let info = {
                    id,
                    name,
                    op,
                    isTemplate,
                    isPublic,
                    isNew: true,
                    'detail.title': title,
                    'detail.desc': desc,
                    'detail.keywords': keywords,
                    'detail.webContent': webContent,
                    'detail.mobileContent': mobileContent
                }

                this.$api('/template/save', {
                    method: 'post',
                    data: info,
                    loading: true
                }).then(pageId => {
                    if(!pageId) return;
                    this.pageInfoVisible = false;

                    this.$message.success('设置成功');

                    if(op === 'add') {
                        // 生成新页面，转到新页面
                        this.$router.replace({params: {id: pageId}, query: {mode: this.pageMode}});
                    } else {
                        // 更新基础信息
                        commondSetPageInfo({name, detail: {title, keywords, desc }});
                    }

                })
            });
        },

        // 显示模板信息
        preparePageTemplate(asNew) {
            if(!this.pageId) {
                this.$message.warning('暂不支持直接生成模板');
                return;
            }
            let {name, isPublic, isTemplate} = this.pageInfo;
            // 保存为新模板 --form页面
            this.saveAsNewTemplate = asNew === true;
            this.editingTemplateInfo = {name, isTemplate, isPublic};
            this.templateInfoVisible = true;
        },

        // 保存模板信息 --（模板/页面保存为模板）
        async saveTemplateInfo() {
            let {name, isPublic=0} = this.editingTemplateInfo || {};
            name = name.trim();
            if(!name) return this.$message.warning('请填写模板名称');
            let isTemplate = 1;
            let op = 'edit';
            let {id, canEdit, detail: {webContent, mobileContent, title, keywords, desc}={}} = this.pageInfo || {};

            // 判断编辑权限
            if(canEdit === false) {
                return this.$alert(`您当前不被允许操作该模板`, {
                    type: 'warning',
                    center: true
                });
            }

            if(this.saveAsNewTemplate) {
                // 保存为新模板
                id = '';
            }

            if(!id) {
                // 新模板
                op = 'add';
                // 首次保存生成页面内容
                let template = await normalizeStoreTemplate(this.pageTree, this.pageMode);
                // 根据平台存储 --一个模板只能存储为一个平台
                if(this.pageMode === 'mobile') {
                    webContent = '';
                    mobileContent = template;
                } else {
                    webContent = template;
                    mobileContent = '';
                }
            }

            let info = {
                id,
                op,
                name,
                isTemplate,
                isPublic,
                isNew: true,
                'detail.title': title,
                'detail.desc': desc,
                'detail.keywords': keywords,
                'detail.webContent': webContent,
                'detail.mobileContent': mobileContent
            }

            this.$api('/template/save', {
                method: 'post',
                data: info,
                loading: true
            }).then(pageId => {
                if(!pageId) return;
                this.templateInfoVisible = false;

                this.$message.success('设置成功');

                if(op === 'edit') {
                    // 更新模板信息
                    commondSetPageInfo({name, isPublic, isTemplate});
                    return ;
                }

                // 生成新模板
                this.$confirm(`已生成新模板，是否前往编辑新模板？<br>请注意当前编辑内容是否已保存。`, '提示', {
                    type: 'warning',
                    center: true,
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: `留在当前`,
                    confirmButtonText: `编辑新模板`
                }).then(() => {
                    this.$router.replace({params: {id: pageId}, query: {mode: this.pageMode}});
                }).catch(() => {
                    cacheEditorPageTree();
                })
            })
        },

        /**
         * 保存页面/模板 编辑内容
         * 按照不同类型保存
         *  --类型：模板/页面 | PC/Mobile | 新增/编辑
         *  --保存方式为新增时（pageInfo无id），转为保存基础信息处理
         */
        async savePageContent() {
            if(!this.pageId) {
                // 创建新页面 --不考虑直接生成为模板
                if(this.pageInfo.isTemplate) {
                    this.$confirm('暂不支持直接生成模板，将生成为页面，是否继续？', '提示', {
                        type: 'warning',
                        center: true
                    }).then(() => {
                        this.preparePageInfo(true);
                    })
                } else {
                    this.preparePageInfo();
                }
                return;
            }

            let {id, name, isTemplate=0, isPublic=0, canEdit, detail: {webContent='', mobileContent='', title, keywords, desc}={}} = this.pageInfo;

            // 判断编辑权限
            if(canEdit === false) {
                return this.$alert(`您当前不被允许操作该${isTemplate ? '模板' : '页面'}`, {
                    type: 'warning',
                    center: true
                });
            }

            if(this.pageSaving) return;
            this.pageSaving = true;

            let template = await normalizeStoreTemplate(this.pageTree, this.pageMode);
            // 根据平台保存
            if(this.pageMode === 'mobile') {
                mobileContent = template;
            } else {
                webContent = template;
            }

            let info = {
                isNew: true,
                id,
                name,
                isTemplate,
                isPublic,
                op: 'edit',
                'detail.title': title,
                'detail.desc': desc,
                'detail.keywords': keywords,
                'detail.webContent': webContent,
                'detail.mobileContent': mobileContent
            }

            this.$api('/template/save', {
                loading: true,
                method: 'post',
                data: info
            }).then(() => {
                this.$message.success('保存成功');
                commondSetPageInfo({detail: {webContent, mobileContent}});
                cacheEditorPageTree();
            }).catch(e => {
                // e
            }).then(() => {
                setTimeout(() => {
                    this.pageSaving = false;
                }, 100)
            });
        },

        // 清空
        clearPageTree() {
            this.$confirm(`确认要清空页面内容吗？<br><strong>保存页面之前可刷新页面或撤销缓存恢复</strong>。`, '提示', {
                type: 'warning',
                dangerouslyUseHTMLString: true,
                center: true
            }).then(() => {
                // 操作前先缓存页面
                cacheEditorPageTree();
                commondClearPageTree();
                cacheEditorPageTree();
            })
        },

        // 获取模板列表
        getPageTemplates() {
            this.pageTemplatesLoading = true;
            this.$api('/template/findAll', {
                // loading: true,
                method: 'post',
                data: {
                    isTemplate: 1,
                    page: 0,
                    pageSize: 1000
                }
            }).then(({data: templates}={}) => {
                this.pageTemplatesLoading = false;
                // 新版搭建系统模板
                this.allPageTemplates = (templates || []).filter(template => template.isNew);
                // this.allPageTemplates = (templates || [])
            }).catch(e => {
                this.pageTemplatesLoading = false;
            });
        },

        // 编辑模板
        editPageTemplate() {
            if(!this.selectedPageTemplate) return this.$message.warning('请先选择模板');
            if(!this.selectedPageTemplate.canEdit) return  this.$message.warning('您没有权限编辑该模板');
            this.$confirm(`即将编辑选中模板，请注意是否已保存当前编辑内容。`, '提示', {
                type: 'warning',
                confirmButtonText: '立即编辑',
                center: true
            }).then(() => {
                this.pageTemplatesVisible = false;
                commondTogglePageEditeState(true);
                this.$router.replace({params: {id: this.selectedPageTemplateId}, query: {mode: this.pageMode}});
            })
        },

        // 应用模板
        usePageTemplate() {
            if(!this.selectedPageTemplate) return this.$message.warning('请先选择模板');
            this.$confirm(`当前编辑内容将被选中模板替换，是否同时替换基础信息？<br>取消模板应用可点击右上角关闭按钮。`, '提示', {
                type: 'warning',
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                confirmButtonText: '替换基础信息',
                cancelButtonText: '不替换',
                center: true
            }).catch(action => {
                if(action === 'cancel') return false;
                return Promise.reject()
            }).then(applyPageInfo => {
                // 操作前先缓存页面
                cacheEditorPageTree();
                let {name, detail: {webContent='', mobileContent='', title, keywords, desc} ={}} = this.selectedPageTemplate;
                let pageTree = extractPageStateFromStoreTemplate(this.pageMode === 'mobile' ? mobileContent : webContent);
                commondSetPageTree(pageTree);
                cacheEditorPageTree();
                if(applyPageInfo) {
                    commondSetPageInfo({name, detail: {title, keywords, desc}});
                }
                this.pageTemplatesVisible = false;
            })
        }
    }
}
</script>
