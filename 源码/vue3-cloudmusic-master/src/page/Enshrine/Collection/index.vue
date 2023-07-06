<template>
  <div class="enshrineCollection" ref="enshrineCollection">
    <!-- 数量 -->
    <div class="amount">收藏的专辑({{ collectionAmount || 0 }})</div>
    <!-- 专辑数据 -->
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
// 引入 composition API
import { reactive, toRefs } from 'vue'
// 引入接口 api
import { enshrineCollection } from '@/api'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'EnshrineCollection',
  setup() {
    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 专辑数据
      collections: [],
      // 专辑数量
      collectionAmount: 0,
      // 专辑数据当前页码（默认为：0）
      pagination: 0,
      // 专辑数据的总页数
      pages: 0,
      // 指向 dom 元素
      enshrineCollection: '',
    })

    // 定义获取收藏专辑的方法
    const getEnshrineCollection = async () => {
      let res = await enshrineCollection(info.pagination * 30)
      info.collections = res.data
      // 更新专辑数量
      info.collectionAmount = res.count
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

    // 获取收藏的专辑数据
    getEnshrineCollection()

    return { toCollectionDetails, currentChange, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.enshrineCollection {
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
}
</style>
