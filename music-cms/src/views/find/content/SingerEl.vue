<template>
    <div class="singerDetails">
      <div class="singerIntroduce">
        <div class="cover">
          <img v-if="singerInfo.cover" :src="singerInfo.cover" alt="" />
          <img
            v-if="!singerInfo.cover"
            src="../../assets/images/loading.png"
            alt=""
          />
        </div>
        <!-- 歌手介绍 -->
        <div class="introduce">
          <!-- 歌手名称 -->
          <div class="name">{{ singerInfo.name }}</div>
          <!-- 操作 -->
          <div class="operate">
            <!-- 收藏 -->
            <div :class="{ like: true, subscribed }" @click="toSubSinger">
              <i v-if="!subscribed" class="iconfont">&#xe604;</i>
              <i v-if="subscribed" class="iconfont">&#xe612;</i>
              {{ subscribed ? '已收藏' : '收藏' }}
            </div>
            <!-- 个人主页 -->
            <div class="home">
              <i class="iconfont">&#xe606;</i>
              个人主页
            </div>
          </div>
          <!-- 作品介绍 -->
          <div class="worksIntroduce">
            <span class="songsCount">单曲数：{{ singerInfo.musicSize }}</span>
            <span class="collectionsCount"
              >专辑数：{{ singerInfo.albumSize }}</span
            >
            <span class="videoCount">MV数：{{ singerInfo.mvSize }}</span>
          </div>
        </div>
      </div>
      <!-- 歌手内容 -->
      <div class="singerContent">
        <!-- 标签栏分类展示 -->
        <el-tabs v-model="selectTag">
          <el-tab-pane label="专辑" name="collection">
            <!-- 热门五十首 -->
            <div class="hotSongs">
              <!-- 封面图片 -->
              <div class="cover">
                <img src="./images/topSongsLogo.png" alt="" />
              </div>
              <!-- 歌曲 -->
              <div class="songs">
                <!-- 标题 -->
                <div class="title">热门 50 首</div>
                <el-table
                  :data="singerHotSongs"
                  style="width: 100%"
                  :show-header="false"
                  size="mini"
                  :max-height="maxHeight"
                  :scrollbar-always-on="true"
                  empty-text="Loading . . . . . ."
                  @row-dblclick="playSong(singerHotSongs)"
                >
                  <!-- 双击播放歌曲：@row-dblclick="play" -->
                  <el-table-column type="index" align="left" min-width="40">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="歌名"
                    min-width="500"
                    align="left"
                  >
                  </el-table-column>
                  <el-table-column prop="ar[0].name" label="歌手" align="right">
                    <template #default="scope">
                      <span
                        class="couldSkip"
                        @click="toSingerDetails(scope.row.ar[0].id)"
                      >
                        {{ scope.row.ar[0].name }}
                      </span>
                      <span
                        v-for="(a, index) in scope.row.ar.slice(1)"
                        :key="index"
                      >
                        /
                        <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                          a.name
                        }}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 查看更多 -->
                <div
                  class="seeMore"
                  v-if="maxHeight === 390"
                  @click="changeMaxHeight"
                >
                  查看更多
                </div>
              </div>
            </div>
            <!-- 专辑详细 -->
            <div
              class="details"
              v-for="(c, index) in collectionDetails"
              :key="index"
              empty-text="Loading . . . . . ."
            >
              <!-- 专辑封面 -->
              <div class="cover">
                <img v-if="c.album" :src="c.album.blurPicUrl" />
                <img v-if="!c.album" src="../../assets/images/loading.png" />
              </div>
              <!-- 专辑歌曲 -->
              <div class="songs">
                <!-- 标题 -->
                <div class="title">{{ c.album.name }}</div>
                <el-table
                  :data="c.songs"
                  style="width: 100%"
                  :show-header="false"
                  size="mini"
                  :max-height="maxHeight"
                  :scrollbar-always-on="true"
                  @row-dblclick="playSong(c.songs)"
                >
                  <el-table-column type="index" align="left" min-width="40">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="歌名"
                    min-width="500"
                    align="left"
                  >
                  </el-table-column>
                  <el-table-column prop="ar[0].name" label="歌手" align="right">
                    <template #default="scope">
                      <span
                        class="couldSkip"
                        @click="toSingerDetails(scope.row.ar[0].id)"
                      >
                        {{ scope.row.ar[0].name }}
                      </span>
                      <span
                        v-for="(a, index) in scope.row.ar.slice(1)"
                        :key="index"
                      >
                        /
                        <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                          a.name
                        }}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 查看更多 -->
                <div class="seeMore" @click="toCollectionDetails(c.album.id)">
                  查看更多
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="MV" name="mv">
            <ul class="lists infinite-list" :v-infinite-scroll="lazyLoading">
              <li
                class="list"
                v-for="(v, index) in singerMV.slice(0, time * 20)"
                :key="index"
                @click="toVideoDetails(v.id, v.type)"
              >
                <!-- 封面 -->
                <div class="cover">
                  <el-image :src="v.imgurl" alt="" class="video">
                    <div slot="placeholder" class="image-slot">
                      <img src="../../assets/images/loading.png" />
                    </div>
                  </el-image>
                  <!-- 播放量 -->
                  <div class="playCount">
                    <i class="iconfont">&#xe656;</i>
                    {{ (v.playCount / 10000).toFixed(1) }}万
                  </div>
                  <!-- 时长 -->
                  <div class="duration">
                    {{ millisecondToMinute(v.duration) }}
                  </div>
                </div>
                <!-- 名称 -->
                <p class="title">{{ v.name }}</p>
              </li>
            </ul>
            <div class="noData" v-if="!singerMV.length">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="歌手详细" name="details">
            <div class="singerDetail">{{ singerInfo.briefDesc }}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 回到顶部 -->
      <el-backtop target=".singerDetails" :bottom="120"></el-backtop>
    </div>
  </template>
  
  <script>
  // 引入接口 API
  import {
    singerDetails,
    hotSongs,
    singerCollections,
    collectionDetails,
    singerMV,
    songUrl,
    subSinger,
    getSubSinger,
  } from '@/api'
  // 引入 composition API
  import { reactive, toRefs, computed, watch } from 'vue'
  // 引入路由相关的 API
  import { useRouter, useRoute } from 'vue-router'
  // 引入 vuex 相关的 API
  import { useStore } from 'vuex'
  // 引入 plugin 中的方法
  import {
    millisecondToMinute,
    millisecondToMinuteArr,
    playAllSongs,
  } from '@/plugin'
  export default {
    name: 'SingerDetails',
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
        // 歌手信息
        singerInfo: {},
        // 歌手热门单曲
        singerHotSongs: [],
        // 专辑详细信息
        collectionDetails: [],
        // 歌手 MV
        singerMV: [],
        // 选中的标签（默认为：collection，歌曲列表页）
        selectTag: 'collection',
        // 热门五十首展示的最大高度（默认为：390）
        maxHeight: 390,
        // 是否还有更多 MV（默认为：false）
        isMoreMV: false,
        // MV 当前加载数据的次数（配合实现懒加载）
        time: 1,
        // 是否收藏了歌手
        subscribed: false,
      })
  
      // 定义获取歌手详细信息的方法
      const getSingerDetails = async () => {
        let res = await singerDetails(id.value)
        info.singerInfo = res.data.artist
      }
  
      // 定义获取歌手热门单曲的方法
      const getSingerHotSongs = async () => {
        let res = await hotSongs(id.value)
        // 格式化歌曲信息的时间
        millisecondToMinuteArr(res.hotSongs, 'dt')
        // 添加 url 值
        for (let i = 0; i < res.hotSongs.length; i++) {
          getSongsUrlToPush(res.hotSongs[i])
        }
        info.singerHotSongs = res.hotSongs
      }
  
      // 定义获取歌手专辑的方法
      const getSingerCollections = async () => {
        let res = await singerCollections(id.value)
        let idArr = []
        for (let i = 0; i < res.hotAlbums.length; i++) {
          idArr[i] = res.hotAlbums[i].id
        }
        getCollectionDetails(idArr)
      }
  
      // 定义批量获取专辑详细的方法（参数：存放专辑 id 的数组）
      const getCollectionDetails = async (idArr) => {
        for (let i = 0; i < idArr.length; i++) {
          let res = await collectionDetails(idArr[i])
          // 格式化歌曲信息的时间
          millisecondToMinuteArr(res.songs, 'dt')
          // 添加 url 值
          for (let i = 0; i < res.songs.length; i++) {
            getSongsUrlToPush(res.songs[i])
          }
          info.collectionDetails[i] = res
        }
      }
  
      // 定义获取歌手 MV 的方法
      const getSingerMV = async () => {
        let res = await singerMV(id.value, info.time * 20)
        // 更新是否还有更多 mv
        info.isMoreMV = res.hasMore
        // 更新 mv 数据
        info.singerMV = res.mvs
      }
  
      // 定义获取歌曲 url 并添加到歌曲信息中的方法（参数：指定歌曲信息）
      const getSongsUrlToPush = async (target) => {
        let res = await songUrl(target.id)
        target.url = res.data[0].url
      }
  
      // 定义获取收藏歌手的方法
      const getSubscribed = async (hint) => {
        let res = await getSubSinger()
        // 收藏的专辑 id
        let subIds = []
  
        console.log(res)
  
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
  
      // 定义收藏/取消收藏歌手的方法
      const toSubSinger = async () => {
        let t = info.subscribed ? 2 : 1
        let res = await subSinger(id.value, t)
        if (res.code === 200) {
          getSubscribed('hint')
        }
      }
  
      // 定义改变热门歌曲展示最大高度的方法
      const changeMaxHeight = () => {
        info.maxHeight = 99999
      }
  
      // 定义跳转到专辑详细页面的方法
      const toCollectionDetails = (id) => {
        router.push({
          name: 'collectionDetails',
          params: { id },
        })
      }
  
      // 定义跳转到歌手详细页面的方法
      const toSingerDetails = (id) => {
        router.push({
          name: 'singerDetails',
          params: { id },
        })
      }
  
      // 定义跳转到视频详细页面的方法
      const toVideoDetails = (id, type) => {
        if (type) {
          type = 'video'
        } else {
          type = 'mv'
        }
        router.push({
          name: 'videoDetails',
          params: {
            id,
            type,
          },
        })
      }
  
      // 懒加载的方法（存在滚动时数据加载页面有卡顿的清空：未解决）
      const lazyLoading = () => {
        // 如果还有更多数据再进行加载且当前处于 MV 标签栏
        if (info.isMoreMV && info.selectTag === 'mv') {
          info.time += 1
          getSingerMV()
        } else {
          if (info.time !== 1) {
            ElMessage({
              message: '暂无更多数据',
              type: 'warning',
            })
          }
        }
      }
  
      // 定义双击播放歌曲的方法
      const playSong = (songs) => {
        playAllSongs(songs, store)
      }
  
      // 设置监视
      watch(
        id,
        () => {
          // 当有 id 值再获取数据
          if (id.value && route.name === 'singerDetails') {
            // 获取歌手详细信息
            getSingerDetails()
  
            // 获取歌手热门单曲
            getSingerHotSongs()
  
            // 获取歌手专辑
            getSingerCollections()
  
            // 获取歌手 MV
            getSingerMV()
  
            // 获取收藏的歌手
            getSubscribed()
          }
        },
        { immediate: true }
      )
  
      return {
        changeMaxHeight,
        toCollectionDetails,
        toVideoDetails,
        lazyLoading,
        millisecondToMinute,
        toSingerDetails,
        playSong,
        toSubSinger,
        ...toRefs(info),
      }
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .singerDetails {
    width: 100%;
    height: calc(100vh - 120px);
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: default;
    .singerIntroduce {
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
      .introduce {
        color: #666;
        .name {
          font-size: 25px;
          font-weight: bold;
          color: #000;
          margin: 15px 0;
        }
        .operate {
          display: flex;
          margin: 10px 0;
          .home,
          .like {
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
          .subscribed {
            i {
              color: #ec4141;
            }
            color: #ec4141;
            border-color: #ec4141;
          }
        }
        .worksIntroduce {
          margin-left: 30px;
          margin-top: 20px;
          font-size: 14px;
          span {
            margin: 0 5px;
          }
        }
      }
    }
    .singerContent {
      margin-top: 20px;
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
        .hotSongs,
        .details {
          width: 100%;
          margin: 20px 0 50px;
          display: flex;
          .cover {
            img {
              width: 187px;
              height: 187px;
              border-radius: 15px;
              margin-right: 30px;
            }
          }
          .songs {
            width: calc(100% - 217px);
            .title {
              font-size: 22px;
              color: #000;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .el-table {
              border-radius: 10px;
              &::before {
                height: 0px;
              }
              tr {
                height: 37.5px;
                cursor: pointer;
                td {
                  font-size: 13px;
                  border-bottom: none;
                  &:nth-child(2n) {
                    color: #000000;
                  }
                  &:nth-child(2n + 1) {
                    color: #868686;
                  }
                }
                &:nth-child(2n + 1) {
                  background-color: #f8f8f8;
                }
                &:hover {
                  background-color: #f4f4f4;
                  & td {
                    background-color: #f4f4f4;
                  }
                }
              }
            }
            .el-scrollbar__bar {
              display: none;
            }
            .el-scrollbar__wrap,
            .el-scrollbar__wrap,
            .el-scrollbar__wrap--hidden-default {
              overflow: hidden !important;
            }
            .seeMore {
              margin-top: 10px;
              font-size: 14px;
              color: #868686;
              cursor: pointer;
            }
          }
        }
        ul.lists {
          display: flex;
          flex-wrap: wrap;
          box-sizing: border-box;
          justify-content: space-around;
          .list {
            box-sizing: border-box;
            margin-bottom: 10px;
            cursor: pointer;
            position: relative;
            .cover {
              position: relative;
              .playCount {
                position: absolute;
                top: 5px;
                right: 10px;
                color: white;
                font-size: 12px;
              }
              .duration {
                position: absolute;
                bottom: 10px;
                right: 10px;
                color: white;
                font-size: 12px;
              }
            }
            p {
              width: 285px;
              font-size: 15px;
              white-space: normal;
              text-align: left;
              margin-bottom: 20px;
            }
          }
        }
        .singerDetail {
          font-size: 15px;
          color: #373737;
          line-height: 30px;
          letter-spacing: 0.7px;
          text-indent: 2em;
          margin-bottom: 20px;
        }
        .noData {
          font-size: 23px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
  </style>
  