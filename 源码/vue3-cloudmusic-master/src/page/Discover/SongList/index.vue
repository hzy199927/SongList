<template>
  <div class="songList" ref="songList">
    <!-- 精品歌单 -->
    <div class="boutique">
      <!-- 背景图 -->
      <img class="bgcImg" :src="boutique.coverImgUrl" alt="" />
      <!-- 封面 -->
      <div class="cover">
        <img :src="boutique.coverImgUrl" alt="" />
      </div>
      <!-- 信息 -->
      <div class="info">
        <div class="introduce">
          <el-button class="title">
            <i class="iconfont">&#xe613;</i>
            精品歌单
          </el-button>
          <!-- 名称 -->
          <p class="name">{{ boutique.name }}</p>
          <!-- 撰稿人 -->
          <p class="copywriter">{{ boutique.copywriter }}</p>
        </div>
      </div>
    </div>
    <!-- 歌单类型选择 -->
    <div class="songListType">
      <!-- 所有类型（可下拉选择） -->
      <el-popover
        ref="popover"
        placement="bottom-start"
        :width="400"
        trigger="click"
      >
        <template #reference>
          <el-button class="typeSelect">
            <span>{{ selectPlaylistName }}</span>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </template>
        <el-button
          :class="{ list: true, select: selectPlaylistName === p.name }"
          v-for="(p, index) in playlistTag"
          :key="index"
          @click="changeType(index)"
        >
          {{ p.name }}
        </el-button>
      </el-popover>

      <!-- 热门类型 -->
      <div class="hotType">
        <el-button
          :class="{ type: true, select: selectPlaylistName === h.name }"
          v-for="(h, index) in hotTypeTag"
          :key="index"
          @click="changeHot(index)"
          >{{ h.name }}</el-button
        >
      </div>
    </div>
    <!-- 对应分类的歌单详细 -->
    <div class="typeResult">
      <ul class="lists">
        <li
          class="list"
          v-for="(h, index) in handpick"
          :key="index"
          @click="toPlaylistDetails(h.id)"
        >
          <el-image :src="h.coverImgUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ h.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-show="handpick.length"
        background
        :current-page="pagination + 1"
        layout="prev, pager, next"
        :total="pages * 10"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".songList" :bottom="100"></el-backtop>
  </div>
</template>

<script>
//  引入接口 api
import { boutique, playlistTag, hotTypeTag, handpick } from '@/api'
//引入 composition API
import { reactive, toRefs, watchEffect } from 'vue'
// 引入路由相关 API
import { useRouter } from 'vue-router'
export default {
  name: 'songList',
  setup() {
    // 定义变量 router 用来进行路由操作
    const router = useRouter()

    // 定义变量 info用来保存当前组件的所有响应式数据
    const info = reactive({
      // 定义属性 boutique用来保存精品歌单
      boutique: [],
      // 所有歌单标签
      playlistTag: [],
      //热门歌单分类的标签
      hotTypeTag: [],
      // 具体分类的歌单
      handpick: [],
      // 选中的歌单名称（默认为华语）
      selectPlaylistName: '华语',
      // 歌单当前页码（默认为：0）
      pagination: 0,
      // 歌单的总页数
      pages: 0,
      // 指向 DOM 元素
      songList: '',
    })

    // 定义获取精品歌单的方法
    const getBoutique = async () => {
      let res = await boutique()
      info.boutique = res.playlists[0]
    }

    // 获取精品歌单标签
    const getPlaylistTag = async () => {
      let res = await playlistTag()
      info.playlistTag = res.sub
    }

    // 获取热门歌单分类的标签
    const getHotTypeTag = async () => {
      let res = await hotTypeTag()
      info.hotTypeTag = res.tags
    }

    // 获取对应分类歌单的详细
    const getHandpick = async () => {
      let res = await handpick(info.selectPlaylistName, info.pagination * 50)
      info.handpick = res.playlists
      // 赋值歌单的总页数
      info.pages = Math.ceil(res.total / 50)
      // 每当重写获取对应分类歌单详细信息时，页面到顶部
      info.songList.scrollTop = 0
    }

    // 歌单类型改变的方法
    const changeType = (i) => {
      // 当歌单类型改变时，重置页码为第一页
      info.pagination = 0
      // 更新标签名
      info.selectPlaylistName = info.playlistTag[i].name
    }

    // 热门歌单类型改变的方法
    const changeHot = (i) => {
      // 思路同 changeType方法
      info.pagination = 0
      info.selectPlaylistName = info.hotTypeTag[i].name
    }

    // 页码改变的方法
    const currentChange = (p) => {
      info.pagination = p - 1
    }

    // 跳转到歌单详细页面
    const toPlaylistDetails = (id) => {
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

    // 设置 监视
    watchEffect(() => {
      const name = info.selectPlaylistName
      const pagination = info.pagination

      // 更新歌单数据
      getHandpick()
    })
    // 获取精品歌单
    getBoutique()
    // 获取所有歌单标签
    getPlaylistTag()
    // 获取热门歌单标签
    getHotTypeTag()
    // 获取相应分类歌单信息
    getHandpick()

    return {
      changeType,
      changeHot,
      currentChange,
      toPlaylistDetails,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.boutique {
  max-width: 1250px;
  min-width: 992px;
  height: 175px;
  margin: auto;
  border-radius: 10px;
  display: flex;
  box-shadow: 1px 1px 10px 1px rgb(209, 209, 209) inset;
  position: relative;
  overflow: hidden;
  .bgcImg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-80px);
    filter: blur(30px) brightness(70%);
  }
  .cover {
    z-index: 2;
    margin: 12.5px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 10px;
    }
  }
  .info {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    z-index: 2;
    .introduce {
      display: flex;
      flex-direction: column;
      .title {
        width: 110px;
        height: 35px;
        border-radius: 100px;
        border: 1px solid #d59654;
        line-height: 35px;
        color: #d59654;
        font-size: 17px;
        margin: 20px 10px 15px 10px;
        background-color: transparent;
        i {
          font-size: 20px;
        }
      }
      p.name {
        font-size: 18px;
        color: white;
      }
      p.copywriter {
        margin-top: 20px;
        margin-left: 20px;
        color: #bbb;
        font-size: 14px;
      }
    }
  }
}
.songListType {
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
.typeResult {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
}
</style>
