<template>
  <div class="comment" ref="comment">
    <!-- 提交评论 -->
    <div class="submitComment">
      <!-- 评论框 -->
      <el-input
        type="textarea"
        placeholder="留下你的评论"
        maxlength="140"
        show-word-limit
        v-model="comments"
        ref="commentTextarea"
      >
      </el-input>
      <!-- 提交按钮 -->
      <div class="submit">
        <el-button @click="toSendComment">评论</el-button>
      </div>
    </div>
    <!-- 评论 -->
    <div
      class="comments"
      v-loading="loading"
      element-loading-text="加载中"
      :element-loading-spinner="svg"
      element-loading-svg-view-box="0, 0, 50, 50"
    >
      <!-- 置顶评论 -->
      <div class="top" v-if="topComments && topComments.length">
        <!-- 标题 -->
        <div class="title">置顶评论</div>
        <!-- 用户评论 -->
        <div class="userComment" v-for="(c, index) in topComments">
          <!-- 头像 -->
          <div class="avatar" @click="toUserDetails(c.user.userId)">
            <img :src="c.user.avatarUrl" alt="" />
          </div>
          <!-- 内容 -->
          <div class="content">
            <!-- 个人 -->
            <div class="personal">
              <!-- 昵称 -->
              <span class="nickname" @click="toUserDetails(c.user.userId)">
                {{ c.user.nickname }}：
              </span>
              <!-- 数据 -->
              <span class="data">{{ c.content }}</span>
            </div>
            <!-- 提醒 -->
            <div class="remind" v-for="(r, index) in c.beReplied">
              <!-- 昵称 -->
              <div class="nickname" @click="toUserDetails(r.user.userId)">
                @{{ r.user.nickname }}：
              </div>
              <!-- 数据 -->
              <div class="data">{{ r.content }}</div>
            </div>
            <!-- 其他 -->
            <div class="else">
              <!-- 评论发布时间 -->
              <div class="publishTime">{{ c.timeStr }}</div>
              <!-- 操作 -->
              <div class="operate">
                <!-- 点赞 -->
                <div
                  :class="{ like: true, liked: c.liked }"
                  @click="toLikeComment(c.liked, c.commentId)"
                >
                  <!-- 图标 -->
                  <i class="iconfont">&#xe613;</i>
                  <!-- 点赞的数量 -->
                  <span class="amount">{{ c.likedCount }}</span>
                </div>
                <!-- 分享 -->
                <div class="share"><i class="iconfont">&#xe60c;</i></div>
                <!-- 回复 -->
                <div
                  class="replay"
                  @click="toReplayComment(c.commentId, c.user.nickname)"
                >
                  <i class="iconfont">&#xe618;</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 热门评论 -->
      <div class="hot" v-if="hotComments && hotComments.length">
        <!-- 标题 -->
        <div class="title">热门评论</div>
        <!-- 用户评论 -->
        <div class="userComment" v-for="(c, index) in hotComments">
          <!-- 头像 -->
          <div class="avatar" @click="toUserDetails(c.user.userId)">
            <img :src="c.user.avatarUrl" alt="" />
          </div>
          <!-- 内容 -->
          <div class="content">
            <!-- 个人 -->
            <div class="personal">
              <!-- 昵称 -->
              <span class="nickname" @click="toUserDetails(c.user.userId)">
                {{ c.user.nickname }}：
              </span>
              <!-- 数据 -->
              <span class="data">{{ c.content }}</span>
            </div>
            <!-- 提醒 -->
            <div class="remind" v-for="(r, index) in c.beReplied">
              <!-- 昵称 -->
              <div class="nickname" @click="toUserDetails(r.user.userId)">
                @{{ r.user.nickname }}：
              </div>
              <!-- 数据 -->
              <div class="data">{{ r.content }}</div>
            </div>
            <!-- 其他 -->
            <div class="else">
              <!-- 评论发布时间 -->
              <div class="publishTime">{{ c.timeStr }}</div>
              <!-- 操作 -->
              <div class="operate">
                <!-- 点赞 -->
                <div
                  :class="{ like: true, liked: c.liked }"
                  @click="toLikeComment(c.liked, c.commentId)"
                >
                  <!-- 图标 -->
                  <i class="iconfont">&#xe613;</i>
                  <!-- 点赞的数量 -->
                  <span class="amount">{{ c.likedCount }}</span>
                </div>
                <!-- 分享 -->
                <div class="share"><i class="iconfont">&#xe60c;</i></div>
                <!-- 回复 -->
                <div
                  class="replay"
                  @click="toReplayComment(c.commentId, c.user.nickname)"
                >
                  <i class="iconfont">&#xe618;</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="new" v-if="newComments && newComments.length">
        <!-- 标题 -->
        <div class="title">最新评论</div>
        <!-- 用户评论 -->
        <div class="userComment" v-for="(c, index) in newComments">
          <!-- 头像 -->
          <div class="avatar" @click="toUserDetails(c.user.userId)">
            <img :src="c.user.avatarUrl" alt="" />
          </div>
          <!-- 内容 -->
          <div class="content">
            <!-- 个人 -->
            <div class="personal">
              <!-- 昵称 -->
              <span class="nickname" @click="toUserDetails(c.user.userId)">
                {{ c.user.nickname }}：
              </span>
              <!-- 数据 -->
              <span class="data">{{ c.content }}</span>
            </div>
            <!-- 提醒 -->
            <div class="remind" v-for="(r, index) in c.beReplied">
              <!-- 昵称 -->
              <div class="nickname" @click="toUserDetails(r.user.userId)">
                @{{ r.user.nickname }}：
              </div>
              <!-- 数据 -->
              <div class="data">{{ r.content }}</div>
            </div>
            <!-- 其他 -->
            <div class="else">
              <!-- 评论发布时间 -->
              <div class="publishTime">{{ c.timeStr }}</div>
              <!-- 操作 -->
              <div class="operate">
                <!-- 点赞 -->
                <div
                  :class="{ like: true, liked: c.liked }"
                  @click="toLikeComment(c.liked, c.commentId)"
                >
                  <!-- 图标 -->
                  <i class="iconfont">&#xe613;</i>
                  <!-- 点赞的数量 -->
                  <span class="amount">{{ c.likedCount }}</span>
                </div>
                <!-- 分享 -->
                <div class="share"><i class="iconfont">&#xe60c;</i></div>
                <!-- 回复 -->
                <div
                  class="replay"
                  @click="toReplayComment(c.commentId, c.user.nickname)"
                >
                  <i class="iconfont">&#xe618;</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
// 引入 composition API
import { reactive, toRefs, computed, watch, nextTick } from 'vue'
// 引入路由相关的 API
import { useRouter, useRoute } from 'vue-router'
// 引入接口 API
import {
  commentSingle,
  commentPlaylist,
  commentCollection,
  mvComment,
  videoComment,
  sendComment,
  likeComment,
} from '@/api'
// 引入 vuex 相关 API
import { useStore } from 'vuex'
// 引入 plugin 中的方法
import { roll } from '@/plugin'
export default {
  name: 'Comment',
  // type：获取那种类型的评论，className：父组件最外层元素的类名，用于滚动
  props: ['type', 'className'],
  setup(props) {
    // 定义变量 router 用来操作路由
    const router = useRouter()

    // 定义变量 route 用来获取路由信息
    const route = useRoute()

    // 定义变量 store 用来进行 vuex 相关操作
    const store = useStore()

    // 获取父组件传递过来的值
    let { type, className } = props

    // 定义变量 info 用来保存当前组件的响应式数据
    const info = reactive({
      // 置顶评论
      topComments: {},
      // 热门评论
      hotComments: {},
      // 最新评论
      newComments: {},
      // 评论页码
      pagination: 0,
      // 评论的总页数
      pages: 0,
      // 用户可提交的评论
      comments: '',
      // 真正用于提交的评论部分
      submitComment: '',
      // 回复的评论 id
      replayCommentId: '',
      // 回复的评论者名称
      replayCommentNickname: '',
      // 加载
      loading: false,
      // 指向 DOM 元素
      comment: '',
      commentTextarea: '',
      // svg
      svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" class="hds-flight-icon--animation-loading"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#ec4141" fill-rule="evenodd" clip-rule="evenodd"> <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"></path> <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"></path> </g> </g></svg>`,
    })

    // 定义计算属性 loginState 用来获取 store 中的登录状态
    const loginState = computed({
      get() {
        return store.state.loginState
      },
    })

    // 定义计算属性 comments 用来保存评论的内容，用于监听
    const comments = computed({
      get() {
        return info.comments
      },
    })

    // 定义计算属性 commentData 用来保存评论类型数据
    const commentData = computed({
      get() {
        return store.state.commentData
      },
    })

    // 定义计算属性 id 用来获取评论的 id 值
    const id = computed({
      get() {
        if (type === 'single') {
          return store.state.currentSongInfo.id
        } else {
          return route.params.id
        }
      },
    })

    // 定义计算属性 pagination 用来保存评论的页码，用于监听
    const pagination = computed({
      get() {
        return info.pagination
      },
    })

    // 定义计算属性 likeType 用来从 store 中获取 likeType
    const likeType = computed({
      get() {
        return store.state.likeType
      },
    })

    // 定义获取评论的方法
    const getComments = async (flag) => {
      // 开始加载
      info.loading = true
      let res
      // 获取评论
      switch (type) {
        case 'playlist':
          res = await commentPlaylist(id.value, info.pagination * 20)
          break
        case 'single':
          res = await commentSingle(id.value, info.pagination * 20)
          break
        case 'collection':
          res = await commentCollection(id.value, info.pagination * 20)
          break
        case 'video':
          res = await videoComment(id.value, info.pagination * 20)
          break
        case 'mv':
          res = await mvComment(id.value, info.pagination * 20)
          break
      }

      if (res.code === 200) {
        // 保存数据
        info.pages = Math.ceil(res.total / 20)
        info.topComments = res.topComments
        info.hotComments = res.hotComments
        info.newComments = res.comments

        nextTick(() => {
          if (flag && res.code === 200) {
            let dom = document.querySelector(`.${className}`)
            let spacing = dom.scrollHeight - info.comment.offsetHeight - 50
            roll(dom, spacing)
          }
        })

        // 暂停加载
        info.loading = false
      }
    }

    // 定义评论的方法
    const toComment = async (t, type, id, content) => {
      let res = await sendComment(t, type, id, content)
      if (res.code === 200) {
        // 清空评论框中的内容
        info.comments = ''
        ElMessage({
          message: '评论成功',
          type: 'success',
          grouping: true,
        })
        getComments()
      } else {
        ElMessage({
          message: '评论失败',
          type: 'error',
          grouping: true,
        })
      }
    }

    // 定义回复评论的方法
    const toReplay = async (t, type, id, content, commentId) => {
      let res = await sendComment(t, type, id, content, commentId)
      if (res.code === 200) {
        // 清空评论框中的内容
        info.comments = ''
        ElMessage({
          message: '回复评论成功',
          type: 'success',
          grouping: true,
        })
        getComments()
      } else {
        ElMessage({
          message: '回复评论失败',
          type: 'error',
          grouping: true,
        })
      }
    }

    // 定义点赞/取消点赞评论的方法
    const toLikeComment = async (isLiked, cid) => {
      if (!loginState.value) {
        ElMessage({
          message: '需要先登录才能点赞',
          type: 'warning',
          grouping: true,
        })
        return
      }
      let t = isLiked ? 0 : 1
      let res

      switch (type) {
        case 'playlist':
          res = await likeComment(t, likeType.value.playlist, id.value, cid)
          break
        case 'single':
          res = await likeComment(t, likeType.value.single, id.value, cid)
          break
        case 'collection':
          res = await likeComment(t, likeType.value.collection, id.value, cid)
          break
        case 'video':
          res = await likeComment(t, likeType.value.video, id.value, cid)
          break
        case 'mv':
          res = await likeComment(t, likeType.value.mv, id.value, cid)
          break
      }
      if (res.code === 200) {
        getComments()
      }
    }

    // 定义发送评论的方法
    const toSendComment = () => {
      let currentType = type
      if (loginState.value) {
        if (info.submitComment.trim()) {
          let { t, type } = commentData.value
          if (info.replayCommentId) {
            toReplay(
              t.replay,
              type[currentType],
              id.value,
              info.submitComment,
              info.replayCommentId
            )
          } else {
            toComment(t.send, type[currentType], id.value, info.submitComment)
          }
        } else {
          ElMessage({
            message: '评论不能为空或空格',
            type: 'warning',
            grouping: true,
          })
        }
      } else {
        ElMessage({
          message: '登录之后才可以评论',
          type: 'warning',
          grouping: true,
        })
      }
    }

    // 定义回复评论的方法
    const toReplayComment = (commentId, nickname) => {
      info.commentTextarea.focus()
      info.replayCommentId = commentId
      info.replayCommentNickname = `回复 - ${nickname}：`
      info.comments = `回复 - ${nickname}：`
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

    // 定义改变页码的方法
    const changePage = (p) => {
      info.pagination = p - 1
    }

    // 设置监视
    watch(
      pagination,
      () => {
        // 获取歌单评论，并传递参数，表示需要进行滚动
        getComments('needRoll')
      },
      { immediate: false }
    )

    watch(
      id,
      () => {
        if (id.value) {
          getComments()
        }
      },
      { immediate: true }
    )

    watch(
      comments,
      () => {
        // 当前评论框中的内容
        let comment = comments.value
        // 评论框的回复提示部分
        let replayComment = info.replayCommentNickname
        // 更新真正需要提交的评论部分
        info.submitComment = info.comments.substring(replayComment.length)
        // 还存在评论提示部分
        if (replayComment) {
          // 清空评论提示部分
          if (replayComment.length > comment.length) {
            // 清空评论
            info.comments = ''
            // 清空回复相关信息
            info.replayCommentId = ''
            info.replayCommentNickname = ''
          }
        }
      },
      { immediate: false }
    )

    return {
      toUserDetails,
      changePage,
      toReplay,
      toSendComment,
      toReplayComment,
      toLikeComment,
      ...toRefs(info),
    }
  },
}
</script>

<style lang="less" scoped>
.comment {
  margin: 50px auto 0;
  .comments {
    .top,
    .hot,
    .new {
      width: 100%;
      margin-bottom: 80px;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .userComment {
        display: flex;
        margin-top: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid rgb(161, 161, 161);
        .avatar {
          margin-right: 20px;
          cursor: pointer;
          img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
          }
        }
        .content {
          width: calc(100% - 65px);
          display: flex;
          flex-direction: column;
          font-size: 15px;
          color: #555;
          .personal {
            width: 100%;
            margin-bottom: 10px;
            .nickname {
              display: inline-block;
              font-weight: bold;
              color: #5a8ab9;
              cursor: pointer;
            }
          }
          .remind {
            width: 100%;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #ddd;
            box-sizing: border-box;
            border-radius: 10px;
            .nickname {
              font-weight: bold;
              cursor: pointer;
            }
          }
          .else {
            width: 100%;
            display: flex;
            flex-direction: row;
            position: relative;
            .operate {
              display: flex;
              flex-direction: row;
              position: absolute;
              right: 0;
              .like,
              .share,
              .replay {
                margin: 0 8px;
                i {
                  cursor: pointer;
                }
              }

              .liked {
                i {
                  color: #ec4141;
                }
                color: #ec4141;
              }
            }
          }
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  :deep(.el-loading-spinner) {
    top: 100px;
    margin-top: 0;
    width: 100%;
    text-align: center;
    position: absolute;
    .el-loading-text {
      color: #ec4141;
      margin: 20px 0;
      font-size: 14px;
    }
  }
}
</style>
