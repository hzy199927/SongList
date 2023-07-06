<template>
  <div class="subscribers" ref="subscriber">
    <!-- 收藏者数据 -->
    <ul class="data">
      <li
        class="subscriber"
        v-for="(s, index) in subscribers"
        :key="index"
        @click="toUserDetails(s.userId)"
      >
        <!-- 头像 -->
        <div class="avatar">
          <img :src="s.avatarUrl" alt="" />
        </div>
        <!-- 简介 -->
        <div class="introduce">
          <!-- 用户名 -->
          <div class="nickname">{{ s.nickname }}</div>
          <!-- 个性签名 -->
          <div class="signature">{{ s.signature }}</div>
        </div>
      </li>
    </ul>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pagination + 1"
        :total="pages * 10"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
    <!-- 无数据 -->
    <div class="none" v-if="!subscribers">暂无数据</div>
  </div>
</template>

<script>
// 引入 composition API
import { toRefs, reactive, computed, watch, nextTick } from 'vue'
// 引入路由相关的 API
import { useRouter, useRoute } from 'vue-router'
// 引入接口 API
import { playlistSubscribers } from '@/api'
// 引入 plugin 中的方法
import { roll } from '@/plugin'
export default {
  name: 'Subscribers',
  props: ['parentNode'],
  setup(props) {
    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量用来保存当前组件的响应式数据
    const info = reactive({
      // 收藏者数据
      subscribers: [],
      // 页码
      pagination: 0,
      // 总页数
      pages: 0,
      // 指向 DOM
      subscriber: '',
    })

    // 定义计算属性 id 用来保存路由传递过来的 id 参数
    const id = computed({
      get() {
        return route.params.id
      },
    })

    // 定义计算属性 pagination 用来保存评论的页码，用于监听
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义获取收藏者的方法
    const getSubscribers = async (flag) => {
      let res = await playlistSubscribers(id.value, info.pagination * 30)
      // 更新数据
      info.pages = Math.ceil(res.total / 30)
      info.subscribers = res.subscribers

      // 判断是否需要滚动
      if (flag) {
        nextTick(() => {
          let spacing =
            props.parentNode.scrollHeight - info.subscriber.offsetHeight - 150
          roll(props.parentNode, spacing)
        })
      }
    }

    // 定义改变页码的方法
    const changePage = (p) => {
      info.pagination = p - 1
    }

    // 定义跳转到用户详细页面的方法
    const toUserDetails = (id) => {
      router.push({
        name: 'userDetails',
        params: {
          id,
        },
      })
    }

    // 设置监视
    watch(
      pagination,
      () => {
        // 获取歌单评论，并传递参数，表示需要进行滚动
        getSubscribers('needRoll')
      },
      { immediate: false }
    )

    watch(
      id,
      () => {
        if (id.value) {
          getSubscribers()
        }
      },
      { immediate: true }
    )

    return { changePage, toUserDetails, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.subscribers {
  .data {
    padding: 0 51px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 30px 0 50px;
    .subscriber {
      width: 440px;
      height: 118px;
      display: flex;
      padding: 16.5px;
      box-sizing: border-box;
      border-radius: 15px;
      cursor: pointer;
      &:hover {
        background-color: #f9f9f9;
      }
      .avatar {
        margin-right: 20px;
        img {
          width: 85px;
          height: 85px;
          border-radius: 50%;
        }
      }
      .introduce {
        color: #555;
        .nickname {
          margin: 5px 0 10px;
          font-weight: bold;
        }
        .signature {
          width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .none {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 22px;
  }
}
</style>
