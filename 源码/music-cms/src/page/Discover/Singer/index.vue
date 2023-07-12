<template>
  <div class="singer">
    <!-- 选择 -->
    <div class="select">
      <!-- 选择地区 -->
      <div class="area">
        <div class="title">语种：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: l.key === areaKey }"
            v-for="(l, index) in staticInfo.area"
            :key="index"
            @click="selectArea(l.key)"
          >
            {{ l.name }}
          </div>
        </div>
      </div>
      <!-- 选择类型 -->
      <div class="type">
        <div class="title">分类：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: t.key === typeKey }"
            v-for="(t, index) in staticInfo.type"
            :key="index"
            @click="selectType(t.key)"
          >
            {{ t.name }}
          </div>
        </div>
      </div>
      <!-- 首字母筛选 -->
      <div class="screen">
        <div class="title">筛选：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: screenKey === s.key }"
            v-for="(s, index) in staticInfo.screen"
            :key="index"
            @click="selectScreen(s.key)"
          >
            {{ s.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 歌手的结果 -->
    <div class="singers">
      <ul
        class="lists"
        v-infinite-scroll="infiniteLoading"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
      >
        <li
          class="list"
          v-for="(s, index) in singers"
          :key="index"
          @click="toSingerDetails(s.id)"
        >
          <el-image :src="s.picUrl" alt="">
            <div slot="placeholder" class="image-slot">
              <img src="../../../assets/images/loading.png" />
            </div>
          </el-image>
          <p class="title">{{ s.name }}</p>
        </li>
      </ul>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".singer" :bottom="100"></el-backtop>
  </div>
</template>

<script>
// 引入 API 接口
import { singers } from '@/api'
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'Singer',
  setup() {
    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 地区的默认值
      areaKey: -1,
      // 分类的默认值
      typeKey: -1,
      // 筛选的默认值
      screenKey: -1,
      // 当前加载数据的次数（配合实现懒加载）
      time: 1,
      // 是否还有更多数据（默认为：false）
      isMore: false,
      // 所有歌手数据
      singers: [],
      // 是否禁用无限滚动
      disabled: false,
    })

    // 定义变量 staticInfo 用来保存当前组件的非响应式数据
    const staticInfo = {
      //地区数据
      area: [
        {
          name: '全部',
          key: -1,
        },
        {
          name: '华语',
          key: 7,
        },
        {
          name: '欧美',
          key: 96,
        },
        {
          name: '日本',
          key: 8,
        },
        {
          name: '韩国',
          key: 16,
        },
        {
          name: '其他',
          key: 0,
        },
      ],
      //分类数据
      type: [
        {
          name: '全部',
          key: -1,
        },
        {
          name: '男歌手',
          key: 1,
        },
        {
          name: '女歌手',
          key: 2,
        },
        {
          name: '乐队',
          key: 3,
        },
      ],
      //筛选数据
      screen: [
        { key: -1, name: '热门' },
        { key: 'a', name: 'A' },
        { key: 'b', name: 'B' },
        { key: 'c', name: 'C' },
        { key: 'd', name: 'D' },
        { key: 'e', name: 'E' },
        { key: 'f', name: 'F' },
        { key: 'g', name: 'G' },
        { key: 'h', name: 'H' },
        { key: 'i', name: 'I' },
        { key: 'j', name: 'J' },
        { key: 'k', name: 'K' },
        { key: 'l', name: 'L' },
        { key: 'm', name: 'M' },
        { key: 'n', name: 'N' },
        { key: 'o', name: 'O' },
        { key: 'p', name: 'P' },
        { key: 'q', name: 'Q' },
        { key: 'r', name: 'R' },
        { key: 's', name: 'S' },
        { key: 't', name: 'T' },
        { key: 'u', name: 'U' },
        { key: 'v', name: 'V' },
        { key: 'w', name: 'W' },
        { key: 'x', name: 'X' },
        { key: 'y', name: 'Y' },
        { key: 'z', name: 'Z' },
        { key: 0, name: '#' },
      ],
    }

    // 定义计算属性 time 用来获取 info 中的 time 值用于监视
    const time = computed({
      get() {
        return info.time
      },
      set(val) {
        return val
      },
    })

    // 获取所有歌手数据的方法
    const getSingers = async () => {
      let res = await singers(
        info.areaKey,
        info.typeKey,
        info.screenKey,
        (info.time - 1) * 30
      )
      // 将获取到的歌手数据添加到 singers数组中
      info.singers.push(...res.artists)
      // 更新是否还有更多数据
      info.isMore = res.more
      // 数据获取完毕，可以加载
      info.disabled = false
    }

    // 选择地区的方法
    const selectArea = (sign) => {
      // 修改地区的参数
      info.areaKey = sign
      // 重置当前加载数据的次数（使其重新开始加载数据）
      info.time = 1
      // 清空歌手详细数据
      info.singers = []
      // 重新获取歌手数据
      getSingers()
    }

    // 分类选择的方法
    const selectType = (sign) => {
      // 修改分类的参数
      info.typeKey = sign
      info.time = 1
      info.singers = []
      getSingers()
    }

    // 筛选的方法
    const selectScreen = (sign) => {
      // 修改筛选参数
      info.screenKey = sign
      info.time = 1
      info.singers = []
      getSingers()
    }

    // 无限滚动的方法
    const infiniteLoading = () => {
      // 数据加载中，禁用加载
      info.disabled = true
      // 如果还有更多数据再进行加载
      if (info.isMore) {
        info.time += 1
      } else {
        if (info.time !== 1) {
          ElMessage({
            message: '暂无更多数据',
            type: 'warning',
          })
        }
      }
    }

    // 定义跳转到歌手详细页面的方法
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: {
          id,
        },
      })
    }

    watch(
      time,
      () => {
        getSingers()
      },
      { immediate: true }
    )

    return {
      staticInfo,
      selectArea,
      selectType,
      selectScreen,
      infiniteLoading,
      toSingerDetails,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.select {
  max-width: 1250px;
  min-width: 992px;
  margin: auto;
  display: flex;
  flex-direction: column;
  color: #666;
  .area,
  .type,
  .screen {
    display: flex;
    margin-bottom: 5px;
    .title {
      width: 50px;
      line-height: 45px;
      font-size: 15px;
    }
    .options {
      width: calc(100% - 50px);
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      .option {
        width: 50px;
        height: 17.5px;
        padding: 7.5px 12.5px;
        margin: 4px 0;
        border-radius: 20px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.selected {
  color: #ec4141;
  background-color: #fdf5f5;
}
.singers {
  max-width: 1250px;
  min-width: 992px;
  margin: 20px auto 0;
  .lists {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    cursor: pointer;
    .list {
      height: 290px;
      box-sizing: border-box;
      flex: 1;
      margin: 0;
      p {
        width: 225px;
        height: 30px;
        font-size: 15px;
        white-space: normal;
        text-align: left;
      }
    }
  }
}
</style>
