<template>
  <div class="mvList" ref="mvList">
    <!-- 选择 -->
    <div class="select">
      <!-- 选择地区 -->
      <div class="area">
        <div class="title">地区：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: l.path === areaKey }"
            v-for="(l, index) in staticInfo.area"
            :key="index"
            @click="selectArea(l.path)"
          >
            {{ l.name }}
          </div>
        </div>
      </div>
      <!-- 选择类型 -->
      <div class="type">
        <div class="title">类型：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: t.path === typeKey }"
            v-for="(t, index) in staticInfo.type"
            :key="index"
            @click="selectType(t.path)"
          >
            {{ t.name }}
          </div>
        </div>
      </div>
      <!-- 首字母筛选 -->
      <div class="sort">
        <div class="title">排序：</div>
        <div class="options">
          <div
            :class="{ option: true, selected: sortKey === s.path }"
            v-for="(s, index) in staticInfo.sort"
            :key="index"
            @click="selectSort(s.path)"
          >
            {{ s.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- mv数据 -->
    <div class="mvs">
      <ul
        class="lists"
        v-infinite-scroll="infiniteLoading"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-distance="300"
        :infinite-scroll-immediate="false"
      >
        <li
          class="list"
          v-for="(m, index) in mvs"
          :key="index"
          @click="toMvDetails(m.id)"
        >
          <div class="cover">
            <el-image :src="m.cover" alt="" class="video">
              <div slot="placeholder" class="image-slot">
                <img src="../../../assets/images/loading.png" />
              </div>
            </el-image>
            <!-- 播放量 -->
            <div class="playCount">
              <i class="iconfont">&#xe656;</i>
              {{ (m.playCount / 10000).toFixed(1) }}万
            </div>
            <!-- 时长 -->
            <div class="duration">
              {{ millisecondToMinute(m.duration) }}
            </div>
          </div>
          <!-- 名称 -->
          <p class="name">{{ m.name }}</p>
          <!-- 作者 -->
          <p class="artist">{{ m.artistName }}</p>
        </li>
      </ul>
    </div>
    <!-- 返回顶部的按钮 -->
    <el-backtop target=".mvList" :bottom="100"></el-backtop>
  </div>
</template>

<script>
// 引入 composition API
import { reactive, toRefs, computed, watch } from 'vue'
// 引入 api 接口
import { allMv } from '@/api'
// 引入 plugin 中的方法
import { millisecondToMinute } from '@/plugin'
// 引入路由相关 API
import { useRouter } from 'vue-router'
export default {
  name: 'MvList',
  setup() {
    // 定义变量 router 用来进行路由操作
    const router = useRouter()

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 地区的默认值
      areaKey: '全部',
      // 分类的默认值
      typeKey: '全部',
      // 排序的默认值
      sortKey: '上升最快',
      // 当前加载数据的次数（配合实现懒加载）
      time: 1,
      // 是否还有更多数据（默认为：true）
      hasMore: true,
      // 所有 mv 数据
      mvs: [],
      // 是否禁用无限滚动
      disabled: false,
    })

    // 定义变量 staticInfo 用来保存当前组件的非响应式数据
    const staticInfo = {
      //地区数据
      area: [
        { name: '全部', path: '全部' },
        { name: '内地', path: '内地' },
        { name: '港台', path: '港台' },
        { name: '欧美', path: '欧美' },
        { name: '日本', path: '日本' },
        { name: '韩国', path: '韩国' },
      ],
      //分类数据
      type: [
        { name: '全部', path: '全部' },
        { name: '官方版', path: '官方版' },
        { name: '原生', path: '原生' },
        { name: '现场版', path: '现场版' },
        { name: '网易出品', path: '网易出品' },
      ],
      //排序
      sort: [
        { name: '上升最快', path: '上升最快' },
        { name: '最热', path: '最热' },
        { name: '最新', path: '最新' },
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

    // 定义获取 mv 的方法
    const getMv = async () => {
      let { areaKey, typeKey, sortKey, time } = info
      let res = await allMv(areaKey, typeKey, sortKey, (time - 1) * 24)
      info.mvs.push(...res.data)
      info.hasMore = res.hasMore
      // 数据获取完毕，可以加载
      info.disabled = false
    }

    // 定义选择地区的方法
    const selectArea = (path) => {
      // 修改地区参数
      info.areaKey = path
      // 重置加载次数
      info.time = 1
      // 清空 mv 数据
      info.mvs = []
      // 重新获取数据
      getMv()
    }

    // 定义选择类型的方法
    const selectType = (path) => {
      // 修改地区参数
      info.typeKey = path
      // 重置加载次数
      info.time = 1
      // 清空 mv 数据
      info.mvs = []
      // 重新获取数据
      getMv()
    }

    // 定义选择排序方式的方法
    const selectSort = (path) => {
      // 修改地区参数
      info.sortKey = path
      // 重置加载次数
      info.time = 1
      // 清空 mv 数据
      info.mvs = []
      // 重新获取数据
      getMv()
    }

    // 跳转到视频详细页面
    const toMvDetails = (id) => {
      router.push({
        name: 'videoDetails',
        params: {
          id,
          type: 'mv',
        },
      })
    }

    // 无限滚动的方法
    const infiniteLoading = () => {
      // 数据加载中，禁用加载
      info.disabled = true
      // 如果还有更多数据再进行加载
      if (info.hasMore) {
        info.time++
      } else {
        if (info.time !== 1) {
          ElMessage({
            message: '暂无更多数据',
            type: 'warning',
          })
        }
      }
    }

    // 设置监视
    watch(
      time,
      () => {
        getMv()
      },
      { immediate: true }
    )

    return {
      selectArea,
      selectType,
      selectSort,
      staticInfo,
      toMvDetails,
      infiniteLoading,
      millisecondToMinute,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.mvList {
  .select {
    max-width: 1250px;
    min-width: 992px;
    margin: auto;
    display: flex;
    flex-direction: column;
    color: #666;
    .area,
    .type,
    .sort {
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
          width: 60px;
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
  .mvs {
    max-width: 1250px;
    min-width: 992px;
    margin: 20px auto 0;
    ul.lists {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      .list {
        box-sizing: border-box;
        margin-bottom: 10px;
        cursor: pointer;
        margin-right: 36px;
        &:nth-child(4n) {
          margin: 0;
        }
        .cover {
          position: relative;
          .playCount {
            position: absolute;
            top: 5px;
            right: 10px;
            color: white;
            font-size: 12px;
          }
          .duration {
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: white;
            font-size: 12px;
          }
        }
        p {
          width: 285px;
          font-size: 15px;
          white-space: normal;
          text-align: left;
          margin-bottom: 0;

          &.artist {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
