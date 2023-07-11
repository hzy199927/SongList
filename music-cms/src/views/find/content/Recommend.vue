<template>
    <div class="recommed">

        <div class="banner">
            <el-carousel 
            :interval="4000" 
            type="card" 
            height="225px" >
                <el-carousel-item v-for="(i, index) in info.banners" :key="index">
                    <img :src="i.imageUrl" alt="">
                    
                </el-carousel-item>
            </el-carousel>
        </div>

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
                <li class="list" v-for="(i, index) in info.personalized" :key="index">
                    <el-image :src="i.picUrl" alt="" width="225px">
                        <div slot="placeholder" class="image-slot">
                            <img src="../../../img/loading.png" />
                            {{ i.name }}

                        </div>

                    </el-image>
                    <p class="title">{{ i.name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>

import { reactive } from 'vue'
import { useRouter } from 'vue-router';
import { banner, personalized } from './../../../api'

// const bannerse =banner()
const router = useRouter()
const info = reactive({
    banners: [],
    personalized: []
})
const getBanner = async () => {

    let tmp = await banner()

    info.banners = tmp.data.banners

}

const getPersonalized = async () => {
    let res = await personalized()
    
    info.personalized = res.data.result
   
}

getBanner()
getPersonalized()
</script>

<style lang="scss" scoped>
.recommend {
  cursor: default;
  .banner {
    max-width: 1000px;
    min-width: 800px;
    margin: auto;
    .el-carousel__item {
      border-radius: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    :deep(.el-carousel__indicators) {
      .el-carousel__button {
        width: 40px;
        height: 3px;
      }
    }
  }
  .personalized {
    max-width: 1250px;
    min-width: 992px;
    margin: 50px auto 0;
    & > p.title {
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
}
.image-slot{width: 250px;height: 250px;}

</style>