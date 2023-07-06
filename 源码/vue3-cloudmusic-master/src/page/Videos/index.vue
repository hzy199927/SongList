<template>
  <div class="video">
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'Video',
  components: { TypeBar },
  setup() {
    const router = useRouter()

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
    // 定义变量 typeBarData保存导航分类的数据
    const typeBarData = [
      {
        label: '视频',
        name: 'videoList',
        path: '/videos/videoList',
      },
      {
        label: 'MV',
        name: 'mvList',
        path: '/videos/mvList',
      },
    ]
    return {
      typeBarData,
    }
  },
}
</script>
