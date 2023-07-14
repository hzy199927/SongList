<template>
    <el-container>
        <el-header>
            <div class="music-header-all">
                <div class="music-header-img">
                    <img src="../img/logo.png" alt="">
                </div>
                <div class="music-header-two">
                    <el-button icon="ArrowLeft" circle @click="router.back()" />
                    <el-button icon="ArrowRight" circle @click="router.forward()" />
                </div>
                <div class="music-header-int">
                    <el-popover v-model="info.isSearchPopShow" popper-class="searchPop" trigger="click" hide-after="50">
                        <template #reference>
                            <el-input placeholder="请输入内容" :prefix-icon="Search" v-model.trim="keywords"
                                @keyup.enter.native="toSearch" @input="keywordsChange"></el-input>
                        </template>

                    </el-popover>
                </div>

                <div class="music-header-login">
                    <div v-if="!info.loginState">
                        <img @click="loginDialogIsVisible = true" src="../img/login.jpg" alt="" />
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
                                @close="handleClose" :default-openeds="['/index',]" router>

                                <el-menu-item index="/">
                                    <el-icon>
                                        <Service />
                                    </el-icon>
                                    发现音乐
                                </el-menu-item>
                                <el-menu-item index="/index/video">
                                    <el-icon>
                                        <Platform />
                                    </el-icon>
                                    每日推荐
                                </el-menu-item>
                                <el-menu-item index="/index/like">
                                    <el-icon>
                                        <StarFilled />
                                    </el-icon>
                                    收藏
                                </el-menu-item>

                            </el-menu>
                        </el-col>
                    </el-row>
                </el-aside>
            </div>

            <el-main>

                <RouterView />
            </el-main>
        </el-container>
        <el-footer>
            <div class="music-footer-all">

                <el-row :gutter="20">
                    <el-col :span="4" class="music-log-all">
                        <div class="grid-content ep-bg-purple" />
                        <div class="music-footer-log">
                            <img src="../img/login.jpg" alt="">
                        </div>
                        <div class="music-footer-text">暂无歌曲</div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content ep-bg-purple" />

                        <div class="footerBar_center">
                            <div class="control">
                                <div class="playType" @click="changeCirculationType">
                                    <i v-if="!circulationType" class="iconfont">&#xe69a;</i>
                                    <i v-if="circulationType === 1" class="iconfont">&#xe603;</i>
                                    <i v-if="circulationType === 2" class="iconfont">&#xe66d;</i>
                                </div>
                                <!-- 切换到上一首 -->
                                <div class="previous" @click="prev">
                                    <i class="iconfont">&#xe76e;</i>
                                </div>
                                <!-- 播放或者暂停 -->
                                <div class="isPlay" @click="changePlayState(!playState)">
                                    <i class="iconfont" v-show="!playState">&#xe62b;</i>
                                    <i class="iconfont" v-show="playState">&#xe87a;</i>
                                </div>
                                <!-- 切换到下一首 -->
                                <div class="next" @click="next">
                                    <i class="iconfont">&#xe76d;</i>
                                </div>
                                <!-- 我喜欢 -->
                                <div class="like">
                                    <i class="iconfont">&#xe8ab;</i>
                                </div>
                            </div>
                            <!-- 进度条 -->
                            <div class="schedule">
                                <div class="currentTime">{{ currentTime }}</div>
                                <el-slider v-model="currentDuration" :max="allDuration" @change="changeMusicDuration"
                                    @click="clickSongSlider(currentDuration)" :show-tooltip="false" />
                                <div class="endTime">{{ endTime }}</div>
                            </div>
                        </div>


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

import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
let timer

const router = useRouter()
const info = reactive({
    music : '' ,
    isSearchPopShow: false,
    circulationType: 0,
    currentTime:'00:00',
})
const keywords = ref('')

const toSearch = async () => {
    window.sessionStorage.setItem('keywords', keywords.value)

}
const keywordsChange = () => {
    clearTimeout(timer)
    if (keywords.value !== '') {
        timer = setTimeout(() => {
            getSearchSuggest(keywords.value)
        }, 100)
    } else {
        info.searchSuggestList = {}
        return
    }
}

const changeCirculationType = () => {
    info.circulationType = info.circulationType < 2 ? ++info.circulationType : 0
}


const changePlayState = () => {
    if ( songUrl.value) {
        store.commit ('changeSongPlayState' , val)
    }else {
        ElMessage({
            message:'暂无可播放的歌曲',
            type:'warning',
            grouping: true,
        })
    }
}

</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    user-select: none;
}

li {
    list-style: none;
}

img {
    vertical-align: top;
    border: none;
}

a {
    color: #000000;
    text-decoration: none;
}

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

.nav-music {
    min-width: calc(100vw - 200px);
}

.el-nav {
    width: calc(100vw - 300px);
}

.el-main {
    height: calc(100vh - 120px);
}

.footerBar_center {
    height: 100%;

    &>.control {
        display: flex;
        justify-content: space-between;
        padding: 0 120px;
        margin: 5px 0 0 0;
        box-sizing: border-box;

        i {
            line-height: 30px;
            cursor: pointer;
        }

        .playType {
            i {
                font-size: 15px;
            }
        }

        .previous,
        .next {
            i {
                font-size: 25px;
            }
        }

        .isPlay {
            i {
                font-size: 30px;
            }
        }

        .like {
            i {
                font-size: 20px;
            }
        }
    }

    &>.schedule {
        display: flex;
        align-items: center;

        .el-slider {
            width: 380px;
        }

        .currentTime,
        .endTime {
            font-size: 13px;
            margin: 0 10px;
            color: #888;
        }
    }
}
</style>


