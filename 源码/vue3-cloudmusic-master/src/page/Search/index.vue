<template>
  <div class="search">
    <!-- 选择 -->
    <TypeBar :typeBarData="typeBarData"></TypeBar>
    <!-- Vue3中的 keep-alive让路由组件不被销毁使用方式的变化 -->
    <router-view class="router-view" v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
// 引入组件
import TypeBar from '@/components/TypeBar'
export default {
  name: 'Search',
  components: { TypeBar },
  setup() {
    // 定义变量 typeBarData 用来保存导航分类的数据
    const typeBarData = [
      {
        label: '单曲',
        name: 'searchSingle',
        // path: '/search/single',
      },
      {
        label: '歌手',
        name: 'searchSinger',
        // path: '/search/singer',
      },

      {
        label: '专辑',
        name: 'searchCollection',
        // path: '/search/collection',
      },
      {
        label: '视频',
        name: 'searchVideo',
        // path: '/search/video',
      },
      {
        label: '歌单',
        name: 'searchSongList',
        // path: '/search/songList',
      },
    ]
    return {
      typeBarData,
    }
  },
}
</script>
