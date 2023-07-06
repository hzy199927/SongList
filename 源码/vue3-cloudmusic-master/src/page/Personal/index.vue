<template>
  <div class="userDetails">
    <!-- 用户信息 -->
    <div class="userInfo" v-if="userInfo.profile">
      <!-- 用户头像 -->
      <div class="userHeaderPhoto">
        <img
          v-if="userInfo.profile.avatarUrl"
          :src="userInfo.profile.avatarUrl"
          alt=""
        />
        <img
          v-if="!userInfo.profile.avatarUrl"
          src="../../assets/images/loading.png"
          alt=""
        />
      </div>
      <!-- 详细信息 -->
      <div class="detailInfo">
        <!-- 顶部信息 -->
        <div class="top">
          <!-- 用户名称 -->
          <div class="name">
            {{ userInfo.profile.nickname }}
          </div>
          <!-- 用户等级 -->
          <div class="level">Lv{{ userInfo.level }}</div>
        </div>
        <!-- 底部信息 -->
        <div class="bottom">
          <!-- 用户数据 -->
          <div class="userData">
            <!-- 动态 -->
            <div class="dynamicState">
              <div class="amount">{{ userInfo.profile.eventCount }}</div>
              <div class="name">动态</div>
            </div>
            <!-- 关注 -->
            <div class="attention">
              <div class="amount">{{ userInfo.profile.follows }}</div>
              <div class="name">关注</div>
            </div>
            <!-- 粉丝 -->
            <div class="fans">
              <div class="amount">{{ userInfo.profile.followeds }}</div>
              <div class="name">粉丝</div>
            </div>
          </div>
          <!-- 用户 id -->
          <div class="userId">
            用户id：<span>{{ userInfo.profile.userId }}</span>
          </div>
          <!-- 用户所在地区 -->
          <div class="userAddress">
            所在地区：<span
              >{{ userInfo.profile.province }} {{ userInfo.profile.city }}</span
            >
          </div>
          <!-- 用户个人介绍 -->
          <div class="userIntroduce">
            个人介绍：<span>{{ userInfo.profile.signature }} </span>
            <span v-if="!userInfo.profile.signature">暂无个人介绍</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 用户创建的歌单 -->
    <div class="userCreateSongList" v-if="userCreateSongList.length">
      <!-- 标题 -->
      <div class="title" v-if="userInfo.profile">
        {{ userInfo.profile.nickname }}创建的歌单({{
          userCreateSongList.length
        }})
      </div>
      <!-- 歌单 -->
      <div class="songs">
        <ul class="lists">
          <li
            class="list"
            v-for="(u, index) in userCreateSongList"
            :key="index"
            @click="toPlaylistDetails(u.id)"
          >
            <el-image :src="u.coverImgUrl" alt="">
              <div slot="placeholder" class="image-slot">
                <img src="../../assets/images/loading.png" />
              </div>
            </el-image>
            <p class="title">{{ u.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 用户收藏的歌单 -->
    <div class="userCollectSongList" v-if="userCollectSongList.length">
      <!-- 标题 -->
      <div class="title" v-if="userInfo.profile">
        {{ userInfo.profile.nickname }}收藏的歌单({{
          userCollectSongList.length
        }})
      </div>
      <!-- 歌单 -->
      <div class="songs">
        <ul class="lists">
          <li
            class="list"
            v-for="(u, index) in userCollectSongList"
            :key="index"
            @click="toPlaylistDetails(u.id)"
          >
            <el-image :src="u.coverImgUrl" alt="">
              <div slot="placeholder" class="image-slot">
                <img src="../../assets/images/loading.png" />
              </div>
            </el-image>
            <p class="title">{{ u.name }}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 无歌单信息时展示 -->
    <div
      class="none"
      v-if="userCollectSongList.length + userCreateSongList.length === 0"
    >
      暂无用户数据
    </div>
    <!-- 回到顶部 -->
    <el-backtop target=".userDetails" :bottom="120"></el-backtop>
  </div>
</template>

<script>
//引入需要使用的api接口
import { userDetails, userSongList } from '@/api'
// 引入 composition API
import { reactive, toRefs, computed, watchEffect } from 'vue'
// 引入路由相关的 API
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'Personal',
  setup() {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义计算属性 id 用来保存路由传递过来的 id 参数
    const id = computed({
      get() {
        return route.params.id
      },
      set(val) {
        return val
      },
    })

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
        message: '需要先登录才能访问',
        type: 'warning',
        grouping: true,
      })
      router.push('/discover/recommend')
    }

    // 定义变量 info 用来保存当前组件的响应式数据
    const info = reactive({
      // 用户信息
      userInfo: {},
      // 用户创建的歌单
      userCreateSongList: [],
      // 用户收藏的歌单
      userCollectSongList: [],
    })

    // 定义获取用户信息的方法
    const getUserInfo = async () => {
      let res = await userDetails(id.value)
      info.userInfo = res
    }

    // 定义获取用户歌单的方法
    const getUserSongList = async () => {
      let res = await userSongList(id.value)
      // 清空歌单数据
      info.userCreateSongList = []
      info.userCollectSongList = []
      // 区分歌单类型
      res.playlist.forEach((el) => {
        if (el.creator.userId === id.value * 1) {
          info.userCreateSongList.push(el)
        } else {
          info.userCollectSongList.push(el)
        }
      })
    }

    // 定义函数 toPlaylistDetails 跳转到歌单详细页面
    const toPlaylistDetails = (id) => {
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

    // 设置监视
    watchEffect(
      () => {
        // 当有 id 值再获取数据
        if (id.value && route.name === 'personal') {
          // 获取用户信息
          getUserInfo()

          // 获取用户歌单
          getUserSongList()
        }
      },
      { immediate: true }
    )

    return { toPlaylistDetails, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.userDetails {
  width: 100%;
  height: calc(100vh - 120px);
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  cursor: default;
  .userInfo {
    display: flex;
    margin: 40px 0;
    padding: 0 10px;
    box-sizing: border-box;
    .userHeaderPhoto {
      margin-right: 30px;
      img {
        width: 187.5px;
        height: 187.5px;
        border-radius: 50%;
      }
    }
    .detailInfo {
      width: calc(100% - 187.5px);
      color: #2e2e2e;
      .top {
        border-bottom: 1px solid rgb(221, 221, 221);
        .name {
          color: #000;
          font-size: 28px;
          font-weight: bold;
        }
        .level {
          border-radius: 10px;
          background-color: #f0f0f0;
          display: inline-block;
          padding: 0 10px;
          font-size: 12px;
          margin: 15px 0;
        }
      }
      .bottom {
        margin: 10px 0 0 10px;
        .userData {
          display: flex;
          & > div {
            margin-bottom: 10px;
            border-right: 1px solid #ddd;
            text-align: center;
            padding: 0 35px;
            cursor: pointer;
            &.dynamicState {
              padding: 0 35px 0 0;
            }
            &.fans {
              border: none;
            }
            .amount {
              font-size: 22px;
            }
            .name {
              font-size: 12px;
              color: #666;
            }
          }
        }
        .userId,
        .userAddress,
        .userIntroduce {
          font-size: 13px;
          margin: 3px 0;
          span {
            color: #666;
          }
        }
      }
    }
  }
  .userCreateSongList,
  .userCollectSongList {
    & > .title {
      font-size: 17px;
      font-weight: bold;
      color: #373737;
      margin-bottom: 20px;
    }
    ul.lists {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      .list {
        box-sizing: border-box;
        margin-bottom: 10px;
        cursor: pointer;
        margin-right: 42px;
        &:nth-child(5n) {
          margin: 0;
        }
        p {
          width: 225px;
          font-size: 15px;
          white-space: normal;
          text-align: left;
          margin-bottom: 20px;
        }
      }
    }
  }
  .none {
    margin: 200px auto 0;
    font-size: 25px;
    font-weight: bold;
  }
}
</style>
