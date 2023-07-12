<template>
  <div class="videoList">
    <!-- 视频类型选择 -->
    <div class="videoListType">
      <!-- 所有类型（可下拉选择） -->
      <el-popover
        ref="popover"
        placement="bottom-start"
        :width="400"
        trigger="click"
      >
        <template #reference>
          <el-button class="typeSelect">
            <span>{{ selectVideoName }}</span>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </template>
        <el-button
          :class="{ list: true, select: selectVideoId === p.id }"
          v-for="(p, index) in videoList"
          :key="index"
          @click="changeType(index)"
        >
          {{ p.name }}
        </el-button>
      </el-popover>

      <!-- 热门类型 -->
      <div class="hotType">
        <el-button
          :class="{ type: true, select: selectVideoId === h.id }"
          v-for="(h, index) in hotVideoList"
          :key="index"
          @click="changeHot(index)"
          >{{ h.name }}</el-button
        >
      </div>
    </div>
    <!-- 视频数据 -->
    <div class="videos">
      <ul
        class="lists"
        :infinite-scroll-disabled="disabled"
        v-infinite-scroll="infiniteLoading"
        :infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
      >
        <li
          class="list"
          v-for="(v, index) in videos"
          :key="index"
          @click="toVideoDetails(v.data.vid, v.data.type)"
        >
          <div class="cover">
            <el-image :src="v.data.coverUrl" alt="" class="video">
              <div slot="placeholder" class="image-slot">
                <img src="../../../assets/images/loading.png" />
              </div>
            </el-image>
            <!-- 播放量 -->
            <div class="playCount">
              <i class="iconfont">&#xe656;</i>
              {{ (v.data.playTime / 10000).toFixed(1) }}万
            </div>
            <!-- 时长 -->
            <div class="duration">
              {{ millisecondToMinute(v.data.durationms) }}
            </div>
          </div>
          <!-- 名称 -->
          <p class="title">{{ v.data.title }}</p>
        </li>
      </ul>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".videoList" :bottom="100"></el-backtop>
  </div>
</template>

<script>
//  引入接口 api
import { videoList, hotVideoList, videoForList } from '@/api'
//引入 composition API
import { reactive, toRefs } from 'vue'
// 引入路由相关 API
import { useRouter } from 'vue-router'
// 引入 plugin 中的方法
import { millisecondToMinute } from '@/plugin'
export default {
  name: 'VideoList',
  setup() {
    // 定义变量 router 用来进行路由操作
    const router = useRouter()

    // 定义变量 info用来保存当前组件的所有响应式数据
    const info = reactive({
      // 视频标签列表
      videoList: [],
      // 热门视频标签列表
      hotVideoList: [],
      // 视频数据
      videos: [],
      // 选中的视频分类标签的名字（默认为：现场）
      selectVideoName: '现场',
      // 选中的视频分类标签的 id（默认为：现场（id:58100））
      selectVideoId: 58100,
      // 选中的视频分类信息
      selectVideoInfo: {},
      // 视频数据加载的次数（默认为：1）
      time: 1,
      // 是否还有更多数据（默认为：true）
      hasMore: true,
      // 是否禁用无限滚动
      disabled: false,
    })

    // 定义获取视频标签列表的方法
    const getVideoList = async () => {
      let res = await videoList()
      info.videoList = res.data
    }

    // 定义获取热门视频标签列表的方法
    const getHotVideoList = async () => {
      let res = await hotVideoList()
      info.hotVideoList = res.data
    }

    // 定义根据视频分类标签获取视频数据的方法
    // 该接口每次请求只能获取 8 条数据，所以大尺寸屏幕没有内容溢出根本就不会触发触底加载事件
    // 所以循环 3 次，每次就获取 24 条数据
    const getVideoForList = async () => {
      let i = 3
      while (i) {
        let id = info.selectVideoId
        let offset = (info.time - 1) * 8
        let res = await videoForList(id, offset)
        info.videos.push(...res.datas)
        info.hasMore = res.hasmore
        // 数据获取完毕，可以加载
        info.disabled = false
        info.time++
        i--
      }
    }

    // 歌单类型改变的方法
    const changeType = (i) => {
      // 重置加载次数
      info.time = 1
      // 更新标签名
      info.selectVideoName = info.videoList[i].name
      // 更新标签 id
      info.selectVideoId = info.videoList[i].id
      // 清空视频数据
      info.videos = []
      // 重新获取数据
      getVideoForList()
    }

    // 热门歌单类型改变的方法
    const changeHot = (i) => {
      // 重置加载次数
      info.time = 1
      // 更新标签名
      info.selectVideoName = info.hotVideoList[i].name
      // 更新标签 id
      info.selectVideoId = info.hotVideoList[i].id
      // 清空视频数据
      info.videos = []
      // 重新获取数据
      getVideoForList()
    }

    // 跳转到视频详细页面
    const toVideoDetails = (id) => {
      router.push({
        name: 'videoDetails',
        params: {
          id,
          type: 'video',
        },
      })
    }

    // 无限加载的方法
    const infiniteLoading = () => {
      // 数据加载中，禁用加载
      info.disabled = true
      // 如果还有更多数据再进行加载
      if (info.hasMore) {
        getVideoForList()
      } else {
        if (info.time !== 1) {
          ElMessage({
            message: '暂无更多数据',
            type: 'warning',
          })
        }
      }
    }

    getVideoForList()

    // 获取视频标签列表
    getVideoList()
    // 获取热门视频标签列表
    getHotVideoList()

    return {
      changeType,
      changeHot,
      millisecondToMinute,
      toVideoDetails,
      infiniteLoading,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.videoList {
  .videoListType {
    max-width: 1250px;
    min-width: 992px;
    height: 68px;
    margin: auto;
    box-sizing: border-box;
    padding: 14px 0;
    display: flex;
    position: relative;
    align-items: center;
    .typeSelect {
      height: 28px;
      border-radius: 20px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      padding: 0 10px;
    }
    .hotType {
      display: flex;
      position: absolute;
      right: 0;
      .type {
        text-align: center;
        padding: 0 10px;
        height: 28px;
        border-radius: 20px;
        box-sizing: border-box;
      }
      .select {
        color: #eb4f4f;
        background-color: #fcebeb;
      }
    }
  }
  .videos {
    max-width: 1250px;
    min-width: 992px;
    margin: 20px auto 0;
    ul.lists {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      .list {
        box-sizing: border-box;
        margin-bottom: 10px;
        cursor: pointer;
        margin-right: 36px;
        &:nth-child(4n) {
          margin: 0;
        }
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
  }
}
</style>
