<template>
  <div class="collection" ref="collection">
    <!-- 搜索的结果数量 -->
    <div class="amount">找到 {{ collectionAmount || 0 }} 个专辑</div>
    <!-- 搜索到的专辑 -->
    <div class="collections">
      <ul class="lists">
        <li
          class="list"
          v-for="(c, index) in collections"
          :key="index"
          @click="toCollectionDetails(c.id)"
        >
          <el-image :src="c.picUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ c.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="collectionAmount"
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
  name: 'SearchCollection',
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义计算属性 pagination 获取专辑页面的页码用于监视
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义计算属性 keywords 获取路由传递过来的关键字参数
    const keywords = computed({
      get() {
        return route.params.keywords
      },
      set(val) {
        return val
      },
    })

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 专辑数据
      collections: [],
      // 专辑数据当前页码（默认为：0）
      pagination: 0,
      // 专辑数据的总页数
      pages: 0,
      // 专辑数量
      collectionAmount: 0,
      // 指向 DOM 元素
      collection: '',
    })

    // 获取搜索的结果
    const getSearchResult = async () => {
      let res = await cloudsearch(keywords.value, 10, info.pagination * 30)
      // 更新专辑数据
      info.collections = res.result.albums
      // 更新专辑数量
      info.collectionAmount = res.result.albumCount
      // 更新数据总页数
      info.pages = Math.ceil(res.result.albumCount / 30)
      // 设置页面到顶部
      if (info.collection) {
        // 设置页面到顶部
        info.collection.scrollTop = 0
      }
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
    }

    // 定义方法 toCollectionDetails 用来跳转到专辑详细页面
    const toCollectionDetails = (id) => {
      router.push({
        name: 'collectionDetails',
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

    return { toCollectionDetails, currentChange, ...toRefs(info) }
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
.collections {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
}
</style>
