//Vue3中需要引入createStore来配置vuex
import { createStore } from 'vuex'

const state = {
  // 当前的歌曲信息
  currentSongInfo: '',
  // 当前正歌曲的 URL
  currentSongUrl: '',
  // 歌曲的播放状态（默认为：false，不播放）
  songPlayState: false,
  // 播放列表
  playlist: [],
  // 登录的弹出框是否展示
  loginDialogIsVisible: false,
  // 是否刷新
  isRefresh: true,
  // 评论数据类型
  commentData: {
    t: {
      send: 1,
      replay: 2,
    },
    type: {
      single: 0,
      mv: 1,
      playlist: 2,
      collection: 3,
      radio: 4,
      video: 5,
      dynamic: 6,
    },
  },
  // 是否登录
  loginState: false,
  // 收藏的歌单数据更新次数（变化用于监视）
  subUpdateTime: 0,
  // 点赞的资源类型
  likeType: {
    single: 0,
    mv: 1,
    playlist: 2,
    collection: 3,
    radioProgram: 4,
    video: 5,
    dynamic: 6,
    radio: 7,
  },
}
const actions = {}
const mutations = {
  // 改变当前正在播放歌曲的信息
  changeCurrentSongInfo(state, value) {
    state.currentSongInfo = value
  },
  // 改变当前正在播放歌曲的 URL
  changeCurrentSongUrl(state, value) {
    state.currentSongUrl = value
  },
  // 改变歌曲的播放状态
  changeSongPlayState(state, value) {
    state.songPlayState = value
  },
  // 改变播放列表的数据
  changePlaylist(state, value) {
    if (value === 'clear') {
      state.playlist = []
    } else {
      state.playlist.push(value)
    }
  },
  // 改变登录弹出框展示状态
  changeLoginDialogIsVisible(state, value) {
    state.loginDialogIsVisible = value
  },
  // 插入歌曲信息到播放列表中
  insetSongInPlaylist(state, value) {
    // 播放列表中是否有数据
    if (state.playlist.length) {
      // 获取歌曲插入位置的索引
      let insetIndex = state.currentSongInfo.sortInPlaylist + 1
      // 为需要插入的歌曲信息添加 sortInPlaylist 属性
      value.sortInPlaylist = insetIndex
      // 插入数据
      state.playlist.splice(insetIndex, 0, value)
      // 修改后面歌曲信息的 sortInPlaylist 值
      if (state.playlist[insetIndex + 1]) {
        for (let i = insetIndex + 1; i < state.playlist.length; i++) {
          state.playlist[i].sortInPlaylist++
        }
      }
      // 修改当前播放歌曲的信息
      state.currentSongInfo = value
      // 修改当前播放歌曲的 url
      state.currentSongUrl = value.url
    } else {
      // 为需要插入的歌曲信息添加 sortInPlaylist 属性
      value.sortInPlaylist = 0
      // 修改当前播放歌曲的信息
      state.currentSongInfo = value
      // 修改当前播放歌曲的 url
      state.currentSongUrl = value.url
      // 将歌曲信息添加到播放列表中
      state.playlist.push(value)
    }
  },
  // 改变刷新条件
  changeIsRefresh(state, value) {
    state.isRefresh = value
  },
  // 改变登录状态
  changeLoginState(state, value) {
    state.loginState = value || false
  },
  // 同步收藏歌单数据更新次数
  changeSubUpdateTime(state) {
    state.subUpdateTime++
  },
}
const getters = {}

//创建并暴露Store实例对象
export default createStore({
  state,
  actions,
  mutations,
  getters,
})
