<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="logo">
                    <img src="../images/logo.png" alt="">
                </div>
                <div class="pageSkip">
                    <el-button :icon="ArrowLeft" circle @click="router.back()" />
                    <el-button :icon="ArrowRight" circle @click="router.forward()" />
                </div>
            </el-header>

            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-container>

                    <el-main>Main</el-main>

                    <el-footer>播放器</el-footer>

                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import {ArrowLeft,ArrowRight,Search,SwitchButton,} from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.el-container .el-header {
    width: 100%;
    background-color: #ec4141;
}

.logo {
    display: inline-block;
    margin-right: 50px;
    background-color: #ec4141;

    img {
        height: 36px;
        //图片对其方式，容易影响布局
        vertical-align: middle;
    }
}
.pageSkip {
    display: inline-block;
    box-sizing: border-box;
    padding: 4px 0;
    margin-right: 20px;
    background-color: #ec4141;
    display: flex;
    .el-button {
      width: 28px;
      height: 28px;
      background-color: #e13e3e;
      border: none;
      color: white;
      text-align: center;
    }
  }
</style>