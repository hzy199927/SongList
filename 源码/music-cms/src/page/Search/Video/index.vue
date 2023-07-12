<template>
  <div class="video" ref="video">
    <!-- 搜索的结果数量 -->
    <div class="amount">找到 {{ videoAmount || 0 }} 个视频</div>
    <!-- 搜索到的视频 -->
    <div class="videos">
      <ul class="lists">
        <li
          class="list"
          v-for="(v, index) in videos"
          :key="index"
          @click="toVideoDetails(v.vid, v.type)"
        >
          <div class="cover">
            <el-image :src="v.coverUrl" alt="" class="video">
              <div slot="placeholder" class="image-slot">
                <img src="../../../assets/images/loading.png" />
              </div>
            </el-image>
            <!-- 播放量 -->
            <div class="playCount">
              <i class="iconfont">&#xe656;</i>
              {{ (v.playTime / 10000).toFixed(1) }}万
            </div>
            <!-- 时长 -->
            <div class="duration">{{ millisecondToMinute(v.durationms) }}</div>
          </div>
          <!-- 名称 -->
          <p class="title">{{ v.title }}</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="videoAmount"
        background
        :current-page="pagination + 1"
        layout="prev, pager, next"
        :total="pages * 10"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 引入接口 API
import { cloudsearch } from '@/api'
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
// 引入路由相关的 API
import { useRoute, useRouter } from 'vue-router'
// 引入 plugin 中的方法
import { millisecondToMinute } from '@/plugin'
export default {
  name: 'SearchVideo',
  setup() {
    // 定义变量 route 获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义计算属性 keywords 获取路由传递过来的关键字参数
    const keywords = computed({
      get() {
        return route.params.keywords
      },
      set(val) {
        return val
      },
    })

    // 定义计算属性 pagination 获取视频数据的当前页码用于监视
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 视频数据
      videos: [],
      // 视频数据当前页码（默认为：0）
      pagination: 0,
      // 视频数据的总页数
      pages: 0,
      // 视频数量
      videoAmount: 0,
      // 指向 DOM 元素
      video: '',
    })

    // 获取搜索的结果
    const getSearchResult = async () => {
      let res = await cloudsearch(
        keywords.value,
        1014,
        info.pagination * 28,
        28
      )
      // 更新视频数据
      info.videos = res.result.videos
      // 更新视频数量
      info.videoAmount = res.result.videoCount
      // 更新数据总页数
      info.pages = Math.ceil(res.result.videoCount / 28)
      // 设置页面到顶部
      if (info.video) {
        // 设置页面到顶部
        info.video.scrollTop = 0
      }
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
    }

    // 跳转到视频详细页面
    const toVideoDetails = (id, type) => {
      if (type) {
        type = 'video'
      } else {
        type = 'mv'
      }
      router.push({
        name: 'videoDetails',
        params: {
          id,
          type,
        },
      })
    }

    // 设置 监视
    watch(pagination, () => {
      // 更新歌单数据
      getSearchResult()
    })

    // 获取搜索的结果
    getSearchResult()

    return {
      currentChange,
      toVideoDetails,
      millisecondToMinute,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.amount {
  width: 1250px;
  font-size: 20px;
  font-weight: bold;
  margin: auto;
}
.videos {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
  ul.lists {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .list {
      box-sizing: border-box;
      margin-bottom: 10px;
      cursor: pointer;
      margin-right: 36px;
      &:nth-child(4n) {
        margin: 0;
      }
      .cover {
        position: relative;
        .playCount {
          position: absolute;
          top: 5px;
          right: 10px;
          color: white;
          font-size: 12px;
        }
        .duration {
          position: absolute;
          bottom: 10px;
          right: 10px;
          color: white;
          font-size: 12px;
        }
      }
      p {
        width: 285px;
        font-size: 15px;
        white-space: normal;
        text-align: left;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
