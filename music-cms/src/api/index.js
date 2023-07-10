import request from './users'

export const banner = ( ) =>{
    return request ({
        url:`/banner`,methods:'GET'
    })
}
//推荐歌单的数据
export const personalized = () => {
    return request ({
        url: `/personalized`, method: 'GET'
    })
}
export const boutique = () => {
  return request({ url: `/top/playlist/highquality`, method: 'GET' })
}

//精品歌单标签列表
export const playlistTag = () => {
  return request({ url: `/playlist/catlist`, method: 'GET' })
}

//热门歌单分类的标签
export const hotTypeTag = () => {
  return request({ url: `/playlist/hot`, method: 'GET' })
}

//根据分类获取歌单（网友精选碟）
export const handpick = (type, offset) => {
  return request({
    url: `/top/playlist?cat=${type}&offset=${offset}`,
    method: 'GET',
  })
}

//所有榜单
export const topList = () => {
  return request({
    url: `/toplist/detail`,
    method: 'GET',
  })
}

//获取歌曲详细
export const playlistDetails = (id) => {
  return request({
    url: `/playlist/detail?id=${id}`,
    method: 'GET',
  })
}

//获取歌单评论
export const commentPlaylist = (id, offset) => {
  return request({
    url: `/comment/playlist?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//获取歌单收藏者
export const playlistSubscribers = (id, offset) => {
  return request({
    url: `/playlist/subscribers?id=${id}&limit=30&offset=${offset}`,
    method: 'GET',
  })
}

//根据分类获取歌手
export const singers = (area, type, initial, offset) => {
  return request({
    url: `/artist/list?&area=${area}&type=${type}&initial=${initial}&offset=${offset}`,
    method: 'GET',
  })
}

//搜索多重匹配
export const multimatch = (keywords) => {
  return request({
    url: `/search/multimatch?keywords=${keywords}`,
    method: 'GET',
  })
}

//搜索
export const cloudsearch = (keywords, type, offset, limit) => {
  return request({
    url: `/cloudsearch?keywords=${keywords}&type=${type}&offset=${offset}&limit=${
      limit || 30
    }`,
    method: 'GET',
  })
}

//获取音频的url
export const songUrl = (id) => {
  return request({
    url: `/song/url?id=${id}`,
    method: 'GET',
  })
}

//获取音频的歌词
export const lyric = (id) => {
  return request({
    url: `/lyric?id=${id}`,
    method: 'GET',
  })
}

//获取歌曲的评论
export const commentSingle = (id, offset) => {
  return request({
    url: `/comment/music?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//获取专辑详细
export const collectionDetails = (id) => {
  return request({
    url: `/album?id=${id}`,
    method: 'GET',
  })
}

//获取专辑评论
export const commentCollection = (id, offset) => {
  return request({
    url: `/comment/album?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//获取歌手详细
export const singerDetails = (id) => {
  return request({
    url: `/artist/detail?id=${id}`,
    method: 'GET',
  })
}

//获取歌手专辑
export const singerCollections = (id) => {
  return request({
    url: `/artist/album?id=${id}`,
    method: 'GET',
  })
}

//获取歌手热门歌曲
export const hotSongs = (id) => {
  return request({
    url: `/artists?id=${id}`,
    method: 'GET',
  })
}
//获取歌手mv
export const singerMV = (id, limit) => {
  return request({
    url: `/artist/mv?id=${id}&limit=${limit}`,
    method: 'GET',
  })
}

//获取用户详细
export const userDetails = (id) => {
  return request({
    url: `/user/detail?uid=${id}`,
    method: 'GET',
  })
}

//获取用户歌单
export const userSongList = (id) => {
  return request({
    url: `/user/playlist?uid=${id}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//获取mv数据
export const mvDetails = (id) => {
  return request({
    url: `/mv/detail?mvid=${id}`,
    method: 'GET',
  })
}

//获取mv地址
export const mvUrl = (id) => {
  return request({
    url: `/mv/url?id=${id}`,
    method: 'GET',
  })
}

//获取视频详细数据
export const videoDetails = (id) => {
  return request({
    url: `/video/detail?id=${id}`,
    method: 'GET',
  })
}

//获取视频地址
export const videoUrl = (id) => {
  return request({
    url: `/video/url?id=${id}`,
    method: 'GET',
  })
}

//获取mv评论
export const mvComment = (id, offset) => {
  return request({
    url: `/comment/mv?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//获取视频评论
export const videoComment = (id, offset) => {
  return request({
    url: `/comment/video?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

//相关推荐
export const related = (id) => {
  return request({
    url: `/related/allvideo?id=${id}`,
    method: 'GET',
  })
}

// 获取二维码的 key 值
export const QRCodeKey = () => {
  return request({
    url: `/login/qr/key?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 获取二维码的 base64 编码
export const QRCodeBase = (key) => {
  return request({
    url: `/login/qr/create?key=${key}&qrimg=true&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 检测二维码的状态
export const QRCodeState = (key) => {
  return request({
    url: `/login/qr/check?key=${key}&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 发送验证码
export const sendCaptcha = (phone) => {
  return request({
    url: `/captcha/sent?phone=${phone}`,
    method: 'GET',
  })
}

// 校验验证码
export const checkCaptcha = (phone, captcha) => {
  return request({
    url: `/captcha/verify?phone=${phone}&captcha=${captcha}`,
    method: 'GET',
  })
}

// 检测手机号码是否已经注册
export const telIsRegister = (phone) => {
  return request({
    url: `/cellphone/existence/check?phone=${phone}`,
    method: 'GET',
  })
}

// 手机号登录
export const telLogin = (phone, captcha) => {
  return request({
    url: `/login/cellphone?phone=${phone}&captcha=${captcha}`,
    method: 'GET',
  })
}

// 注册
export const telRegister = (phone, password, captcha, nickname) => {
  return request({
    url: `/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}`,
    method: 'GET',
  })
}

// 重复昵称检测
export const checkNicknameIsRepetition = (nickname) => {
  return request({
    url: `/nickname/check?nickname=${nickname}`,
    method: 'GET',
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: `/logout?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 账号信息
export const accountInfo = () => {
  return request({
    url: `/user/account?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 热搜榜
export const hotSearch = () => {
  return request({
    url: `/search/hot/detail`,
    method: 'GET',
  })
}

// 搜索建议
export const searchSuggest = (keywords) => {
  return request({
    url: `/search/suggest?keywords=${keywords}`,
    method: 'GET',
  })
}

// 歌曲详细
export const songDetail = (ids) => {
  if (ids.length > 1) {
    let idStr = ''
    for (let i = 0; i < ids.length; i++) {
      idStr += ids[i] + ','
    }
    ids = idStr.substring(0, idStr.length - 1)
  }
  return request({
    url: `/song/detail?ids=${ids}`,
    method: 'GET',
  })
}

// 视频标签列表
export const videoList = () => {
  return request({
    url: `/video/group/list`,
    method: 'GET',
  })
}

// 热门视频标签列表
export const hotVideoList = () => {
  return request({
    url: `/video/category/list`,
    method: 'GET',
  })
}

// 根据指定标签获取视频
export const videoForList = (id, offset) => {
  return request({
    url: `/video/group?id=${id}&offset=${offset}`,
  })
}

// 获取所有 mv
export const allMv = (area, type, order, offset) => {
  return request({
    url: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}&limit=24`,
    method: 'GET',
  })
}

// 获取收藏的专辑
export const enshrineCollection = (offset, limit) => {
  return request({
    url: `/album/sublist?&offset=${offset}&limit=${
      limit || 30
    }&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 获取收藏的专辑
export const enshrineSinger = (offset, limit) => {
  return request({
    url: `/artist/sublist?&offset=${offset}&limit=${
      limit || 30
    }&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 获取收藏的专辑
export const enshrineVideo = (offset, limit) => {
  return request({
    url: `/mv/sublist?&offset=${offset}&limit=${
      limit || 30
    }&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 获取每日推荐歌曲
export const recommendation = () => {
  return request({
    url: `/recommend/songs?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 发送评论
export const sendComment = (t, type, id, content, commentId) => {
  let url
  if (commentId) {
    url = `/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`
  } else {
    url = `/comment?t=${t}&type=${type}&id=${id}&content=${content}`
  }
  return request({
    url,
    method: 'GET',
  })
}

// 给评论点赞
export const likeComment = (t, type, id, cid) => {
  return request({
    url: `/comment/like?t=${t}&type=${type}&id=${id}&cid=${cid}`,
    method: 'GET',
  })
}

// 收藏/取消收藏歌手
export const subSinger = (id, t) => {
  return request({
    url: `/artist/sub?id=${id}&t=${t}`,
    method: 'GET',
  })
}

// 获取收藏的歌手列表
export const getSubSinger = () => {
  return request({
    url: `/artist/sublist?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 收藏/取消收藏 MV
export const subMV = (id, t) => {
  return request({
    url: `/mv/sub?mvid=${id}&t=${t}`,
    method: 'GET',
  })
}

// 获取收藏的 mv 列表
export const getSubMv = () => {
  return request({
    url: `/mv/sublist?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 收藏/取消收藏歌单
export const subPlaylist = (id, t) => {
  return request({
    url: `/playlist/subscribe?id=${id}&t=${t}`,
    method: 'GET',
  })
}

// 收藏/取消收藏专辑
export const subCollection = (id, t) => {
  return request({
    url: `/album/sub?id=${id}&t=${t}`,
    method: 'GET',
  })
}

// 获取收藏的专辑列表
export const getSubCollection = () => {
  return request({
    url: `/album/sublist?timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}

// 收藏/取消收藏视频
export const subVideo = (id, t) => {
  return request({
    url: `video/sub?id=${id}&t=${t}`,
    method: 'GET',
  })
}

// 对资源进行点赞/取消点赞
export const likeResource = (type, t, id) => {
  return request({
    url: `/resource/like?type=${type}&t=${t}&id=${id}`,
    method: 'GET',
  })
}

// 获取点过赞的视频（接口应该还未更新）
export const likeVideo = () => {
  return request({
    url: `/playlist/mylike?limit=1000&timestamp=${new Date().getTime()}`,
    method: 'GET',
  })
}