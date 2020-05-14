<style lang="less">
@import (reference) '~@/assets/style/reference';
@import '~github-markdown-css/github-markdown.css';

.xpage-document {
    width: 1000px;
    max-width: 100%;
    margin: 0 auto;
    padding: 10px 30px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-size: 14px;
}
</style>

<template>
    <div class="xpage-document markdown-body">
        <doc-use></doc-use>
    </div>
</template>

<script>
import DocUse from '@@/docs/use.md';

export default {
    components: {DocUse}
}
</script>
