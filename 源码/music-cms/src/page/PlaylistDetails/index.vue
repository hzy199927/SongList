<template>
  <div class="playlistDetails">
    <!-- 歌单介绍 -->
    <div class="playlistIntroduce">
      <!-- 封面 -->
      <div class="cover">
        <img
          v-if="playlistDetails.coverImgUrl"
          :src="playlistDetails.coverImgUrl"
          alt=""
        />
        <img
          v-if="!playlistDetails.coverImgUrl"
          src="../../assets/images/loading.png"
          alt=""
        />
      </div>
      <!-- 详细内容 -->
      <div class="details" v-if="playlistDetails">
        <!-- 标题详细 -->
        <div class="titleDetails">
          <!-- 标签 -->
          <div class="tag">歌单</div>
          <!-- 标题 -->
          <div class="title">{{ playlistDetails.name }}</div>
        </div>
        <!-- 作者详细 -->
        <div class="authorDetails" v-if="playlistDetails.creator">
          <!-- 头像 -->
          <div class="headPhoto">
            <img :src="playlistDetails.creator.avatarUrl" alt="" />
          </div>
          <!-- 名称 -->
          <div
            class="name"
            @click="toUserDetails(playlistDetails.creator.userId)"
          >
            {{ playlistDetails.creator.nickname }}
          </div>
          <!-- 创建日期 -->
          <div class="createDate">
            {{ timestampToDate(playlistDetails.createTime) }}创建
          </div>
        </div>
        <!-- 操作 -->
        <div class="operate">
          <!-- 播放全部 -->
          <div class="playAll" @click="playAll">
            <i class="iconfont">&#xe87c;</i> 播放全部
          </div>
          <!-- 收藏 -->
          <div
            v-if="!created"
            :class="{ like: true, subscribed }"
            @click="toSubPlaylist"
          >
            <i v-if="!subscribed" class="iconfont">&#xe604;</i>
            <i v-if="subscribed" class="iconfont">&#xe612;</i>
            {{ subscribed ? '已收藏' : '收藏' }}
          </div>
          <!-- 分享 -->
          <div class="share"><i class="iconfont">&#xe60c;</i> 分享</div>
        </div>
        <!-- 其他介绍 -->
        <div class="elseIntro">
          <!-- 歌单类别标签 -->
          <div class="playlistTypeTag" v-if="playlistDetails.tags">
            标签：
            <span v-for="(t, index) in playlistDetails.tags" :key="index">
              {{ t }}
            </span>
            <span v-show="!playlistDetails.tags.length">暂无标签</span>
          </div>
          <!-- 歌曲数量、播放量 -->
          <div class="count">
            <!-- 歌曲数量 -->
            <div class="songsCount">歌曲：{{ playlistDetails.trackCount }}</div>
            <!-- 歌曲播放量 -->
            <div class="playCount">
              播放：{{ (playlistDetails.playCount / 10000).toFixed(1)
              }}{{ playlistDetails.playCount ? '万' : '' }}
            </div>
          </div>
          <!-- 歌单简介 -->
          <div class="playlistIntro">
            简介：{{ playlistDetails.description || '暂无简介' }}
          </div>
        </div>
      </div>
    </div>
    <!-- 歌单内容 -->
    <div class="playlistContent">
      <!-- 标签栏分类展示 -->
      <el-tabs v-model="selectTag" @tab-click="handleClick"
        ><!--  -->
        <el-tab-pane label="歌曲列表" name="songList">
          <el-table
            v-if="songs.length"
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

          <p v-show="!loginState" class="seeMore">登陆后查看更多音乐</p>
        </el-tab-pane>
        <el-tab-pane label="评论" name="comment">
          <!-- 评论 -->
          <Comment type="playlist" className="playlistDetails"></Comment>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="subscribers">
          <Subscribers :parentNode="playlistDetail"></Subscribers>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 回到顶部 -->
    <el-backtop target=".playlistDetails" :bottom="120"></el-backtop>
  </div>
</template>

<script>
// 引入接口 API
import {
  playlistDetails,
  songUrl,
  songDetail,
  userSongList,
  subPlaylist,
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
// 引入组件
import Comment from '@/components/Comment'
import Subscribers from '@/components/Subscribers'
export default {
  name: 'PlaylistDetails',
  components: { Comment, Subscribers },
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
    })

    // 定义计算属性用来获取用户 id
    let userId = computed({
      get() {
        return window.localStorage.getItem('userId')
      },
    })

    // 定义计算属性 loginState 用来获取 store 中的登录状态
    const loginState = computed({
      get() {
        return store.state.loginState
      },
    })

    // 定义变量 info 用来保存当前组件的响应式数据
    const info = reactive({
      // 歌单详细
      playlistDetails: {},
      // 歌单歌曲
      songs: [],
      // 歌单评论
      playlistComments: {},
      // 选中的标签（默认为：songList，歌曲列表页）
      selectTag: 'songList',
      // 当前歌单是否由用户创建
      created: false,
      // 当前歌单是否被用户收藏
      subscribed: false,
    })

    // 定义获取歌单详细信息的方法
    const getPlaylistDetails = async () => {
      let res = await playlistDetails(id.value)
      let songs
      let songsId = []
      // 未登录最多只展示二十首歌曲
      if (!loginState.value) {
        songs = res.playlist.tracks
      } else {
        // 登录了展示全部歌曲

        // 获取所有歌曲的 id
        let infoArr = res.playlist.trackIds
        // 取出 id 值保存在数组中
        for (let i = 0; i < infoArr.length; i++) {
          songsId.push(infoArr[i].id)
        }
        // 获取歌曲
        let songsData = await songDetail(songsId)
        songs = songsData.songs
      }

      // 格式化歌曲信息的时间
      millisecondToMinuteArr(songs, 'dt')

      // 添加 url 值
      for (let i = 0; i < songs.length; i++) {
        getSongsUrlToPush(songs[i])
      }

      // 更新数据
      info.playlistDetails = res.playlist
      info.songs = songs
    }

    // 获取用户创建的歌单进行判断
    const getCreatePlaylist = async (hint) => {
      let res = await userSongList(userId.value)
      // 创建的歌单 id
      let createdIds = []
      // 收藏的歌单 id
      let subIds = []
      // 区分歌单类型
      res.playlist.forEach((el) => {
        if (el.creator.userId === userId.value * 1) {
          createdIds.push(el.id)
        } else {
          subIds.push(el.id)
        }
      })

      // 修改创建状态
      if (createdIds.indexOf(id.value * 1) !== -1) {
        info.created = true
      } else {
        info.created = false
      }

      // 修改收藏状态
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

    // 收藏/取消收藏歌单
    const toSubPlaylist = async () => {
      let t = info.subscribed ? 2 : 1
      let res = await subPlaylist(id.value, t)
      if (res.code === 200) {
        getCreatePlaylist('hint')

        store.commit('changeSubUpdateTime')
      }
    }

    // 定义标签栏切换的方法
    const handleClick = () => {}

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

    // 设置监视
    watch(
      id,
      () => {
        // 当有 id 值再获取数据且路由路径就是当前组件
        if (id.value && route.name === 'playlistDetails') {
          if (loginState.value) {
            // 判断当前歌单是否由用户创建
            getCreatePlaylist()
          }

          // 获取歌单详细
          getPlaylistDetails()
        }
      },
      { immediate: true }
    )

    return {
      id,
      timestampToDate,
      handleClick,
      toUserDetails,
      toSingerDetails,
      toCollectionDetails,
      playSong,
      playAll,
      loginState,
      toSubPlaylist,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.playlistDetails {
  width: 100%;
  height: calc(100vh - 120px);
  overflow: auto;
  padding: 0 20px;
  box-sizing: border-box;
  cursor: default;
  .playlistIntroduce {
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
      .authorDetails {
        display: flex;
        line-height: 30px;
        margin: 5px 0;
        .headPhoto {
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }
        .name {
          margin: 0 10px;
          font-size: 14px;
          color: #6191c2;
          cursor: pointer;
        }
        .createDate {
          font-size: 13px;
          margin-left: 5px;
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
        .playlistTypeTag {
          span {
            color: #6191c2;
            margin-right: 5px;
          }
        }
        .count {
          display: flex;
          .songsCount {
            margin-right: 15px;
          }
        }
        .count,
        .playlistTypeTag {
          margin-bottom: 3px;
        }
        .playlistIntro {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .playlistContent {
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
      .seeMore {
        text-align: center;
        margin: 20px 0 5px;
        color: #aaa;
        font-size: 14px;
      }
    }
  }
}
</style>
