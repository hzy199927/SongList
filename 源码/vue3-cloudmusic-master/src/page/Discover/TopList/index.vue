<template>
  <div class="topList">
    <!-- 官方榜单 -->
    <div class="official">
      <!-- 标题 -->
      <p class="title" v-if="official.length">官方榜</p>
      <!-- 榜单内容 -->
      <div class="list" v-for="(t, index) in official" :key="index">
        <!-- 榜单图片 -->
        <el-image :src="t.coverImgUrl" alt="">
          <div slot="placeholder" class="image-slot">
            <img src="../../../assets/images/loading.png" />
          </div>
        </el-image>
        <!-- 榜单的音乐 -->
        <div class="songInfo">
          <el-table
            :data="officialSongs[index]"
            style="width: 100%"
            :show-header="false"
            height="195px"
            size="mini"
            empty-text="Loading . . . . . ."
            @row-dblclick="toPlaylistDetails(t.id)"
          >
            <!-- 双击播放：@row-dblclick="play" -->
            <el-table-column type="index" align="left" width="30">
            </el-table-column>
            <el-table-column prop="name" label="歌名" width="600" align="left">
            </el-table-column>
            <el-table-column prop="ar[0].name" label="歌手" align="right">
              <template #default="scope">
                <span
                  class="couldSkip"
                  @click="toSingerDetails(scope.row.ar[0].id)"
                >
                  {{ scope.row.ar[0].name }}
                </span>
                <span v-for="(a, index) in scope.row.ar.slice(1)" :key="index">
                  /
                  <span class="couldSkip" @click="toSingerDetails(a.id)">{{
                    a.name
                  }}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <p class="more" @click="toPlaylistDetails(t.id)">
            查看更多<i class="el-icon-arrow-right"></i>
          </p>
        </div>
      </div>
    </div>
    <!-- 全球榜单 -->
    <div class="global">
      <!-- 榜单标题 -->
      <p class="title" v-if="global.length">全球榜</p>
      <!-- 所有榜单结果 -->
      <div class="typeResult">
        <ul class="lists">
          <li
            class="list"
            v-for="(g, index) in global"
            :key="index"
            @click="toPlaylistDetails(g.id)"
          >
            <el-image :src="g.coverImgUrl" alt="">
              <div slot="placeholder" class="image-slot">
                <img src="../../../assets/images/loading.png" />
              </div>
            </el-image>
            <p class="title">{{ g.name }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 API 接口
import { topList, playlistDetails } from '@/api'
// 引入 composition API
import { reactive, toRefs } from 'vue'
// 引入路由相关的 API
import { useRouter } from 'vue-router'
export default {
  name: 'TopList',
  setup() {
    // 定义变量 router 用来进行路由操作
    const router = useRouter()

    // 定义变量 info 用来保存当前组件的所有响应式数据
    const info = reactive({
      // 官方榜单的所有信息
      official: [],
      // 官方榜单对应的歌单信息
      officialSongs: [],
      // 全球榜单的所有信息
      global: [],
    })

    // 获取榜单所有信息的方法
    const getOfficial = async () => {
      let res = await topList()
      // 更新官方榜单所有信息
      info.official = res.list.slice(0, 4)
      // 根据官方榜单数据每个榜单展示五首歌曲
      for (let i = 0; i < info.official.length; i++) {
        // 获取歌单 id
        let id = info.official[i].id
        // 调用方法获取歌单详细
        getPlaylistDetails(id)
      }

      // 更新全球榜单的所有信息
      info.global = res.list.slice(4)
    }

    // 获取歌单详细的方法
    const getPlaylistDetails = async (id) => {
      let res = await playlistDetails(id)
      // 取出歌单中的五首歌曲
      let songs = res.playlist.tracks.slice(0, 5)
      // 将存有五首歌曲的数组添加到 officialSongs中
      info.officialSongs.push(songs)
    }

    // 跳转到歌单详细页面
    const toPlaylistDetails = (id) => {
      ElMessage({
        message: '为您跳转到歌单详细页面',
        type: 'success',
      })
      router.push({
        name: 'playlistDetails',
        params: {
          id,
        },
      })
    }

    // 定义跳转到歌手详细页面的方法
    const toSingerDetails = (id) => {
      router.push({
        name: 'singerDetails',
        params: { id },
      })
    }

    // 获取榜单的所有信息
    getOfficial()
    return { toPlaylistDetails, toSingerDetails, ...toRefs(info) }
  },
}
</script>

<style lang="less" scoped>
.official {
  max-width: 1250px;
  min-width: 992px;
  display: flex;
  flex-direction: column;
  margin: auto;
  .title {
    font-size: 20px;
    color: #666;
  }
  .list {
    width: 100%;
    height: 225px;
    margin: 20px 0 50px;
    display: flex;
    .el-image {
      width: 187px;
      height: 187px;
      border-radius: 15px;
      margin-right: 30px;
      img {
        width: 187px;
        height: 187px;
      }
    }
    .songInfo {
      width: 1033px;
      .el-table {
        border-radius: 10px;
        &::before {
          height: 0px;
        }
        :deep(tr) {
          height: 37.5px;
          cursor: pointer;
          td {
            font-size: 13px;
            border-bottom: none;
            &:nth-child(2n) {
              color: #000000;
            }
            &:nth-child(2n + 1) {
              color: #868686;
            }
          }
          &:nth-child(2n + 1) {
            background-color: #f8f8f8;
          }
          &:hover {
            background-color: #f4f4f4;
            & td {
              background-color: #f4f4f4;
            }
          }
        }
      }
      p.more {
        display: inline-block;
        margin-top: 15px;
        font-size: 14px;
        color: #868686;
        cursor: pointer;
      }
    }
  }
}
.global {
  max-width: 1250px;
  min-width: 992px;
  display: flex;
  flex-direction: column;
  margin: auto;
  .title {
    font-size: 20px;
    color: #666;
    margin-bottom: 20px;
  }
}
</style>
