<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">网易云音乐</el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-container>
                    <el-main>Main</el-main>
                    <el-footer>Footer</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.el-container .el-header {
    width: 100%;
    
    background-color: #ec4141;
}
</style>