<template>
  <div class="singer" ref="singer">
    <!-- 搜索的结果数量 -->
    <div class="amount">找到 {{ singerAmount || 0 }} 位歌手</div>
    <!-- 搜索到的歌手 -->
    <div class="singers">
      <ul class="lists">
        <li
          class="list"
          v-for="(s, index) in singers"
          :key="index"
          @click="toSingerDetails(s.id)"
        >
          <el-image :src="s.picUrl" alt="">
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
        v-show="singerAmount"
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
  name: 'SearchSinger',
  setup() {
    // 定义变量 route 用来获取路由信息
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

    // 定义计算属性 pagination 获取专辑页面的页码用于监视
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 歌手数据
      singers: [],
      // 歌手数据当前页码（默认为：0）
      pagination: 0,
      // 歌手数据的总页数
      pages: 0,
      // 歌手数量
      singerAmount: 0,
      // 指向 DOM 元素
      singer: '',
    })

    // 获取搜索的结果
    const getSearchResult = async () => {
      let res = await cloudsearch(keywords.value, 100, info.pagination * 30)
      // 更新歌手数据
      info.singers = res.result.artists
      // 更新歌手数量
      info.singerAmount = res.result.artistCount
      // 更新数据总页数
      info.pages = Math.ceil(res.result.artistCount / 30)
      // 设置页面到顶部
      if (info.singer) {
        // 设置页面到顶部
        info.singer.scrollTop = 0
      }
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
    }

    // 定义前往歌手详细页面的方法
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: { id },
      })
    }

    // 设置 监视
    watch(pagination, () => {
      // 更新歌单数据
      getSearchResult()
    })

    // 获取搜索的结果
    getSearchResult()

    return { ...toRefs(info), currentChange, toSingerDetails }
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
.singers {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
}
</style>
