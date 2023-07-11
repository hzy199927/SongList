<template>
  <div class="songList" ref="songList">
    <!-- 搜索的结果数量 -->
    <div class="amount">找到 {{ songListAmount || 0 }} 个歌单</div>
    <!-- 搜索到的歌手 -->
    <div class="songLists">
      <ul class="lists">
        <li
          class="list"
          v-for="(s, index) in songLists"
          :key="index"
          @click="toPlaylistDetails(s.id)"
        >
          <el-image :src="s.coverImgUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ s.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="songListAmount"
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
export default {
  name: 'SearchSongList',
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

    // 定义计算属性 pagination 获取歌单页面的页码用于监视
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 歌手数据
      songLists: [],
      // 歌手数据当前页码（默认为：0）
      pagination: 0,
      // 歌手数据的总页数
      pages: 0,
      // 歌手数量
      songListAmount: 0,
      // 指向 DOM 元素
      songList: '',
    })

    // 获取搜索的结果
    const getSearchResult = async () => {
      let res = await cloudsearch(keywords.value, 1000, info.pagination * 30)
      // 更新歌手数据
      info.songLists = res.result.playlists
      // 更新歌手数量
      info.songListAmount = res.result.playlistCount
      // 更新数据总页数
      info.pages = Math.ceil(res.result.playlistCount / 30)
      // 设置页面到顶部
      if (info.songList) {
        // 设置页面到顶部
        info.songList.scrollTop = 0
      }
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
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

    // 设置 监视
    watch(pagination, () => {
      // 更新歌单数据
      getSearchResult()
    })

    // 获取搜索的结果
    getSearchResult()

    return { toPlaylistDetails, currentChange, ...toRefs(info) }
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
.songLists {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
}
</style>
