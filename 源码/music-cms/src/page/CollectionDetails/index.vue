<template>
  <div class="collectionDetails">
    <!-- 专辑介绍 -->
    <div class="collectionIntroduce">
      <!-- 封面 -->
      <div class="cover">
        <img
          v-if="collectionDetails.picUrl"
          :src="collectionDetails.picUrl"
          alt=""
        />
        <img
          v-if="!collectionDetails.picUrl"
          src="../../assets/images/loading.png"
          alt=""
        />
      </div>
      <!-- 详细内容 -->
      <div class="details" v-if="collectionDetails">
        <!-- 标题详细 -->
        <div class="titleDetails">
          <!-- 标签 -->
          <div class="tag">专辑</div>
          <!-- 标题 -->
          <div class="title">{{ collectionDetails.name }}</div>
        </div>
        <!-- 操作 -->
        <div class="operate">
          <!-- 播放全部 -->
          <div class="playAll" @click="playAll">
            <i class="iconfont">&#xe87c;</i> 播放全部
          </div>
          <!-- 收藏 -->
          <div :class="{ like: true, subscribed }" @click="toSubCollection">
            <i v-if="!subscribed" class="iconfont">&#xe604;</i>
            <i v-if="subscribed" class="iconfont">&#xe612;</i>
            {{ subscribed ? '已收藏' : '收藏' }}
          </div>
          <!-- 分享 -->
          <div class="share"><i class="iconfont">&#xe60c;</i> 分享</div>
        </div>
        <!-- 其他介绍 -->
        <div class="elseIntro">
          <!-- 歌手 -->
          <div class="singer" v-if="collectionDetails.artists">
            歌手：<span
              v-for="(a, index) in collectionDetails.artists"
              :key="index"
              @click="toSingerDetails(a.id)"
              >{{ a.name }}</span
            >
          </div>
          <!-- 时间 -->
          <div class="time">
            时间：{{ timestampToDate(collectionDetails.publishTime) }}
          </div>
        </div>
      </div>
      <!-- 简介加载中 -->
      <p v-if="!collectionDetails">加载中...</p>
    </div>
    <!-- 专辑内容 -->
    <div class="collectionContent">
      <!-- 标签栏分类展示 -->
      <el-tabs v-model="selectTag" @tab-click="handleClick">
        <el-tab-pane label="歌曲列表" name="songList">
          <el-table
            v-if="collectionSongs"
            :data="collectionSongs"
            style="width: 100%"
            size="mini"
            empty-text="Loading . . . . . ."
            @row-dblclick="playSong"
          >
            <!-- 双击播放：@row-dblclick="play" -->
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
            </el-table-column>
            <el-table-column
              prop="minuteDt"
              label="时长"
              min-width="60"
              align="center"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="评论" name="comment">
          <Comment type="collection" className="collectionDetails"></Comment>
        </el-tab-pane>
        <el-tab-pane label="专辑详细" name="detailsIntroduce">
          <div class="detailsIntroduce">
            {{ collectionDetails.description }}
          </div></el-tab-pane
        >
      </el-tabs>
    </div>
    <!-- 当没有数据时展示 -->
    <div class="noData" v-if="!collectionDetails">暂无数据</div>
    <!-- 回到顶部 -->
    <el-backtop target=".collectionDetails" :bottom="120"></el-backtop>
  </div>
</template>

<script>
// 引入接口 API
import {
  collectionDetails,
  songUrl,
  getSubCollection,
  subCollection,
} from '@/api'
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
// 引入路由相关的 API
import { useRouter, useRoute } from 'vue-router'
// 引入 vuex 相关的 API
import { useStore } from 'vuex'
// 引入 plugin 中的方法
import {
  millisecondToMinuteArr,
  timestampToDate,
  playSingle,
  playAllSongs,
} from '@/plugin'
import Comment from '@/components/Comment'
export default {
  name: 'CollectionDetails',
  components: { Comment },
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 store 进行 vuex 相关操作
    const store = useStore()

    // 定义计算属性 id 用来保存路由传递过来的 id 参数
    const id = computed({
      get() {
        return route.params.id
      },
      set(val) {
        return val
      },
    })

    // 定义变量 info 用来保存当前组件的响应式数据
    const info = reactive({
      // 专辑详细
      collectionDetails: {},
      // 专辑中的歌曲
      collectionSongs: [],
      // 专辑评论
      collectionComments: {},
      // 选中的标签（默认为：songList，歌曲列表页）
      selectTag: 'songList',
      // 是否收藏
      subscribed: false,
    })

    // 定义获取专辑详细信息的方法
    const getCollectionDetails = async () => {
      let res = await collectionDetails(id.value)
      // 更新专辑详细信息
      info.collectionDetails = res.album
      // 格式化歌曲信息的时间
      millisecondToMinuteArr(res.songs, 'dt')
      // 添加 url 值
      for (let i = 0; i < res.songs.length; i++) {
        getSongsUrlToPush(res.songs[i])
      }
      // 更新专辑中的歌曲
      info.collectionSongs = res.songs
    }

    // 定义获取歌曲 url 并添加到歌曲信息中的方法（参数：指定歌曲信息）
    const getSongsUrlToPush = async (target) => {
      let res = await songUrl(target.id)
      target.url = res.data[0].url
    }

    // 定义获取收藏专辑的方法
    const getSubscribed = async (hint) => {
      let res = await getSubCollection()
      // 收藏的专辑 id
      let subIds = []

      res.data.forEach((el) => {
        subIds.push(el.id)
      })

      if (subIds.indexOf(id.value * 1) !== -1) {
        info.subscribed = true
        if (hint) {
          ElMessage({
            message: '收藏成功',
            type: 'success',
            grouping: true,
          })
        }
      } else {
        info.subscribed = false
        if (hint) {
          ElMessage({
            message: '已取消收藏',
            type: 'success',
            grouping: true,
          })
        }
      }
    }

    // 定义收藏/取消收藏专辑的方法
    const toSubCollection = async () => {
      let t = info.subscribed ? 2 : 1
      let res = await subCollection(id.value, t)
      if (res.code === 200) {
        getSubscribed('hint')
      }
    }

    // 定义标签栏切换的方法
    const handleClick = () => {}

    // 定义双击播放歌曲的方法
    const playSong = (row) => {
      playSingle(row, store)
    }

    // 定义播放专辑所有歌曲的方法
    const playAll = () => {
      playAllSongs(info.collectionSongs, store)
    }

    // 定义跳转到用户详细页面的方法
    const toUserDetails = (id) => {
      router.push({
        name: 'userDetails',
        params: {
          id,
        },
      })
    }

    // 定义跳转到歌手详细页面的方法
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: {
          id,
        },
      })
    }

    // 设置监视
    watch(
      id,
      () => {
        // 当有 id 值再获取数据且路由路径就是当前组件
        if (id.value && route.name === 'collectionDetails') {
          // 获取专辑详细信息
          getCollectionDetails()
          // 获取收藏的专辑
          getSubscribed()
        }
      },
      { immediate: true }
    )

    return {
      handleClick,
      timestampToDate,
      toUserDetails,
      toSingerDetails,
      playSong,
      playAll,
      toSubCollection,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.collectionDetails {
  width: 100%;
  height: calc(100vh - 120px);
  overflow: auto;
  padding: 0 20px;
  box-sizing: border-box;
  cursor: default;
  .collectionIntroduce {
    padding: 32px 18px;
    display: flex;
    .cover {
      margin-right: 20px;
      img {
        width: 187px;
        height: 187px;
        border-radius: 10px;
      }
    }
    .details {
      width: calc(100% - 207px);
      display: flex;
      flex-direction: column;
      color: #666;
      .titleDetails {
        display: flex;
        flex-direction: row;
        margin: 0 0 5px;
        .tag {
          height: 18px;
          color: #ec4141;
          font-size: 13px;
          border: 1px solid #ec4141;
          padding: 0 3px;
          border-radius: 5px;
          margin: 7px 8px 0;
        }
        .title {
          font-size: 25px;
          font-weight: bold;
          color: #000;
        }
      }
      .operate {
        display: flex;
        margin: 5px 0;
        .playAll,
        .like,
        .share {
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
        .subscribed {
          i {
            color: #ec4141;
          }
          color: #ec4141;
          border-color: #ec4141;
        }
      }
      .elseIntro {
        margin-left: 30px;
        margin-top: 5px;
        font-size: 14px;
        .singer {
          margin: 5px 0;
          cursor: pointer;
          span {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .collectionContent {
    margin: 20px 0;
    padding: 0 18px;
    box-sizing: border-box;
    :deep(.el-tabs) {
      width: 100%;
      .el-tabs__nav {
        background-color: #fff;
        .el-tabs__active-bar {
          height: 2px;
          background-color: #ec4141;
        }
        .is-active {
          color: black;
          font-size: 16px !important;
          font-weight: bold;
        }
        .el-tabs__item {
          font-size: 14px;
          &:hover {
            color: black;
          }
        }
      }
      .el-tabs__nav-wrap {
        &::after {
          height: 0;
        }
      }
      .detailsIntroduce {
        font-size: 15px;
        color: #373737;
        line-height: 30px;
        letter-spacing: 0.7px;
        text-indent: 2em;
        margin-bottom: 20px;
      }
      .pagination {
        display: flex;
        justify-content: center;
      }
    }
  }
  .noData {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 22px;
  }
}
</style>
