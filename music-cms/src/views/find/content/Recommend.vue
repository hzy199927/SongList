<template>
    <div>
        <el-carousel
         :interval="4000" 
         type="card" height="225px" class="recommend-one">

            <el-carousel-item v-for="index in 6" >
                <img src="../../../img/back.jpg" alt="">
                <h3 text="2xl" justify="center">1</h3>
            </el-carousel-item>
        </el-carousel>


        <div class="personalized">
            <!-- 标题 -->
            <p class="title">
                推荐歌单
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </p>
            <!-- 内容 -->
            <ul class="lists">
                <li class="list" v-for=" index in 8" :key="index" >
                    <el-image src="../img/login.jpg" alt="">
                        <div slot="placeholder" class="image-slot">
                            <img src="../../../img/loading.png" />
                        </div>
                    </el-image>
                    <p class="title">{{ index }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>

import {reactive} from 'vue'
import { useRouter } from 'vue-router';
import {banner,personalized} from '@/api'

const router = useRouter ()
const info = reactive({
    banners : [] ,
    personalizes :[]
})
const getBanner = async () => {
    let res = await banner()
    info.banners = res.banners
}

const getPersonalizes = async () => {
    let res = await personalized()
    info.personalizes = res.result
}

getBanner()
getPersonalizes()
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.recommend-one {
    width: calc(100vw - 210px);
}
.recommend-one img{width: 100%;height: 100%;}
.personalized {
    max-width: 1250px;
    min-width: 992px;
    margin: 50px auto 0;

    &>p.title {
        font-size: 23px;
        font-weight: bold;
        color: #373737;
        box-sizing: border-box;
        padding: 0 15px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
    }
}
</style>