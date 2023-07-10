<template>
    <el-container>

        <el-header>

            <div class="music-header-all">
                <div class="music-header-img">
                    <img src="./img/logo.png" alt="">
                </div>
                <div class="music-header-two">
                    <el-button icon="ArrowLeft" circle />
                    <el-button icon="ArrowRight" circle />
                </div>
                <div class="music-header-int">
                    <el-popover v-model="isSearchPopShow" popper-class="searchPop" trigger="click" hide-after="50">
                        <template #reference>
                            <el-input placeholder="请输入内容" :prefix-icon="Search" v-model.trim="keywords"
                                @keyup.enter.native="toSearch" @input="keywordsChange"></el-input>
                        </template>

                    </el-popover>
                </div>

                <div class="music-header-login">
                    <div v-if="!loginState">
                        <img @click="loginDialogIsVisible = true" src="./img/login.jpg" alt="" />
                        <span>点击头像登录</span>
                    </div>
                </div>
            </div>
        </el-header>


        <el-container>
            <div class="music-nav-all">
                <el-aside width="200px">
                    <el-row class="tac">
                        <el-col :span="24">
                            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen"
                                @close="handleClose">

                                <el-menu-item index="/index">
                                    <el-icon>
                                        <Service />
                                    </el-icon>
                                    发现音乐
                                </el-menu-item>
                                <el-menu-item index="/video">
                                    <el-icon>
                                        <Platform />
                                    </el-icon>
                                    视频
                                </el-menu-item>
                                <el-menu-item index="/like">
                                    <el-icon>
                                        <StarFilled />
                                    </el-icon>
                                    收藏
                                </el-menu-item>
                                <el-menu-item index="/find">
                                    <el-icon>
                                        <Pointer />
                                    </el-icon>
                                    每日推荐
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                    </el-row>
                </el-aside>
            </div>

           <el-main>
            <div class="nav-music">
                    <el-menu :default-active="defaultActive"
                     class="el-menu-demo" 
                    
                    :default-openeds="['/find',]" router
                    >
                            <el-menu-item index="/find/recommend">个性推荐</el-menu-item>
                            <el-menu-item index="/find/list">歌单</el-menu-item>
                            <el-menu-item index="/find/thecharts">排行榜</el-menu-item>
                            <el-menu-item index="/find/singer">歌手</el-menu-item>
                           
                       
                    </el-menu>
                </div>
                <RouterView />
           </el-main>
        </el-container>
        <el-footer>
            <div class="music-footer-all">

                <el-row :gutter="20">
                    <el-col :span="4" class="music-log-all">
                        <div class="grid-content ep-bg-purple" />
                        <div class="music-footer-log">
                            <img src="./img/login.jpg" alt="">
                        </div>
                        <div class="music-footer-text">暂无歌曲</div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content ep-bg-purple" />

                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content ep-bg-purple" />
                    </el-col>
                </el-row>
            </div>
        </el-footer>
    </el-container>
</template>

<script setup>


</script>

<style lang="scss" scoped>
.el-header {
    padding: 0;
    width: 100vw;
}

.music-header-all {
    background-color: #ec4141;
    width: 100vw;
    display: flex;
    margin: auto;
    padding: 0;
}


.music-header-img {
    width: 150px;
    height: 36px;
    padding-top: 15px;
}

.music-header-img img {
    width: 150px;
    height: 30px;
}

.music-header-two {
    height: 60px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 20px;
}

.el-button {
    width: 28px;
    height: 28px;
    background-color: #e13e3e;
    border: none;
    color: white;
    text-align: center;
}

.music-header-int {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    :deep(.el-input) {
        height: 28px;

        .el-input__wrapper {
            border-radius: 50px;
            background-color: #e13e3e;
            box-shadow: none;
        }
    }
}

.music-header-login {
    width: 147.5px;
    box-sizing: border-box;
    color: white;
    font-family: '等线';
    font-size: 15px;
    position: absolute;
    right: 20px;
    margin-right: 30px;
    background-color: #ec4141;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &>div {
        display: flex;
        align-items: center;

        img {
            width: 37.5px;
            border-radius: 50%;
            vertical-align: middle;
            margin: 0 10px;
            cursor: pointer;
        }
    }
}

.music-nav-all {
    height: calc(100vh - 120px);
    border-right: 1px solid #ccc;
}

.el-footer {
    padding: 0;
}

.music-footer-all {
    border-top: 1px solid #ccc;
    padding: 0 20px;

    width: calc(100vw - 50px);
}

.music-footer-log {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 60px;
}

.music-footer-log img {
    width: 45px;
    height: 45px;
    border-radius: 5px;
}

.music-footer-text {
    height: 60px;
    margin-left: 10px;
    line-height: 60px;
}

.music-log-all {
    display: flex;
}

.music-footer-top {
    display: flex;
}


.el-menu-demo {
    height: 60px;
    width: calc(100vw - 300px);
    display: flex;
}
.nav-music{
    min-width: calc(100vw - 200px);
}
.el-nav{
width:  calc(100vw - 300px);
}
</style>


