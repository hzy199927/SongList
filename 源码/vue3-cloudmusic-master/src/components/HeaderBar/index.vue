<template>
  <div class="headerBar">
    <!-- logo -->
    <div class="logo">
      <img src="./images/logo.png" alt="" />
    </div>
    <!-- 页面前后跳转 -->
    <div class="pageSkip">
      <el-button :icon="ArrowLeft" circle @click="router.back()" />
      <el-button :icon="ArrowRight" circle @click="router.forward()" />
    </div>
    <!-- 搜索框 -->
    <div class="search">
      <el-popover
        v-model="isSearchPopShow"
        popper-class="searchPop"
        trigger="click"
        hide-after="50"
      >
        <template #reference>
          <el-input
            placeholder="请输入内容"
            :prefix-icon="Search"
            v-model.trim="keywords"
            @keyup.enter.native="toSearch"
            @input="keywordsChange"
          ></el-input>
        </template>
        <!-- 热搜榜 -->
        <HotSearch v-if="!searchSuggestList.songs"></HotSearch>
        <!-- 搜索建议 -->
        <div class="searchSuggest" v-if="searchSuggestList.songs">
          <div class="title">搜索建议</div>
          <div class="song" v-if="searchSuggestList.songs">
            <div class="title">
              <i class="iconfont">&#xe6e3;</i>
              单曲
            </div>
            <div
              class="data"
              v-for="(i, index) in searchSuggestList.songs"
              :key="index"
              @click="playSong(i.id)"
            >
              {{ i.name + ' - ' + i.artists[0].name }}
            </div>
          </div>
          <div class="singer" v-if="searchSuggestList.artists">
            <div class="title">
              <i class="iconfont">&#xe8c2;</i>
              歌手
            </div>
            <div
              class="data"
              v-for="(i, index) in searchSuggestList.artists"
              :key="index"
              @click="toSingerDetails(i.id)"
            >
              {{ i.name }}
            </div>
          </div>
          <div class="collection" v-if="searchSuggestList.albums">
            <div class="title">
              <i class="iconfont">&#xe60a;</i>
              专辑
            </div>
            <div
              class="data"
              v-for="(i, index) in searchSuggestList.albums"
              :key="index"
              @click="toCollectionDetails(i.id)"
            >
              {{ i.name + ' - ' + i.artist.name }}
            </div>
          </div>
          <div class="playlist" v-if="searchSuggestList.playlists">
            <div class="title">
              <i class="iconfont">&#xe636;</i>
              歌单
            </div>
            <div
              class="data"
              v-for="(i, index) in searchSuggestList.playlists"
              :key="index"
              @click="toPlaylistDetails(i.id)"
            >
              {{ i.name }}
            </div>
          </div>
        </div>
      </el-popover>
    </div>
    <!-- 登录 -->
    <div class="toLogin">
      <!-- 未登录时展示 -->
      <div v-if="!loginState">
        <img
          @click="loginDialogIsVisible = true"
          src="./images/login.jpg"
          alt=""
        />
        <span>点击头像登录</span>
      </div>
      <!-- 登录时展示 -->
      <div v-if="loginState">
        <!-- 用户头像 -->
        <img :src="accountInfo.avatarUrl" alt="" @click="skipPersonal" />
        <!-- 用户名称 -->
        <span class="nickname">{{ accountInfo.nickname }}</span>
      </div>
      <!-- 登录的 dialog -->
      <el-dialog
        v-model="loginDialogIsVisible"
        width="30%"
        :modal="false"
        :center="true"
        :draggable="true"
        top="10vh"
      >
        <!-- 登录部分 -->
        <Login :closeDialog="closeDialog"></Login>
      </el-dialog>
      <!-- 退出登录的 dialog -->
      <el-dialog
        v-model="quitDialogIsVisible"
        title="退出登录"
        width="30%"
        :center="true"
        :modal="false"
        :draggable="true"
      >
        <span class="quitHint">请问是否确认退出登录</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button class="true" @click="toLogout">确定</el-button>
            <el-button class="false" @click="quitDialogIsVisible = false"
              >取消</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 退出登录 -->
    <div class="quit" v-if="loginState" @click="selectLogout">
      <el-icon><SwitchButton /></el-icon>
    </div>
  </div>
</template>

<script>
//引入element-plus图标
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SwitchButton,
} from '@element-plus/icons-vue'
//引入compositionAPI
import { ref, computed, toRefs, reactive } from 'vue'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
// 引入 vuex 相关的 API
import { useStore } from 'vuex'
// 引入组件
import Login from '../Login'
import HotSearch from '../HotSearch'
// 引入接口 API
import {
  accountInfo,
  logout,
  searchSuggest,
  songUrl,
  songDetail,
  isLogin,
} from '@/api'
// 引入 plugin 中的方法
import { playSingle, millisecondToMinute, clearCookie } from '@/plugin'
export default {
  name: 'HeaderBar',
  components: { Login, HotSearch },
  setup() {
    // 定义变量 router 用来进行路由的操作
    const router = useRouter()

    // 定义变量 store 进行 vuex 相关操作
    const store = useStore()

    // 定义变量 keywords 用来保存搜索的关键字
    let keywords = ref('')

    // 定义节流定时器
    let timer

    // 定义变量 logoutTimer 用来协助退出登录操作
    let logoutTimer

    // 定义变量 info 用来保存当前页面的响应式数据
    const info = reactive({
      // 登录弹出框是否显示
      loginDialogIsVisible: false,
      // 退出登录弹出框是否显示
      quitDialogIsVisible: false,
      // 账户信息
      accountInfo: {},
      // 搜索建议
      searchSuggestList: {},
      // 搜索提示内容是否显示
      isSearchPopShow: false,
      // 搜索建议中歌曲的详细信息
      searchSuggestSongDetails: {},
      // loading 加载
      loading: '',
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

    // 定义计算属性 loginState 用来获取 vuex 中的登录状态
    const loginState = computed({
      get() {
        return store.state.loginState
      },
    })

    // 定义函数 toSearch 用来执行搜索的操作
    const toSearch = async () => {
      // 将当前搜索框中的关键字保存在 session 中
      window.sessionStorage.setItem('keywords', keywords.value)
      // 判断，如果当关键字不为空串时才能进行搜索，否则进行提示
      if (keywords.value) {
        // 跳转页面，并传递搜索的关键词
        router.push({
          name: 'searchSingle',
          params: {
            keywords: keywords.value,
          },
        })
      } else {
        ElMessage({
          message: '请输入有效的搜索关键字 ！',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义获取账号信息的方法
    const getAccountInfo = async () => {
      let res = await accountInfo()
      if (res.profile) {
        // 已登录

        // 保存用户数据
        info.accountInfo = res.profile

        // 将用户的 id 值添加到 localStorage 中
        window.localStorage.setItem('userId', res.profile.userId)
        // 修改登录状态
        store.commit('changeLoginState', true)
      } else {
        // 未登录

        // 清空 localStorage 中的 userId
        window.localStorage.removeItem('userId')
        // 修改登录状态
        store.commit('changeLoginState', false)
        // 清空 cookie
        clearCookie()
      }
    }

    // 定义退出登录的方法
    const toLogout = async () => {
      let res = await logout()
      // 关闭弹窗
      info.quitDialogIsVisible = false
      if (res.code === 200) {
        // 退出成功

        // 删除 userId
        window.localStorage.removeItem('userId')
        // 清空 cookie
        clearCookie()
        ElMessage({
          message: '已退出登录',
          type: 'success',
          grouping: true,
        })
        // 获取当前页面的路径
        let currentPath = window.location.href
        // 关闭定时器
        clearInterval(logoutTimer)
        // 如果处于个人信息页面则重定向到主页面
        if (currentPath.indexOf('personal') !== -1) {
          router.push('/discover/recommend')
        }
        // 刷新页面
        router.go(0)
      }
    }

    // 定义获取歌曲 url 的方法
    const getSongUrl = async (target) => {
      let res = await songUrl(target.id)
      target.url = res.data[0].url

      // 播放歌曲
      playSingle(info.searchSuggestSongDetails, store)
    }

    // 定义获取歌曲详细的方法
    const getSongDetails = async (idArr) => {
      let res = await songDetail(idArr)

      // 将歌曲时长的时间戳转换为分钟
      res.songs[0].minuteDt = millisecondToMinute(res.songs[0].dt)
      info.searchSuggestSongDetails = res.songs[0]

      // 获取歌曲的 url 值
      getSongUrl(info.searchSuggestSongDetails)
    }

    // 定义关闭弹窗的方法（用于组件间通信）
    const closeDialog = (val) => {
      info.loginDialogIsVisible = val
    }

    // 定义点击弹出退出登录选择的方法
    const selectLogout = () => {
      // 设置退出登录的弹窗显示
      info.quitDialogIsVisible = true
    }

    // 定义获取搜索建议的方法
    const getSearchSuggest = async () => {
      let res = await searchSuggest(keywords.value)
      info.searchSuggestList = res.result
    }

    // 定义搜索关键词变化的函数
    const keywordsChange = () => {
      // 清空定时器
      clearTimeout(timer)
      if (keywords.value !== '') {
        timer = setTimeout(() => {
          getSearchSuggest(keywords.value)
        }, 100)
      } else {
        // 清空searchSuggestList
        info.searchSuggestList = {}
        return
      }
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

    // 定义跳转到歌单详细页面的方法
    const toPlaylistDetails = (id) => {
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

    // 定义跳转到个人主页的方法
    const skipPersonal = () => {
      router.push({
        name: 'personal',
        params: {
          id: userId.value,
        },
      })
    }

    // 定义播放音乐的方法
    const playSong = (id) => {
      // 获取歌曲的详细信息
      getSongDetails([id])
    }

    getAccountInfo()

    return {
      keywords,
      router,
      ArrowLeft,
      ArrowRight,
      SwitchButton,
      Search,
      toSearch,
      userId,
      closeDialog,
      toLogout,
      selectLogout,
      keywordsChange,
      toSingerDetails,
      toCollectionDetails,
      toPlaylistDetails,
      playSong,
      skipPersonal,
      loginState,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.headerBar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: default;
  position: relative;
  .logo {
    display: inline-block;
    margin-right: 50px;
    background-color: #ec4141;
    img {
      height: 36px;
      //图片对其方式，容易影响布局
      vertical-align: middle;
    }
  }
  .pageSkip {
    display: inline-block;
    box-sizing: border-box;
    padding: 4px 0;
    margin-right: 20px;
    background-color: #ec4141;
    display: flex;
    .el-button {
      width: 28px;
      height: 28px;
      background-color: #e13e3e;
      border: none;
      color: white;
      text-align: center;
    }
  }
  .search {
    position: relative;
    :deep(.el-input) {
      height: 28px;
      .el-input__wrapper {
        border-radius: 50px;
        background-color: #e13e3e;
        box-shadow: none;
        input {
          color: white;
          &::-webkit-input-placeholder {
            color: rgba(255, 255, 255);
          }
          &:-moz-placeholder {
            color: rgba(255, 255, 255);
          }
          &::-moz-placeholder {
            color: rgba(255, 255, 255);
          }
          &:-ms-input-placeholder {
            color: rgba(255, 255, 255);
          }
        }
        .el-input__prefix {
          color: white;
        }
      }
    }
  }
  .toLogin {
    width: 147.5px;
    box-sizing: border-box;
    color: white;
    font-family: '等线';
    font-size: 15px;
    position: absolute;
    right: 20px;
    margin-right: 30px;
    background-color: #ec4141;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    & > div {
      display: flex;
      align-items: center;
      img {
        width: 37.5px;
        border-radius: 50%;
        vertical-align: middle;
        margin: 0 10px;
        cursor: pointer;
      }
      .nickname {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    :deep(.el-dialog) {
      header {
        height: 50px;
        line-height: 50px;
        padding: 0;
      }
      .el-dialog__headerbtn {
        top: 0;
        i {
          font-size: 20px;
        }
        &:hover {
          i {
            color: #ec4141;
          }
        }
      }
      .true {
        height: 35px;
        padding: 0 20px;
        border: 1px solid #ddd;
        background-color: #ec4141;
        color: white;
        &:hover {
          background-color: #e13e3e;
          color: rgb(254, 254, 254);
        }
        &:active {
          background-color: #d43b3b;
          color: rgb(253, 253, 253);
        }
      }
      .false {
        height: 35px;
        padding: 0 20px;
        border: 1px solid #ddd;
        background-color: #ddd;
        color: white;
        &:hover {
          background-color: #ddd;
          color: rgb(254, 254, 254);
        }
        &:active {
          background-color: #ddd;
          color: rgb(253, 253, 253);
        }
      }
      .quitHint {
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .quit {
    position: absolute;
    right: 10px;
    font-size: 23px;
    color: white;
    cursor: pointer;
    margin-top: 5px;
  }
}
</style>
