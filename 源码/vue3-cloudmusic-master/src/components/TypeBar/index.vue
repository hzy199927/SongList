<template>
  <div class="typeBar">
    <el-tabs v-model="name" @tab-click="handleClick">
      <!-- 循环遍历主内容区导航分类的内容 -->
      <el-tab-pane
        v-for="t in typeBarData"
        :label="t.label"
        :name="t.name"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 引入 composition API
import { computed } from 'vue'
// 引入路由相关的 API
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'TypeBar',
  //props接收父组件传递的值
  props: { typeBarData: Array },
  //props需要作为参数传递到setup配置项中才能进行操作
  setup(props) {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来进行路由操作
    const router = useRouter()

    // 定义变量 name 用来保存当前页面的路径
    let name = computed({
      get() {
        return route.name
      },
      set(val) {
        return val
      },
    })

    // 定义标签的点击方法
    const handleClick = (tab, event) => {
      // 判断是否有path属性，有的话则表示不需要传递params参数
      if (props.typeBarData[tab.index].path) {
        router.push(props.typeBarData[tab.index].path)
      } else {
        router.push({
          name: props.typeBarData[tab.index].name,
          params: {
            keywords: router.currentRoute.value.params.keywords,
          },
        })
      }
    }

    return {
      handleClick,
      name,
    }
  },
}
</script>

<style lang="less" scoped>
.typeBar {
  margin: 10px 0;
  box-sizing: border-box;
  padding: 0 40px;
  .el-tabs {
    display: inline-block;
    :deep(.el-tabs__nav) {
      background-color: #fff;
      .el-tabs__active-bar {
        height: 3px;
        background-color: #ec4141;
      }
      .is-active {
        color: black;
        font-size: 25px !important;
        font-weight: bold;
      }
      .el-tabs__item {
        font-size: 16px;
        &:hover {
          color: black;
        }
      }
    }
  }
}
</style>
