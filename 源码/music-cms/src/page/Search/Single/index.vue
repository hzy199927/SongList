<template>
  <div class="single" ref="single">
    <!-- 搜索到的单曲数量 -->
    <div class="songsAmount">找到 {{ songsAmount }} 首单曲</div>
    <!-- 搜索的最佳匹配 -->
    <div class="searchMultimatch" v-if="searchMultimatch">
      <p class="title">最佳匹配</p>
      <div class="result" @click="toSingerDetails(searchMultimatch.id)">
        <el-image :src="searchMultimatch.picUrl" alt="" class="logo">
          <div slot="placeholder" class="image-slot">
            <img src="../../../assets/images/loading.png" />
          </div>
        </el-image>
        <p>{{ searchMultimatch.occupation }}：{{ searchMultimatch.name }}</p>
        <el-icon class="right">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <!-- 歌曲信息 -->
    <div class="songs">
      <el-table
        :data="searchResult"
        style="width: 100%"
        size="mini"
        empty="Loading . . . . . ."
        @row-dblclick="playSong"
      >
        <el-table-column type="index" align="left" width="50">
        </el-table-column>
        <el-table-column width="80">
          <i class="iconfont">&#xe668;</i>
        </el-table-column>
        <el-table-column
          prop="name"
          label="音乐标题"
          min-width="200"
          align="left"
        >
        </el-table-column>
        <el-table-column
          prop="ar[0].name"
          label="歌手"
          min-width="100"
          align="left"
        >
          <template #default="scope">
            <span
              class="couldSkip"
              @click="toSingerDetails(scope.row.ar[0].id)"
            >
              {{ scope.row.ar[0].name }}
            </span>
            <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">
              /
              <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                a.name
              }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="al.name"
          label="专辑"
          min-width="170"
          align="left"
        >
          <template #default="scope">
            <span
              class="couldSkip"
              @click="toCollectionDetails(scope.row.al.id)"
              >{{ scope.row.al.name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="minuteDt"
          label="时长"
          min-width="60"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="songsAmount"
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
// 引入element-plus图标
import { ArrowRight } from '@element-plus/icons-vue'
// 引入 API 接口
import { cloudsearch, songUrl, multimatch } from '@/api'
// 引入 composition API
import { reactive, toRefs, watch, computed } from 'vue'
// 引入路由相关的 API
import { useRoute, useRouter } from 'vue-router'
// 引入 vuex 相关 API
import { useStore } from 'vuex'
// 引入 plugin 中的函数
import { millisecondToMinuteArr, playSingle } from '@/plugin'
export default {
  name: 'SearchSingle',
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 store 进行 vuex相关操作
    const store = useStore()

    // 定义计算属性 keywords 获取路由传递过来的关键字参数
    const keywords = computed({
      get() {
        return route.params.keywords
      },
    })

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 歌曲当前页码（默认为：0）
      pagination: 0,
      // 歌曲的总页数
      pages: 0,
      // 搜索的结果
      searchResult: [],
      // 搜索的最佳匹配
      searchMultimatch: {},
      // 歌曲的数量
      songsAmount: 0,
      // 歌曲的 URL
      url: '',
      // 指向 DOM 元素
      single: '',
    })

    // 定义计算属性 pagination 用来保存歌曲的当前页码用于监视
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义获取搜索结果的方法
    const getSearchResult = async () => {
      let res = await cloudsearch(keywords.value, 1, info.pagination * 30)
      // 更新歌曲数量
      info.songsAmount = res.result.songCount
      // 更新总页数
      info.pages = Math.ceil(res.result.songCount / 30)
      // 格式化歌曲信息的时间
      millisecondToMinuteArr(res.result.songs, 'dt')

      for (let i = 0; i < res.result.songs.length; i++) {
        getSongsUrlToPush(res.result.songs[i])
      }

      // 更新歌曲数据
      info.searchResult = res.result.songs
      if (info.single) {
        // 设置页面到顶部
        info.single.scrollTop = 0
      }
    }

    // 定义获取最佳匹配的方法
    const getSearchMultimatch = async () => {
      let res = await multimatch(keywords.value)
      // 如果能够获取到最佳匹配的数据再进行赋值
      if (res.result.artist) {
        info.searchMultimatch = res.result.artist[0]
      } else {
        info.searchMultimatch = false
      }
    }

    // 定义获取歌曲 url 并添加到歌曲信息中的方法（参数：指定歌曲信息）
    const getSongsUrlToPush = async (target) => {
      let res = await songUrl(target.id)
      target.url = res.data[0].url
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
    }

    // 定义跳转到歌手详细页面的方法
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: { id },
      })
    }

    // 定义跳转到专辑详细页面的方法
    const toCollectionDetails = (id) => {
      router.push({
        name: 'collectionDetails',
        params: { id },
      })
    }

    // 定义播放歌曲的方法
    const playSong = (row) => {
      playSingle(row, store)
    }

    // 设置 监视
    watch(pagination, () => {
      // 更新歌单数据
      getSearchResult()
    })

    watch(keywords, () => {
      // 获取歌曲最佳匹配
      getSearchMultimatch()

      // 获取歌曲信息
      getSearchResult()
    })

    // 获取歌曲最佳匹配
    getSearchMultimatch()

    // 获取搜索的结果
    getSearchResult()

    return {
      ArrowRight,
      currentChange,
      toSingerDetails,
      toCollectionDetails,
      playSong,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.single {
  padding: 0 20px;
  .songsAmount {
    font-size: 20px;
    font-weight: bold;
  }
  .searchMultimatch {
    margin: 10px 0;
    .title {
      font-size: 15px;
    }
    .result {
      display: flex;
      width: 337.5px;
      height: 80px;
      background-color: rgb(243, 243, 243);
      margin: 10px 0;
      border-radius: 5px;
      align-items: center;
      cursor: pointer;
      box-sizing: border-box;
      padding-right: 30px;
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .right {
        margin-left: auto;
      }
    }
  }
  .songs {
    padding: 0 20px;
    margin: 20px 0;
  }
}
</style>
