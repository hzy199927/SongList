<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <div class="banner">
      <!-- 当轮播图图片数据还未完全加载过来时，就会出现第一张卡片不显示的问题，使用v-if，当数据未获取到时不显示即可 -->
      <el-carousel
        v-if="banners[0]"
        :interval="4000"
        type="card"
        height="225px"
      >
        <el-carousel-item v-for="(i, index) in banners" :key="index">
          <img :src="i.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
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
        <li
          class="list"
          v-for="(i, index) in personalizes"
          :key="index"
          @click="toPlaylistDetails(i.id)"
        >
          <el-image :src="i.picUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ i.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 引入element-plus图标
import { ArrowRight } from '@element-plus/icons-vue'
// 引入接口 api
import { banner, personalized } from '@/api'
// 引入 composition API
import { reactive, toRefs } from 'vue'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'Recommend',
  setup() {
    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义对象 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 定义变量 banners 用来保存轮播图数据
      banners: [],
      // 定义变量 personalizes 用来保存推荐歌单的数据
      personalizes: [],
    })

    // 定义函数 getBanner 用来获取轮播图数据
    const getBanner = async () => {
      let res = await banner()
      info.banners = res.banners
    }

    // 定义函数 getPersonalizes 用来获取推荐歌单的数据
    const getPersonalizes = async () => {
      let res = await personalized()
      info.personalizes = res.result
    }

    // 定义函数 toPlaylistDetails 跳转到歌单详细页面
    const toPlaylistDetails = (id) => {
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

    // 调用函数 getBanner获取轮播图数据
    getBanner()

    //调用函数 getPersonalizes获取推荐歌单数据
    getPersonalizes()
    return { ArrowRight, toPlaylistDetails, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
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
</style>
