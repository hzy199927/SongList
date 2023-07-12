<template>
  <div class="recommendation">
    <!-- 每日推荐信息 -->
    <div class="recommendationInfo">
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/images/recommendMusic.png" alt="" />
      </div>
      <!-- 文案 -->
      <div class="write">
        <div class="title">每日歌曲推荐</div>
        <div class="intro">根据你的音乐口味生成，每天6:00更新</div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="operate">
      <!-- 播放全部 -->
      <div class="playAll" @click="playAll">
        <i class="iconfont">&#xe87c;</i> 播放全部
      </div>
      <!-- 收藏全部 -->
      <div class="likeAll"><i class="iconfont">&#xe604;</i> 收藏全部</div>
    </div>
    <!-- 歌曲 -->
    <div class="songs">
      <el-table
        v-if="songs"
        :data="songs"
        style="width: 100%"
        size="mini"
        empty-text="Loading . . . . . ."
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
  </div>
</template>

<script>
// 引入接口 api
import { recommendation, songUrl } from '@/api'
import { reactive, toRefs, computed } from 'vue'
// 引入 vuex 相关的 API
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 引入 plugin 中的方法
import { millisecondToMinuteArr, playSingle, playAllSongs } from '@/plugin'
export default {
  name: 'Recommendation',
  setup() {
    // 定义变量 store 进行 vuex 相关操作
    const store = useStore()

    const router = useRouter()

    // 定义计算属性 userId 用来从 localStorage 中获取当前登录账号的 id
    let userId = computed({
      get() {
        return window.localStorage.getItem('userId')
      },
      set(val) {
        return val
      },
    })

    // 如果没有登录则重定向到主页面
    if (!userId.value) {
      ElMessage({
        message: '需要先登录才能访问个人主页',
        type: 'warning',
        grouping: true,
      })
      router.push('/discover/recommend')
    }

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 歌曲数据
      songs: [],
    })

    // 定义获取每日推荐歌曲的方法
    const getRecommendation = async () => {
      let res = await recommendation()
      // 格式化歌曲信息的时间
      millisecondToMinuteArr(res.data.dailySongs, 'dt')
      // 添加 url 值
      for (let i = 0; i < res.data.dailySongs.length; i++) {
        getSongsUrlToPush(res.data.dailySongs[i])
      }
      info.songs = res.data.dailySongs
    }

    // 定义获取歌曲 url 并添加到歌曲信息中的方法（参数：指定歌曲信息）
    const getSongsUrlToPush = async (target) => {
      let res = await songUrl(target.id)
      target.url = res.data[0].url
    }

    // 定义双击播放歌曲的方法
    const playSong = (row) => {
      playSingle(row, store)
    }

    // 定义播放专辑所有歌曲的方法
    const playAll = () => {
      playAllSongs(info.songs, store)
    }

    // 获取每日推荐歌曲
    getRecommendation()

    return { playSong, playAll, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.recommendation {
  padding: 0 20px;
  .recommendationInfo {
    padding: 0 20px;
    margin: 30px 0 20px;
    display: flex;
    .logo {
      margin-right: 20px;
      img {
        width: 100px;
      }
    }
    .write {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title {
        font-size: 25px;
        font-weight: bold;
      }
      .intro {
        color: #666;
      }
    }
  }
  .operate {
    padding: 0 30px;
    display: flex;
    .playAll,
    .likeAll {
      border: 1px solid #ddd;
      padding: 8px 15px;
      border-radius: 50px;
      font-size: 14px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        background-color: #f7f7f7;
      }
    }
    .playAll {
      background-color: #ec4141;
      color: white;
      &:hover {
        background-color: rgb(228, 32, 32);
      }
    }
  }
  .songs {
    margin: 20px 0;
  }
}
</style>
