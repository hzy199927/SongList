<template>
  <div class="discover">
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
// 引入composition API
export default {
  name: 'Discover',
  components: { TypeBar },
  setup() {
    // 定义变量 typeBarData保存导航分类的数据
    const typeBarData = [
      {
        label: '个性推荐',
        name: 'recommend',
        path: '/discover/recommend',
      },
      {
        label: '歌单',
        name: 'songList',
        path: '/discover/songList',
      },
      {
        label: '排行榜',
        name: 'topList',
        path: '/discover/topList',
      },
      {
        label: '歌手',
        name: 'singer',
        path: '/discover/singer',
      },
    ]
    return {
      typeBarData,
    }
  },
}
</script>
