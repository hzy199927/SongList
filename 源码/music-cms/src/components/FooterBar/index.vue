<template>
  <div class="footerBar">
    <!-- 音频 -->
    <audio
      :src="songUrl"
      ref="music"
      @timeupdate="timeupdate"
      volume="0.5"
    ></audio>
    <!-- 左边 -->
    <div class="footerBar_left">
      <!-- 图片 -->
      <div class="cover" @click="songDetailsDrawer = !songDetailsDrawer">
        <img v-if="songInfo" :src="songInfo.al.picUrl" alt="" />
        <img v-if="!songInfo" src="./images/logo.jpg" alt="" />
      </div>
      <!-- 抽屉（歌曲详细） -->
      <el-drawer
        v-model="songDetailsDrawer"
        title="I am the title"
        :with-header="false"
        :direction="songDetailsDrawerDirection"
        :append-to-body="isToBody"
        :custom-class="frostedGlass"
        :modal="false"
      >
        <!-- 收起抽屉 -->
        <button class="packUp" @click="songDetailsDrawer = false">
          <el-icon><ArrowDownBold /></el-icon>
        </button>
        <!-- 歌曲详细 -->
        <div class="songDetails" v-if="songUrl">
          <!-- 歌曲信息 -->
          <div class="songInfo">
            <!-- 唱片部分 -->
            <div class="disc">
              <!-- 指针 -->
              <div class="needle" :class="{ needle: true, crush: playState }">
                <img src="./images/needle.png" alt="" />
              </div>
              <!-- 磁盘 -->
              <div
                class="disk"
                :class="{ disk: true, start: playState, stop: !playState }"
              >
                <!-- 外圈 -->
                <div class="outer"><img src="./images/disc.png" alt="" /></div>
                <!-- 内圈 -->
                <div class="inner">
                  <img :src="songInfo.al.picUrl" alt="" />
                </div>
              </div>
            </div>
            <!-- 歌曲信息 -->
            <div class="songDetails">
              <!-- 标题信息 -->
              <div class="title">
                <div class="name">{{ songInfo.name }}</div>
                <div
                  class="collection"
                  @click="toCollectionDetails(songInfo.al.id)"
                >
                  {{ songInfo.al.name }}
                </div>
                <div class="singers">
                  <span
                    class="singerName"
                    @click="toSingerDetails(songInfo.ar[0].id)"
                    >{{ songInfo.ar[0].name }}</span
                  >
                  <span v-for="(a, index) in songInfo.ar.slice(1)" :key="index">
                    /
                    <span class="singerName" @click="toSingerDetails(a.id)">{{
                      a.name
                    }}</span></span
                  >
                </div>
              </div>
              <!-- 歌词信息 -->
              <div class="lyrics" ref="lyricDom">
                <!-- 占位留白 -->
                <div class="placeholder"></div>
                <!-- 歌词内容 -->
                <div
                  v-show="lyricsContent.length"
                  :class="{
                    word: true,
                    currentLyric: currenLyricIndex === index,
                  }"
                  v-for="(l, index) in lyricsContent"
                  :key="index"
                >
                  {{ l }}
                </div>
                <!-- 歌曲未获取到时展示 -->
                <div class="word" v-show="!lyricsContent.length">
                  歌词获取中，请稍后...
                </div>
              </div>
            </div>
          </div>
          <div class="songComments">
            <!-- 歌曲评论 -->
            <Comment
              v-if="singleId"
              type="single"
              className="el-drawer__body"
            ></Comment>
          </div>
        </div>
        <!-- 没有歌曲时展示 -->
        <div class="not" v-if="!songUrl">暂无歌曲</div>
        <!-- 设置毛玻璃效果 -->
        <button
          class="setFrostedGlass"
          @click="isFrostedGlass = !isFrostedGlass"
        >
          <i class="iconfont">&#xe663;</i>
        </button>
        <el-backtop target=".el-drawer__body" :bottom="120"></el-backtop>
      </el-drawer>
      <!-- 歌曲信息 -->
      <div class="songInfo">
        <!-- 歌曲名称 -->
        <div class="name" v-if="songInfo">{{ songInfo.name }}</div>
        <!-- 歌手 -->
        <div class="singer" v-if="songInfo">
          <span class="couldSkip" @click="toSingerDetails(songInfo.ar[0].id)">
            {{ songInfo.ar[0].name }}
          </span>
          <span v-for="(a, index) in songInfo.ar.slice(1)" :key="index">
            /
            <span class="couldSkip" @click="toSingerDetails(a.id)">{{
              a.name
            }}</span></span
          >
        </div>
        <!-- 没有歌曲时显示 -->
        <div v-if="!songInfo" class="none">暂无歌曲</div>
      </div>
      <!-- 下载按钮 -->
      <div v-if="songInfo" class="download iconfont">&#xe668;</div>
    </div>
    <!-- 中间 -->
    <div class="footerBar_center">
      <!-- 控制台 -->
      <div class="control">
        <!-- 播放列表的播放方式 -->
        <div class="playType" @click="changeCirculationType">
          <i v-if="!circulationType" class="iconfont">&#xe64d;</i>
          <i v-if="circulationType === 1" class="iconfont">&#xe603;</i>
          <i v-if="circulationType === 2" class="iconfont">&#xe66d;</i>
        </div>
        <!-- 切换到上一首 -->
        <div class="previous" @click="prev">
          <i class="iconfont">&#xe641;</i>
        </div>
        <!-- 播放或者暂停 -->
        <div class="isPlay" @click="changePlayState(!playState)">
          <i class="iconfont" v-show="!playState">&#xe87c;</i>
          <i class="iconfont" v-show="playState">&#xee33;</i>
        </div>
        <!-- 切换到下一首 -->
        <div class="next" @click="next">
          <i class="iconfont">&#xe642;</i>
        </div>
        <!-- 我喜欢 -->
        <div class="like">
          <i class="iconfont">&#xe604;</i>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="schedule">
        <div class="currentTime">{{ currentTime }}</div>
        <el-slider
          v-model="currentDuration"
          :max="allDuration"
          @change="changeMusicDuration"
          @click="clickSongSlider(currentDuration)"
          :show-tooltip="false"
        />
        <div class="endTime">{{ endTime }}</div>
      </div>
    </div>
    <!-- 右边 -->
    <div class="footerBar_right">
      <!-- 音量控制 -->
      <div class="volume">
        <!-- 静音 -->
        <div class="mute" @click="changeMute">
          <i v-show="!isMute" class="iconfont">&#xeca6;</i>
          <i v-show="isMute" class="iconfont">&#xeca9;</i>
        </div>
        <el-slider
          v-model="currentVolume"
          @change="changeVolumeProgress"
          @click="clickVolumeSlider(currentVolume)"
          :show-tooltip="false"
          :max="maxVolume"
        ></el-slider>
      </div>
      <!-- 播放列表 -->
      <div class="playlist" @click="playlistDrawer = !playlistDrawer">
        <el-badge
          v-show="playlist.length"
          :value="playlist.length"
          class="item"
        >
          <i class="iconfont">&#xe63a;</i>
        </el-badge>
        <i v-show="!playlist.length" class="iconfont">&#xe63a;</i>
        <!-- 抽屉（播放列表） -->
        <el-drawer
          v-model="playlistDrawer"
          title="I am the title"
          :with-header="false"
          :append-to-body="isToBody"
          :size="380"
        >
          <!-- 歌曲数量 -->
          <div class="amount">总{{ playlist.length || 0 }}首</div>
          <el-table
            :data="playlist"
            style="width: 100%"
            size="mini"
            :show-header="false"
            :row-class-name="activeRowClass"
            @row-dblclick="dblclickInPlaylist"
            empty-text="暂无歌曲"
          >
            <el-table-column
              prop="name"
              width="190"
              label="音乐标题"
              align="left"
            >
            </el-table-column>
            <el-table-column
              prop="ar[0].name"
              width="100"
              label="歌手"
              align="left"
            >
              <template #default="scope">
                {{ scope.row.ar[0].name }}
                <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">
                  /
                  <span>{{ a.name }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="minuteDt"
              width="80"
              label="时长"
              align="center"
            >
            </el-table-column>
          </el-table>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
// 引入接口 API
import { lyric } from '@/api'
// 引入 composition API
import { reactive, computed, watch, toRefs, nextTick, watchEffect } from 'vue'
//引入element-plus图标
import { ArrowDown } from '@element-plus/icons-vue'
// 引入 vuex 相关 API
import { useStore } from 'vuex'
// 引入路由相关 API
import { useRouter } from 'vue-router'
// 引入 plugin 中的函数
import { millisecondToMinute, roll, playSingle } from '@/plugin'
import Comment from '@/components/Comment'
export default {
  name: 'FooterBar',
  components: { Comment },
  setup() {
    // 定义变量 store 用来进行 vuex 相关操作
    const store = useStore()

    // 定义变量 router 用来进行路由操作、
    const router = useRouter()

    // 定义计算属性 playState 用来保存歌曲的播放状态（从vuex中获取）
    const playState = computed({
      get() {
        return store.state.songPlayState
      },
      set(val) {
        return val
      },
    })

    // 定义计算属性 songUrl 用来保存歌曲的 URL（从vuex中获取）
    const songUrl = computed({
      get() {
        return store.state.currentSongUrl
      },
    })

    // 定义计算属性 songInfo 用来保存歌曲的信息（从vuex中获取）
    const songInfo = computed({
      get() {
        return store.state.currentSongInfo
      },
    })

    // 定义计算属性 singleId 用来保存当前歌曲的 id 值
    const singleId = computed({
      get() {
        return store.state.currentSongInfo.id
      },
    })

    // 定义计算属性 playlist 用来保存播放列表的数据（从vuex中获取）
    const playlist = computed({
      get() {
        return store.state.playlist
      },
    })

    // 定义计算属性 frostedGlass 用来保存是否设置毛玻璃效果
    const frostedGlass = computed({
      get() {
        if (info.isFrostedGlass) {
          return 'frostedGlass'
        }
      },
    })

    // 定义计算属性 currentLyricIndex 用于监视歌词索引变化
    const currenLyricIndex = computed({
      get() {
        return info.currenLyricIndex
      },
      set(val) {
        return val
      },
    })

    // 定义计算属性 songDetailsDrawer 用于监视歌曲详细抽屉的开启状态
    const songDetailsDrawer = computed({
      get() {
        return info.songDetailsDrawer
      },
    })

    // 定义变量 info 用来保存当前组件的响应式数据
    const info = reactive({
      // 指向 DOM 元素
      music: '',
      // 歌曲当前播放的时间
      currentTime: '00:00',
      // 歌曲当前播放的时长
      currentDuration: 0,
      // 歌曲的音量
      currentVolume: 50,
      // 歌曲音量的最大值
      maxVolume: 100,
      // 保存旧的音量值（点击静音键时保存）
      oldVolume: 50,
      // 音频是否处于静音状态
      isMute: false,
      // 播放列表的抽屉开启状态
      playlistDrawer: false,
      // 歌曲详细的抽屉开启状态
      songDetailsDrawer: false,
      // 歌曲详细的抽屉开启方向
      songDetailsDrawerDirection: 'btt',
      // 抽屉是否放置在 body 上
      isToBody: true,
      // 歌曲的循环方式 (顺序播放：0，随机播放：1，单曲循环：2)
      circulationType: 0,
      // 是否设置毛玻璃效果
      isFrostedGlass: false,
      // 指向歌词的 DOM 元素
      lyricDom: '',
      // 每句歌词的播放时间
      lyricsTime: [],
      // 每句歌词的内容
      lyricsContent: [],
      // 歌词是否可以自动滚动
      isAutoRoll: false,
      // 当前歌词的索引
      currenLyricIndex: 0,
      // 歌曲结束的时间
      endTime: computed({
        get() {
          return songInfo.value.minuteDt || '00:00'
        },
      }),
      // 歌曲的总时长
      allDuration: computed({
        get() {
          return Math.ceil(songInfo.value.dt / 1000)
        },
      }),
    })

    // 定义获取歌曲歌词的方法
    const getLyric = async () => {
      // 需要重新获取歌词数据时，将歌词的自动滚动状态设置为 false
      info.isAutoRoll = false
      if (songInfo.value) {
        let res = await lyric(songInfo.value.id)
        // 获取到的歌词数据是带有换行符的字符串
        let lyricsInfo = res.lrc.lyric
        // 清空歌词数据
        info.lyricsTime = []
        info.lyricsContent = []
        // 根据换行符分离出每句歌词数据
        lyricsInfo.split('\n').filter((value) => {
          // 单句歌词数据保存了当前歌词的播放时间和歌词内容
          let alone = value
          // 当歌词整体数据不为空串时，再进行时间和歌词内容的分离
          if (alone) {
            // 歌词时间放置在一对[]中，过滤分离
            alone.split(']').filter((value) => {
              // 过滤之后的数据包括时间和歌词，时间部分包含字符：[
              // 将时间部分和歌词部分分开进行处理
              if (!value.indexOf('[')) {
                // 时间部分

                // 去除时间部分的：[ 符号，和前后的空格
                let time = value.trim().slice(1)

                // 将时间部分转换为秒的形式

                // 获取时间的分
                let minute = time.slice(0, 2)
                // 获取时间的秒部分
                let second = time.slice(3)
                // 转换为时长
                let duration = minute * 60 + second * 1
                // 添加到保存每句歌词时长的数组中
                info.lyricsTime.push(duration)
              } else {
                // 歌词部分
                // 判断歌词是否为空串，如果为空串则不添加到歌词内容的数组中，并删除歌词时长数组中的最后一个元素（该元素就是当前歌词的时间数据）
                if (value.trim() === '') {
                  info.lyricsTime.pop()
                } else {
                  // 不为空串，获取歌词，并将其添加到歌词内容的数组中
                  let word = value.trim()
                  info.lyricsContent.push(word)
                }
              }
            })
          }
        })
        // 获取到歌词数据后，将歌词自动滚动状态设置为 true
        info.isAutoRoll = true
        // 获取到新的歌词数据之后，将当前歌词的索引设置为 0
        info.currenLyricIndex = 0
        // 获取到新的歌词之后，让歌词和页面都回到顶部
        if (info.lyricDom) {
          info.lyricDom.scrollTop = 0
        }
      }
    }

    // 定义播放歌曲的方法
    const playSong = () => {
      info.music.play()
    }

    // 定义暂停歌曲的方法
    const pauseSong = () => {
      info.music.pause()
    }

    // 定义点击按钮控制歌曲播放或者暂停的方法
    const changePlayState = (val) => {
      if (songUrl.value) {
        // 修改歌曲的播放状态
        store.commit('changeSongPlayState', val)
      } else {
        ElMessage({
          message: '暂无可播放的歌曲',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义拖动音频进度条的方法
    const changeMusicDuration = (val) => {
      if (songUrl.value) {
        // 更改音频的时长
        info.music.currentTime = val
        // 将当前歌词的索引重置为 0
        info.currenLyricIndex = 0
      } else {
        ElMessage({
          message: '无可播放歌曲，无法进行操作',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义点击音频进度条的方法
    const clickSongSlider = (val) => {
      if (songUrl.value) {
        // 更改音频的时长
        info.music.currentTime = val
        // 将当前歌词的索引重置为 0
        info.currenLyricIndex = 0
      }
    }

    // 定义拖动音量进度条的方法
    const changeVolumeProgress = (val) => {
      // 修改音量的值
      info.music.volume = val / 100
      // 判断进度条的值是否为 0
      info.isMute = val ? false : true
    }

    // 定义点击音量进度条的方法
    const clickVolumeSlider = (val) => {
      // 修改音量的值
      info.music.volume = val / 100
      // 判断进度条的值是否为 0
      info.isMute = val ? false : true
    }

    // 定义改变歌曲进度条状态的方法
    const changeMusicProgressState = () => {
      info.musicProgressState = false
    }

    // 定义切换歌曲的方法（参数：切换的歌曲在播放列表中的索引）
    const changeSong = (index) => {
      // 将之前歌曲的播放状态设置为暂停
      store.commit('changeSongPlayState', false)
      // 修改歌曲的 url
      store.commit('changeCurrentSongUrl', playlist.value[index].url)
      // 修改歌曲的信息
      store.commit('changeCurrentSongInfo', playlist.value[index])
    }

    // 定义切换到下一首歌曲的方法
    const next = () => {
      if (songUrl.value) {
        // 判断歌曲循环方式是否为随机播放
        if (info.circulationType === 1) {
          random()
        } else {
          if (playlist.value.length === 1) {
            ElMessage({
              message: '当前播放列表只有一首歌曲',
              type: 'warning',
              grouping: true,
            })
            return
          }
          // 获取当前歌曲在播放列表中的索引
          let index = songInfo.value.sortInPlaylist
          // 判断当前歌曲是否为播放列表的最后一首，如果是将索引设为：0，否则播放下一首
          if (index === playlist.value.length - 1) {
            index = 0
          } else {
            index++
          }
          // 切换歌曲
          changeSong(index)
        }
      } else {
        ElMessage({
          message: '暂无可播放的歌曲',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义切换到上一首歌曲的方法
    const prev = () => {
      if (songUrl.value) {
        if (info.circulationType === 1) {
          random()
        } else {
          if (playlist.value.length === 1) {
            ElMessage({
              message: '当前播放列表只有一首歌曲',
              type: 'warning',
              grouping: true,
            })
            return
          }
          // 获取当前歌曲在播放列表中的索引
          let index = songInfo.value.sortInPlaylist
          // 判断歌曲是否为播放列表中的第一首，如果是则将索引设为最后一首的索引，否则播放上一首
          if (index === 0) {
            index = playlist.value.length - 1
          } else {
            index--
          }
          // 切换歌曲
          changeSong(index)
        }
      } else {
        ElMessage({
          message: '暂无可播放的歌曲',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义随机播放的方法
    const random = () => {
      if (playlist.value.length > 1) {
        let random
        let currentIndex = songInfo.value.sortInPlaylist
        const randomFn = () => {
          random = Math.floor(Math.random() * playlist.value.length)
          if (random !== currentIndex) {
            changeSong(random)
          } else {
            randomFn()
          }
        }
        randomFn()
      } else {
        ElMessage({
          message: '当前歌曲已经是最后一首',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义切换歌曲循环方式的方法
    const changeCirculationType = () => {
      info.circulationType =
        info.circulationType < 2 ? ++info.circulationType : 0
    }

    // 定义当音频时长变化的方法
    const timeupdate = (e) => {
      // 更新歌曲的当前播放时长
      info.currentDuration = e.target.currentTime
      // 更新歌曲的当前播放时间（需要先转换为毫秒值）
      info.currentTime = millisecondToMinute(e.target.currentTime * 1000)
      // 根据歌曲播放时间的不断变化，为歌词设置自动滚动效果

      // 获取还未播放歌词的数组
      let lyricTimeArr = info.lyricsTime.slice(info.currenLyricIndex)

      // 获取歌词最后一句的时间
      let lastTime = info.lyricsTime[info.lyricsTime.length - 1]

      // 如果当前播放歌词时间大于当前歌曲的最后一句歌词时间，那么就定位在最后一句，否则通过for循环进行判断当前播放的歌曲是哪一句
      if (info.currentDuration >= lastTime) {
        info.currenLyricIndex = info.lyricsTime.length - 1
      } else {
        // 利用for循环更改当前播放歌词的索引
        for (let i = 0; i < lyricTimeArr.length; i++) {
          if (
            info.currentDuration >= lyricTimeArr[i] &&
            info.currentDuration < lyricTimeArr[i + 1]
          ) {
            info.currenLyricIndex += i
          }
        }
      }

      // 判断如果当前歌曲的时长等于总时长，则将歌曲播放状态设置为暂停
      if (info.currentDuration && info.currentTime === info.endTime) {
        store.commit('changeSongPlayState', false)
      }

      // 判断歌曲是否为试听歌曲
      if (e.target.ended && info.currentTime < info.endTime) {
        ElMessage({
          message: '试听结束，如果要听完整版的歌曲，你懂的！！！',
          type: 'warning',
          grouping: true,
        })
      }

      let currentTime = Math.ceil(e.target.currentTime)
      let duration = Math.ceil(songInfo.value.dt / 1000)

      // 当歌曲播放完毕后修改歌曲的播放状态，并根据歌曲的循环方式进行操作
      if (e.target.ended || currentTime === duration) {
        // 修改歌曲的播放状态
        store.commit('changeSongPlayState', !e.target.ended)
        if (info.circulationType === 0) {
          if (playlist.value.length > 1) {
            // 顺序播放
            next()
          }
        } else if (info.circulationType === 1) {
          if (playlist.value.length > 1) {
            // 随机播放
            random()
          }
        } else {
          // 将当前播放歌词的索引设置为 0
          info.currenLyricIndex = 0
          // 单曲循环
          e.target.currentTime = 0
          store.commit('changeSongPlayState', true)
        }
      }
    }

    // 定义跳转到歌手详细页面的方法
    const toSingerDetails = (id) => {
      info.songDetailsDrawer = false
      router.push({
        name: 'singerDetails',
        params: { id },
      })
    }

    // 定义跳转到专辑详细页面的方法
    const toCollectionDetails = (id) => {
      info.songDetailsDrawer = false
      router.push({
        name: 'collectionDetails',
        params: { id },
      })
    }

    // 定义跳转到用户详细页面的方法
    const toUserDetails = (id) => {
      info.songDetailsDrawer = false
      router.push({
        name: 'userDetails',
        params: {
          id,
        },
      })
    }

    // 定义点击静音按钮的方法
    const changeMute = () => {
      // 设置静音状态
      info.isMute = !info.isMute
      if (info.isMute) {
        // 将旧的音量值保存一份
        info.oldVolume = info.currentVolume
        // 将音频音量设置为 0
        info.music.volume = 0
        info.currentVolume = 0
      } else {
        // 将音频音量设置为之前保存的值
        info.music.volume = info.oldVolume / 100
        info.currentVolume = info.oldVolume
      }
    }

    // 为当前播放歌曲在播放列表中添加选中的样式
    const activeRowClass = ({ row, rowIndex }) => {
      if (rowIndex === songInfo.value.sortInPlaylist) {
        return 'active'
      }
    }

    // 双击播放列表中的歌曲进行播放
    const dblclickInPlaylist = (row) => {
      playSingle(row, store)
    }

    // 监视播放状态
    watch(
      playState,
      (newValue, oldValue) => {
        nextTick(() => {
          // 根据新的播放状态进行播放或暂停的操作
          newValue ? playSong() : pauseSong()
        })
      },
      { deep: true }
    )

    watch(singleId, () => {
      let dom = document.querySelector('.el-drawer__body')
      if (dom) roll(dom, 0)
    })

    watch(currenLyricIndex, () => {
      // 监视当前歌词索引的变化
      if (info.isAutoRoll && info.currenLyricIndex) {
        roll(info.lyricDom, info.currenLyricIndex * 51)
      }
    })

    // 监视歌词 DOM 元素的状态
    watchEffect(() => {
      if (info.lyricDom) {
        // 当歌词 DOM 元素被渲染出来之后，为其添加滚轮滚动事件

        // 定义变量 delay 用来保存延迟操作
        let delay
        info.lyricDom.addEventListener('mousewheel', () => {
          // 如果 delay 已经绑定成延迟了，那么就先关闭它
          if (delay) {
            clearTimeout(delay)
          }
          // 然后将歌词的自动滚动状态设置为 false
          info.isAutoRoll = false
          // 设置延迟期，2秒之后再恢复歌词的自动滚动状态
          delay = setTimeout(() => {
            info.isAutoRoll = true
          }, 2000)
        })
      }
    })

    // 监视当前播放歌曲信息的变化
    watchEffect(() => {
      if (songUrl.value && songInfo.value.id) {
        // 先将歌曲播放状态设置为关闭
        store.commit('changeSongPlayState', false)
        // 再将歌曲的播放状态设置为播放
        store.commit('changeSongPlayState', true)
        // 获取歌词
        getLyric()
      }
    })

    watch(songDetailsDrawer, () => {
      if (info.songDetailsDrawer) {
        roll(info.lyricDom, info.currenLyricIndex * 51)
      }
    })

    return {
      ArrowDown,
      songInfo,
      playState,
      frostedGlass,
      songUrl,
      playlist,
      changePlayState,
      timeupdate,
      changeMusicDuration,
      changeMusicProgressState,
      next,
      prev,
      toSingerDetails,
      toCollectionDetails,
      toUserDetails,
      changeVolumeProgress,
      changeMute,
      activeRowClass,
      dblclickInPlaylist,
      changeCirculationType,
      clickSongSlider,
      clickVolumeSlider,
      singleId,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.footerBar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  cursor: default;
  .footerBar_left {
    display: flex;
    height: 100%;
    align-items: center;

    & > .cover {
      img {
        width: 45px;
        height: 45px;
        border-radius: 8px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    & > .songInfo {
      width: 90px;
      .name,
      .singer {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin: 3px 0;
      }
      .singer {
        font-size: 13px;
      }
      .couldSkip {
        cursor: pointer;
        &:hover {
          color: #ec4141;
        }
      }
    }
    & > .download {
      margin-left: 20px;
      margin-top: 15px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .footerBar_center {
    height: 100%;
    & > .control {
      display: flex;
      justify-content: space-between;
      padding: 0 120px;
      margin: 5px 0 0 0;
      box-sizing: border-box;
      i {
        line-height: 30px;
        cursor: pointer;
      }
      .playType {
        i {
          font-size: 15px;
        }
      }
      .previous,
      .next {
        i {
          font-size: 25px;
        }
      }
      .isPlay {
        i {
          font-size: 30px;
        }
      }
      .like {
        i {
          font-size: 20px;
        }
      }
    }
    & > .schedule {
      display: flex;
      align-items: center;
      .el-slider {
        width: 380px;
      }
      .currentTime,
      .endTime {
        font-size: 13px;
        margin: 0 10px;
        color: #888;
      }
    }
  }
  .footerBar_right {
    height: 100%;
    display: flex;
    align-items: center;
    .volume {
      display: flex;
      margin-right: 40px;
      .mute {
        margin-right: 15px;
        i {
          color: #555;
          font-size: 22px;
          cursor: pointer;
        }
      }
      .el-slider {
        width: 60px;
      }
    }
    .playlist {
      margin-right: 10px;
      i {
        color: #555;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
