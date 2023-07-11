<template>
  <div class="navBar">
    <!-- 侧边栏列表 -->
    <ul>
      <!-- 基础列表 -->
      <li
        :class="{ current: routePath.indexOf(l.first) !== -1 }"
        @click="skip(l.path, l.name)"
        v-for="(l, index) in list"
        :key="index"
      >
        <i class="iconfont" :class="l.icon"></i>
        <span>{{ l.label }}</span>
      </li>
      <!-- 创建的歌单 -->
      <li v-if="userId" class="title">创建的歌单</li>
      <li
        :class="{
          current:
            routePath.indexOf('playlistDetails') !== -1 && l.id === id * 1,
        }"
        v-for="(l, index) in createSongList"
        :key="index"
        v-if="userId"
        @click="toPlaylistDetails(l.id)"
      >
        <i class="iconfont">&#xe636;</i>
        <span>{{ l.name }}</span>
      </li>
      <!-- 收藏的歌单 -->
      <li v-if="userId" class="title">收藏的歌单</li>
      <li
        :class="{
          current:
            routePath.indexOf('playlistDetails') !== -1 && l.id === id * 1,
        }"
        v-for="(l, index) in collectSongList"
        :key="index"
        v-if="userId"
        @click="toPlaylistDetails(l.id)"
      >
        <i class="iconfont">&#xe636;</i>
        <span>{{ l.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入路由相关的 API
import { useRoute, useRouter } from 'vue-router'
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
//引入需要使用的api接口
import { userSongList } from '@/api'
import { useStore } from 'vuex'
export default {
  name: 'NavBar',
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    const store = useStore()

    // 定义计算属性 routePath 用来保存当前页面的路径
    let routePath = computed({
      get() {
        return route.path
      },
      set(val) {
        return val
      },
    })

    // 定义计算属性用来获取用户 id
    let userId = computed({
      get() {
        return window.localStorage.getItem('userId')
      },
    })

    // 定义计算属性用来获取路径中的 id 值
    const id = computed({
      get() {
        return route.params.id
      },
    })

    // 定义计算属性 loginState 用来获取 store 中的登录状态
    const loginState = computed({
      get() {
        return store.state.loginState
      },
    })

    // 定义计算属性 subUpdateTime 用来获取 store 中的 subUpdateTime
    const subUpdateTime = computed({
      get() {
        return store.state.subUpdateTime
      },
    })

    // 定义对象 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 侧边栏列表
      list: [
        {
          label: '发现音乐',
          name: 'recommend',
          path: '/discover/recommend',
          icon: 'icon-yinle',
          first: 'discover',
        },
        {
          label: '视频',
          name: 'videoList',
          path: '/videos/videoList',
          icon: 'icon-shipin',
          first: 'videos',
        },
        {
          label: '收藏',
          name: 'enshrineCollection',
          path: '/enshrine/collection',
          icon: 'icon-shoucang',
          first: 'enshrine',
        },
        {
          label: '每日推荐',
          name: 'recommendation',
          path: '/recommendation',
          icon: 'icon-meirituijian',
          first: 'recommendation',
        },
      ],
      // 用户创建的歌单
      createSongList: [],
      // 用户收藏的歌单
      collectSongList: [],
    })

    // 定义获取用户歌单的方法
    const getUserSongList = async () => {
      let res = await userSongList(userId.value)
      if (res.code === 200) {
        // 清空歌单数据
        info.createSongList = []
        info.collectSongList = []
        // 区分歌单类型
        res.playlist.forEach((el) => {
          if (el.creator.userId === userId.value * 1) {
            info.createSongList.push(el)
          } else {
            info.collectSongList.push(el)
          }
        })
      }
    }

    // 定义跳转到指定路径页面的方法
    const skip = (path, name) => {
      if (name === 'recommend') {
        router.push(path)
        return
      }
      if (loginState.value) {
        router.push(path)
      } else {
        ElMessage({
          message: '需要先登录才能访问',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义跳转到歌单详细页面的方法
    const toPlaylistDetails = (id) => {
      if (loginState.value) {
        router.push({
          name: 'playlistDetails',
          params: {
            id,
          },
        })
      } else
        [
          ElMessage({
            message: '需要先登录才能访问',
            type: 'warning',
            grouping: true,
          }),
        ]
    }

    watch(
      subUpdateTime,
      () => {
        // 获取用户歌单信息
        getUserSongList()
      },
      { immediate: true }
    )

    return { routePath, skip, id, userId, toPlaylistDetails, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.navBar {
  ul {
    padding: 5px 0;
    li {
      padding: 5px 0;
      cursor: pointer;
      box-sizing: border-box;
      display: inline-block;
      width: 100%;
      height: 37.5px;
      line-height: 37.5px;
      padding: 0 20px;
      font-size: 15px;
      color: #303133;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      i {
        color: #909399;
        margin: 0 8px;
        font-size: 19px;
      }
      &:hover {
        background-color: #f5f5f6;
      }
      &.current {
        font-weight: bold;
        i {
          color: #303133;
        }
      }
      &.title {
        &:hover {
          background-color: #fff;
          cursor: default;
        }
      }
    }
  }
}
</style>
