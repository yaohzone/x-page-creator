<template>
<div>
    <el-dialog
        :title="isPicker ? '图片素材选择' : '图片素材管理'"
        :visible.sync="visible"
        width="80%"
        :center="true"
        @closed="onClosed"
    >
        <div class="photos-wrapper">
            <div class="photos-nav">
                <div class="nav-list">
                    <a
                        v-for="group in tabGroups"
                        :key="group.id"
                        href="javascript: void 0;"
                        class="item"
                        :class="{active: group.id === currentGroupId}"
                        :title="group.name"
                    >
                        <span class="title" @click="switchGroup(group)">{{group.name}}</span>
                        <div v-if="group.id" class="handles">
                            <el-button type="text" @click="renameGroup(group)" title="分组重命名"><i class="icon el-icon-edit"></i></el-button>
                            <el-button type="text" @click="removeGroup(group)" title="删除分组"><i class="icon el-icon-delete"></i></el-button>
                        </div>
                    </a>
                </div>
                <el-button type="primary" class="add-btn" title="新建分组" @click="addGroup"><i class="el-icon-plus"></i> 新建分组</el-button>
            </div>
            <div class="photos-container">
                <div class="photos-header">
                    <div v-if="isPicker && selectedPhoto" class="selected">已选：<strong :title="selectedPhoto.name">{{selectedPhoto.name}}</strong></div>
                    <div class="handles">
                        <el-upload
                            ref="upload"
                            action="/api/imageInfo/uploadFile"
                            multiple
                            accept="image/*,.jpeg,.jpg,.png,.gif,.svg,.bmp"
                            name="pic"
                            :data="{groupId: currentGroupId}"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="filesChanged"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccess"
                            :on-error="uploadFail"
                        >
                            <el-button type="primary" class="btn" title="上传图片"><i class="el-icon-upload"></i> 上传图片</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                    </div>
                </div>
                <div v-loading="loading" class="photos-panel" ref="photoList" id="photoList">
                    <div v-if="currentGroupPhotos.length" class="photos-list">
                        <div
                            v-for="photo in currentGroupPhotos"
                            :key="photo.id"
                            class="photo-item"
                            :class="{active: selectedPhoto && selectedPhoto.id === photo.id}"
                        >
                            <el-image
                                class="pic"
                                :src="photo.url"
                                :alt="photo.name"
                                fit="scale-down"
                                lazy
                                scroll-container="#photoList"
                                :preview-src-list="[photo.url]"
                            ></el-image>
                            <p class="name" :title="photo.name">{{photo.name}}</p>
                            <i class="group" v-if="currentGroupId === ''">{{ getGroupNameById(photo.groupId) }}</i>
                            <i v-if="isPicker" class="el-icon-check select" :class="{selected: selectedPhoto && selectedPhoto.id === photo.id}" title="选择图片" @click="selectPhoto(photo)"></i>
                            <div class="handles">
                                <el-button type="primary" icon="el-icon-edit" size="mini" circle title="图片重命名" @click="renamePhoto(photo)"></el-button>
                                <el-button type="warning" icon="el-icon-connection" size="mini" circle title="修改分组" @click="rechangeGroup(photo)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" circle title="删除图片" @click="removePhoto(photo)"></el-button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="photos-empty">还没有图片</div>
                </div>
                <div class="photos-pagination">
                    <el-pagination
                        v-if="totalRecord"
                        layout="prev, pager, next, total"
                        :current-page.sync="currentPage"
                        :page-size.sync="pageSize"
                        :total="totalRecord"
                        :page-sizes="[12, 24, 36]"
                        @size-change="resetGroupPhotos"
                        @current-change="getGroupPhotos"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <div slot="footer">
            <el-button size="medium" style="width: 120px;" @click="visible = false">取 消</el-button>
            <el-button type="success" size="medium" style="width: 120px;" @click="confirmPhoto">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog
        title="选择分组"
        :visible.sync="groupsVisible"
        width="420px"
        top="20vh"
        :center="true">
        <div class="group-select-list">
            <el-tag
                v-for="group in photoGroups"
                :key="group.id"
                class="item"
                :effect="group.id === selectedGroupId ? 'dark' : 'plain'"
                size="medium"
                @click="selectedGroupId = group.id"
            >{{group.name}}</el-tag>
        </div>
        <div slot="footer">
            <el-button size="medium" @click="groupsVisible = false">取 消</el-button>
            <el-button type="success" size="medium" @click="confirmGroup">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {RESPONCE_CODE_OK} from '@/constants.js';
import fileSize from '@/filters/file-size';

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isPicker: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            loading: false,
            photoGroups: [],
            currentGroupPhotos: [],
            currentGroupId: '',
            currentPage: 1,
            pageSize: 12,
            totalRecord: 0,
            selectedPhoto: null,
            groupsVisible: false,
            changingGroupPhoto: null,
            selectedGroupId: '',
            // 一次最多允许上传图片数
            maxCountOnceUpload: 25,
            // 上传图片最大尺寸
            maxSizeUpload: 1024 * 1024 * 1
        }
    },
    computed: {
        tabGroups() {
            return [{name: '全部', id: ''}].concat(this.photoGroups);
        },
        photosPreview() {
            return this.currentGroupPhotos.map(item => item.url).filter(Boolean);
        },
        photoGroupsMap() {
            let map = {};
            let groups = this.photoGroups;
            for(let i=0, len=groups.length; i<len; i++) {
                let group = groups[i];
                map[group.id] = group;
            }
            return map
        }
    },
    model: {
        prop: 'visible',
        event: 'visible'
    },
    watch: {
        visible: {
            immediate: true,
            handler(value, oldValue) {
                if(value === oldValue) return;
                this.$emit('visible', !!value);
                if(value) {
                    this.selectedPhoto = null;
                    this.currentGroupId = this.currentGroupId || '';
                    this.currentPage = this.currentPage || 1;
                    this.getPhotoGroups();
                    this.getGroupPhotos();
                }
            }
        }
    },
    methods: {
        resetData(res) {
            this.currentGroupId = '';
            this.currentPage = 1;
            this.getPhotoGroups();
            this.getGroupPhotos();
        },
        resetGroupPhotos(res) {
            this.currentPage = 1;
            this.getGroupPhotos();
        },
        switchGroup(group) {
            if(!group) return ;
            this.currentGroupId = group.id;
            this.currentPage = 1;
            this.getGroupPhotos();
        },
        getPhotoGroups() {
            this.$api('/imageGroup/findAll', {method: 'post'}).then(res => {
                this.photoGroups = res;
            });
        },
        getGroupPhotos(toTop) {
            this.loading = true;
            this.$api('/imageInfo/findAll', {
                method: 'post',
                data: {
                    page: this.currentPage || 1,
                    pageSize: this.pageSize,
                    groupId: this.currentGroupId
                }
            }).then(res => {
                this.loading = false;
                this.currentGroupPhotos = res.data || [];
                this.totalRecord = res.rows || 0;
                // 列表置顶
                (toTop !== false && this.$refs.photoList) && (this.$refs.photoList.scrollTop = 0);
            }).catch(err => {
                this.loading = false;
            });
        },
        getGroupNameById(id) {
            if(!id) return '';
            let {name} = this.photoGroupsMap[id] || {};
            return name || '--'
        },
        selectPhoto(photo) {
            if(this.selectedPhoto && this.selectedPhoto.id === photo.id) {
                return this.selectedPhoto = null;
            }
            this.selectedPhoto = photo;
        },
        confirmPhoto() {
            if(!this.isPicker) {
                this.visible = false;
                return;
            }
            if(!this.selectedPhoto) {
                return this.$message.warning('还没有选择图片');
            }
            this.visible = false;
            this.$emit('confirm', this.selectedPhoto);
        },
        onClosed() {
            this.$emit('cancel');
        },
        // 添加分组
        addGroup() {
            this.$prompt('请输入分组名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: value => !(/^[\s]*$/.test(value)),
                inputErrorMessage: '请输入分组名'
            }).then(({ value }) => {

                value = value.trim();
                this.$api('/imageGroup/save', {
                    method: 'post',
                    data: {
                        name: value
                    }
                }).then(res => {
                    this.$message.success('操作成功');
                    this.getPhotoGroups();
                })
            }).catch(() => { });
        },
        // 重命名分组
        renameGroup({id, name}={}) {
            if(!name || !id) return;
            this.$prompt('请修改分组名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: name,
                inputValidator: value => !(/^[\s]*$/.test(value)),
                inputErrorMessage: '请输入分组名'
            }).then(({ value }) => {
                value = value.trim();
                this.$api('/imageGroup/save', {
                    method: 'post',
                    data: {
                        id,
                        name: value
                    }
                }).then(res => {
                    this.$message.success('操作成功');
                    this.getPhotoGroups();
                })
            }).catch(() => { });
        },
        // 删分组
        removeGroup({id} = {}) {
            if(!id) return;
            this.$confirm('删除后该分类下的所有图片将被移动到全部分类。', '确认要删除该分组？', {
                type: 'warning',
                dangerouslyUseHTMLString: true,
                center: true
            }).then(res => {
                this.$api('/imageGroup/removeById', {
                    method: 'post',
                    data: {
                        ids: id
                    }
                }).then(res => {
                    this.$message.success('操作成功');
                    this.resetData();
                })
            }).catch(err => {});
        },
        // 图片重命名
        renamePhoto({id, name, groupId}={}) {
            if(!name || !id) return;
            this.$prompt('请修改图片名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: name,
                inputValidator: value => !(/^[\s]*$/.test(value)),
                inputErrorMessage: '请输入图片名'
            }).then(({ value }) => {
                value = value.trim();
                this.$api('/imageInfo/save', {
                    method: 'post',
                    data: {
                        id,
                        groupId,
                        name: value
                    }
                }).then(res => {
                    this.$message.success('操作成功');
                    this.getGroupPhotos(false);
                })
            }).catch(() => { });
        },
        // 变更分组
        rechangeGroup(photo={}) {
            if(!photo.id) return;
            this.changingGroupPhoto = photo;
            this.selectedGroupId = photo.groupId;
            this.groupsVisible = true;
        },
        // 确认选择分组
        confirmGroup() {
            if(!this.selectedGroupId) return this.$message.warning('还没有选择分组');
            let {id, name} = this.changingGroupPhoto || {};
            if(!id) return;
            this.$api('/imageInfo/save', {
                method: 'post',
                data: {
                    id,
                    name,
                    groupId: this.selectedGroupId
                }
            }).then(res => {
                this.groupsVisible = false;
                this.$message.success('操作成功');
                this.getGroupPhotos(false);
            })
        },
        // 删图片
        removePhoto({id} = {}) {
            if(!id) return;
            this.$confirm('', '确认要删除该图片？', {
                type: 'warning',
                center: true
            }).then(res => {
                this.$api('/imageInfo/removeById', {
                    method: 'post',
                    data: {
                        ids: id
                    }
                }).then(res => {
                    this.$message.success('操作成功');
                    this.getGroupPhotos(false);
                })
            }).catch(err => {});
        },
        filesChanged(file, fileList) {
            this.uploadTimer && clearTimeout(this.uploadTimer);
            this.uploadTimer = setTimeout(() => {
                if(fileList.length > this.maxCountOnceUpload) {
                    this.$refs.upload.clearFiles();
                    return this.$alert(`本次上传${fileList.length}张，每次最多只允许上传 ${this.maxCountOnceUpload} 张图片`, { type: 'warning', title: '提示'});
                }
                this.$refs.upload.submit();
                this.uploadTimer = null;
            }, 100);
        },
        beforeUpload(file) {
            // console.log('[beforeUpload]', file);
            let {name, size} = file || {};
            if(size > this.maxSizeUpload) {
                setTimeout(() => {
                    this.$message.warning(`图片【${name}】尺寸为${fileSize(size)}，已超过允许上传的最大尺寸${fileSize(this.maxSizeUpload)}!`);
                }, 100)
                return false;
            }
        },
        uploadSuccess(response, file, fileList) {
            // console.log('[uploadSuccess]', response, file, fileList);
            if(response.result === RESPONCE_CODE_OK) {
                clearTimeout(this.uploadUpdater);
                this.uploadUpdater = setTimeout(() => {
                    this.getGroupPhotos();
                    this.$refs.upload.clearFiles();
                    this.uploadUpdater = null;
                }, 500);
            } else {
                this.$alert(response.msg || '上传失败！', {type: 'error', title: '提示'});
            }
        },
        uploadFail(err, file, fileList) {
            // console.log('[uploadFail]', err, file, fileList);
            this.$alert(`程序出错！`, { type: 'error', title: '提示'});
            this.$refs.upload.clearFiles();
        }
    }
}
</script>

<style lang="less" scoped>
@import (reference) '~@/assets/style/reference';

.photos-wrapper {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    height: 600px;
    margin-top: -20px;
    margin-bottom: -20px;
    .photos-nav {
        position: relative;
        flex: 0 0 180px;
        width: 180px;
        overflow: hidden;
        .add-btn {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            display: block;
            width: 100%;
            height: 36px;
            font-size: 15px;
        }
        .nav-list {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 45px;
            padding-left: 5px;
            overflow-x: hidden;
            overflow-y: auto;
            background: #f2f3f4;
            .item {
                display: flex;
                flex-flow: row nowrap;
                height: 32px;
                line-height: 32px;
                margin: 5px 0;
                padding-left: 15px;
                border-radius: 16px 0 0 16px;
                transition: 0.2s;
                &:focus{
                    outline: none;
                }
                .title {
                    flex: 1 1 auto;
                    color: #888;
                    .ellipsis-oneline();
                }
                .handles {
                    display: none;
                    flex: 0 0 auto;
                    padding: 0 10px;
                    .icon {
                        font-size: 16px;
                    }
                }
                &:hover {
                    .title {
                        color: #222;
                    }
                    .handles {
                        display: block;
                    }
                }
                &.active {
                    background-color: #fff;
                    .title {
                        color: #222;
                    }
                }
            }
        }
    }
    .photos-container {
        position: relative;
        flex: 1 1 auto;
        display: flex;
        flex-flow: column nowrap;
        // margin-left: 10px;
        .photos-header {
            position: relative;
            flex: 0 0 40px;
            width: 100%;
            height: 40px;
            margin-bottom: 10px;
            padding: 0 20px;
            line-height: 40px;
            .selected {
                max-width: 450px;
                .ellipsis-oneline();
            }
            .handles {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 9;
                .btn {
                    font-size: 14px;
                }
            }
        }
        .photos-panel {
            position: relative;
            flex: 1 1 auto;
            overflow-x: hidden;
            overflow-y: auto;
            .photos-list {
                display: flex;
                flex-flow: row wrap;
                // justify-content: space-between;
                padding: 10px;
            }
            .photo-item {
                position: relative;
                flex: 0 0 180px;
                width: 180px;
                margin-left: 10px;
                margin-right: 10px;
                margin-bottom: 20px;
                border: 1px solid #eee;
                border-radius: 5px;
                overflow: hidden;
                transition: 0.2s;
                .pic {
                    width: 178px;
                    height: 178px;
                    cursor: pointer;
                }
                .name {
                    padding: 0 10px;
                    text-align: center;
                }
                .group {
                    position: absolute;
                    top: 150px;
                    left: 0;
                    z-index: 88;
                    height: 20px;
                    padding: 0 10px 0 8px;
                    border-radius: 0 10px 10px 0;
                    line-height: 20px;
                    background-color: fade(@color-info, 80);
                    font-style: normal;
                    font-size: 12px;
                    color: #fff;
                    &:empty {
                        display: none;
                    }
                }
                .select {
                    position: absolute;
                    top: 145px;
                    right: 5px;
                    z-index: 99;
                    width: 28px;
                    height: 28px;
                    border: 1px solid #ddd;
                    border-radius: 50%;
                    background-color: #fff;
                    line-height: 28px;
                    font-size: 20px;
                    text-align: center;
                    color: #c0c0c0;
                    cursor: pointer;
                    &.selected {
                        border-color: @color-success;
                        background-color: @color-success;
                        color: #fff;
                    }
                }
                .handles {
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    z-index: 100;
                }
                &:hover {
                    border-color: @color-info;
                    box-shadow: 2px 3px 10px fade(@color-info, 50);
                    .handles {
                        display: block;
                    }
                }
                &.active {
                    background-color: fade(@color-success, 10);
                    border-color: @color-success;
                    box-shadow: 2px 3px 10px fade(@color-success, 50);
                }
            }
        }
        .photos-empty {
            flex: 1 1 auto;
            padding: 20px;
            line-height: 200px;
            text-align: center;
            font-size: 32px;
            color: #888;
        }
        .photos-pagination {
            flex: 0 0 32px;
            height: 32px;
            margin-top: 10px;
            text-align: center;
        }
    }
}

.group-select-list {
    .item {
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }
}
</style>
