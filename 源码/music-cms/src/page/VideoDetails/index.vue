<template>
  <div class="videoDetails">
    <!-- 详细内容（mv） -->
    <div class="contentDetails" v-if="type === 'mv'">
      <!-- 视频内容 -->
      <div class="videoContent">
        <!-- 标题 -->
        <div class="title">MV详细</div>
        <!-- 视频 -->
        <div class="video">
          <video :src="videoUrl" controls :poster="videoDetails.cover"></video>
        </div>
      </div>
      <!-- 视频信息 -->
      <div class="videoInfo">
        <!-- 作者信息 -->
        <div
          class="author"
          v-if="videoDetails.artists"
          v-for="(v, index) in videoDetails.artists"
          :key="index"
        >
          <!-- 头像 -->
          <div class="headerPhoto" @click="toSingerDetails(v.id)">
            <img :src="v.img1v1Url" alt="" />
          </div>
          <!-- 名称 -->
          <div class="name" @click="toSingerDetails(v.id)">{{ v.name }}</div>
        </div>
        <!-- 标题 -->
        <div class="title">{{ videoDetails.name }}</div>
        <!-- 发布时间 -->
        <div class="publishTime">发布：{{ videoDetails.publishTime }}</div>
        <!-- 播放量 -->
        <div class="playAmount">
          播放：{{ (videoDetails.playCount / 10000).toFixed(1) }}万
        </div>
        <!-- 操作 -->
        <div class="operate">
          <!-- 赞 -->
          <div class="like">
            <i class="iconfont">&#xe613;</i>
            赞
          </div>
          <!-- 收藏 -->
          <div :class="{ collect: true, subscribed }" @click="toSubscribe">
            <i v-if="!subscribed" class="iconfont">&#xe604;</i>
            <i v-if="subscribed" class="iconfont">&#xe612;</i>
            {{ subscribed ? '已收藏' : '收藏' }}
          </div>
          <!-- 分享 -->
          <div class="share">
            <i class="iconfont">&#xe60c;</i>
            分享
          </div>
        </div>
      </div>
      <!-- 视频评论 -->
      <div class="videoComments">
        <Comment :type="type" className="videoDetails"></Comment>
      </div>
    </div>
    <!-- 详细内容（video） -->
    <div class="contentDetails" v-if="type === 'video'">
      <!-- 视频内容 -->
      <div class="videoContent">
        <!-- 标题 -->
        <div class="title">视频详细</div>
        <!-- 视频 -->
        <div class="video">
          <video
            :src="videoUrl"
            controls
            :poster="videoDetails.coverUrl"
          ></video>
        </div>
      </div>
      <!-- 视频信息 -->
      <div class="videoInfo">
        <!-- 作者信息 -->
        <div class="author" v-if="videoDetails.creator">
          <!-- 头像 -->
          <div
            class="headerPhoto"
            @click="toUserDetails(videoDetails.creator.userId)"
          >
            <img :src="videoDetails.creator.avatarUrl" alt="" />
          </div>
          <!-- 名称 -->
          <div class="name" @click="toUserDetails(videoDetails.creator.userId)">
            {{ videoDetails.creator.nickname }}
          </div>
        </div>
        <!-- 标题 -->
        <div class="title">{{ videoDetails.title }}</div>
        <!-- 发布时间 -->
        <div class="publishTime">
          发布：{{ timestampToDate(videoDetails.publishTime) }}
        </div>
        <!-- 播放量 -->
        <div class="playAmount">
          播放：{{ (videoDetails.playTime / 10000).toFixed(1) }}万
        </div>
        <!-- 操作 -->
        <div class="operate">
          <!-- 赞 -->
          <div class="like">
            <i class="iconfont">&#xe613;</i>
            赞
          </div>
          <!-- 收藏 -->
          <div :class="{ collect: true, subscribed }" @click="toSubscribe">
            <i v-if="!subscribed" class="iconfont">&#xe604;</i>
            <i v-if="subscribed" class="iconfont">&#xe612;</i>
            {{ subscribed ? '已收藏' : '收藏' }}
          </div>
          <!-- 分享 -->
          <div class="share">
            <i class="iconfont">&#xe60c;</i>
            分享
          </div>
        </div>
      </div>
      <!-- 视频评论 -->
      <div class="videoComments">
        <Comment :type="type" className="videoDetails"></Comment>
      </div>
    </div>
    <!-- 视频相关推荐 -->
    <div class="videoRelated">
      <!-- 标题 -->
      <div class="title">相关推荐</div>
      <ul class="lists">
        <li
          class="list"
          v-for="(r, index) in videoRelated"
          :key="index"
          @click="switchVideo(r.vid, r.type)"
        >
          <!-- 封面 -->
          <div class="cover">
            <img :src="r.coverUrl" alt="" />
            <!-- 播放量 -->
            <div class="playCount">
              <i class="iconfont">&#xe656;</i>
              {{ (r.playTime / 10000).toFixed(1) }}万
            </div>
            <!-- 时长 -->
            <div class="duration">{{ millisecondToMinute(r.durationms) }}</div>
          </div>
          <!-- 介绍 -->
          <div class="introduce">
            <!-- 标题 -->
            <div class="title">{{ r.title }}</div>
            <!-- 名称 -->
            <div class="name">{{ r.creator[0].userName }}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 回到顶部 -->
    <el-backtop target=".videoDetails" :bottom="120"></el-backtop>
  </div>
</template>

<script>
// 引入接口 API
import {
  mvDetails,
  mvUrl,
  videoDetails,
  videoUrl,
  related,
  subVideo,
  subMV,
  getSubMv,
  likeVideo,
} from '@/api'
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
// 引入路由相关的 API
import { useRouter, useRoute } from 'vue-router'
// 引入 plugin 中的方法
import { timestampToDate, millisecondToMinute } from '@/plugin'
import { useStore } from 'vuex'
import Comment from '@/components/Comment'
export default {
  name: 'VideoDetails',
  components: { Comment },
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

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

    // 定义计算属性 type 用来获取传递过来的 type 参数
    const type = computed({
      get() {
        return route.params.type
      },
      set(val) {
        return val
      },
    })

    // 定义计算属性 likeType 用来获取 store 中的 likeType
    const likeType = computed({
      get() {
        return store.state.likeType
      },
    })

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 视频详细
      videoDetails: {},
      // 视频评论
      videoComments: [],
      // 视频相关推荐
      videoRelated: [],
      // 视频的 url
      videoUrl: '',
      // 是否收藏了视频或 mv
      subscribed: false,
    })

    // 定义切换视频的方法
    const switchVideo = (id, type) => {
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

    // 定义获取视频详细的方法
    const getVideoDetails = async () => {
      let res

      // 判断类型为普通视频还是mv
      if (type.value == 'mv') {
        res = await mvDetails(id.value)
      } else if (type.value == 'video') {
        res = await videoDetails(id.value)
      }

      // 更新视频详细
      info.videoDetails = res.data
    }

    // 定义获取视频相关推荐的方法
    const getRelated = async () => {
      let res = await related(id.value)
      info.videoRelated = res.data
    }

    // 定义获取视频 url 的方法
    const getVideoUrl = async () => {
      let res

      // 判断类型为普通视频还是mv
      if (type.value == 'mv') {
        res = await mvUrl(id.value)
        info.videoUrl = res.data.url
      } else if (type.value == 'video') {
        res = await videoUrl(id.value)
        info.videoUrl = res.urls[0].url
      }
    }

    // 定义获取收藏视频或 mv 的方法
    const getSubscribed = async (hint) => {
      let res = await getSubMv()

      // 收藏的 id
      let subIds = []

      res.data.forEach((el) => {
        let newType = type.value === 'mv' ? 0 : 1
        if (el.type === newType) {
          subIds.push(el.vid)
        }
      })

      if (subIds.indexOf(id.value) !== -1) {
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

    // 定义收藏/取消收藏 视频或 mv 的方法
    const toSubscribe = async () => {
      let t = info.subscribed ? 2 : 1
      let res
      switch (type.value) {
        case 'mv':
          res = await subMV(id.value, t)
          break
        case 'video':
          res = await subVideo(id.value, t)
          break
      }
      if (res.code === 200) {
        getSubscribed('hint')
      }
    }

    // 定义获取点过赞的视频的方法
    const getLikeVideo = async () => {
      let res = await likeVideo()
      // 获取不到对应数据，应该是接口没有更新
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

    // 定义跳转到用户详细页面的方法
    const toUserDetails = (id) => {
      router.push({
        name: 'userDetails',
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
        if (id.value && route.name === 'videoDetails') {
          // 获取视频详细
          getVideoDetails()

          // 获取视频相关推荐
          getRelated()

          // 获取视频 url
          getVideoUrl()

          // 获取收藏的视频或 mv
          getSubscribed()

          // 获取点过赞的视频或 mv
          getLikeVideo()
        }
      },
      { immediate: true }
    )

    return {
      timestampToDate,
      switchVideo,
      type,
      millisecondToMinute,
      toUserDetails,
      toSingerDetails,
      toSubscribe,
      ...toRefs(info),
    }
  },
}
</script>

<!-- 样式 -->
<style lang="less" scoped>
.videoDetails {
  width: 100%;
  height: calc(100vh - 120px);
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  cursor: default;
  justify-content: center;
  overflow: auto;
  .contentDetails {
    width: 625px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    & > .videoContent {
      & > .title {
        margin-top: 20px;
        font-size: 22px;
        font-weight: bold;
      }
      .video {
        margin-top: 20px;
        video {
          width: 620px;
          height: 355px;
        }
      }
    }
    & > .videoInfo {
      .author {
        height: 50px;
        display: flex;
        line-height: 50px;
        margin: 20px 0;
        .headerPhoto {
          cursor: pointer;
          margin-right: 20px;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .name {
          cursor: pointer;
        }
      }
      .title {
        font-size: 25px;
        margin: 10px 0;
        font-weight: bold;
      }
      .publishTime,
      .playAmount {
        font-size: 13px;
        margin-right: 30px;
        color: #aaa;
      }
      .operate {
        margin: 20px 0;
        .like,
        .collect,
        .share {
          display: inline-block;
          border: 1px solid #ddd;
          padding: 5px 15px;
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
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }
  }
  .videoRelated {
    width: 375px;
    height: 100%;
    & > .title {
      margin-top: 20px;
      font-size: 22px;
      font-weight: bold;
    }
    & > ul.lists {
      margin-top: 20px;
      .list {
        display: flex;
        margin-bottom: 20px;
        cursor: pointer;
        .cover {
          position: relative;
          img {
            width: 187.5px;
            height: 112.5px;
            border-radius: 10px;
            margin-right: 15px;
          }
          .playCount {
            position: absolute;
            top: 5px;
            right: 20px;
            color: white;
            font-size: 12px;
          }
          .duration {
            position: absolute;
            bottom: 10px;
            right: 20px;
            color: white;
            font-size: 12px;
          }
        }
        .introduce {
          .title {
            width: 172px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 15px;
            margin: 10px 0;
            color: #1f1e1e;
          }
          .name {
            margin: 20px 0;
            color: #aaa;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
