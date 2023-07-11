
export const millisecondToMinuteArr = (arr, target) => {
    for (let i = 0; i < arr.length; i++) {
      let time = Math.floor(arr[i][target] / 1000)
      let minute = Math.floor(time / 60)
      let second = Math.floor(time % 60)
      arr[i].minuteDt =
        minute < 10
          ? second < 10
            ? `0${minute}:0${second}`
            : `0${minute}:${second}`
          : second < 10
          ? `${minute}:0${second}`
          : `${minute}:${second}`
    }
  }
  
  // 将毫秒转换为分钟
  export const millisecondToMinute = (time) => {
    let duration = Math.floor(time / 1000)
    let minute = Math.floor(duration / 60)
    let second = Math.floor(duration % 60)
    time =
      minute < 10
        ? second < 10
          ? `0${minute}:0${second}`
          : `0${minute}:${second}`
        : second < 10
        ? `${minute}:0${second}`
        : `${minute}:${second}`
    return time
  }
  
  // 将时间戳转换为具体的日期（参数：时间戳）
  export const timestampToDate = (timestamp) => {
    let time = new Date(timestamp)
  
    // 获取年份
    let year = time.getFullYear()
  
    // 获取月份
    let month = time.getMonth() + 1
    // 对月份进行处理
    month = month < 10 ? `0${month}` : month
  
    // 获取日期
    let date = time.getDate()
    // 对日期进行处理
    date = date < 10 ? `0${date}` : date
  
    return `${year}-${month}-${date}`
  }
  
  // 将指定 DOM 元素滚动条滚动到指定位置（参数：DOM元素，目标位置，滚动方向（默认竖向滚动））
  export const roll = (el, target, direction) => {
    // 判断是否设置滚动方向，如果没有设置则默认为竖向滚动
    direction = direction ? direction : 'scrollTop'
    // 设置滚动的总时长（单位：ms，毫秒）
    let duration = 180
    // 设置滚动的间隔时间（单位：ms，毫秒）
    let time = 5
    // 获取滚动的距离（当前位置 - 目标位置）
    let distance = el[direction] - target
    // 获取滚动的速度
    let speed = distance / (duration / time)
    // 如果需要滚动的距离为 0，直接返回
    if (!distance) {
      return
    }
  
    // 当滚动的距离不为 0时，创建定时器实现滚动
    let timer = setInterval(() => {
      //  设置滚动
      el[direction] -= speed
      // 判断如果到达指定位置，则关闭定时器
      if (speed > 0 && el[direction] <= target) {
        clearInterval(timer)
      } else if (speed < 0 && el[direction] >= target) {
        clearInterval(timer)
      } else if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) {
        // 设置当竖向滚动距离底部在某个范围时也关闭定时器
        clearInterval(timer)
      }
    }, time)
  }
  
  // 播放单曲（参数：歌曲信息，vuex 中的 store）
  export const playSingle = (row, store) => {
    // 如果当前有正在播放的歌曲，则先将其暂停
    if (store.state.songPlayState && store.state.currentSongUrl) {
      // 暂停歌曲的播放
      store.commit('changeSongPlayState', false)
    }
  
    // 判断当前需要播放的歌曲是否已经存在于播放列表中
    if (row.hasOwnProperty('sortInPlaylist')) {
      // 当前需要播放的歌曲已经存在于播放列表中
  
      // 判断正在播放的歌曲是否就是需要播放的歌曲
      if (store.state.currentSongUrl === row.url) {
        // 继续播放歌曲
        store.commit('changeSongPlayState', true)
        ElMessage({
          message: '歌曲正在播放中',
          type: 'warning',
        })
      } else {
        // 更新当前播放歌曲的信息到 vuex 中
        store.commit('changeCurrentSongInfo', row)
        // 更新当前播放歌曲的 url 到 vuex 中
        store.commit('changeCurrentSongUrl', row.url)
        // 播放歌曲
        store.commit('changeSongPlayState', true)
      }
    } else {
      // 当前需要播放的歌曲不存在于播放列表中
  
      // 将当前歌曲信息插入到播放列表中 ———— 并会自动更新播放歌曲的信息和 url
      store.commit('insetSongInPlaylist', row)
      // 播放歌曲
      store.commit('changeSongPlayState', true)
    }
  }
  
  // 播放所有歌曲（参数：所有歌曲的信息，vuex 中的 store）
  export const playAllSongs = (songsInfo, store) => {
    // 先播放第一首歌曲
  
    // 获取当前播放列表中的数据
    let currentPlaylist = store.state.playlist
    // 获取第一首歌的信息
    let firstSong = songsInfo[0]
    // 为第一首歌曲添加 sortInPlaylist 属性，表示该歌曲在播放列表中的索引
    firstSong.sortInPlaylist = 0
    // 先清空播放列表
    store.commit('changePlaylist', 'clear')
    // 将第一首歌曲的信息添加到播放列表中
    store.commit('changePlaylist', firstSong)
    // 如果当前有正在播放的歌曲，则先将其暂停
    if (store.state.songPlayState && store.state.currentSongUrl) {
      // 暂停歌曲的播放
      store.commit('changeSongPlayState', false)
    }
    // 更新当前播放歌曲的信息到 vuex 中
    store.commit('changeCurrentSongInfo', firstSong)
    // 更新当前播放歌曲的 url 到 vuex 中
    store.commit('changeCurrentSongUrl', firstSong.url)
    // 播放歌曲
    store.commit('changeSongPlayState', true)
  
    // 再将剩余的歌曲信息保存在播放列表中
  
    for (let i = 1; i < songsInfo.length; i++) {
      // 获取当前播放列表中的数据
      let currentPlaylist = store.state.playlist
      // 为歌曲添加 sortInPlaylist 属性，表示该歌曲在播放列表中的索引
      songsInfo[i].sortInPlaylist = currentPlaylist.length
      // 将歌曲信息添加到播放列表中
      store.commit('changePlaylist', songsInfo[i])
    }
  }
  
  // 定义清空 cookie 的方法
  export const clearCookie = () => {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
      for (var i = keys.length; i--; ) {
        document.cookie =
          keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() //清除当前域名下的,例如：m.kevis.com
        document.cookie =
          keys[i] +
          '=0;path=/;domain=' +
          document.domain +
          ';expires=' +
          new Date(0).toUTCString() //清除当前域名下的，例如 .m.kevis.com
        document.cookie =
          keys[i] +
          '=0;path=/;domain=kevis.com;expires=' +
          new Date(0).toUTCString() //清除一级域名下的或指定的，例如 .kevis.com
      }
    }
  }
  