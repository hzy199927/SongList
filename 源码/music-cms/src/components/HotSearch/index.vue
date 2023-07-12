<template>
  <div class="hotSearch">
    <div class="title">热搜榜</div>
    <div class="songs">
      <div
        :class="{ song: true, winner: index - 2 <= 0 }"
        v-for="(s, index) in hotSearch"
        :key="index"
        @click="toSearch(s.searchWord)"
      >
        <div class="number">{{ index + 1 }}</div>
        <div class="introduce">
          <div class="searchWord">{{ s.searchWord }}</div>
          <div class="content">{{ s.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//引入compositionAPI
import { ref, computed, toRefs, reactive } from 'vue'
// 引入接口 API
import { hotSearch } from '@/api'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'HotSearch',
  setup() {
    // 定义变量 router 用来进行路由的操作
    const router = useRouter()

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 热搜
      hotSearch: '',
    })

    // 定义获取热搜榜的方法
    const getHotSearch = async () => {
      let res = await hotSearch()
      info.hotSearch = res.data
    }

    // 定义函数 toSearch 用来执行搜索的操作
    const toSearch = async (keywords) => {
      // 将当前搜索框中的关键字保存在 session 中
      window.sessionStorage.setItem('keywords', keywords)
      // 跳转页面，并传递搜索的关键词
      router.push({
        name: 'searchSingle',
        params: {
          keywords,
        },
      })
    }

    getHotSearch()

    return { toSearch, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.hotSearch {
  width: 380px;
  .title {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    padding: 0 20px;
    color: #444;
  }
  .songs {
    height: 430px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .song {
      height: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .number {
        width: 50px;
        text-align: center;
      }
      .introduce {
        .searchWord {
          width: 280px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .content {
          width: 280px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
        }
      }
    }
    .winner {
      .number {
        color: #ec4141;
      }
      .introduce {
        .searchWord {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
