<template>
  <div class="enshrineSinger">
    <!-- 数量 -->
    <div class="amount">收藏的专辑({{ singerAmount || 0 }})</div>
    <!-- 专辑数据 -->
    <div class="singers">
      <ul class="lists">
        <li
          class="list"
          v-for="(c, index) in singers"
          :key="index"
          @click="toSingerDetails(c.id)"
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
// 引入 composition API
import { reactive, toRefs } from 'vue'
// 引入接口 api
import { enshrineSinger } from '@/api'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'EnshrineSinger',
  setup() {
    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 专辑数据
      singers: [],
      // 专辑数量
      singerAmount: 0,
      // 专辑数据当前页码（默认为：0）
      pagination: 0,
      // 专辑数据的总页数
      pages: 0,
      // 指向 dom 元素
      enshrineSinger: '',
    })

    // 定义获取收藏专辑的方法
    const getEnshrineSinger = async () => {
      let res = await enshrineSinger(info.pagination * 30)
      info.singers = res.data
      // 更新专辑数量
      info.singerAmount = res.count
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

    // 定义方法 toSingerDetails 用来跳转到专辑详细页面
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: { id },
      })
    }

    // 获取收藏的专辑数据
    getEnshrineSinger()

    return { toSingerDetails, currentChange, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.enshrineSinger {
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
}
</style>
